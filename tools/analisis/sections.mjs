import { chromium } from 'playwright';
const b = await chromium.launch();
for (const width of [1440, 768, 390]) {
  const p = await b.newPage({ viewport: { width, height: 900 } });
  await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
  const r = await p.evaluate(() => {
    const out = [];
    const walk = (el, depth) => {
      if (depth > 3) return;
      el.querySelectorAll(':scope > .e-con, :scope > .e-con-inner > .e-con').forEach(c => {
        const cs = getComputedStyle(c); const rc = c.getBoundingClientRect();
        if (rc.height === 0) return;
        out.push('  '.repeat(depth) + `${c.dataset.id} ${Math.round(rc.x)},${Math.round(rc.y+scrollY)} ${Math.round(rc.width)}x${Math.round(rc.height)} pad:${cs.padding} bg:${cs.backgroundColor} ${cs.backgroundImage!=='none'?'img':''} dir:${cs.flexDirection} gap:${cs.gap} r:${cs.borderRadius} inner:${c.querySelector(':scope>.e-con-inner')?getComputedStyle(c.querySelector(':scope>.e-con-inner')).maxWidth:'-'}`);
        walk(c, depth + 1);
      });
    };
    document.querySelectorAll('[data-elementor-type]').forEach(t => { out.push('## ' + t.dataset.elementorType); walk(t, 0); });
    return out.join('\n');
  });
  console.log('=====', width, '\n' + r);
  await p.close();
}
await b.close();
