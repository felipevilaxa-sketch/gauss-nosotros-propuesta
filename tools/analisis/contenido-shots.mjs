import { chromium } from 'playwright';
const out = '../reference/screens/mejoras/09-contenido-oficial/';
const b = await chromium.launch();
for (const w of [1440, 390]) {
  const p = await b.newPage({ viewport: { width: w, height: 900 }, locale: 'es-CL' });
  await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
  await p.addStyleTag({ content: '.site-header,.subnav{visibility:hidden!important}' });
  await p.$$eval('img[loading=lazy]', i => i.forEach(x => x.loading = 'eager')); await p.waitForTimeout(800);
  await p.evaluate(() => document.getElementById('cifras').scrollIntoView()); await p.waitForTimeout(1800);
  for (const id of ['cifras', 'presencia-latam', 'certificaciones']) await (await p.$('#' + id)).screenshot({ path: `${out}${w}-${id}.png` });
  await (await p.$('.trabaja__intro')).screenshot({ path: `${out}${w}-trabaja-intro.png` });
  await p.close();
}
await b.close(); console.log('ok');
