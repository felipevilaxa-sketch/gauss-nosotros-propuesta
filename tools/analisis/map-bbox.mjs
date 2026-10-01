import { chromium } from 'playwright';
import fs from 'node:fs';
const svg = fs.readFileSync('../assets/img/mapa-latinoamerica.svg', 'utf8');
const b = await chromium.launch(); const p = await b.newPage();
await p.setContent(svg);
console.log(await p.evaluate(() => [...document.querySelectorAll('path')].map((el, i) => ({ i, fill: el.getAttribute('fill'), bb: el.getBBox() })).filter(o => o.fill === '#A2BCD3').map(o => `#${o.i} x${o.bb.x.toFixed(0)} y${o.bb.y.toFixed(0)} w${o.bb.width.toFixed(0)} h${o.bb.height.toFixed(0)}`).join('\n')));
await b.close();
