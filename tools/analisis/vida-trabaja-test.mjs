// Prueba: anclas de la subnav, filtros de Vida en Gauss y validación del formulario.
import { chromium } from 'playwright';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';

const URL = 'http://localhost:5173/';
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), 'gauss-'));
const pdfOk = path.join(tmp, 'cv.pdf');
const pdfBig = path.join(tmp, 'cv-grande.pdf');
const docx = path.join(tmp, 'cv.docx');
fs.writeFileSync(pdfOk, '%PDF-1.4\n%prueba\n');
fs.writeFileSync(pdfBig, Buffer.alloc(6 * 1024 * 1024, 1));
fs.writeFileSync(docx, 'no es pdf');

const b = await chromium.launch();
const errors = [];
const log = (...a) => console.log(...a);

for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  p.on('pageerror', e => errors.push(e.message));
  await p.goto(URL, { waitUntil: 'networkidle' });

  // 1. Cada ancla tiene sección y se marca activa al hacer clic
  const hrefs = await p.$$eval('.subnav__link', as => as.map(a => [a.textContent.trim(), a.getAttribute('href')]));
  for (const [label, href] of hrefs) {
    const exists = await p.$(href);
    await p.evaluate(() => scrollTo(0, 650)); await p.waitForTimeout(500);
    await p.click(`.subnav__link[href="${href}"]`); await p.waitForTimeout(2600); // el scroll suave en mobile tarda ~1,5 s en páginas largas
    const active = await p.$eval('.subnav__link.is-active', a => a.textContent.trim()).catch(() => '(ninguna)');
    log(`${w} ancla ${label.padEnd(22)} sección:${exists ? 'sí' : 'NO'}  activa:${active}  ${exists && active === label ? 'OK' : 'REVISAR'}`);
  }
}

// 2. Filtros
let p = await b.newPage({ viewport: { width: 1440, height: 900 } });
p.on('pageerror', e => errors.push(e.message));
await p.goto(URL, { waitUntil: 'networkidle' });
const visibles = () => p.$$eval('.actividad', els => els.filter(e => !e.hidden).length);
log('\nfiltro Todas →', await visibles(), 'cards');
for (const f of ['en-terreno', 'capacitaciones', 'eventos-y-ferias', 'comunidad', 'celebraciones', 'todas']) {
  await p.click(`[data-filter="${f}"]`); await p.waitForTimeout(700);
  const pressed = await p.$$eval('[data-filter]', bs => bs.filter(b => b.getAttribute('aria-pressed') === 'true').map(b => b.dataset.filter));
  const status = await p.$eval('[data-vida-status]', s => s.textContent);
  log(`filtro ${f.padEnd(17)} → ${await visibles()} cards · aria-pressed=${pressed.join(',')} · "${status}"`);
}
await p.click('[data-filter="celebraciones"]'); await p.waitForTimeout(700);
await (await p.$('#vida-en-gauss')).screenshot({ path: '../../reference/screens/mejoras/vida-trabaja/1440-vida-filtro-celebraciones.png' });
await p.click('[data-filter="todas"]'); await p.waitForTimeout(700);

// 3. Formulario
const err = id => p.$eval(`#${id}-error`, e => e.hidden ? '' : e.textContent);
await p.click('.apply-form__submit'); await p.waitForTimeout(200);
log('\nenvío vacío → foco en', await p.evaluate(() => document.activeElement.id));
for (const id of ['ap-nombre', 'ap-email', 'ap-telefono', 'ap-pais', 'ap-area', 'ap-cv', 'ap-consent']) log(`  ${id}: ${await err(id)}`);
await (await p.$('#trabaja')).screenshot({ path: '../../reference/screens/mejoras/vida-trabaja/1440-trabaja-errores.png' });

await p.fill('#ap-email', 'nombre@empresa'); await p.locator('#ap-email').blur();
log('email "nombre@empresa" →', await err('ap-email'));
await p.fill('#ap-linkedin', 'linkedin/yo'); await p.locator('#ap-linkedin').blur();
log('linkedin "linkedin/yo" →', await err('ap-linkedin'));
await p.setInputFiles('#ap-cv', docx); log('CV .docx →', await err('ap-cv'));
await p.setInputFiles('#ap-cv', pdfBig); log('CV 6 MB →', await err('ap-cv'));

await p.fill('#ap-nombre', 'Persona de Prueba');
await p.fill('#ap-email', 'persona@empresa.com');
await p.fill('#ap-telefono', '+56 9 1234 5678');
await p.selectOption('#ap-pais', 'Chile');
await p.selectOption('#ap-area', 'Customer Success');
await p.fill('#ap-linkedin', 'https://www.linkedin.com/in/persona-prueba');
await p.setInputFiles('#ap-cv', pdfOk);
await p.check('#ap-consent');
const quedan = await p.$$eval('.field__error', es => es.filter(e => !e.hidden).length);
log('con datos válidos → errores visibles:', quedan);
await p.click('.apply-form__submit'); await p.waitForTimeout(1300);
log('tras enviar → éxito visible:', await p.$eval('[data-apply-success]', e => !e.hidden), '| foco en', await p.evaluate(() => document.activeElement.id));
await (await p.$('#trabaja')).screenshot({ path: '../../reference/screens/mejoras/vida-trabaja/1440-trabaja-exito.png' });
await p.click('[data-apply-again]'); await p.waitForTimeout(200);
log('"Enviar otra" → formulario visible:', await p.$eval('[data-apply-form]', f => !f.hidden), '| nombre vacío:', await p.$eval('#ap-nombre', i => i.value === ''));

// 4. Movimiento reducido: filtros sin animación
await p.close();
p = await b.newPage({ viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' });
await p.goto(URL, { waitUntil: 'networkidle' });
await p.click('[data-filter="comunidad"]');
log('\nreduced-motion: tras el clic (sin esperar) →', await visibles(), 'cards visibles');
await p.close();

await b.close();
log('\nerrores JS:', errors.length ? errors : 'ninguno');
