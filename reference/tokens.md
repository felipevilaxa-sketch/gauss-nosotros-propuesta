# Tokens — gausscontrol.com/nosotros

Fuente: `css/uploads__elementor__css__post-7.css` (kit global), `post-1898` (header), `post-1562` (página), `post-1244` (footer) y estilos computados con Playwright (`computed.json`).
Cuando el kit y lo renderizado no coinciden, manda lo **renderizado**, y lo marco con ⚠.

---

## 1. Breakpoints (confirmados)

| Nombre  | Regla Elementor        | Uso en la réplica         |
|---------|------------------------|---------------------------|
| Desktop | > 1024px               | por defecto               |
| Tablet  | `max-width: 1024px`    | `@media (max-width:1024px)` |
| Mobile  | `max-width: 767px`     | `@media (max-width:767px)`  |
| Extra   | `< 576px` (JS header)  | En < 576px el header queda siempre fijo, sin ocultarse al hacer scroll |

---

## 2. Tipografía

**Familia única:** `WorkSans`, autoalojada en subset (woff2 + woff) → `assets/fonts/`.
Pesos: 400 Regular · 500 Medium · 600 SemiBold.
Roboto y Roboto Slab aparecen en el kit pero **no se usan** en la página.

Letter-spacing general: **-0.055em** (16px → -0.88px).

### Escala global del kit (desktop / ≤1024 / ≤767)

| Token kit | Rol | Desktop | Tablet | Mobile | LH | LS (d/t/m) |
|---|---|---|---|---|---|---|
| d8f0338 | Display | 80px (5rem) 400 | 60px | 40px | 1 / 1.2 / 1.2 | -0.055 / -0.03 / -0.02em |
| 64a0518 | H1/H2 grande | 60px (3.75rem) 400 | 48px | 32px | 1 | -0.055 / -0.035 / -0.02em |
| 33aed05 | H grande semibold | 60px 600 | 48px | 48px | 1 | -0.055em |
| d1b5649 | H mediano | 40px 400 | 24px | 20px | 1 | -0.055 / -0.03 / -0.02em |
| 294099f | H3 sección | 30px 400 | 24px | 18px | 1 | -0.055px ⚠ (px, no em) / -0.03 / -0.02em |
| 2523820 | H4 | 18px 400 | 18px | 16.8px | 1 | -0.055 / -0.03 / -0.02em |
| bdc5002 | Texto / botón | 16px 400 | 16px | 16px | 1 | -0.055em |
| ec3b2db | Menú | 16px 500 | — | — | 1 | -0.055em |

### Aplicado por nivel (valores renderizados)

| Elemento | Desktop | Tablet (768) | Mobile (390) | Peso | Color |
|---|---|---|---|---|---|
| **H1** hero | 60/60px, -3.3px | 48/48, -1.68px | 32/32, -0.64px | 500 | #FFFFFF |
| **H2** sección ("Nuestra cultura…", "Creciendo…") | 60/60, -3.3px | 48/48, -1.68px | 32/32, -0.64px | 400 | #003666 |
| **H2** "Conoce nuestro equipo" | 30/30, -0.055px | 24/24, -0.72px | 24/24, -0.48px | 400 | #677C8E |
| **H3** acordeón (Directorio / Gerencia) | 30/30 | 24/24 | 24/24 | 400 | #003666 |
| **H3** valores (icon-box) | 18/18, -0.99px | 16/16 | 16/16 | 500 | #003666 |
| **H3** país (México…) | 20px, lh 10px ⚠ | 24/24 | 18/18 | 500 | #003666 |
| **H3** nombre persona | 16px, lh 1–1.2 | 16 | 16 | 500 | #003666 |
| Cargo ("Director") | 16/16 | 16 | 16 | 500 | #677C8E |
| **Párrafo** | 16px / 19.2px (1.2), -0.88px | 16/16 | 16/19.2 | 400 | #677C8E |
| Etiqueta "Nosotros" (pill) | 16/16 | — | — | 500 | #FFFFFF |
| **Menú** principal | 16px / 20px, LS normal | — | (off-canvas) | 500 | #FFFFFF |
| **Botones** | 16/16, -0.88px | 16 | 16 | 500 (LinkedIn footer 400) | — |
| Footer "Certificaciones" | 14/14 | 16 | 16 | 400 | #FFFFFF |
| Footer títulos (Ventas / Soporte Técnico) | 16px, lh 12px | 16 | — | 600 | #FFFFFF |
| Footer links | 16/16 | 16 | 16 | 400 | #FFFFFF |
| Footer país (bloque oficinas) | más pequeño (~12px título / 10px texto, ver captura) | | | | #FFFFFF |
| Copyright | 12/12 | 14/14 | 12/12 | 400 | #FFFFFF |

