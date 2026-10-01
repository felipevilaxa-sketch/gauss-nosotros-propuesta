// Uso: node steps.mjs <nombre-ajuste> [selector-a-mostrar] [url]
// Capturas de página completa a 1440/768/390 + vista del viewport con el
// selector indicado arriba (scroll real, para ver header/subnav sticky).
import { chromium } from 'playwright';
import fs from 'node:fs';
const [name = 'ajuste', sel, url = 'http://localhost:5173/'] = process.argv.slice(2);
const out = `../reference/screens/mejoras/${name}/`;
fs.mkdirSync(out, { recursive: true });
const b = await chromium.launch();
const errors = [];
for (const w of [1440, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  p.on('pageerror', e => errors.push(`${w}: ${e.message}`));
  p.on('console', m => m.type() === 'error' && errors.push(`${w}: ${m.text()}`));
  await p.goto(url, { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 300) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); });
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}${w}-full.png`, fullPage: true });
  if (sel) {
    // Simula la navegación real: baja hasta el elemento (el header se oculta al bajar)
    await p.evaluate(s => { const e = document.querySelector(s); const y = e.getBoundingClientRect().top + scrollY; scrollTo(0, y - 140); }, sel);
    await p.waitForTimeout(1200);
    await p.screenshot({ path: `${out}${w}-vista.png` });
  }
  await p.close();
}
await b.close();
console.log('capturas en', out, '| errores JS:', errors.length ? errors : 'ninguno');
