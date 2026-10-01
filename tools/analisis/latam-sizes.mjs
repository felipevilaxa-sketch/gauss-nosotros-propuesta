import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 1024, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' }); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const q = s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); return [Math.round(r.width), Math.round(r.height)]; }; return { body: q('.latam__body'), list: q('.latam__list'), map: q('.latam__map'), svg: q('.latam__svg') }; });
  console.log(w, JSON.stringify(r)); await p.close();
}
await b.close();
