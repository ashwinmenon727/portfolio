const sharp = require('sharp');
const path = 'C:/Users/ASHWIN MENON/Downloads/WhatsApp Image 2026-08-14 at 1.56.49 PM.jpeg';
const outDir = 'C:/Users/ASHWIN MENON/portfolio/public';

async function createCutout() {
  const src = sharp(path);
  const meta = await src.metadata();
  const W = meta.width, H = meta.height;
  console.log(`Source: ${W}x${H}`);

  const raw = await src.raw().toBuffer({ resolveWithObject: true });
  const data = raw.data;
  const ch = raw.info.channels;

  function lum(x, y) {
    const i = (y * W + x) * ch;
    return (data[i] + data[i + 1] + data[i + 2]) / 3;
  }
  function rgb(x, y) {
    const i = (y * W + x) * ch;
    return [data[i], data[i + 1], data[i + 2]];
  }

  // --- Step 1: Find head precisely ---
  // Scan rows from top, find first row where >30% of center columns are bright
  let headTopY = 0;
  for (let y = 0; y < H * 0.4; y++) {
    let brightCount = 0;
    let totalSampled = 0;
    for (let x = Math.floor(W * 0.35); x < Math.floor(W * 0.65); x += 4) {
      totalSampled++;
      if (lum(x, y) > 28) brightCount++;
    }
    if (brightCount / totalSampled > 0.15) {
      headTopY = y;
      break;
    }
  }

  // Find head center X and width by scanning the first few rows of the head
  let headSamples = [];
  for (let y = headTopY; y < headTopY + 150; y += 5) {
    let left = W, right = 0;
    for (let x = Math.floor(W * 0.2); x < Math.floor(W * 0.8); x++) {
      if (lum(x, y) > 28) {
        left = Math.min(left, x);
        right = Math.max(right, x);
      }
    }
    if (left < right && (right - left) < 400) {
      headSamples.push({ y, left, right, cx: (left + right) / 2, w: right - left });
    }
  }

  const headCX = Math.round(headSamples.reduce((s, h) => s + h.cx, 0) / headSamples.length);
  const headW = Math.round(headSamples.reduce((s, h) => s + h.w, 0) / headSamples.length);
  const headCY = headTopY + 60;
  console.log(`Head: top=${headTopY}, cx=${headCX}, width=${headW}`);

  // --- Step 2: Trace silhouette with body proportion constraints ---
  // Max shoulder width = ~3x head width
  // Max body width = ~2.8x head width
  const maxShoulderW = headW * 3.2;
  const maxBodyW = headW * 2.8;

  const silhouette = [];

  for (let y = headTopY; y < H * 0.85; y += 2) {
    // Scan for person edges using gradient + luminance
    const gradThreshold = 25;
    let leftEdge = headCX;
    let rightEdge = headCX;

    // Find left edge: scan left from center
    for (let x = headCX; x >= Math.max(1, headCX - maxShoulderW); x--) {
      const g = Math.abs(lum(x + 1, y) - lum(x - 1, y));
      if (g > gradThreshold && lum(x, y) > 15) {
        leftEdge = x;
        break;
      }
    }

    // Find right edge: scan right from center
    for (let x = headCX; x <= Math.min(W - 2, headCX + maxShoulderW); x++) {
      const g = Math.abs(lum(x + 1, y) - lum(x - 1, y));
      if (g > gradThreshold && lum(x, y) > 15) {
        rightEdge = x;
        break;
      }
    }

    // If no gradient edge found, fall back to luminance boundary
    if (leftEdge === headCX) {
      for (let x = headCX; x >= Math.max(1, headCX - maxShoulderW / 2); x--) {
        if (lum(x, y) < 12 && lum(x + 3, y) > 25) {
          leftEdge = x;
          break;
        }
      }
    }
    if (rightEdge === headCX) {
      for (let x = headCX; x <= Math.min(W - 2, headCX + maxShoulderW / 2); x++) {
        if (lum(x, y) < 12 && lum(x - 3, y) > 25) {
          rightEdge = x;
          break;
        }
      }
    }

    // Clamp to body proportions
    const cw = rightEdge - leftEdge;
    if (cw > maxBodyW) {
      const cx = (leftEdge + rightEdge) / 2;
      leftEdge = Math.round(cx - maxBodyW / 2);
      rightEdge = Math.round(cx + maxBodyW / 2);
    }

    // Smooth with previous row (prevent jitter)
    if (silhouette.length > 0) {
      const prev = silhouette[silhouette.length - 1];
      leftEdge = Math.round(prev.left + Math.max(-8, Math.min(8, leftEdge - prev.left)));
      rightEdge = Math.round(prev.right + Math.max(-8, Math.min(8, rightEdge - prev.right)));
    }

    silhouette.push({ y, left: leftEdge, right: rightEdge });
  }

  // Print silhouette
  console.log('Silhouette:');
  for (let i = 0; i < silhouette.length; i += Math.floor(silhouette.length / 30)) {
    const s = silhouette[i];
    console.log(`  y=${s.y} (${(s.y/H*100).toFixed(0)}%): L=${s.left} R=${s.right} W=${s.right - s.left}`);
  }

  // --- Step 3: Build alpha mask ---
  const alpha = new Float32Array(W * H);
  const featherIn = 8;
  const featherOut = 12;

  for (let y = 0; y < H; y++) {
    let leftEdge = -1, rightEdge = -1;

    // Find silhouette at this Y
    for (let i = 0; i < silhouette.length - 1; i++) {
      if (y >= silhouette[i].y && y < silhouette[i + 1].y) {
        const t = (y - silhouette[i].y) / (silhouette[i + 1].y - silhouette[i].y);
        leftEdge = silhouette[i].left + t * (silhouette[i + 1].left - silhouette[i].left);
        rightEdge = silhouette[i].right + t * (silhouette[i + 1].right - silhouette[i + 1].right);
        break;
      }
    }
    if (leftEdge < 0) continue;

    const bodyH = silhouette[silhouette.length - 1].y - headTopY;

    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      const distFromLeft = x - leftEdge;
      const distFromRight = rightEdge - x;
      const distFromEdge = Math.min(distFromLeft, distFromRight);

      let a = 0;
      if (distFromEdge > 0) {
        // Inside silhouette - feather inward near edges
        a = distFromEdge < featherIn ? (distFromEdge / featherIn) : 1.0;
      } else {
        // Outside silhouette - feather outward slightly for softness
        a = distFromEdge > -featherOut ? (1.0 + distFromEdge / featherOut) : 0;
        a = Math.max(0, a);
      }

      // --- Vertical masking ---
      // Top fade (above head)
      if (y < headTopY + 10) {
        a *= Math.max(0, (y - headTopY + 3) / 13);
      }

      // Bottom fade (pockets area → dissolve)
      const fadeStart = headTopY + bodyH * 0.62;
      const fadeEnd = headTopY + bodyH * 0.85;
      if (y > fadeStart) {
        const t = Math.min(1, (y - fadeStart) / (fadeEnd - fadeStart));
        a *= (1.0 - t * t); // quadratic ease out
      }

      alpha[idx] = Math.max(0, Math.min(1, a));
    }
  }

  // --- Step 4: Boost alpha where pixel content confirms it's the person ---
  // For pixels with alpha > 0.5, if they're brighter than very dark, boost
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = y * W + x;
      if (alpha[idx] > 0.3) {
        const l = lum(x, y);
        if (l > 20) {
          alpha[idx] = Math.min(1, alpha[idx] + 0.15);
        }
      }
    }
  }

  // --- Step 5: Smooth blur ---
  const blurred = new Float32Array(W * H);
  const blurR = 3;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let sum = 0, count = 0;
      for (let dy = -blurR; dy <= blurR; dy++) {
        for (let dx = -blurR; dx <= blurR; dx++) {
          const nx = x + dx, ny = y + dy;
          if (nx >= 0 && nx < W && ny >= 0 && ny < H) {
            sum += alpha[ny * W + nx]; count++;
          }
        }
      }
      blurred[y * W + x] = sum / count;
    }
  }

  // --- Step 6: Build RGBA and save ---
  const out = Buffer.alloc(W * H * 4);
  for (let i = 0; i < W * H; i++) {
    out[i * 4] = data[i * ch];
    out[i * 4 + 1] = data[i * ch + 1];
    out[i * 4 + 2] = data[i * ch + 2];
    out[i * 4 + 3] = Math.round(Math.min(255, blurred[i] * 255));
  }

  // Crop
  let cMinX = W, cMaxX = 0, cMinY = H, cMaxY = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (blurred[y * W + x] > 0.02) {
        cMinX = Math.min(cMinX, x); cMaxX = Math.max(cMaxX, x);
        cMinY = Math.min(cMinY, y); cMaxY = Math.max(cMaxY, y);
      }
    }
  }

  const pad = 30;
  const cropX = Math.max(0, cMinX - pad);
  const cropY = Math.max(0, cMinY - 5);
  const cropW = Math.min(W - cropX, cMaxX - cMinX + pad * 2 + 10);
  const cropH = Math.min(H - cropY, cMaxY - cMinY + 15);

  console.log(`\nCrop: (${cropX},${cropY}) ${cropW}x${cropH}`);

  await sharp(out, { raw: { width: W, height: H, channels: 4 } })
    .extract({ left: cropX, top: cropY, width: cropW, height: cropH })
    .png()
    .toFile(`${outDir}/ashwin-cutout.png`);

  const fm = await sharp(`${outDir}/ashwin-cutout.png`).metadata();
  console.log(`Saved: ashwin-cutout.png (${fm.width}x${fm.height})`);
}

createCutout().catch(e => console.error(e));
