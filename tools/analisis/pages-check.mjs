import { chromium, devices } from 'playwright';
const URL = 'https://felipevilaxa-sketch.github.io/gauss-nosotros-propuesta/';
const b = await chromium.launch();
for (const [n, o] of [['desktop 1440', { viewport: { width: 1440, height: 900 } }], ['iPhone 13', devices['iPhone 13']]]) {
  const ctx = await b.newContext({ ...o, locale: 'es-CL' }); const p = await ctx.newPage();
  const fails = [], errors = [];
  p.on('response', r => { if (r.status() >= 400) fails.push(r.status() + ' ' + r.url()); });
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(URL, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 500) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } });
  await p.waitForTimeout(1200);
  const r = await p.evaluate(() => ({
    fuente: document.fonts.check('16px WorkSans'),
    imgsRotas: [...document.images].filter(i => i.complete && i.naturalWidth === 0 && i.getAttribute('src')).map(i => i.getAttribute('src')),
    mapaInteractivo: !!document.querySelector('.latam__svg [data-country]'),
    docW: document.documentElement.scrollWidth, vw: innerWidth
  }));
  console.log(n, JSON.stringify(r), '| 4xx/5xx:', fails.length ? fails : 'ninguno', '| errores JS:', errors.length ? errors : 'ninguno');
  if (n.startsWith('desktop')) { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600); await p.screenshot({ path: '../reference/screens/mejoras/pages-desktop.png' }); }
  else { await p.evaluate(() => scrollTo(0, 0)); await p.waitForTimeout(600); await p.screenshot({ path: '../reference/screens/mejoras/pages-iphone.png' }); }
  await ctx.close();
}
await b.close();
