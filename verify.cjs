const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({headless:true,executablePath:'C:/Users/ASHWIN MENON/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
  const p = await b.newPage();
  await p.setViewportSize({width:1440,height:900});
  await p.goto('http://localhost:5173',{waitUntil:'networkidle',timeout:20000});
  await p.waitForTimeout(4000);

  // Verify the actual rendered portrait
  const info = await p.evaluate(() => {
    const img = document.querySelector('img[alt="Ashwin Menon"]');
    if (!img) return 'NO IMG FOUND';
    const cs = window.getComputedStyle(img);
    const rect = img.getBoundingClientRect();
    return {
      src: img.src,
      rect: { x: rect.x, y: rect.y, w: Math.round(rect.width), h: Math.round(rect.height) },
      filter: cs.filter,
      mask: cs.maskImage || cs.webkitMaskImage || 'none',
      objectFit: cs.objectFit,
    };
  });
  console.log('Portrait:', JSON.stringify(info, null, 2));

  // Check for any element overlapping the portrait with 3D transforms
  const overlapping = await p.evaluate(() => {
    const img = document.querySelector('img[alt="Ashwin Menon"]');
    if (!img) return [];
    const rect = img.getBoundingClientRect();
    const results = [];
    document.querySelectorAll('canvas, iframe, video, svg').forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.x < rect.right && r.right > rect.x && r.y < rect.bottom && r.bottom > rect.y) {
        const cs = window.getComputedStyle(el);
        results.push({
          tag: el.tagName,
          class: el.className?.substring(0,60),
          rect: { x: Math.round(r.x), y: Math.round(r.y), w: Math.round(r.width), h: Math.round(r.height) },
          zIndex: cs.zIndex,
          position: cs.position,
          transform: cs.transform !== 'none' ? cs.transform : undefined,
        });
      }
    });
    return results;
  });
  console.log('Overlapping elements:', JSON.stringify(overlapping, null, 2));

  // Verify no errors
  const errors = [];
  p.on('pageerror', e => errors.push(e.message));

  await p.screenshot({path:'C:/Users/ASHWIN MENON/portfolio/screenshot_final.png',fullPage:false});
  console.log('Errors:', errors.length ? errors : 'NONE');
  await b.close();
  console.log('done');
})().catch(e => console.error(e.message));
