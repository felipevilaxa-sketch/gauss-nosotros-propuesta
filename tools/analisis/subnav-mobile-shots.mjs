import { chromium, devices } from 'playwright';
const out = '../reference/screens/mejoras/mobile/';
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 13'], locale: 'es-CL' }); const p = await ctx.newPage();
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
for (const [id, name] of [['#equipo', 'equipo'], ['#vida-en-gauss', 'vida'], ['#trabaja', 'trabaja']]) {
  await p.evaluate(s => { const e = document.querySelector(s); scrollTo({ top: e.getBoundingClientRect().top + scrollY + 300, behavior: 'instant' }); }, id);
  await p.waitForTimeout(900);
  await p.screenshot({ path: `${out}iphone-subnav-${name}.png` });
}
console.log('ok'); await b.close();
