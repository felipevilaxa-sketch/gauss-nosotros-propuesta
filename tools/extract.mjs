// Uso: node extract.mjs <url> <salida.json>
// Vuelca estilos computados de headings, párrafos, botones, links y contenedores
// en 1440/768/390, más inventario de imágenes, fondos y SVG inline.
import { chromium } from 'playwright';
import fs from 'node:fs';

const [url, out] = process.argv.slice(2);
const browser = await chromium.launch();
const result = {};

for (const width of [1440, 768, 390]) {
  const page = await browser.newPage({ viewport: { width, height: 900 } });
  await page.goto(url, { waitUntil: 'networkidle', timeout: 90000 });
  await page.addStyleTag({ content: '.cky-consent-container,.cky-overlay,.cky-btn-revisit-wrapper{display:none!important}' });
  await page.evaluate(async () => {
    for (let y = 0; y < document.body.scrollHeight; y += 400) { window.scrollTo(0, y); await new Promise(r => setTimeout(r, 80)); }
    window.scrollTo(0, 0);
  });
  await page.waitForTimeout(1000);

  result[width] = await page.evaluate(() => {
    const props = ['fontFamily','fontSize','fontWeight','lineHeight','letterSpacing','color','backgroundColor',
      'padding','margin','borderRadius','border','boxShadow','textTransform','textAlign','gap','maxWidth','width','height','display','flexDirection','gridTemplateColumns','justifyContent','alignItems','backgroundImage','position','top'];
    const pick = el => { const cs = getComputedStyle(el); const o = {}; props.forEach(p => o[p] = cs[p]); const r = el.getBoundingClientRect(); o.rect = [Math.round(r.x), Math.round(r.y + scrollY), Math.round(r.width), Math.round(r.height)]; return o; };
    const sel = 'h1,h2,h3,h4,h5,h6,p,a,button,.elementor-button,.e-con,.elementor-widget,li,span,summary,img,svg,i';
    const items = [];
    document.querySelectorAll(sel).forEach(el => {
      const r = el.getBoundingClientRect();
      if (r.width === 0 && r.height === 0) return;
      const text = (el.children.length === 0 || /^(H\d|P|A|BUTTON|SUMMARY)$/.test(el.tagName)) ? (el.innerText || '').trim().slice(0, 160) : '';
      items.push({ tag: el.tagName.toLowerCase(), id: el.dataset.id || el.id || '', cls: (el.className && el.className.baseVal === undefined ? el.className : '').toString().slice(0, 160), text, style: pick(el) });
    });
    const imgs = [...document.querySelectorAll('img')].map(i => ({ src: i.currentSrc || i.src, srcset: i.srcset, alt: i.alt, w: i.naturalWidth, h: i.naturalHeight, display: [Math.round(i.getBoundingClientRect().width), Math.round(i.getBoundingClientRect().height)] }));
    const bgs = [...document.querySelectorAll('*')].map(e => getComputedStyle(e).backgroundImage).filter(b => b && b !== 'none');
    const svgs = [...document.querySelectorAll('svg')].map(s => ({ cls: s.getAttribute('class'), size: [Math.round(s.getBoundingClientRect().width), Math.round(s.getBoundingClientRect().height)], len: s.outerHTML.length }));
    return { docHeight: document.body.scrollHeight, items, imgs, bgs: [...new Set(bgs)], svgs };
  });
  await page.close();
}
fs.writeFileSync(out, JSON.stringify(result, null, 1));
await browser.close();
console.log('ok', out);
