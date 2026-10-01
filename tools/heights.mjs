// Compara alto de cada sección: original (data-id Elementor) vs réplica (id)
import { chromium } from 'playwright';
const map = { header: 'fe1d8fa', hero: '71166c2', 'cultura-valores': '216edb7', equipo: '1c74641', 'presencia-latam': '3bbf9b4', footer: '56745b8' };
const sub = { 'latam intro': ['1b798dc', '.latam__intro'], 'latam body': ['17b7ae8', '.latam__body'], 'latam list': ['83b1d96', '.latam__list'], 'footer col1': ['4408cee', '.site-footer__col--brand'], 'footer col3': ['25b2b8b', '.site-footer__col--contact'], 'valores': ['57ca63d', '.valores'], 'cultura intro': ['495c6be', '.cultura__intro'] };
const b = await chromium.launch();
const ws = process.argv.slice(2).map(Number);
for (const w of ws.length ? ws : [1440, 768, 390]) {
  const get = async (url, sel) => { const p = await b.newPage({ viewport: { width: w, height: 900 } }); await p.goto(url, { waitUntil: 'networkidle' });
    const r = await p.evaluate(sel => Object.fromEntries(Object.entries(sel).map(([k, s]) => { const e = document.querySelector(s); if (!e) return [k, null]; const q = e.getBoundingClientRect(); return [k, [Math.round(q.y + scrollY), Math.round(q.height)]]; })), sel); await p.close(); return r; };
  const os = {}, rs = {};
  for (const [k, v] of Object.entries(map)) { os[k] = `[data-id="${v}"]`; rs[k] = '#' + k; }
  for (const [k, [o, r]] of Object.entries(sub)) { os[k] = `[data-id="${o}"]`; rs[k] = r; }
  const [o, r] = await Promise.all([get('https://gausscontrol.com/nosotros/', os), get('http://localhost:5173/', rs)]);
  console.log(`== ${w}`);
  for (const k of Object.keys(os)) console.log(k.padEnd(16), 'orig', JSON.stringify(o[k]), ' répl', JSON.stringify(r[k]), (o[k] && r[k] && o[k][1] !== r[k][1]) ? `  Δh ${r[k][1] - o[k][1]}` : '');
}
await b.close();
