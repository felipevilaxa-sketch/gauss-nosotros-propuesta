/* =========================================================
   Equipo — botones de LinkedIn pendientes.
   Mientras no tengamos las URL de cada perfil, el botón se ve y es
   enfocable, pero el clic no navega (href="#" llevaría al inicio de la página).
   ========================================================= */
(function () {
  'use strict';
  document.querySelectorAll('[data-linkedin-pendiente]').forEach(function (a) {
    a.addEventListener('click', function (e) { e.preventDefault(); });
  });
})();