---

## 3. Paleta

| Hex | Nombre propuesto | Dónde se usa |
|---|---|---|
| `#FF8300` | `--color-orange` ⚠ | Fondo header, fondo hero, fondo dropdown del menú, fondo botón "Inicia Sesión". **Es el naranja real renderizado** |
| `#F78200` | `--color-primary` (kit) | Color de texto en hover de botones del footer/off-canvas (fondo blanco + texto naranja). Fondo del header en estado `bg-orange` del JS |
| `#FFA745` | `--color-orange-light` | Hover "Inicia Sesión" (fondo + borde) |
| `#FAA84C` | `--color-orange-highlight` | Ítem resaltado del dropdown |
| `#FFE3C3` | `--color-orange-tint` | Hover botón "Contacto" |
| `#FFBC7D` | — | Transición de página Elementor (no aplica) |
| `#003666` | `--color-navy` (accent) | Títulos H2/H3, nombres, ícono acordeón abierto (círculo relleno), pill "Nosotros", íconos de valores |
| `#677C8E` | `--color-slate` (text) | Párrafos, cargos, H2 "Conoce nuestro equipo", **fondo del footer** |
| `#4A647B` | `--color-slate-dark` | Fondo botón "LinkedIn" del footer |
| `#9BB3C8` | `--color-slate-light` | Borde del ícono "+" del acordeón cerrado |
| `#D0DBE5` | `--color-border` | Líneas divisoras (acordeón, países) |
| `#EAF3FB` | `--color-ice` | Fondo de íconos de valores, fondo pie de tarjetas del equipo, mapa |
| `#313F4B` | `--color-ink` | Definido en kit (texto oscuro) |
| `#1C1C1C` | `--color-black-soft` | Texto botón "Escríbenos" |
| `#000000` | — | Texto botón "Contacto" |
| `#FFFFFF` | `--color-white` | Fondos de secciones, texto sobre naranja/footer |
| `#631502` | secondary (kit) | No se usa en esta página |
| `rgba(0,0,0,.26)` | `--header-scrolled-gray` | Estado `bg-gray` del header (JS) |
| `rgba(0,0,0,.3)` | sombra | Sombra del dropdown |

---

## 4. Espaciado y layout

### Contenedor
- Ancho máx. contenido: **1280px** (= 80vw a 1600px; en la práctica las secciones usan `max-width:1280px` inner).
- Kit: `--container-max-width: 80vw` (desktop) / 90vw (≤1024).
- Gutter lateral de sección: **40px** desktop · **24px** tablet · **16px** mobile.
- Separación entre widgets por defecto: **2em (32px)**.

### Secciones (padding vertical · gap interno)

| Sección | Desktop | Tablet | Mobile | Fondo |
|---|---|---|---|---|
| Header | alto 110px, pad 0 40px, gap 32px | pad 24px | pad 16px | #FF8300 |
| Hero | alto 500px, contenido 400px centrado (50px arriba/abajo), 2 columnas con gap 64px; columna texto gap 16px | igual, columnas 355/301 | apilado, pad 32px 16px, gap 16px | #FF8300 |
| Cultura y valores | pad 100px 40px, gap 58px; bloque título gap 28px | pad 64px 24px, gap 24px | pad 48px 16px, gap 32px/16px | #FFF |
| Equipo | pad 40px, gap 32px | pad 40px | pad 32px 24px, gap 16px | #FFF |
| Presencia LATAM | pad 100px 40px, gap 58px; columnas lista+mapa 768px de ancho, gap 32px | pad 64px 24px | pad 80px 16px | #FFF |
| Footer | pad 32px; 3 columnas (545 / 305 / 366); col. 3 con borde izquierdo 1px blanco y pad-left 48px, gap 56px | pad 32px, 2 columnas | pad 32px 20px, 1 columna, gap 80px | #677C8E |

### Grillas
- Valores: 4 columnas a 1440 (~282px c/u, gap ~50px); 4 columnas compactas en 768; 1 columna en lista (ícono a la izquierda) en mobile.
- Equipo: 5 tarjetas por fila en desktop (~230px, gap ~32px); 3 por fila a 768; 1 por fila en mobile.

---

## 5. Radios, sombras, bordes

