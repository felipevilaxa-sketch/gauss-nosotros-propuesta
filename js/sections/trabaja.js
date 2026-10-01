/* =========================================================
   Trabaja con nosotros — validación del formulario de postulación.
   Sin backend: el envío solo simula éxito.
   - Valida al salir de cada campo (después de tocarlo) y al enviar.
   - Errores junto al campo, enlazados con aria-describedby + aria-invalid.
   - Al enviar con errores, el foco va al primer campo inválido.
   ========================================================= */
(function () {
  'use strict';

  var form = document.querySelector('[data-apply-form]');
  if (!form) return;

  var success = document.querySelector('[data-apply-success]');
  var again = document.querySelector('[data-apply-again]');
  var submit = form.querySelector('[type="submit"]');
  var MAX_MB = 5;
  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  var PHONE_RE = /^\+?[\d\s().-]{8,20}$/;

  var rules = {
    nombre: function (el) {
      var v = el.value.trim();
      if (!v) return 'Ingresa tu nombre completo.';
      if (v.length < 3) return 'El nombre debe tener al menos 3 caracteres.';
      return '';
    },
    email: function (el) {
      var v = el.value.trim();
      if (!v) return 'Ingresa tu email.';
      if (!EMAIL_RE.test(v)) return 'Revisa el formato del email. Ejemplo: nombre@empresa.com';
      return '';
    },
    telefono: function (el) {
      var v = el.value.trim();
      if (!v) return 'Ingresa un teléfono de contacto.';
      if (!PHONE_RE.test(v) || v.replace(/\D/g, '').length < 8) return 'Ingresa un teléfono válido, con código de país. Ejemplo: +56 9 1234 5678';
      return '';
    },
    pais: function (el) { return el.value ? '' : 'Selecciona tu país.'; },
    area: function (el) { return el.value ? '' : 'Selecciona un área de interés.'; },
    linkedin: function (el) {
      var v = el.value.trim();
      if (!v) return '';
      try {
        var u = new URL(v);
        if (!/^https?:$/.test(u.protocol) || !/(^|\.)linkedin\.com$/i.test(u.hostname)) throw new Error();
      } catch (e) {
        return 'Ingresa la URL completa de tu perfil. Ejemplo: https://www.linkedin.com/in/tu-perfil';
      }
      return '';
    },
    cv: function (el) {
      var file = el.files && el.files[0];
      if (!file) return 'Adjunta tu CV en formato PDF.';
      var isPdf = file.type === 'application/pdf' || /\.pdf$/i.test(file.name);
      if (!isPdf) return 'El archivo debe ser PDF. Seleccionaste "' + file.name + '".';
      if (file.size > MAX_MB * 1024 * 1024) {
        return 'El archivo pesa ' + (file.size / 1024 / 1024).toFixed(1).replace('.', ',') + ' MB. El máximo es ' + MAX_MB + ' MB.';
      }
      return '';
    },
    consentimiento: function (el) { return el.checked ? '' : 'Debes aceptar el tratamiento de datos para postular.'; }
  };

  function errorEl(field) { return document.getElementById(field.id + '-error'); }

  function show(field, message) {
    var err = errorEl(field);
    if (!err) return;
    if (message) {
      err.textContent = message;
      err.hidden = false;
      field.setAttribute('aria-invalid', 'true');
    } else {
      err.textContent = '';
      err.hidden = true;
      field.removeAttribute('aria-invalid');
    }
  }

  function validate(field) {
    var rule = rules[field.name];
    if (!rule) return true;
    var message = rule(field);
    show(field, message);
    return !message;
  }

  var fields = Array.prototype.slice.call(form.elements).filter(function (el) { return rules[el.name]; });

  fields.forEach(function (field) {
    // Valida al salir del campo, una vez que el usuario lo tocó
    field.addEventListener('blur', function () {
      if (field.type !== 'file' && field.type !== 'checkbox' && !field.value && !field.dataset.touched) return;
      field.dataset.touched = 'true';
      validate(field);
    });
    // Si ya mostraba error, se revalida mientras escribe para quitarlo apenas se corrija
    var live = field.type === 'file' || field.type === 'checkbox' || field.tagName === 'SELECT' ? 'change' : 'input';
    field.addEventListener(live, function () {
      if (field.getAttribute('aria-invalid') === 'true' || live === 'change') {
        field.dataset.touched = 'true';
        validate(field);
      }
    });
  });

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var firstInvalid = null;
    fields.forEach(function (field) {
      field.dataset.touched = 'true';
      if (!validate(field) && !firstInvalid) firstInvalid = field;
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // Envío simulado
    submit.setAttribute('aria-busy', 'true');
    submit.disabled = true;
    submit.textContent = 'Enviando…';
    setTimeout(function () {
      form.hidden = true;
      success.hidden = false;
      success.focus();
      submit.removeAttribute('aria-busy');
      submit.disabled = false;
      submit.textContent = 'Enviar postulación';
    }, 900);
  });

  if (again) {
    again.addEventListener('click', function () {
      form.reset();
      fields.forEach(function (f) { delete f.dataset.touched; show(f, ''); });
      success.hidden = true;
      form.hidden = false;
      form.querySelector('.field__control').focus();
    });
  }
})();
