/* =========================================================
   Subnav sticky — sección activa, scroll con offset y estado "pegado".
   No modifica el header: observa su clase .is-hidden y la refleja en <html>.
   ========================================================= */
(function () {
  'use strict';

  var subnav = document.querySelector('[data-subnav]');
  if (!subnav) return;

  var root = document.documentElement;
  var header = document.querySelector('[data-header]');
  var scroller = subnav.querySelector('.subnav__inner');
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  // Sólo enlaces cuyo destino existe en la página
  var links = Array.prototype.slice.call(subnav.querySelectorAll('a[href^="#"]')).filter(function (a) {
    return document.getElementById(a.hash.slice(1));
  });

  /* ---------- Reflejar header oculto (para mover la barra a top: 0) ---------- */
  function syncHeader() {
    root.classList.toggle('is-header-hidden', !!header && header.classList.contains('is-hidden'));
  }
  if (header && 'MutationObserver' in window) {
    new MutationObserver(syncHeader).observe(header, { attributes: true, attributeFilter: ['class'] });
    syncHeader();
  }

  function cssPx(name) {
    return parseFloat(getComputedStyle(root).getPropertyValue(name)) || 0;
  }

  /* ---------- Sombra cuando la barra está pegada ---------- */
  var sentinel = document.createElement('div');
  sentinel.setAttribute('aria-hidden', 'true');
  sentinel.style.cssText = 'height:1px;margin-bottom:-1px;';
  subnav.parentNode.insertBefore(sentinel, subnav);
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(function (entries) {
      subnav.classList.toggle('is-stuck', !entries[0].isIntersecting);
    }, { rootMargin: '-' + (cssPx('--header-height') + 1) + 'px 0px 0px 0px' }).observe(sentinel);
  }

  /* ---------- Marcar sección activa ---------- */
  function setActive(link) {
    links.forEach(function (a) {
      var on = a === link;
      a.classList.toggle('is-active', on);
      if (on) a.setAttribute('aria-current', 'true'); else a.removeAttribute('aria-current');
    });
    // En mobile, mantener visible el enlace activo dentro de la barra
    if (link && scroller.scrollWidth > scroller.clientWidth) {
      var left = link.offsetLeft - (scroller.clientWidth - link.offsetWidth) / 2;
      scroller.scrollTo({ left: left, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
    }
  }

  // Línea de lectura de 1px justo bajo header + subnav: como las secciones son
  // contiguas, a lo más una la cruza → esa es la activa.
  var io = null;
  function observeSections() {
    if (!('IntersectionObserver' in window)) return;
    if (io) io.disconnect();
    var lineTop = cssPx('--header-height') + cssPx('--subnav-height') + cssPx('--space-32');
    var visible = new Map();
    io = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible.set(e.target.id, e.isIntersecting); });
      var current = null;
      links.some(function (a) {
        if (visible.get(a.hash.slice(1))) { current = a; return true; }
        return false;
      });
      setActive(current);
    }, {
      rootMargin: '-' + lineTop + 'px 0px -' + Math.max(0, window.innerHeight - lineTop - 1) + 'px 0px'
    });
    links.forEach(function (a) { io.observe(document.getElementById(a.hash.slice(1))); });
  }
  observeSections();
  var resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(observeSections, 150);
  });

  /* ---------- Scroll suave con offset ---------- */
  links.forEach(function (a) {
    a.addEventListener('click', function (e) {
      var target = document.getElementById(a.hash.slice(1));
      if (!target) return;
      e.preventDefault();
      var targetY = target.getBoundingClientRect().top + window.pageYOffset;
      var goingDown = targetY > window.pageYOffset;
      // Al bajar, el header se oculta: sólo hay que dejar espacio para la subnav
      var offset = cssPx('--subnav-height') + cssPx('--space-16') + (goingDown && window.innerWidth >= 576 ? 0 : cssPx('--header-height'));
      window.scrollTo({ top: targetY - offset, behavior: reduceMotion.matches ? 'auto' : 'smooth' });
      // Accesibilidad: mover el foco al destino sin volver a desplazar
      if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
      target.focus({ preventScroll: true });
      if (history.replaceState) history.replaceState(null, '', a.hash);
      setActive(a);
    });
  });
})();
