/* =========================================================
   Historia — botones anterior / siguiente de la línea de tiempo.
   Solo se muestran cuando la línea es horizontal y desborda (tablet y desktop).
   El scroll nativo, el arrastre y las flechas del teclado (con la línea
   enfocada) siguen funcionando igual.
   ========================================================= */
(function () {
  'use strict';

  var root = document.querySelector('[data-historia]');
  if (!root) return;

  var track = root.querySelector('[data-historia-track]');
  var controls = root.querySelector('[data-historia-controls]');
  var prev = root.querySelector('[data-historia-prev]');
  var next = root.querySelector('[data-historia-next]');

  function step() {
    var item = track.querySelector('.hito');
    // Avanza de a dos hitos, sin pasar del ancho visible
    return item ? Math.min(item.offsetWidth * 2, track.clientWidth - 40) : track.clientWidth * 0.8;
  }

  function update() {
    var overflow = track.scrollWidth > track.clientWidth + 1;
    controls.hidden = !overflow;
    if (!overflow) return;
    prev.disabled = track.scrollLeft <= 1;
    next.disabled = track.scrollLeft + track.clientWidth >= track.scrollWidth - 1;
  }

  prev.addEventListener('click', function () { track.scrollBy({ left: -step() }); });
  next.addEventListener('click', function () { track.scrollBy({ left: step() }); });
  track.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
})();
