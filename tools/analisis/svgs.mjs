import { chromium } from 'playwright';
import fs from 'node:fs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
const svgs = await p.evaluate(() => [...document.querySelectorAll('svg')].map((s, i) => {
  const host = s.closest('[data-id]'); const sec = s.closest('[data-elementor-type]');
  let ctx = s.parentElement; for (let k = 0; k < 4 && ctx && !(ctx.innerText || '').trim(); k++) ctx = ctx.parentElement;
  return { i, tpl: sec?.dataset.elementorType, dataId: host?.dataset.id, widget: host?.dataset.widget_type, cls: s.getAttribute('class'), ctx: (ctx?.innerText || '').trim().slice(0, 50).replace(/\n/g, ' | '), html: s.outerHTML };
}));
fs.writeFileSync('../../reference/inline-svgs.json', JSON.stringify(svgs, null, 1));
svgs.forEach(s => console.log(s.i, s.tpl, s.dataId, s.widget, s.cls, '|', s.ctx, '| len', s.html.length));
await b.close();