| Elemento | Valor |
|---|---|
| Botones del header / footer (pill) | `border-radius: 50px` |
| Botón "Escríbenos" | `52px` |
| Botón global kit | `8px` (no se usa visiblemente) |
| Pill "Nosotros" (hero) | ~8px (ver captura), fondo #003666 |
| Imagen hero | 16–20px |
| Íconos de valores | `10px`, padding 16px (12px en mobile), 64×64 / 52×52 |
| Tarjeta equipo (foto) | radio superior ~20px; pie `0 0 20px 20px`, padding 16.4px 8px, fondo #EAF3FB |
| Dropdown menú | `0 0 10px 10px`, sombra `1px 10px 10px 0 rgba(0,0,0,.3)`, ítems padding .8em 1em |
| Inputs (kit) | 10px |

---

## 6. Estados hover / focus

| Elemento | Normal | Hover / focus |
|---|---|---|
| "Contacto" (header) | fondo #FFF, texto #000 | fondo **#FFE3C3**, texto #000 |
| "Inicia Sesión" (header) | fondo #FF8300, borde 1px #FFF, texto #FFF, ícono flecha ↗ | fondo y borde **#FFA745**, texto #FFF |
| "Escríbenos" (hero) | fondo #FFF, texto #1C1C1C | fondo #FFF, texto #1C1C1C (sin cambio visible) |
| Botones footer / off-canvas (Compliance, Políticas) | transparente, borde 1px #FFF, texto #FFF | fondo **#FFF**, texto **#F78200**, borde #FFF; flecha ↗ también naranja |
| Ítems de menú | #FFF | #FFF (sin cambio de color; sin subrayado) |
| Dropdown "Soluciones" | fondo #FF8300 | ítem resaltado #FAA84C |
| Ícono hamburguesa | blanco | #003666 |
| Íconos de listas (footer) | — | #FFF |

---

## 7. Comportamiento del header (JS original)

- En scroll **hacia abajo** (≥20px de movimiento) el header se oculta (`top: -alto`); al subir reaparece fijo. En `scrollY = 0` vuelve a `position: relative`.
- Transición `top .6s ease-in-out`.
- Clases `bg-orange` (#F78200) / `bg-gray` (rgba(0,0,0,.26)) según contexto; en esta página el header se ve naranja.
- En < 576px queda siempre fijo arriba.
- "Soluciones" abre su submenú al hacer clic (y hover en desktop).

## 8. Contenido no visible que se replica
- Dropdown Soluciones: Cognus | Evaluación · Gauss Risk | Análisis · Gauss Alert | Prevención · Gauss Fleet | Logística.
- Selector de idioma: Español (actual) · Inglés · Portugués (banderas WPML).
- Off-canvas mobile: Contacto, Inicia Sesión, menú, idiomas, LinkedIn, Compliance, Políticas, Ventas, Soporte técnico y Oficinas.
- Acordeón Gerencia (cerrado por defecto): 7 personas.
- Se descarta: widget "Cognus" oculto en cultura (`display:none`) y banner de cookies CookieYes.

---

## 9. Tokens nuevos (propuesta de mejora)

Agregados a `css/tokens.css` para las secciones nuevas. Todos derivan de valores ya presentes en el sitio.

| Token | Valor | Derivado de | Uso |
|---|---|---|---|
| `--subnav-height` | 56px | Escala de espaciado (`--space-56`) | Alto de la barra de anclas sticky (`#subnav`) |
| `--color-error` | `var(--color-maroon)` = #631502 | Color secondary del kit de Elementor (ya presente en la paleta) | Mensajes de error, asterisco de obligatorio y borde de campos inválidos en el formulario de `#trabaja`. Contraste ~13:1 sobre blanco |

Notas de uso:
- Las secciones nuevas se escriben **mobile first** con `@media (min-width: 768px)` (tablet) y `@media (min-width: 1025px)` (desktop), equivalentes a los breakpoints originales (≤767 / ≤1024).
- Las anclas usan `scroll-margin-top: header + subnav + 16px` como respaldo del offset calculado en JS.

### Componentes reutilizados en las secciones nuevas
- **Inputs del formulario:** replican el estilo de campos del kit original (borde 1px ,  10px, padding .75em 1.125em, texto ). Foco: borde y anillo navy. Error: .
- **Cards de actividad (Vida en Gauss):** misma construcción que la tarjeta del equipo (foto + pie , ).
- **Etiqueta de categoría:** misma pieza que el tag "Nosotros" del hero (navy, ).
- **Filtros:** píldoras  con borde ; activo en navy.
