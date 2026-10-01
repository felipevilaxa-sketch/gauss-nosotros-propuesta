// Verifica interacciones de la réplica y guarda capturas en reference/screens/replica/
import { chromium } from 'playwright';
const D = '../reference/screens/replica/';
const URL = 'http://localhost:5173/';
const b = await chromium.launch();
const errors = [];
let p = await b.newPage({ viewport: { width: 1440, height: 600 } });
p.on('pageerror', e => errors.push(e.message)); p.on('console', m => m.type() === 'error' && errors.push(m.text()));
await p.goto(URL, { waitUntil: 'networkidle' });
await p.hover('#submenu-soluciones >> xpath=..'); await p.waitForTimeout(400);
await p.screenshot({ path: D + 'int-1440-dropdown-soluciones.png', clip: { x: 0, y: 0, width: 900, height: 400 } });
await p.mouse.move(700, 500); await p.waitForTimeout(400);
await p.hover('#submenu-idioma >> xpath=..'); await p.waitForTimeout(400);
await p.screenshot({ path: D + 'int-1440-dropdown-idioma.png', clip: { x: 0, y: 0, width: 900, height: 400 } });
await p.mouse.move(700, 500);
// teclado: Tab hasta Soluciones + Enter
await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab'); await p.keyboard.press('Tab');
await p.keyboard.press('Enter'); await p.waitForTimeout(300);
console.log('teclado: foco en', await p.evaluate(() => document.activeElement.textContent.trim()), '| abierto:', await p.evaluate(() => document.querySelector('[aria-controls="submenu-soluciones"]').getAttribute('aria-expanded')));
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
console.log('escape: abierto:', await p.evaluate(() => document.querySelector('[aria-controls="submenu-soluciones"]').getAttribute('aria-expanded')));
// scroll header
await p.evaluate(() => window.scrollTo(0, 800)); await p.waitForTimeout(900);
console.log('scroll abajo → header oculto:', await p.evaluate(() => document.querySelector('[data-header]').classList.contains('is-hidden')));
await p.evaluate(() => window.scrollTo(0, 500)); await p.waitForTimeout(900);
console.log('scroll arriba → header oculto:', await p.evaluate(() => document.querySelector('[data-header]').classList.contains('is-hidden')));
// acordeón
await p.evaluate(() => window.scrollTo(0, 0));
await p.click('#gerencia summary'); await p.waitForTimeout(700);
console.log('acordeón: directorio open', await p.evaluate(() => document.getElementById('directorio').open), '| gerencia open', await p.evaluate(() => document.getElementById('gerencia').open));
await (await p.$('#equipo')).screenshot({ path: D + 'int-1440-gerencia-abierta.png' });
// hover botones (volver arriba: el header se ocultó al bajar hasta el acordeón)
await p.evaluate(() => window.scrollTo(0, 0)); await p.waitForTimeout(900);
await p.hover('.site-header .btn--contact'); await p.waitForTimeout(400);
console.log('hover Contacto bg:', await p.evaluate(() => getComputedStyle(document.querySelector('.site-header .btn--contact')).backgroundColor));
await p.close();

// mobile off-canvas
p = await b.newPage({ viewport: { width: 390, height: 844 } });
p.on('pageerror', e => errors.push(e.message));
await p.goto(URL, { waitUntil: 'networkidle' });
await p.click('[data-offcanvas-open]'); await p.waitForTimeout(700);
await p.screenshot({ path: D + 'int-390-offcanvas.png' });
console.log('offcanvas: body overflow', await p.evaluate(() => getComputedStyle(document.body).overflow), '| foco en', await p.evaluate(() => document.activeElement.getAttribute('aria-label')));
await p.click('.offcanvas__toggle'); await p.click('.lang-select__toggle'); await p.waitForTimeout(300);
await p.screenshot({ path: D + 'int-390-offcanvas-abierto.png' });
await p.evaluate(() => document.querySelector('.offcanvas__panel').scrollTop = 99999); await p.waitForTimeout(200);
await p.screenshot({ path: D + 'int-390-offcanvas-final.png' });
await p.keyboard.press('Escape'); await p.waitForTimeout(300);
console.log('escape: offcanvas hidden', await p.evaluate(() => document.getElementById('offcanvas').hidden));
await p.close();
console.log('errores JS:', errors.length ? errors : 'ninguno');
await b.close();
