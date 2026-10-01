/* =========================================================
   Presencia en Latinoamérica — mapa interactivo.
   - Carga el SVG del mapa en línea para poder interactuar con cada país
     (si falla, p. ej. abriendo el archivo con file://, queda la imagen estática).
   - Al pasar el mouse, enfocar con teclado o tocar un país, este se oscurece
     y se abre un popup sobre el mapa con la foto de la oficina.
   - Los datos (nombre, dirección, foto) se leen de la lista de países.
   ========================================================= */
(function () {
  'use strict';

  var wrap = document.querySelector('[data-latam-map]');
  if (!wrap || !window.fetch) return;

  var img = wrap.querySelector('img');
  var popup = wrap.querySelector('[data-map-popup]');
  var GAP = 12;
  var active = null;
  var touchOpened = false;

  // Datos por país desde la lista
  var data = {};
  document.querySelectorAll('.country[data-country]').forEach(function (li) {
    var desc = li.querySelector('.country__desc').innerHTML.split(/<br\s*\/?>/i);
    var address = (desc[1] || '').replace(/<[^>]+>/g, '').replace(/^\s*Dirección:\s*/, '').trim();
    data[li.dataset.country] = {
      name: li.querySelector('.country__name').textContent.trim(),
      flag: li.querySelector('.country__flag').getAttribute('src'),
      photo: li.dataset.photo,
      address: address,
      item: li
    };
  });

  fetch(img.getAttribute('src'))
    .then(function (r) { if (!r.ok) throw new Error(r.status); return r.text(); })
    .then(function (text) {
      var doc = new DOMParser().parseFromString(text, 'image/svg+xml');
      var svg = doc.documentElement;
      if (!svg || svg.nodeName.toLowerCase() !== 'svg') return;
      svg = document.importNode(svg, true);
      svg.classList.add('latam__svg');
      svg.setAttribute('role', 'group');
      svg.setAttribute('aria-label', img.getAttribute('alt'));
      svg.removeAttribute('width');
      svg.removeAttribute('height');
      img.replaceWith(svg);
      setup(svg);
      fitMap(svg);
    })
    .catch(function () { /* se mantiene la imagen estática */ });

  var paths = {};

  /* ---------- Tamaño: el mapa iguala el alto de la lista de países ---------- */
  function fitMap(svg) {
    var list = document.querySelector('.latam__list');
    var body = wrap.parentElement;
    var vb = svg.viewBox && svg.viewBox.baseVal;
    var ratio = vb && vb.height ? vb.width / vb.height : 390 / 454;
    wrap.classList.add('is-fitted');

    function fit() {
      var stacked = getComputedStyle(body).flexDirection === 'column';
      var w, h;
      if (stacked) {
        // Mobile: el mapa va bajo la lista y usa el ancho de la columna
        w = body.clientWidth;
        h = w / ratio;
      } else {
        var gap = parseFloat(getComputedStyle(body).columnGap) || 0;
        var available = body.clientWidth - list.offsetWidth - gap;
        h = list.offsetHeight;
        w = Math.min(h * ratio, available);
        h = w / ratio;
      }
      wrap.style.width = Math.round(w) + 'px';
      wrap.style.height = Math.round(h) + 'px';
      if (active) position(active);
    }
    fit();
    if ('ResizeObserver' in window) {
      var ro = new ResizeObserver(fit);
      ro.observe(list);
      ro.observe(body);
    } else {
      window.addEventListener('resize', fit);
    }
  }

  function setup(svg) {
    svg.querySelectorAll('[data-country]').forEach(function (path) {
      var d = data[path.dataset.country];
      if (!d) return;
      path.setAttribute('tabindex', '0');
      path.setAttribute('role', 'button');
      path.setAttribute('aria-label', d.name + ': ver oficina');
      path.setAttribute('aria-describedby', popup.id);
      paths[path.dataset.country] = path;

      path.addEventListener('mouseenter', function () { open(path); });
      path.addEventListener('mouseleave', function () { if (!touchOpened) close(); });
      path.addEventListener('focus', function () { open(path); });
      path.addEventListener('blur', function () { close(); });
      // Pantallas táctiles: un toque abre, otro toque (o tocar fuera) cierra
      path.addEventListener('pointerup', function (e) {
        if (e.pointerType === 'mouse') return;
        if (active === path) { close(); return; }
        touchOpened = true;
        open(path);
      });
      path.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          if (active === path) close(); else open(path);
        }
      });
    });

    /* ---------- Las cajas de la lista activan la misma interacción ---------- */
    wrap.closest('.latam').classList.add('is-interactive');
    Object.keys(data).forEach(function (key) {
      var li = data[key].item;
      var path = paths[key];
      if (!li || !path) return;
      li.addEventListener('mouseenter', function () { open(path); });
      li.addEventListener('mouseleave', function () { if (!touchOpened) close(); });
      // Teclado: al enfocar el teléfono de la caja también se muestra la oficina
      li.addEventListener('focusin', function () { open(path); });
      li.addEventListener('focusout', function (e) { if (!li.contains(e.relatedTarget)) close(); });
      li.addEventListener('pointerup', function (e) {
        if (e.pointerType === 'mouse' || e.target.closest('a')) return;
        if (active === path) { close(); return; }
        touchOpened = true;
        open(path);
        // Mobile: el mapa está bajo la lista; si el país o su popup no se ven, se lleva a la vista
        // Se revisa el país y su popup (no solo el borde del mapa): Chile queda al fondo
        var pr = path.getBoundingClientRect();
        var pop = popup.getBoundingClientRect();
        var subnav = document.querySelector('[data-subnav]');
        var topLimit = subnav ? subnav.getBoundingClientRect().bottom : 0;
        if (Math.max(pr.bottom, pop.bottom) > window.innerHeight || Math.min(pr.top, pop.top) < topLimit) {
          var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          wrap.scrollIntoView({ block: 'center', behavior: reduce ? 'auto' : 'smooth' });
          setTimeout(function () { if (active === path) position(path); }, reduce ? 0 : 600);
        }
      });
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && active) close();
    });
    document.addEventListener('pointerdown', function (e) {
      if (touchOpened && active && !wrap.contains(e.target) && !e.target.closest('.country')) close();
    });
    window.addEventListener('resize', function () { if (active) position(active); });
  }

  function open(path) {
    var d = data[path.dataset.country];
    if (active && active !== path) active.classList.remove('is-active');
    active = path;
    path.classList.add('is-active');
    if (d.item) d.item.classList.add('is-highlighted');
    Object.keys(data).forEach(function (k) { if (data[k] !== d) data[k].item.classList.remove('is-highlighted'); });

    var photo = popup.querySelector('.map-popup__photo');
    photo.src = d.photo;
    photo.alt = 'Oficina de Gauss Control en ' + d.name;
    popup.querySelector('.map-popup__flag').src = d.flag;
    popup.querySelector('.map-popup__name').textContent = 'Oficina ' + d.name;
    popup.querySelector('.map-popup__address').textContent = d.address;
    popup.hidden = false;
    position(path);
    // Fuerza el reflow para que la transición de entrada se ejecute
    void popup.offsetWidth;
    popup.classList.add('is-visible');
  }

  function close() {
    if (!active) return;
    active.classList.remove('is-active');
    var d = data[active.dataset.country];
    if (d && d.item) d.item.classList.remove('is-highlighted');
    active = null;
    touchOpened = false;
    popup.classList.remove('is-visible', 'is-below');
    popup.hidden = true;
  }

  // Ubica el popup sobre el país (o debajo si no cabe), sin salirse de la sección
  function position(path) {
    var box = wrap.getBoundingClientRect();
    var p = path.getBoundingClientRect();
    var bounds = (wrap.closest('.latam__body') || wrap).getBoundingClientRect();
    var w = popup.offsetWidth;
    var h = popup.offsetHeight;

    var left = p.left + p.width / 2 - w / 2;
    left = Math.max(bounds.left, Math.min(left, bounds.right - w));

    // No debe quedar bajo el header/subnav fijos ni muy por encima del mapa
    var subnav = document.querySelector('[data-subnav]');
    var minTop = Math.max(subnav ? subnav.getBoundingClientRect().bottom : 0, box.top - h / 2);
    var below = p.top - h - GAP < minTop;
    var top = below ? p.bottom + GAP : p.top - h - GAP;
    popup.classList.toggle('is-below', below);

    popup.style.left = (left - box.left) + 'px';
    popup.style.top = (top - box.top) + 'px';
    // Punta del popup apuntando al centro del país
    var arrow = p.left + p.width / 2 - left;
    popup.style.setProperty('--arrow-x', Math.max(20, Math.min(arrow, w - 20)) + 'px');
  }
})();
