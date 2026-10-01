import { chromium } from 'playwright';
const out = '../reference/screens/mejoras/latam-mapa/';
const b = await chromium.launch(); const errors = [];
for (const w of [1440, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, hasTouch: w === 390 });
  p.on('pageerror', e => errors.push(`${w}: ${e.message}`));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(() => { const m = document.querySelector('.latam__body'); scrollTo({ top: m.getBoundingClientRect().top + scrollY - 120, behavior: 'instant' }); });
  await p.waitForTimeout(900);
  console.log(`\n${w}px`);
  for (const c of ['mexico', 'colombia', 'peru', 'chile']) {
    const li = p.locator(`.country[data-country="${c}"] .country__name`);
    if (w === 390) await li.tap(); else await li.hover();
    await p.waitForTimeout(400);
    const r = await p.evaluate(c => ({
      fill: getComputedStyle(document.querySelector(`.latam__svg [data-country="${c}"]`)).fill,
      caja: getComputedStyle(document.querySelector(`.country[data-country="${c}"]`)).backgroundColor,
      popup: !document.querySelector('[data-map-popup]').hidden ? document.querySelector('.map-popup__name').textContent : '(cerrado)'
    }), c);
    console.log(`  caja ${c.padEnd(9)} → país:${r.fill} caja:${r.caja} popup:${r.popup}`);
    if (c === 'colombia' && w !== 390) await p.screenshot({ path: `${out}${w}-caja-colombia.png` });
    if (w === 390) {
      if (c === 'chile') await p.screenshot({ path: `${out}390-caja-chile.png`, fullPage: false });
      await li.tap(); await p.waitForTimeout(250);
    }
  }
  if (w === 1440) {
    await p.mouse.move(5, 5); await p.waitForTimeout(300);
    console.log('  mouse fuera → popup oculto:', await p.$eval('[data-map-popup]', e => e.hidden));
    await p.focus('.country[data-country="peru"] a'); await p.waitForTimeout(300);
    console.log('  Tab al teléfono de Perú → popup:', await p.$eval('.map-popup__name', e => e.textContent));
    await p.screenshot({ path: `${out}1440-mapa-alto.png` });
  }
  await p.close();
}
await b.close(); console.log('\nerrores JS:', errors.length ? errors : 'ninguno');
