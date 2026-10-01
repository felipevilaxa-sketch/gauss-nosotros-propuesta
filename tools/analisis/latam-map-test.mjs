import { chromium } from 'playwright';
const out = '../reference/screens/mejoras/latam-mapa/';
const b = await chromium.launch();
const errors = [];
for (const w of [1440, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, hasTouch: w === 390 });
  p.on('pageerror', e => errors.push(`${w}: ${e.message}`));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  // Centra el mapa (el sitio usa scroll suave: si Playwright desplaza al pasar el mouse, el país se mueve)
  await p.evaluate(() => { const m = document.querySelector('[data-latam-map]'); scrollTo({ top: m.getBoundingClientRect().top + scrollY - (innerHeight - m.offsetHeight) / 2 + 60, behavior: 'instant' }); });
  await p.waitForTimeout(1200);
  const inline = await p.$('.latam__svg');
  console.log(`\n${w}px · SVG en línea: ${inline ? 'sí' : 'NO'}`);
  for (const c of ['mexico', 'colombia', 'peru', 'chile']) {
    const path = p.locator(`.latam__svg [data-country="${c}"]`);
    if (w === 390) await path.tap(); else await path.hover();
    await p.waitForTimeout(400);
    const r = await p.evaluate(c => {
      const pop = document.querySelector('[data-map-popup]');
      const el = document.querySelector(`.latam__svg [data-country="${c}"]`);
      const pr = pop.getBoundingClientRect();
      return { fill: getComputedStyle(el).fill, visible: !pop.hidden && getComputedStyle(pop).opacity === '1', nombre: pop.querySelector('.map-popup__name').textContent, foto: pop.querySelector('.map-popup__photo').getAttribute('src'), dentroPantalla: pr.left >= 0 && pr.right <= innerWidth, lista: document.querySelector(`.country[data-country="${c}"]`).classList.contains('is-highlighted') };
    }, c);
    console.log(`  ${c.padEnd(9)} fill:${r.fill} popup:${r.visible ? 'visible' : 'NO'} "${r.nombre}" ${r.foto.split('/').pop()} dentroPantalla:${r.dentroPantalla} listaResaltada:${r.lista}`);
    if (c === 'peru' || (w !== 1440 && c === 'mexico')) await p.screenshot({ path: `${out}${w}-hover-${c}.png` });
    if (w === 390) { await path.tap(); await p.waitForTimeout(300); }
  }
  if (w === 1440) {
    await p.mouse.move(10, 10); await p.waitForTimeout(300);
    console.log('  mouse fuera → popup oculto:', await p.$eval('[data-map-popup]', e => e.hidden));
    // teclado
    await p.focus('.latam__svg [data-country="chile"]'); await p.waitForTimeout(300);
    console.log('  foco teclado en Chile → popup:', await p.$eval('.map-popup__name', e => e.textContent), '| visible', await p.$eval('[data-map-popup]', e => !e.hidden));
    await p.keyboard.press('Escape'); await p.waitForTimeout(200);
    console.log('  Esc → popup oculto:', await p.$eval('[data-map-popup]', e => e.hidden));
  }
  await p.close();
}
await b.close();
console.log('\nerrores JS:', errors.length ? errors : 'ninguno');
