import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: Number(process.argv[2]||390), height: 900 } });
await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => {
  const q = (s) => [...document.querySelectorAll(s)].map(e => { const r = e.getBoundingClientRect(); return s + ' ' + [r.x, r.y + scrollY, r.width, r.height].map(Math.round).join(','); }).join('\n');
  return [q('[data-id="56745b8"] img'), q('[data-id="56745b8"] p'), q('[data-id="56745b8"] .elementor-button'), q('[data-id="1c74641"] summary'), q('[data-id="1c74641"] summary svg'), q('[data-id="17b7ae8"] .elementor-divider-separator'), q('[data-id="17b7ae8"] h3')].join('\n');
}));
await b.close();
