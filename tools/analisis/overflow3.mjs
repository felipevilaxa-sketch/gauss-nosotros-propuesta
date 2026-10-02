import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const W = () => document.documentElement.scrollWidth;
  const out = ['total ' + W()];
  const q = s => { const e = document.querySelector(s); const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return `${s}: x${Math.round(r.left)} w${Math.round(r.width)} scrollW ${e.scrollWidth} overflowX ${cs.overflowX} minW ${cs.minWidth} display ${cs.display}`; };
  ['.vida', '.vida__inner', '.vida__filters', '.vida__filter-list', '.vida__grid', '.vida__cta'].forEach(s => out.push(q(s)));
  for (const s of ['.vida__filters', '.vida__grid', '.vida__intro', '.vida__cta']) { const e = document.querySelector(s); const d = e.style.display; e.style.display = 'none'; out.push(`sin ${s}: ${W()}`); e.style.display = d; }
  return out.join('\n');
}));
await b.close();
