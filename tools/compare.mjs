// Uso: node compare.mjs [ancho...]
// Genera reference/screens/compare/compare-<ancho>-<n>.png con original | réplica
// en tramos de 900px de alto, más un resumen de alturas de página.
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';

const S = path.resolve('../reference/screens');
const out = path.join(S, 'compare');
fs.mkdirSync(out, { recursive: true });
const widths = process.argv.slice(2).map(Number).filter(Boolean);
const list = widths.length ? widths : [1440, 768, 390];

const b = await chromium.launch();
for (const w of list) {
  // Requiere el servidor local (node tools/serve.mjs) corriendo en :5173
  const a = `http://localhost:5173/reference/screens/original-${w}.png`;
  const r = `http://localhost:5173/reference/screens/replica/replica-${w}.png`;
  const p = await b.newPage({ viewport: { width: w * 2 + 20, height: 900 } });
  await p.goto('http://localhost:5173/'); await p.setContent(`<body style="margin:0;display:flex;align-items:flex-start;gap:20px;background:#f0f"><img id=a src="${a}"><img id=b src="${r}"></body>`);
  await p.waitForFunction(() => [...document.images].every(i => i.complete));
  const [ha, hb] = await p.evaluate(() => [a.naturalHeight, b.naturalHeight]);
  console.log(`${w}px  original ${ha}px · réplica ${hb}px · diferencia ${hb - ha}px`);
  const h = Math.max(ha, hb);
  await p.setViewportSize({ width: w * 2 + 20, height: h });
  for (let y = 0, n = 1; y < h; y += 900, n++) {
    await p.screenshot({ path: path.join(out, `compare-${w}-${n}.png`), clip: { x: 0, y, width: w * 2 + 20, height: Math.min(900, h - y) } });
  }
  await p.close();
}
await b.close();
