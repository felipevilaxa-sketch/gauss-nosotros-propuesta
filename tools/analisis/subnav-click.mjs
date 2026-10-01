import { chromium } from 'playwright';
const b = await chromium.launch();
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 } });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  for (const [label, sel] of [['Oficinas', '#latam-title'], ['Equipo', '#equipo-title'], ['Cultura', '#cultura-title']]) {
    await p.evaluate(() => scrollTo(0, 650)); await p.waitForTimeout(700);
    await p.click(`.subnav__link:text-is("${label}")`); await p.waitForTimeout(1500);
    const r = await p.evaluate(s => { const t = document.querySelector(s).getBoundingClientRect().top; const sn = document.querySelector('.subnav').getBoundingClientRect().bottom; const act = document.querySelector('.subnav__link.is-active')?.textContent; return { tituloTop: Math.round(t), subnavBottom: Math.round(sn), activo: act }; }, sel);
    console.log(w, label, JSON.stringify(r), r.tituloTop > r.subnavBottom ? 'OK' : 'TAPADO');
  }
  await p.close();
}
await b.close();
