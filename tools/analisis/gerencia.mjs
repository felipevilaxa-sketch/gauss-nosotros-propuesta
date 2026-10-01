import { chromium } from 'playwright';
const b = await chromium.launch();
for (const width of [1440, 390]) {
const p = await b.newPage({ viewport: { width, height: 900 } });
await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
await p.addStyleTag({ content: '.cky-consent-container,.cky-overlay{display:none!important}' });
const r = await p.evaluate(() => {
  const cog = [...document.querySelectorAll('[data-id="495c6be"] p')][0]; const cs = getComputedStyle(cog.closest('.elementor-widget'));
  const sums = [...document.querySelectorAll('[data-id="dfdfa96"] details')].map(d => ({ open: d.open, summary: d.querySelector('summary').innerText.trim() }));
  return { cognusVisible: cs.display, cognusRect: cog.getBoundingClientRect().height, sums };
});
console.log(width, JSON.stringify(r));
await p.click('[data-id="dfdfa96"] details:nth-of-type(2) summary');
await p.waitForTimeout(1200);
const g = await p.evaluate(() => [...document.querySelectorAll('[data-id="dfdfa96"] details')][1].innerText.replace(/\n+/g, ' | '));
console.log('GERENCIA', g);
const el = await p.$('[data-id="1c74641"]');
await el.screenshot({ path: `../reference/screens/original-equipo-gerencia-abierta-${width}.png` });
await p.close();
}
await b.close();
