# Gauss Control · Nosotros — propuesta de mejora

Prototipo estático (HTML, CSS y JS puros, sin build step) de la página <https://gausscontrol.com/nosotros/>. Parte de una réplica fiel del sitio (commit "réplica fiel v1") y suma la propuesta de mejora para presentar al cliente.

> Contenido de ejemplo: todo lo marcado como `PLACEHOLDER` en los comentarios de `index.html` está listado en [CONTENIDO-PENDIENTE.md](CONTENIDO-PENDIENTE.md). El formulario de postulación **no envía datos**: solo simula el envío.

## Cómo levantarlo en local

No requiere instalar nada para verlo:

```bash
node tools/serve.mjs
```

Abre <http://localhost:5173>. También funciona abriendo `index.html` directo en el navegador, o con cualquier servidor estático (`npx serve .`, Live Server de VS Code, etc.).

Todas las rutas son relativas, así que la carpeta se puede publicar tal cual en GitHub Pages.

## Estructura

```
index.html                 Página completa, una <section> por bloque
css/
  tokens.css               Variables: color, tipografía, espaciado, radios, breakpoints + @font-face
  base.css                 Reset, tipografía base, foco visible, botones genéricos
  sections/
    header.css             Header fijo, menú, dropdowns, acciones
    offcanvas.css          Menú lateral mobile/tablet (parte del header)
    hero.css               Hero con dos CTA
    cifras.css             Franja de cifras
    subnav.css             Sub-navegación sticky
    mensaje-ceo.css
    cultura-valores.css    Incluye .section-title / .section-lead compartidos
    historia.css           Línea de tiempo
    equipo.css             Acordeón + tarjetas
    vida-en-gauss.css      Filtros + actividades
    presencia-latam.css    Lista de países + mapa interactivo
    trabaja.css            Intro + formulario de postulación
    certificaciones.css
    footer.css
js/
  main.js                  Header ocultable, dropdowns, off-canvas, selector de idioma, acordeón
  sections/
    subnav.js              Sección activa (IntersectionObserver), scroll con offset
    cifras.js              Conteo al entrar en viewport
    historia.js            Botones de la línea de tiempo
    vida-en-gauss.js       Filtros por categoría
    presencia-latam.js     Mapa interactivo y popup de oficinas
    trabaja.js             Validación del formulario
assets/placeholders/       Fotos pendientes (actividades y oficinas), SVG 4:3
assets/
  fonts/                   WorkSans 400 / 500 / 600 (subset original, woff2 + woff)
  img/                     Logo, hero, mapa, favicon, banderas de idioma
  img/equipo/              directorio-*.png · gerencia-*.jpg|png
  img/certificaciones/     iso-27001.png · sicep.png
  icons/                   Íconos de valores, banderas de países, +/−, flecha, LinkedIn, menú
reference/                 Solo consulta: HTML y CSS originales, tokens.md, capturas
tools/                     Scripts Playwright de captura y comparación (no se publican)
```

## Secciones

Cada sección está delimitada en `index.html` con comentarios `INICIO SECCIÓN` / `FIN SECCIÓN` y tiene su propio CSS.

| id | Contenido | CSS |
|---|---|---|
| `#header` | Logo, menú (Inicio · Soluciones ▾ · Casos · Nosotros · Español ▾), LinkedIn, Contacto, Inicia Sesión, hamburguesa + off-canvas `#offcanvas` | `header.css`, `offcanvas.css` |
| `#hero` | Etiqueta "Nosotros", H1, botones "Conoce al equipo" y "Trabaja con nosotros", foto (en mobile, sobre el texto) | `hero.css` |
| `#cifras` | **Nueva.** 4 cifras de respaldo con conteo animado | `cifras.css` |
| `#subnav` | **Nueva.** Anclas sticky: Cultura · Equipo · Vida en Gauss · Oficinas · Trabaja con nosotros | `subnav.css` |
| `#mensaje-ceo` | **Nueva.** Foto, cita, nombre y cargo del CEO | `mensaje-ceo.css` |
| `#cultura-valores` | H2, párrafo y 4 cards de valores con "Cómo se vive en Gauss" (slider en mobile) | `cultura-valores.css` |
| `#historia` | **Nueva.** Línea de tiempo 2013 → hoy (vertical en mobile, horizontal con botones desde tablet) | `historia.css` |
| `#equipo` | "Conoce nuestro equipo" + acordeón `#directorio` (5) y `#gerencia` (7) (slider en mobile) | `equipo.css` |
| `#vida-en-gauss` | **Nueva.** Filtros por categoría, 8 actividades (carrusel en mobile) y CTA a LinkedIn | `vida-en-gauss.css` |
| `#presencia-latam` | H2, párrafo, 4 países y mapa interactivo: hover en país o caja → país oscurecido + popup con foto de la oficina | `presencia-latam.css` |
| `#trabaja` | **Nueva.** Intro y formulario de postulación con validación (envío simulado) | `trabaja.css` |
| `#certificaciones` | ISO 27001 y SICEP (dentro de la 1.ª columna del footer, como en el original) | `certificaciones.css` |
| `#footer` | Marca, LinkedIn, copyright, oficinas, Ventas, Soporte, Compliance y Políticas | `footer.css` |

