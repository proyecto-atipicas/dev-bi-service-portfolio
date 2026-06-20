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
      'Tablero de experiencia para la presidencial 2026: centro de lectura de la jornada con embebido seguro institucional.',
    url: 'https://simae.actoreselectorales.com/login',
  },
  {
    kind: 'link',
    subtitle: 'Monitoreo interno',
    title: 'AppBI · PMO',
    description:
      'Aplicación transversal para el monitoreo de KPIs operativos y el seguimiento centralizado de los avances de la PMO.',
    url: 'https://appbi.actoreselectorales.com/',
  },
  {
    kind: 'link',
    subtitle: 'Salud de bases de datos',
    title: 'Seguimiento DATA',
    description:
      'Monitoreo y tracking continuo de las bases del proyecto: carga, estado y consumo siempre visibles para el equipo.',
    url: 'https://seguimiento-data.actoreselectorales.com/',
  },
  {
    kind: 'link',
    subtitle: 'Procesos orquestados',
    title: 'Flujos de automatización n8n',
    description:
      'Flujos que conectan sistemas, validan datos y ejecutan tareas operativas 24/7 sin intervención manual.',
    url: 'https://botbi.actoreselectorales.com/',
  },
  {
    kind: 'link',
    subtitle: 'Documentos en línea',
    title: 'Visor de documentos',
    description:
      'Consulta y descarga de resoluciones y credenciales del sistema CNE sin recorrer múltiples portales.',
    url: 'https://credenciales.actoreselectorales.com/',
  },
  {
    kind: 'link',
    subtitle: 'Analítica a la medida',
    title: 'Analítica de Presidencia',
    description:
      'Herramienta a la medida para el análisis histórico de las elecciones presidenciales en Colombia.',
    url: 'https://analisis-presidencia-colombia.vercel.app/',
  },
];
