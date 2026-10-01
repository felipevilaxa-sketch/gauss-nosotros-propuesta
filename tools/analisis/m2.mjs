import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 768, height: 900 } });
await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
console.log(await p.evaluate(() => [...document.querySelectorAll('[data-id="17b7ae8"] .elementor-icon, [data-id="17b7ae8"] p, [data-id="25b2b8b"] .elementor-button, [data-id="25b2b8b"] p')].map(e => { const r = e.getBoundingClientRect(); return e.className.slice(0,30) + ' ' + [r.x, r.y + scrollY, r.width, r.height].map(Math.round).join(','); }).join('\n')));
await b.close();
