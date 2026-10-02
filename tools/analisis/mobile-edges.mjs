// Bordes izquierdo/derecho del contenido de cada sección a 390px
import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
const rows = await p.evaluate(() => {
  const sels = { header: '.site-header__inner', subnav: '.subnav__list', hero: '.hero__text', cifras: '.cifras__list', ceo: '.ceo__inner', cultura: '.cultura__intro', valores: '.valores', equipo: '.equipo__inner', vida: '.vida__intro', latam: '.latam__intro', 'latam lista': '.latam__list', trabaja: '.trabaja__intro', 'trabaja form': '.trabaja__panel', footer: '.site-footer__inner' };
  return Object.entries(sels).map(([k, s]) => { const e = document.querySelector(s); if (!e) return [k, 'no existe']; const r = e.getBoundingClientRect(); const cs = getComputedStyle(e); return [k, Math.round(r.left + parseFloat(cs.paddingLeft)), Math.round(innerWidth - r.right + parseFloat(cs.paddingRight))]; });
});
rows.forEach(([k, l, r]) => console.log(k.padEnd(14), 'izq', String(l).padStart(3), ' der', String(r).padStart(3)));
await b.close();
