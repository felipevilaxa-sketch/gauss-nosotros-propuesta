import { chromium } from 'playwright';
const out = '../reference/screens/mejoras/10-desplegables-linkedin/';
import fs from 'node:fs'; fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch(); const errors = [];
for (const w of [1440, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, hasTouch: w === 390 });
  p.on('pageerror', e => errors.push(`${w}: ${e.message}`));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const go = async s => { await p.evaluate(s => { const e = document.querySelector(s); scrollTo({ top: e.getBoundingClientRect().top + scrollY - 180, behavior: 'instant' }); }, s); await p.waitForTimeout(700); };
  await go('.valores');
  const cerradas = await p.$$eval('.valor', vs => vs.map(v => Math.round(v.getBoundingClientRect().height)));
  console.log(`${w} cards cerradas (alto):`, cerradas.join(', '), '| abiertas:', await p.$$eval('.valor__details[open]', d => d.length));
  await p.screenshot({ path: `${out}${w}-valores-cerrados.png` });
  // abrir la primera (clic) y la segunda (teclado)
  if (w === 390) await p.locator('.valor__trigger').first().tap(); else await p.locator('.valor__trigger').first().click();
  await p.waitForTimeout(500);
  await p.locator('.valor__trigger').nth(1).focus(); await p.keyboard.press('Enter'); await p.waitForTimeout(500);
  const est = await p.$$eval('.valor', vs => vs.map(v => (v.querySelector('details').open ? 'abierta' : 'cerrada') + ' ' + Math.round(v.getBoundingClientRect().height)));
  console.log(`${w} tras abrir 1 y 2:`, est.join(' | '));
  await p.screenshot({ path: `${out}${w}-valores-abiertos.png` });
  // cerrar la primera
  await p.locator('.valor__trigger').first().click(); await p.waitForTimeout(500);
  console.log(`${w} tras cerrar la 1:`, await p.$$eval('.valor__details', d => d.map(x => x.open ? 'A' : 'C').join('')));
  // LinkedIn
  await go('#directorio');
  const li = await p.$$eval('.team-card__linkedin', as => ({ total: as.length, aria: as[0].getAttribute('aria-label'), visibles: as.filter(a => a.offsetParent).length }));
  const antes = await p.evaluate(() => [location.href, Math.round(scrollY)]);
  await p.locator('#directorio .team-card__linkedin').first().click(); await p.waitForTimeout(400);
  const despues = await p.evaluate(() => [location.href, Math.round(scrollY)]);
  console.log(`${w} LinkedIn:`, JSON.stringify(li), '| clic no navega:', antes[0] === despues[0] && Math.abs(antes[1] - despues[1]) < 5, '| pestañas:', b.contexts()[0]?.pages().length ?? 1);
  await p.screenshot({ path: `${out}${w}-directorio.png` });
  await p.close();
}
await b.close(); console.log('errores JS:', errors.length ? errors : 'ninguno');
