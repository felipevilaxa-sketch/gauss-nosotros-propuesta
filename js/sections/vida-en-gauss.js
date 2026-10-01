/* =========================================================
   Vida en Gauss — filtros por categoría.
   Botones con aria-pressed; las cards que salen se desvanecen y las que
   entran aparecen con un leve desplazamiento. Sin animación si el
   usuario pidió movimiento reducido.
   ========================================================= */
(function () {
  'use strict';

  var root = document.querySelector('[data-vida]');
  if (!root) return;

  var buttons = Array.prototype.slice.call(root.querySelectorAll('[data-filter]'));
  var cards = Array.prototype.slice.call(root.querySelectorAll('[data-category]'));
  var status = root.querySelector('[data-vida-status]');
  var grid = root.querySelector('[data-vida-grid]');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  var OUT = 160;
  var IN = 280;
  var pending = null;

  function matches(card, filter) {
    return filter === 'todas' || card.dataset.category === filter;
  }

  function announce(filter, count) {
    var btn = buttons.filter(function (b) { return b.dataset.filter === filter; })[0];
    var name = filter === 'todas' ? 'todas las categorías' : btn.textContent.trim();
    status.textContent = 'Mostrando ' + count + (count === 1 ? ' actividad' : ' actividades') + ' de ' + name + '.';
  }

  function apply(filter) {
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', String(b.dataset.filter === filter)); });
    var show = cards.filter(function (c) { return matches(c, filter); });
    var hide = cards.filter(function (c) { return !matches(c, filter) && !c.hidden; });
    announce(filter, show.length);
    // En mobile (carrusel) se vuelve al inicio para mostrar el primer resultado
    if (grid.scrollLeft) grid.scrollTo({ left: 0, behavior: reduceMotion.matches ? 'auto' : 'smooth' });

    var animate = !reduceMotion.matches && typeof Element.prototype.animate === 'function';
    if (pending) clearTimeout(pending);

    if (!animate) {
      cards.forEach(function (c) { c.hidden = !matches(c, filter); });
      return;
    }

    hide.forEach(function (c) {
      c.animate([{ opacity: 1, transform: 'none' }, { opacity: 0, transform: 'scale(0.97)' }], { duration: OUT, easing: 'ease-in', fill: 'forwards' });
    });
    pending = setTimeout(function () {
      cards.forEach(function (c) {
        c.getAnimations().forEach(function (a) { a.cancel(); });
        c.hidden = !matches(c, filter);
      });
      show.forEach(function (c, i) {
        c.animate([{ opacity: 0, transform: 'translateY(12px)' }, { opacity: 1, transform: 'none' }], { duration: IN, delay: i * 40, easing: 'ease-out', fill: 'backwards' });
      });
    }, hide.length ? OUT : 0);
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      if (b.getAttribute('aria-pressed') === 'true') return;
      apply(b.dataset.filter);
    });
  });
})();
