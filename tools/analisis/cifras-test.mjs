import { chromium } from 'playwright';
const b = await chromium.launch();
for (const reducedMotion of ['no-preference', 'reduce']) {
  const p = await b.newPage({ viewport: { width: 1440, height: 400 }, reducedMotion });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const antes = await p.$$eval('[data-count]', els => els.map(e => e.textContent));
  await p.evaluate(() => document.getElementById('cifras').scrollIntoView());
  await p.waitForTimeout(250);
  const durante = await p.$$eval('[data-count]', els => els.map(e => e.textContent));
  await p.waitForTimeout(1600);
  const despues = await p.$$eval('[data-count]', els => els.map(e => e.textContent));
  console.log(reducedMotion, '| antes', antes.join(' · '), '| durante', durante.join(' · '), '| final', despues.join(' · '));
  await p.close();
}
await b.close();
