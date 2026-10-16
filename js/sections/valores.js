/* =========================================================
   Valores — desplegables con animación de alto.
   Cada card es un <details>: sin JS funciona igual, solo sin animación.
   Se pueden abrir varias a la vez.
   ========================================================= */
(function () {
  'use strict';

  var DURATION = 300;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  document.querySelectorAll('.valor__details').forEach(function (details) {
    var trigger = details.querySelector('.valor__trigger');
    var body = details.querySelector('.valor__body');
    var running = null;

    trigger.addEventListener('click', function (e) {
      if (reduceMotion.matches || !body.animate) return; // comportamiento nativo
      e.preventDefault();
      if (running) running.cancel();

      if (details.open) {
        running = body.animate(
          [{ height: body.offsetHeight + 'px', opacity: 1 }, { height: '0px', opacity: 0 }],
          { duration: DURATION, easing: 'ease' }
        );
        running.onfinish = function () { details.open = false; running = null; };
      } else {
        details.open = true;
        running = body.animate(
          [{ height: '0px', opacity: 0 }, { height: body.offsetHeight + 'px', opacity: 1 }],
          { duration: DURATION, easing: 'ease' }
        );
        running.onfinish = function () { running = null; };
      }
    });
  });
})();
