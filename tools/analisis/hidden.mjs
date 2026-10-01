import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
const r = await p.evaluate(() => {
  const o = {};
  o.navs = [...document.querySelectorAll('nav')].map(n => ({ cls: n.className.slice(0,80), aria: n.getAttribute('aria-label'), id: n.closest('[data-id]')?.dataset.id,
    links: [...n.querySelectorAll('a')].map(a => '  '.repeat(a.closest('ul').closest('li') ? (a.closest('ul').closest('li').closest('ul').closest('li')?2:1) : 0) + a.textContent.trim().replace(/\s+/g,' ') + ' -> ' + a.getAttribute('href')) }));
  o.offcanvas = [...document.querySelectorAll('.e-off-canvas')].map(e => ({ id: e.closest('[data-id]')?.dataset.id, text: e.textContent.replace(/\s+/g,' ').trim().slice(0, 1500), links: [...e.querySelectorAll('a')].map(a => a.textContent.trim().replace(/\s+/g,' ') + ' -> ' + a.getAttribute('href')) }));
  o.allLinks = [...document.querySelectorAll('header a, footer a, [data-elementor-type=header] a, [data-elementor-type=footer] a')].map(a => a.textContent.trim().replace(/\s+/g,' ').slice(0,40) + ' -> ' + a.getAttribute('href') + (a.target ? ' target=' + a.target : ''));
  const acc = document.querySelector('[data-id=\"dfdfa96\"]');
  o.gerencia = acc ? acc.innerText.replace(/\n+/g,' | ') : '';
  o.culturaP = [...document.querySelectorAll('[data-id=\"495c6be\"] p')].map(p => p.innerText);
  o.latamP = [...document.querySelectorAll('[data-id=\"1b798dc\"] p')].map(p => p.innerText);
  o.title = document.title; o.metaDesc = document.querySelector('meta[name=description]')?.content; o.lang = document.documentElement.lang;
  return o;
});
console.log(JSON.stringify(r, null, 1));
await b.close();