## Tokens principales

Definidos en `css/tokens.css`. Detalle y origen de cada valor en `reference/tokens.md`.

| Token | Valor | Uso |
|---|---|---|
| `--color-orange` | `#FF8300` | Header, hero, dropdown, Inicia Sesión |
| `--color-primary` | `#F78200` | Off-canvas, texto hover de botones footer |
| `--color-navy` | `#003666` | Títulos, acentos |
| `--color-slate` | `#677C8E` | Texto, fondo footer |
| `--color-ice` | `#EAF3FB` | Íconos de valores, tarjetas |
| `--color-border` | `#D0DBE5` | Divisores |
| `--font-family` | WorkSans | Única familia |
| `--ls-tight` | `-0.055em` | Letter-spacing general |
| `--fs-h1` / `--fs-h2` | 60 → 48 → 32 px | Títulos principales |
| `--fs-h3` | 30 → 24 → 24 px | Títulos de bloque |
| `--container-max` | 1280px | Ancho de contenido |
| `--gutter` | 40 → 24 → 16 px | Margen lateral |
| `--section-pad-y` | 100 → 64 → 48 px | Padding vertical de sección |
| `--radius-pill` | 50px | Botones |
| `--radius-card` | 20px | Tarjetas del equipo |

Breakpoints: **tablet ≤ 1024px**, **mobile ≤ 767px** (los mismos de Elementor). Las variables cambian dentro de esas media queries en `tokens.css`.

## Comportamiento replicado

- **Header:** se oculta al bajar y reaparece al subir (transición `top .6s`). Bajo 576 px queda siempre visible.
- **Dropdowns:** abren con hover en desktop y con clic o teclado. Se cierran con Esc o con un clic fuera.
- **Off-canvas (≤ 1024px):** entra con `fadeInRight`, bloquea el scroll, mantiene el foco dentro y se cierra con Esc.
- **Acordeón:** un solo panel abierto a la vez, animación de 400 ms. Directorio abierto por defecto.

## Verificar contra el original

Con el servidor corriendo (`node tools/serve.mjs`):

```bash
cd tools && npm install && npx playwright install chromium
node screens.mjs http://localhost:5173/ ../reference/screens/replica replica
node compare.mjs        # original | réplica lado a lado → reference/screens/compare/
node diffpos.mjs 1440   # desfase de cada texto en px
node heights.mjs        # alto de cada sección
node interact.mjs       # prueba dropdowns, off-canvas, acordeón, header
```

## Diferencias conocidas con el original

- **Banner de cookies (CookieYes):** no se replica.
- **Widget "Cognus" oculto en Cultura:** no se replica (en el original tiene `display: none`).
- **Header en mobile (< 576px):** en el original, al primer scroll pasa a `position: fixed` sin dejar un espacio reservado. El contenido salta 110 px y el header tapa la etiqueta "Nosotros". La réplica reserva ese espacio, así que no hay salto.
- **Datos que no coinciden en el original:** se mantienen tal cual y van marcados con un comentario en el HTML.
  - La dirección de Perú del menú mobile es distinta a la del resto de la página.
  - El enlace de soporte del menú mobile está escrito `tel:++56…`.
