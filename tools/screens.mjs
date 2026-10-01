// Uso: node screens.mjs <url> <carpeta-salida> [prefijo]
// Toma capturas de página completa a 1440, 768 y 390 px.
import { chromium } from 'playwright';
import path from 'node:path';
import fs from 'node:fs';

const [url, outDir, prefix = 'shot'] = process.argv.slice(2);
if (!url || !outDir) {
  console.error('Uso: node screens.mjs <url> <carpeta-salida> [prefijo]');
  process.exit(1);
}
fs.mkdirSync(outDir, { recursive: true });

const widths = [1440, 768, 390];
const browser = await chromium.launch();

for (const width of widths) {
  const page = await browser.newPage({ viewport: { width, height: 900 }, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  // Oculta el banner de cookies (CookieYes) sin interactuar con él: no forma parte de la réplica.
  await page.addStyleTag({ content: '.cky-consent-container,.cky-overlay,.cky-btn-revisit-wrapper,.cky-modal{display:none!important}' });
  // Scroll progresivo para disparar lazy-load y animaciones de entrada.
  await page.evaluate(async () => {
    const step = 400;
    for (let y = 0; y < document.body.scrollHeight; y += step) {
      window.scrollTo(0, y);
      await new Promise(r => setTimeout(r, 120));
    }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1500);
  const file = path.join(outDir, `${prefix}-${width}.png`);
  await page.screenshot({ path: file, fullPage: true });
  console.log('ok', file);
  await page.close();
}
await browser.close();
