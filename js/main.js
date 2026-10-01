/* =========================================================
   Gauss Control · Nosotros — interacciones
   - Header: se oculta al bajar y reaparece al subir (<576px siempre visible)
   - Dropdowns del menú (Soluciones / idioma)
   - Menú off-canvas mobile
   - Selector de idioma visual del off-canvas
   - Acordeón del equipo (un panel abierto a la vez)
   ========================================================= */
(function () {
  'use strict';

  /* ---------- Header: ocultar / mostrar al hacer scroll ---------- */
  var header = document.querySelector('[data-header]');
  if (header) {
    var SCROLL_THRESHOLD = 20;
    var prevScroll = window.pageYOffset;

    window.addEventListener('scroll', function () {
      var current = window.pageYOffset;
      if (window.innerWidth < 576 || current <= 0) {
        header.classList.remove('is-hidden');
        prevScroll = current;
        return;
      }
      if (Math.abs(current - prevScroll) < SCROLL_THRESHOLD) return;
      header.classList.toggle('is-hidden', current > prevScroll);
      if (current > prevScroll) closeAllDropdowns();
      prevScroll = current;
    }, { passive: true });

    // Si el foco entra al header (teclado), lo mostramos
    header.addEventListener('focusin', function () { header.classList.remove('is-hidden'); });
  }

  /* ---------- Dropdowns del menú principal ---------- */
  var dropdowns = Array.prototype.slice.call(document.querySelectorAll('[data-dropdown]'));

  function setDropdown(item, open) {
    item.classList.toggle('is-open', open);
    var btn = item.querySelector('.main-nav__toggle');
    if (btn) btn.setAttribute('aria-expanded', String(open));
  }
  function closeAllDropdowns(except) {
    dropdowns.forEach(function (d) { if (d !== except) setDropdown(d, false); });
  }

  dropdowns.forEach(function (item) {
    var btn = item.querySelector('.main-nav__toggle');
    btn.addEventListener('click', function (e) {
      e.stopPropagation();
      var open = !item.classList.contains('is-open');
      closeAllDropdowns(item);
      setDropdown(item, open);
      if (open) {
        var first = item.querySelector('.main-nav__sub a');
        // Activado por teclado: llevar el foco al primer ítem cuando el submenú ya es visible
        if (first && e.detail === 0) requestAnimationFrame(function () { first.focus(); });
      }
    });
    // Mantener aria-expanded coherente con el hover en desktop
    item.addEventListener('mouseenter', function () { btn.setAttribute('aria-expanded', 'true'); });
    item.addEventListener('mouseleave', function () {
      if (!item.classList.contains('is-open')) btn.setAttribute('aria-expanded', 'false');
    });
    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget)) setDropdown(item, false);
    });
  });

  document.addEventListener('click', function () { closeAllDropdowns(); });
  document.addEventListener('keydown', function (e) {
    if (e.key !== 'Escape') return;
    var openItem = dropdowns.filter(function (d) { return d.classList.contains('is-open'); })[0];
    if (openItem) {
      setDropdown(openItem, false);
      openItem.querySelector('.main-nav__toggle').focus();
    }
  });

  /* ---------- Off-canvas ---------- */
  var offcanvas = document.querySelector('[data-offcanvas]');
  var openBtn = document.querySelector('[data-offcanvas-open]');
  var lastFocus = null;

  function focusables(root) {
    return Array.prototype.slice.call(root.querySelectorAll(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )).filter(function (el) { return el.offsetParent !== null; });
  }

  function openOffcanvas() {
    lastFocus = document.activeElement;
    offcanvas.hidden = false;
    offcanvas.classList.add('is-open');
    document.body.classList.add('has-offcanvas');
    openBtn.setAttribute('aria-expanded', 'true');
    var close = offcanvas.querySelector('[data-offcanvas-close]');
    if (close) close.focus();
  }
  function closeOffcanvas() {
    offcanvas.classList.remove('is-open');
    offcanvas.hidden = true;
    document.body.classList.remove('has-offcanvas');
    openBtn.setAttribute('aria-expanded', 'false');
    if (lastFocus) lastFocus.focus();
  }

  if (offcanvas && openBtn) {
    openBtn.addEventListener('click', openOffcanvas);
    offcanvas.querySelectorAll('[data-offcanvas-close]').forEach(function (b) {
      b.addEventListener('click', closeOffcanvas);
    });
    offcanvas.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') { closeOffcanvas(); return; }
      if (e.key !== 'Tab') return;
      var f = focusables(offcanvas);
      if (!f.length) return;
      var first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    // Si se agranda la ventana a desktop, se cierra
    window.addEventListener('resize', function () {
      if (window.innerWidth > 1024 && !offcanvas.hidden) closeOffcanvas();
    });
  }

  /* Submenú "Soluciones" dentro del off-canvas */
  document.querySelectorAll('.offcanvas__toggle').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var sub = document.getElementById(btn.getAttribute('aria-controls'));
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      sub.hidden = !open;
    });
  });

  /* ---------- Selector de idioma (off-canvas) ---------- */
  document.querySelectorAll('[data-lang-select]').forEach(function (sel) {
    var btn = sel.querySelector('.lang-select__toggle');
    var list = sel.querySelector('.lang-select__list');
    btn.addEventListener('click', function () {
      var open = btn.getAttribute('aria-expanded') !== 'true';
      btn.setAttribute('aria-expanded', String(open));
      list.hidden = !open;
    });
    sel.addEventListener('focusout', function (e) {
      if (!sel.contains(e.relatedTarget)) {
        btn.setAttribute('aria-expanded', 'false');
        list.hidden = true;
      }
    });
  });

  /* ---------- Acordeón del equipo ---------- */
  var DURATION = 400;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function animateOpen(details) {
    var content = details.querySelector('.accordion__content');
    details.open = true;
    if (reduceMotion || !content.animate) return;
    var h = content.scrollHeight;
    content.animate([{ height: '0px' }, { height: h + 'px' }], { duration: DURATION, easing: 'ease' });
  }
  function animateClose(details) {
    var content = details.querySelector('.accordion__content');
    if (reduceMotion || !content.animate) { details.open = false; return; }
    var anim = content.animate([{ height: content.offsetHeight + 'px' }, { height: '0px' }], { duration: DURATION, easing: 'ease' });
    anim.onfinish = function () { details.open = false; };
  }

  document.querySelectorAll('[data-accordion]').forEach(function (acc) {
    var items = Array.prototype.slice.call(acc.querySelectorAll('.accordion__item'));
    items.forEach(function (details) {
      details.querySelector('summary').addEventListener('click', function (e) {
        e.preventDefault();
        if (details.open) {
          animateClose(details);
        } else {
          items.forEach(function (other) { if (other !== details && other.open) animateClose(other); });
          animateOpen(details);
        }
      });
    });
  });
})();
