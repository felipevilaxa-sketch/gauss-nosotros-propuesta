import { chromium, devices } from 'playwright';
const b = await chromium.launch();
for (const [n, o] of [['390', { viewport: { width: 390, height: 844 } }], ['iPhone 13', devices['iPhone 13']], ['768', { viewport: { width: 768, height: 900 } }], ['1440', { viewport: { width: 1440, height: 900 } }]]) {
  const ctx = await b.newContext(o); const p = await ctx.newPage();
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const r = await p.$eval('.hero__media img', i => { const q = i.getBoundingClientRect(); return [Math.round(q.width), Math.round(q.height), (q.width / q.height).toFixed(3), (i.naturalWidth / i.naturalHeight).toFixed(3)]; });
  console.log(n.padEnd(10), `img ${r[0]}x${r[1]} · proporción ${r[2]} (original ${r[3]})`);
  if (n === 'iPhone 13') await p.screenshot({ path: '../reference/screens/mejoras/mobile/iphone-hero.png' });
  await ctx.close();
}
await b.close();
