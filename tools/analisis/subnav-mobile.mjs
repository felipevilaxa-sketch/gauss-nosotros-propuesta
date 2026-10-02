import { chromium, devices } from 'playwright';
const b = await chromium.launch();
const cases = [['390', { viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true }], ['iPhone 13', devices['iPhone 13']], ['600', { viewport: { width: 600, height: 900 } }], ['1440', { viewport: { width: 1440, height: 900 } }]];
for (const [name, opts] of cases) {
  const ctx = await b.newContext(opts); const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const res = [];
  for (const y of [400, 1500, 3000, 5000, 7000, 9000]) {
    await p.evaluate(y => scrollTo({ top: y, behavior: 'instant' }), y); await p.waitForTimeout(900);
    res.push(await p.evaluate(() => { const s = document.querySelector('.subnav').getBoundingClientRect(); const h = document.querySelector('.site-header').getBoundingClientRect(); return `y${Math.round(scrollY)}: subnav ${Math.round(s.top)} (header ${Math.round(h.top)})`; }));
  }
  const ov = await p.evaluate(() => ({ docW: document.documentElement.scrollWidth, vw: innerWidth, pos: getComputedStyle(document.querySelector('.subnav')).position }));
  console.log(name.padEnd(10), JSON.stringify(ov), '\n   ', res.join(' | '));
  await ctx.close();
}
await b.close();
