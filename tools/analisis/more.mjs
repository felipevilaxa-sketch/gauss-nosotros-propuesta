import { chromium } from 'playwright';
const b = await chromium.launch();
const dump = (root) => { const out=[]; const r=document.querySelector(root); if(!r) return 'none';
  r.querySelectorAll('h1,h2,h3,p,a,span,img,svg,.elementor-icon,li,.elementor-divider-separator,.e-con,select').forEach(e=>{const s=getComputedStyle(e);const q=e.getBoundingClientRect(); if(!q.width) return;
  const t=(e.children.length===0?(e.innerText||''):'').trim().slice(0,28);
  const cls=(e.className.baseVal??e.className).toString().split(' ').filter(c=>c&&!c.startsWith('elementor-element-')).slice(0,2).join('.');
  out.push([e.tagName.toLowerCase(),cls,JSON.stringify(t),[q.x,q.y+scrollY,q.width,q.height].map(Math.round).join(','),s.fontSize,s.fontWeight,'lh'+s.lineHeight,s.color,s.backgroundColor==='rgba(0, 0, 0, 0)'?'':'bg'+s.backgroundColor,s.padding==='0px'?'':'p'+s.padding,s.borderTopWidth!=='0px'?'bt'+s.borderTop:'',s.borderBottomWidth!=='0px'?'bb'+s.borderBottom:'',s.borderLeftWidth!=='0px'?'bl'+s.borderLeft:'',s.borderRadius==='0px'?'':'r'+s.borderRadius,s.textDecorationLine==='none'?'':'td',s.gap==='normal'?'':'gap'+s.gap].filter(Boolean).join(' '))});return out.join('\n');};
let p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
for (const id of ['56745b8','17b7ae8','57ca63d','d1d3ad3','fe1d8fa']) { console.log('#####', id); console.log(await p.evaluate(dump, `[data-id="${id}"]`)); }
await p.close();
p = await b.newPage({ viewport: { width: 390, height: 844 } });
await p.goto('https://gausscontrol.com/nosotros/', { waitUntil: 'networkidle' });
await p.click('[data-id="ffdd7bd"] .elementor-icon'); await p.waitForTimeout(1000);
console.log('##### offcanvas'); console.log(await p.evaluate(dump, '.e-off-canvas__content'));
console.log('##### header390'); console.log(await p.evaluate(dump, '[data-id="fe1d8fa"]'));
await b.close();
