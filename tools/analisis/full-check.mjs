import { chromium, devices } from 'playwright';
const b = await chromium.launch();
for (const [n, o] of [['1440', { viewport: { width: 1440, height: 900 } }], ['1024', { viewport: { width: 1024, height: 800 } }], ['768', { viewport: { width: 768, height: 900 } }], ['iPhone 13', devices['iPhone 13']]]) {
  const ctx = await b.newContext(o); const p = await ctx.newPage(); const errs = [], fails = [];
  p.on('pageerror', e => errs.push(e.message)); p.on('response', r => r.status() >= 400 && fails.push(r.status() + ' ' + r.url()));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 600) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } });
  const r = await p.evaluate(() => ({ docW: document.documentElement.scrollWidth, vw: innerWidth, ids: [...document.querySelectorAll('.subnav__link')].map(a => !!document.querySelector(a.getAttribute('href'))).every(Boolean) }));
  console.log(n.padEnd(10), JSON.stringify(r), '| 4xx:', fails.length ? fails : 'no', '| errores JS:', errs.length ? errs : 'no');
  await ctx.close();
}
await b.close();
