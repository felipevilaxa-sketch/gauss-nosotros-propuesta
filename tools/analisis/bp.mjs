import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1024, 1025, 767]) {
  const p = await b.newPage({ viewport: { width: w, height: 800 } });
  await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => { const vis = id => { const e = document.querySelector(`[data-id="${id}"]`); return e ? getComputedStyle(e).display + ' ' + Math.round(e.getBoundingClientRect().width) : 'x'; };
    const h = document.querySelector('[data-id="fe1d8fa"]'); const cs = getComputedStyle(h);
    return { nav: vis('47a49b4'), social: vis('abee83b'), contacto: vis('6852e2c'), login: vis('78595f7'), burger: vis('ffdd7bd'), footOff: vis('7597021'), footRight: vis('25b2b8b'), hShadow: cs.boxShadow, hPos: cs.position, hZ: cs.zIndex, hid: h.id };
  });
  console.log(w, JSON.stringify(r)); await p.close();
}
await b.close();
