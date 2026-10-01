// Captura de secciones completas (elemento) a 1440/768/390
import { chromium } from 'playwright';
const out = '../reference/screens/mejoras/vida-trabaja/';
const b = await chromium.launch();
for (const w of [1440, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, locale: 'es-CL' });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 40)); } scrollTo(0, 0); });
  await p.waitForTimeout(600);
  await p.$$eval('img[loading=lazy]', imgs => imgs.forEach(i => i.loading = 'eager')); await p.waitForTimeout(500);
  // Fija el header/subnav fuera de la captura de elemento
  await p.addStyleTag({ content: '.site-header,.subnav{visibility:hidden!important}' });
  for (const id of ['vida-en-gauss', 'trabaja']) await (await p.$('#' + id)).screenshot({ path: `${out}${w}-${id}.png` });
  await p.close();
}
await b.close();
console.log('ok');
