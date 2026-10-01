import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 900 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await p.evaluate(() => scrollTo(0, 650)); await p.waitForTimeout(500);
await p.click('.subnav__link[href="#trabaja"]');
for (const t of [300, 800, 1500, 2500]) {
  await p.waitForTimeout(t === 300 ? 300 : t - [300, 800, 1500][[800, 1500, 2500].indexOf(t)]);
  console.log(t + 'ms', JSON.stringify(await p.evaluate(() => ({ y: Math.round(scrollY), maxY: document.documentElement.scrollHeight - innerHeight, trabajaTop: Math.round(document.getElementById('trabaja').getBoundingClientRect().top), latamBottom: Math.round(document.getElementById('presencia-latam').getBoundingClientRect().bottom), activo: document.querySelector('.subnav__link.is-active')?.textContent }))));
}
await b.close();
