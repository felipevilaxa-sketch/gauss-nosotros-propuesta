# Gauss Control · Nosotros — réplica estática

Réplica fiel de <https://gausscontrol.com/nosotros/> en HTML, CSS y JS puros (sin WordPress, Elementor ni build step), para iterar sección por sección.

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
    hero.css
    cultura-valores.css    Incluye .section-title / .section-lead compartidos
    equipo.css             Acordeón + tarjetas
    presencia-latam.css
    certificaciones.css
    footer.css
js/main.js                 Header ocultable, dropdowns, off-canvas, selector de idioma, acordeón
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
| `#hero` | Etiqueta "Nosotros", H1, botón Escríbenos, foto | `hero.css` |
| `#cultura-valores` | H2, párrafo y 4 valores con ícono | `cultura-valores.css` |
| `#equipo` | "Conoce nuestro equipo" + acordeón `#directorio` (5) y `#gerencia` (7) | `equipo.css` |
| `#presencia-latam` | H2, párrafo, 4 países y mapa | `presencia-latam.css` |
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
