import { chromium } from 'playwright';
const b = await chromium.launch(); const errors = [];
for (const w of [1440, 768, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  p.on('pageerror', e => errors.push(`${w}: ${e.message}`));
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  const st = () => p.evaluate(() => { const t = document.querySelector('[data-historia-track]'); return { controles: !document.querySelector('[data-historia-controls]').hidden, prevDis: document.querySelector('[data-historia-prev]').disabled, nextDis: document.querySelector('[data-historia-next]').disabled, scrollLeft: Math.round(t.scrollLeft), docW: document.documentElement.scrollWidth }; });
  console.log(w, 'inicio', JSON.stringify(await st()));
  if (w !== 390) {
    await p.evaluate(() => document.getElementById('historia').scrollIntoView()); await p.waitForTimeout(600);
    for (let i = 0; i < 6; i++) { const dis = await p.$eval('[data-historia-next]', b => b.disabled); if (dis) break; await p.click('[data-historia-next]'); await p.waitForTimeout(600); }
    console.log(w, 'al final', JSON.stringify(await st()));
    await p.screenshot({ path: `../reference/screens/mejoras/08-historia/${w}-final.png` });
  }
  // subnav
  await p.evaluate(() => scrollTo(0, 650)); await p.waitForTimeout(500);
  await p.click('.subnav__link[href="#historia"]'); await p.waitForTimeout(2600);
  console.log(w, 'subnav Historia → activa:', await p.$eval('.subnav__link.is-active', a => a.textContent.trim()));
  await p.close();
}
await b.close(); console.log('errores JS:', errors.length ? errors : 'ninguno');
