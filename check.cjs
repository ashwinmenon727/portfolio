const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({headless:true,executablePath:'C:/Users/ASHWIN MENON/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
  const p = await b.newPage();
  await p.setViewportSize({width:1440,height:900});
  await p.goto('http://localhost:5173',{waitUntil:'networkidle',timeout:20000});
  await p.waitForTimeout(3000);

  const info = await p.evaluate(() => {
    const imgs = document.querySelectorAll('img');
    const results = [];
    imgs.forEach(img => {
      results.push({
        alt: img.alt,
        src: img.src,
        naturalWidth: img.naturalWidth,
        naturalHeight: img.naturalHeight,
        displayW: img.offsetWidth,
        displayH: img.offsetHeight,
        complete: img.complete,
        filter: window.getComputedStyle(img).filter,
      });
    });
    return results;
  });
  console.log('Images on page:', JSON.stringify(info, null, 2));

  // Check for any canvas elements
  const canvases = await p.evaluate(() => {
    return document.querySelectorAll('canvas').length;
  });
  console.log('Canvas elements:', canvases);

  // Check hero grid structure
  const hero = await p.evaluate(() => {
    const grid = document.querySelector('.hero-grid');
    if (!grid) return 'no hero-grid found';
    return {
      children: grid.children.length,
      html: grid.innerHTML.substring(0, 500)
    };
  });
  console.log('Hero grid:', JSON.stringify(hero, null, 2));

  await p.screenshot({path:'C:/Users/ASHWIN MENON/portfolio/screenshot5.png',fullPage:false});
  await b.close();
  console.log('done');
})().catch(e => console.error(e.message));
