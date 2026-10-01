import { chromium } from 'playwright';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, locale: 'es-CL' });
await p.goto('http://localhost:5173/', { waitUntil: 'networkidle' });
await p.evaluate(() => { const s = document.getElementById('vida-en-gauss'); scrollTo(0, s.getBoundingClientRect().top + scrollY - 166); });
await p.waitForTimeout(1200);
await p.screenshot({ path: '../reference/screens/mejoras/vida-trabaja/390-vida-viewport.png' });
// desliza el carrusel una card
await p.$eval('[data-vida-grid]', g => g.scrollBy({ left: 300 })); await p.waitForTimeout(800);
await p.screenshot({ path: '../reference/screens/mejoras/vida-trabaja/390-vida-carrusel-deslizado.png' });
await b.close();
