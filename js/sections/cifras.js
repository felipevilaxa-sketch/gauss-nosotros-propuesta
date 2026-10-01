/* =========================================================
   Cifras — animación de conteo al entrar en el viewport.
   Sin JS o con prefers-reduced-motion se muestra el valor final
   (que ya viene escrito en el HTML).
   ========================================================= */
(function () {
  'use strict';

  var section = document.querySelector('[data-cifras]');
  if (!section || !('IntersectionObserver' in window)) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  var DURATION = 1400;
  var numbers = Array.prototype.slice.call(section.querySelectorAll('[data-count]'));
  var fmt = new Intl.NumberFormat('es-CL');

  function render(el, value) {
    el.textContent = (el.dataset.prefix || '') + fmt.format(value) + (el.dataset.suffix || '');
  }
  function easeOutCubic(t) { return 1 - Math.pow(1 - t, 3); }

  function animate(el) {
    var target = Number(el.dataset.count);
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var t = Math.min(1, (ts - start) / DURATION);
      render(el, Math.round(target * easeOutCubic(t)));
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // Reserva el ancho final para que el texto no "salte" mientras cuenta
  numbers.forEach(function (el) {
    el.style.display = 'inline-block';
    el.style.minWidth = el.offsetWidth + 'px';
    render(el, 0);
  });

  var io = new IntersectionObserver(function (entries) {
    if (!entries[0].isIntersecting) return;
    numbers.forEach(animate);
    io.disconnect();
  }, { threshold: 0.4 });
  io.observe(section);
})();
