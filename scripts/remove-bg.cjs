const fs = require('fs');
const path = require('path');
const { removeBackground } = require('@imgly/background-removal');

const srcPath = 'C:/Users/ASHWIN MENON/Downloads/WhatsApp Image 2026-08-14 at 1.56.49 PM.jpeg';
const outDir = 'C:/Users/ASHWIN MENON/portfolio/public';
const outPath = path.join(outDir, 'ashwin-cutout.png');

async function main() {
  console.log('Reading source image...');
  const imageBuffer = fs.readFileSync(srcPath);
  console.log(`Source: ${(imageBuffer.length / 1024).toFixed(0)}KB`);

  console.log('Running AI background removal (this may take a minute on first run as models download)...');
  const startTime = Date.now();

  const blob = await removeBackground(imageBuffer, {
    progress: (key, current, total) => {
      if (total > 0) {
        const pct = ((current / total) * 100).toFixed(0);
        process.stdout.write(`\r  ${key}: ${pct}% (${(current / 1024 / 1024).toFixed(1)}/${(total / 1024 / 1024).toFixed(1)}MB)`);
      }
    },
  });

  console.log(`\nDone in ${((Date.now() - startTime) / 1000).toFixed(1)}s`);

  // Convert blob to buffer and save
  const arrayBuffer = await blob.arrayBuffer();
  const outputBuffer = Buffer.from(arrayBuffer);
  fs.writeFileSync(outPath, outputBuffer);
  console.log(`Saved: ${outPath} (${(outputBuffer.length / 1024).toFixed(0)}KB)`);
}

main().catch(e => {
  console.error('Error:', e.message || e);
  process.exit(1);
});
