/**
 * Evidencia en producción del área de Business Intelligence.
 *
 * Tipos genéricos de entregable (reutilizados por `DeliverablesShowcase`) y
 * el listado de aplicaciones y tableros que ya están operando, usados como
 * prueba concreta dentro de la sección `#evidencia` de la landing.
 *
 * Aquí vivía el catálogo de servicios (`services.ts`); con la reestructuración
 * a pilares / journeys / verticales, el catálogo se movió a `pillars.ts`,
 * `journeys.ts`, `managed-services.ts` y `verticals.ts`, y este archivo
 * conserva únicamente la evidencia viva.
 */

export type DeliverableKind = 'iframe' | 'image' | 'video' | 'link' | 'placeholder';

export type DeliverableItem = {
  kind: DeliverableKind;
  title: string;
  description: string;
  /** URL del recurso o enlace externo. Opcional para `placeholder`. */
  url?: string;
  /** Etiqueta corta encima del título (p. ej. "Power BI · SIMAE"). */
  subtitle?: string;
};

/**
 * Aplicaciones y tableros del área que ya corren en producción durante el
 * ciclo electoral. Son la prueba viva detrás de los pilares de capacidad y
 * de la vertical Electoral.
 */
export const appsEnProduccion: DeliverableItem[] = [
  {
    kind: 'link',
    subtitle: 'SIMAE · Experiencia electoral',
    title: 'Sistema Integral de Monitoreo y Analítica Electoral',
    description:
      'Centro de lectura de la jornada presidencial 2026, con embebido seguro institucional.',
    url: 'https://simae.actoreselectorales.com/login',
  },
  {
    kind: 'link',
    subtitle: 'Monitoreo interno',
    title: 'AppBI · PMO',
    description:
      'Monitoreo de KPIs operativos y seguimiento centralizado de la PMO.',
    url: 'https://appbi.actoreselectorales.com/',
  },
  {
    kind: 'link',
    subtitle: 'Salud de bases de datos',
    title: 'Seguimiento DATA',
    description:
      'Monitoreo continuo de las bases: carga, estado y consumo siempre visibles.',
    url: 'https://seguimiento-data.actoreselectorales.com/',
  },
  {
    kind: 'link',
    subtitle: 'Procesos orquestados',
    title: 'Flujos de automatización n8n',
    description:
      'Flujos que conectan sistemas y ejecutan tareas 24/7 sin intervención manual.',
    url: 'https://botbi.actoreselectorales.com/',
  },
  {
    kind: 'link',
    subtitle: 'Documentos en línea',
    title: 'Visor de documentos',
    description:
      'Consulta y descarga de resoluciones y credenciales del CNE en un solo lugar.',
    url: 'https://credenciales.actoreselectorales.com/',
  },
  {
    kind: 'link',
    subtitle: 'Analítica a la medida',
    title: 'Analítica de Presidencia',
    description:
      'Análisis histórico de las elecciones presidenciales en Colombia.',
    url: 'https://analisis-presidencia-colombia.vercel.app/',
  },
];
