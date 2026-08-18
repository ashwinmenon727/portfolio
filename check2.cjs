const { chromium } = require('playwright');
(async () => {
  const b = await chromium.launch({headless:true,executablePath:'C:/Users/ASHWIN MENON/AppData/Local/ms-playwright/chromium-1234/chrome-win64/chrome.exe'});
  const p = await b.newPage();
  await p.setViewportSize({width:1440,height:900});
  await p.goto('http://localhost:5173',{waitUntil:'networkidle',timeout:20000});
  await p.waitForTimeout(3000);

  // Check all transforms and 3D properties on the portrait path
  const transforms = await p.evaluate(() => {
    const img = document.querySelector('img[alt="Ashwin Menon"]');
    if (!img) return 'no img found';
    const chain = [];
    let el = img;
    while (el && el !== document.body) {
      const s = window.getComputedStyle(el);
      const t = s.transform;
      const p = s.perspective;
      const ts = s.transformStyle;
      if (t !== 'none' || p !== 'none') {
        chain.push({
          tag: el.tagName,
          class: el.className?.substring(0,60),
          transform: t,
          perspective: p,
          transformStyle: ts,
          willChange: s.willChange,
        });
      }
      el = el.parentElement;
    }
    return chain;
  });
  console.log('Transform chain:', JSON.stringify(transforms, null, 2));

  // Check if any old Three.js code is still running
  const hasThree = await p.evaluate(() => {
    const canvases = document.querySelectorAll('canvas');
    const info = [];
    canvases.forEach((c,i) => {
      const ctx = c.getContext('webgl2') || c.getContext('webgl');
      info.push({
        index: i,
        width: c.width,
        height: c.height,
        hasWebGL: !!ctx,
        parentClass: c.parentElement?.className?.substring(0,50),
      });
      if (ctx) ctx.getExtension('WEBGL_lose_context')?.loseContext();
    });
    return info;
  });
  console.log('Canvas/WebGL info:', JSON.stringify(hasThree, null, 2));

  await b.close();
  console.log('done');
})().catch(e => console.error(e.message));
