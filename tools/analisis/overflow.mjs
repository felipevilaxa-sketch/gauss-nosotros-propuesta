import { chromium } from 'playwright';
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const vw = document.documentElement.clientWidth;
  // elementos que sobresalen y cuyo ancestro no recorta (overflow visible)
  const clips = el => { for (let a = el.parentElement; a; a = a.parentElement) { const o = getComputedStyle(a).overflowX; if (o !== 'visible') return a; } return null; };
  const out = [];
  document.querySelectorAll('body *').forEach(el => {
    const r = el.getBoundingClientRect();
    if (r.right > vw + 1 && !clips(el)) out.push(`${el.tagName.toLowerCase()}.${String(el.className).split(' ')[0]} right=${Math.round(r.right)} w=${Math.round(r.width)}`);
  });
  return `docW ${document.documentElement.scrollWidth} vw ${vw}\n` + out.slice(0, 25).join('\n');
}));
await b.close();
