# CLAUDE.md

Guía interna del proyecto **Hilarious Galaxy**: portafolio de servicios del área
de Business Intelligence (Astro + React 19 + Tailwind v4 + anime.js + Remotion).

## Comandos clave

```sh
npm install                    # Instala dependencias
npm run dev                    # Servidor de desarrollo en localhost:4321
npm run build                  # Build de producción a ./dist
npm run preview                # Sirve el build localmente

npm run remotion:studio        # Editor de Remotion
npm run remotion:render:hero   # Renderiza public/hero.mp4
npm run remotion:render:reporteria      # Renderiza public/servicio-reporteria.mp4
npm run remotion:render:automatizacion  # Renderiza public/servicio-automatizacion.mp4
npm run remotion:render:desarrollo      # Renderiza public/servicio-desarrollo.mp4
npm run remotion:render:basesdatos      # Renderiza public/servicio-basesdatos.mp4
```

## Arquitectura

Landing **de una sola página**: la navegación es siempre scroll a anclas
internas (`#servicios`, `#automatizacion`, `#reporteria`, `#desarrollo`,
`#estructuracion`, `#galeria-herramientas`, `#contacto`). No existen
páginas secundarias ni rutas adicionales.

```
src/
├── assets/                    # SVG / imágenes estáticas
├── components/
│   ├── shared/
│   │   ├── DeliverablesShowcase.astro # Vitrina genérica de entregables
│   │   └── VerticalTimeline.astro     # Línea de tiempo vertical animada
│   ├── ServiceSection.astro   # Plantilla por servicio (intro + dolor/solución + métricas + slot vitrina)
│   ├── SiteHeader.astro       # Barra superior + sub-nav sticky de servicios
│   └── Welcome.astro
├── data/
│   ├── services.ts            # Catálogo tipado de los 4 servicios
│   └── timeline-elecciones.ts # Datos de la línea de tiempo electoral
├── layouts/
│   └── Layout.astro           # Layout base (head, header, slot, scripts)
├── pages/
│   └── index.astro            # Landing única: hero + índice + 4 servicios + galería + contacto
├── remotion/                  # Composiciones Remotion (videos del sitio)
├── scripts/
│   ├── site-animations.ts     # Animaciones globales y sub-nav activo
│   └── vertical-timeline.ts   # Comportamiento del componente VerticalTimeline
└── styles/
    └── global.css             # Tailwind v4 + utilidades del sitio
```

## Convenciones

- **Idioma**: español con tildes correctas en todo el contenido visible (UI,
  metadatos `<title>` / `<meta>`, `aria-label`, comentarios). El código ASCII
  (identificadores, claves) puede mantenerse sin tildes por compatibilidad de
  imports y rutas.
- **Mobile-first**: cada bloque parte del estilo móvil y agrega breakpoints
  `sm:` / `md:` / `lg:` solo cuando aporta. Las grillas usan `grid-cols-2`
  desde móvil cuando el espacio lo permite.
- **Tema visual**: fondo blanco para descripción y formularios; bloques oscuros
  (`bg-slate-950`) para hero, secciones de servicios y línea de tiempo. Color
  de marca: `blue-500/blue-400`. Hitos electorales: acento `amber-300`.
- **Accesibilidad**: anclas con `scroll-mt-20`, `aria-labelledby` en secciones,
  marcadores decorativos con `aria-hidden`, `prefers-reduced-motion` respetado
  en cada animación.

## Animaciones

Centralizadas en `src/scripts/`. Cada página llama a las funciones que necesita
desde su bloque `<script>` (Astro empaqueta el módulo).

- `initNavAndTextAnimations()` — auto-cargado desde `Layout.astro`. Anima
  `[data-animate-nav]` (header) y `[data-animate-text]` (textos al entrar al
  viewport).
- `initServicesSubnav()` — auto-cargado desde `Layout.astro`. Marca el
  enlace activo del sub-nav (`[data-subnav-link]`) según la sección visible.
- `initHomePageEffects()` — anima `[data-animate]`, `[data-stagger]` y los
  videos `[data-service-preview]`. Se invoca desde `index.astro`.
