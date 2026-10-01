import { chromium } from 'playwright';
const D = '../../reference/screens/detail/';
const hide = '.cky-consent-container,.cky-overlay,.cky-btn-revisit-wrapper{display:none!important}';
const b = await chromium.launch();
const open = async (w, h = 900) => { const p = await b.newPage({ viewport: { width: w, height: h } }); await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' }); await p.addStyleTag({ content: hide });
  await p.evaluate(async () => { for (let y = 0; y < document.body.scrollHeight; y += 400) { scrollTo(0, y); await new Promise(r => setTimeout(r, 60)); } scrollTo(0, 0); }); await p.waitForTimeout(800); return p; };
// crops por sección
for (const w of []) {
  const p = await open(w);
  for (const id of ['fe1d8fa', '71166c2', '216edb7', '1c74641', '3bbf9b4', '56745b8']) {
    const el = await p.$(`[data-id="${id}"]`); if (el) await el.screenshot({ path: `${D}${w}-${id}.png` });
  }
  await p.close();
}
// dropdowns desktop
let p = await open(1440, 500);
await p.hover('[data-id="47a49b4"] .elementor-nav-menu--main li.menu-item-has-children > a'); await p.waitForTimeout(600);
await p.screenshot({ path: D + '1440-dropdown-soluciones.png', clip: { x: 0, y: 0, width: 900, height: 400 } });
const items = await p.$$('[data-id="47a49b4"] .elementor-nav-menu--main > ul > li.menu-item-has-children');
await p.mouse.move(10, 300); await p.waitForTimeout(400);
if (items[1]) { await items[1].hover(); await p.waitForTimeout(600); await p.screenshot({ path: D + '1440-dropdown-idioma.png', clip: { x: 0, y: 0, width: 900, height: 400 } }); }
const dd = await p.evaluate(() => [...document.querySelectorAll('[data-id="47a49b4"] .elementor-nav-menu--main .sub-menu')].map(s => { const cs = getComputedStyle(s); const a = s.querySelector('a'); const ac = getComputedStyle(a); const r = s.getBoundingClientRect(); return { rect: [r.x, r.y, r.width, r.height], bg: cs.backgroundColor, radius: cs.borderRadius, shadow: cs.boxShadow, aPad: ac.padding, aFs: ac.fontSize, aW: ac.fontWeight, aColor: ac.color, html: s.outerHTML.slice(0, 1200) }; }));
console.log(JSON.stringify(dd, null, 1));
await p.close();
// off-canvas mobile
p = await open(390, 844);
await p.click('[data-id="ffdd7bd"] a, [data-id="ffdd7bd"] .elementor-icon'); await p.waitForTimeout(1200);
await p.screenshot({ path: D + '390-offcanvas.png', fullPage: false });
const oc = await p.evaluate(() => { const e = document.querySelector('.e-off-canvas__content'); return e ? { h: e.scrollHeight, bg: getComputedStyle(e).backgroundColor } : null; });
console.log('offcanvas', JSON.stringify(oc));
await p.evaluate(() => { const e = document.querySelector('.e-off-canvas__content'); if (e) e.scrollTop = 700; }); await p.waitForTimeout(300);
await p.screenshot({ path: D + '390-offcanvas-2.png' });
await p.evaluate(() => { const e = document.querySelector('.e-off-canvas__content'); if (e) e.scrollTop = 99999; }); await p.waitForTimeout(300);
await p.screenshot({ path: D + '390-offcanvas-3.png' });
await p.close();
await b.close();
