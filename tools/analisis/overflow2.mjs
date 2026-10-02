import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const W = () => document.documentElement.scrollWidth;
  const lines = ['total ' + W()];
  const blocks = [...document.querySelectorAll('body > *, main > *')];
  for (const el of blocks) {
    const prev = el.style.display; el.style.display = 'none';
    const w = W(); el.style.display = prev;
    lines.push(`${el.tagName.toLowerCase()}#${el.id || ''}.${String(el.className).split(' ')[0]} → sin él: ${w}`);
  }
  return lines.join('\n');
}));
await b.close();