- `initContactKeywordSlider()` — slider continuo de palabras clave.
- `initVerticalTimelines()` — comportamiento del componente
  `VerticalTimeline.astro` (ver sección dedicada).

Todas las funciones cortocircuitan al detectar
`window.matchMedia('(prefers-reduced-motion: reduce)')`.

## Componente compartido `VerticalTimeline`

Ruta: `src/components/shared/VerticalTimeline.astro`.
Script asociado: `src/scripts/vertical-timeline.ts`.
Datos del caso electoral: `src/data/timeline-elecciones.ts`.

### Propósito

Renderiza una línea de tiempo vertical, animada y responsiva, pensada para
mostrar la evolución cronológica de proyectos / despliegues con tableros
embebidos. Está integrada como **vitrina de entregables** del servicio de
Reportería dentro de la sección `#reporteria` de la landing, para visualizar
las elecciones atípicas, Congreso 2026 y Presidencia 2026; está diseñada
para reutilizarse en otros servicios.

### Props

```ts
interface Props {
  events: TimelineEvent[];   // ordenados internamente por fecha
  eyebrow?: string;          // etiqueta superior pequeña
  heading: string;           // título de la sección
  description?: string;      // bajada / descripción
  id?: string;               // base del id de la sección y de las anclas
}
```

`TimelineEvent` admite varios tipos de embebidos: `iframe` (tableros Power BI),
`image`, `video` y `link`. Los iframes se cargan de forma diferida cuando el
embebido entra en pantalla (lazy-load real, no solo `loading="lazy"`) para no
penalizar el TTI cuando la línea de tiempo tiene 20+ tableros.

### Comportamientos clave

1. **Mini-nav sticky**: chips horizontales con cada elección. Saltan a la
   ancla y resaltan según la elección visible.
2. **Riel de progreso**: relleno animado conforme el usuario hace scroll.
3. **Marcadores con pulso** para los eventos `isHito` (Congreso, Presidencia).
4. **Lazy-load de iframes**: cada Power BI carga al entrar en viewport.
5. **Pendientes**: si `embeds.length === 0`, muestra un placeholder con borde
   discontinuo para reservar el espacio sin romper la cronología.
6. **Tema oscuro** alineado a `bg-slate-950` y a la paleta del sitio.
7. **Mobile-first**: línea a la izquierda, tarjetas apiladas a la derecha. En
   `md+` la línea pasa al centro y las tarjetas alternan lado.
8. **Reduced motion**: se desactivan transformaciones y pulsos.

### Uso

```astro
---
import VerticalTimeline from '../../components/shared/VerticalTimeline.astro';
import { electionTimeline } from '../../data/timeline-elecciones';
---
<VerticalTimeline
  id="linea-tiempo-elecciones"
  eyebrow="Evolución del servicio"
  heading="Línea de tiempo de elecciones"
  description="..."
  events={electionTimeline}
/>

<script>
  import { initVerticalTimelines } from '../../scripts/vertical-timeline';
  initVerticalTimelines();
</script>
```

### Cómo agregar tableros pendientes

1. Editar `src/data/timeline-elecciones.ts`.
2. Localizar la elección con `embeds: []` (Sitionuevo, Fonseca, etc.).
3. Reemplazar por una lista de `pbiEmbed(title, url, description, subtitle)`.
4. Para enlaces no-Power BI, usar el constructor manual con `kind: 'link' |
   'image' | 'video'`.

## Despliegues / cambios destacados

- **2026-05-08**: corrección ortográfica integral (tildes y términos en
  español) en home, layout, header y vista de detalle de servicios. Se agregó
  el componente `VerticalTimeline` y los datos de las jornadas electorales.
- **2026-05-12**: reestructuración del portafolio como **landing de una sola
  página enfocada a la venta**. Se eliminaron las rutas `/servicio/...`, se
  introdujeron `ServiceSection.astro` y `DeliverablesShowcase.astro` como
  plantilla común, y el sub-nav sticky con anclas reemplaza la navegación a
  páginas separadas.
