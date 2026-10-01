// Uso: node diffpos.mjs [ancho]
// Compara la posición (x, y, ancho, alto) de cada bloque de texto visible
// entre el sitio original y la réplica local. Lista desfases > 3px.
import { chromium } from 'playwright';

const ORIG = 'https://gausscontrol.com/nosotros/';
const REPL = 'http://localhost:5173/';
const widths = process.argv.slice(2).map(Number).filter(Boolean);
const b = await chromium.launch();

async function grab(url, w) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await p.addStyleTag({ content: '.cky-consent-container,.cky-overlay{display:none!important}' });
  await p.waitForTimeout(500);
  const r = await p.evaluate(() => {
    const out = {};
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let n;
    while ((n = walker.nextNode())) {
      const t = n.textContent.trim().replace(/\s+/g, ' ');
      if (t.length < 3) continue;
      const el = n.parentElement;
      if (el.closest('.offcanvas,.e-off-canvas,[data-offcanvas],.cky-consent-container,script,style,.visually-hidden,.elementor-screen-only,.skip-link,.skip-link,.screen-reader-text')) continue;
      const range = document.createRange(); range.selectNodeContents(n);
      const rc = range.getBoundingClientRect();
      if (!rc.width || !rc.height) continue;
      const key = t.slice(0, 40);
      if (out[key]) { out[key].n++; key in out; }
      const k = out[key] ? key + ' #' + out[key].n : key;
      out[k] = { x: Math.round(rc.x), y: Math.round(rc.y + scrollY), w: Math.round(rc.width), h: Math.round(rc.height), n: 1 };
    }
    return out;
  });
  await p.close();
  return r;
}

for (const w of widths.length ? widths : [1440, 768, 390]) {
  const [o, r] = await Promise.all([grab(ORIG, w), grab(REPL, w)]);
  console.log(`\n===== ${w}px =====`);
  let prevDy = null;
  for (const k of Object.keys(o)) {
    const a = o[k], c = r[k];
    if (!c) { console.log(`FALTA en réplica: "${k}"`); continue; }
    const dx = c.x - a.x, dy = c.y - a.y, dw = c.w - a.w, dh = c.h - a.h;
    if (Math.abs(dx) > 3 || Math.abs(dw) > 3 || Math.abs(dh) > 3 || (prevDy === null || Math.abs(dy - prevDy) > 3)) {
      if (Math.abs(dx) > 3 || Math.abs(dy) > 3 || Math.abs(dw) > 3 || Math.abs(dh) > 3)
        console.log(`${k.padEnd(42)} dx ${dx}  dy ${dy}  dw ${dw}  dh ${dh}   (orig ${a.x},${a.y} ${a.w}x${a.h})`);
    }
    prevDy = dy;
  }
  for (const k of Object.keys(r)) if (!o[k]) console.log(`SOBRA en réplica: "${k}"`);
}
await b.close();
