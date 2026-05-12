/**
 * Catálogo tipado de los servicios del área de Business Intelligence.
 *
 * Cada servicio se renderiza como una sección autónoma de la landing
 * (`#automatizacion`, `#reporteria`, `#desarrollo`, `#estructuracion`) y
 * comparte la misma plantilla narrativa: dolor, solución, beneficios,
 * casos con métrica y vitrina de entregables.
 *
 * Para añadir un servicio basta con sumar una entrada y registrarla en
 * `serviceOrder`; la home y el componente `ServiceSection` se actualizan
 * automáticamente.
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

export type ServiceDetail = {
  /** Slug usado como ancla (#automatizacion, #reporteria, ...). */
  anchor: string;
  /** Título principal del servicio. */
  title: string;
  /** Subtítulo de propuesta de valor (enfoque al usuario / venta). */
  valueSubtitle: string;
  /** Descripción corta para la tarjeta del índice horizontal. */
  shortDesc: string;
  /** Path SVG (24×24) del icono que acompaña la tarjeta del índice. */
  iconPath: string;
  /** Video de portada en bucle. */
  videoSrc: string;
  /** Primer párrafo: el dolor que vive hoy el área usuaria. */
  painParagraph: string;
  /** Segundo párrafo: cómo lo resolvemos en concreto. */
  solutionParagraph: string;
  /** Bullets de beneficio (3–4). */
  benefits: string[];
  /** Casos de éxito con métrica (hasta 3). */
  successMetrics: string[];
  /** Entregables de la vitrina; vacío en reportería (usa la línea de tiempo). */
  deliverables: DeliverableItem[];
};

/** Orden de aparición en la página y en el índice horizontal. */
export const serviceOrder = [
  'automatizacion',
  'reporteria',
  'desarrollo',
  'estructuracion',
] as const;

export type ServiceKey = (typeof serviceOrder)[number];

const ICON_AUTOMATIZACION =
  'M12 2v3M4.93 4.93l2.12 2.12M2 12h3M4.93 19.07l2.12-2.12M12 19v3M16.95 16.95l2.12 2.12M19 12h3M16.95 7.05l2.12-2.12M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z';
const ICON_REPORTERIA =
  'M4 20V10M10 20V4M16 20v-7M22 20H2';
const ICON_DESARROLLO =
  'M8 6 2 12l6 6M16 6l6 6-6 6M14 4l-4 16';
const ICON_ESTRUCTURACION =
  'M4 6c0-1.66 3.58-3 8-3s8 1.34 8 3-3.58 3-8 3-8-1.34-8-3Zm0 0v12c0 1.66 3.58 3 8 3s8-1.34 8-3V6M4 12c0 1.66 3.58 3 8 3s8-1.34 8-3';

export const services: Record<ServiceKey, ServiceDetail> = {
  automatizacion: {
    anchor: 'automatizacion',
    title: 'Automatización',
    valueSubtitle: 'Flujos de trabajo y monitoreo continuo que liberan a tu equipo del trabajo manual.',
    shortDesc: 'Procesos que corren solos y avisan cuando algo se desvía.',
    iconPath: ICON_AUTOMATIZACION,
    videoSrc: '/servicio-automatizacion.mp4',
    painParagraph:
      'Tu equipo dedica horas cada semana a capturar, mover y revisar datos a mano. La operación crece, los archivos se multiplican y el error humano se vuelve inevitable: KPIs desactualizados, retrabajos y decisiones tomadas con la información de ayer.',
    solutionParagraph:
      'Diseñamos bots, formularios inteligentes y flujos en n8n que ejecutan esas tareas 24/7, con trazabilidad y alertas tempranas. La información llega oportuna al consumo analítico y tu gente se concentra en lo que sí requiere su criterio: analizar, decidir y actuar.',
    benefits: [
      'Eliminamos tareas repetitivas con bots y aplicaciones que trabajan 24/7.',
      'Orquestamos procesos completos con flujos n8n que reducen la intervención manual al mínimo.',
      'Monitoreamos KPIs en continuo con alertas tempranas cuando algo se desvía.',
      'Centralizamos la información operativa para que el dato llegue oportuno a la analítica.',
    ],
    successMetrics: [
      'Reducción de hasta 80 % del tiempo operativo en ciclos de captura documental.',
      'Integración de 5+ sistemas con n8n, disminuyendo retrabajos y errores manuales.',
      'Seguimiento centralizado de KPIs de PMO con ahorro estimado de 12 horas/semana.',
    ],
    deliverables: [
      {
        kind: 'link',
        subtitle: 'Monitoreo interno',
        title: 'AppBI - PMO',
        description:
          'Aplicación transversal para el monitoreo de KPIs operativos y el seguimiento centralizado de los avances de la PMO.',
        url: 'https://appbi.actoreselectorales.com/',
      },
      {
        kind: 'link',
        subtitle: 'Salud de bases de datos',
        title: 'Seguimiento DATA',
        description:
          'Monitoreo y tracking continuo de las bases de datos del proyecto: carga, estado y consumo siempre visibles para el equipo.',
        url: 'https://seguimiento-data.actoreselectorales.com/',
      },
      {
        kind: 'link',
        subtitle: 'Procesos orquestados',
        title: 'Flujos de automatización',
        description:
          'Flujos n8n que conectan sistemas, validan datos y ejecutan tareas operativas sin intervención manual.',
        url: 'https://botbi.actoreselectorales.com/',
      },
      {
        kind: 'link',
        subtitle: 'Documentos en línea',
        title: 'Visor de documentos',
        description:
          'Visor en línea para consultar y descargar resoluciones y credenciales del sistema CNE sin recorrer múltiples portales.',
        url: 'https://credenciales.actoreselectorales.com/',
      },
    ],
  },

  reporteria: {
    anchor: 'reporteria',
    title: 'Reportería',
    valueSubtitle: 'Tableros y reportes en los que cada área puede confiar para decidir.',
    shortDesc: 'Métricas homologadas, entregas a tiempo y trazabilidad de versiones.',
    iconPath: ICON_REPORTERIA,
    videoSrc: '/servicio-reporteria.mp4',
    painParagraph:
      'Cada decisión exige un nuevo Excel, las cifras cambian según quién las consulte y los reportes ad-hoc se acumulan en la mesa del equipo. Sin una base común, la analítica se vuelve un cuello de botella en lugar de una palanca.',
    solutionParagraph:
      'Construimos catálogos de reportes y tableros versionados, con métricas homologadas y entregas programadas. Cada área accede a información comparable, auditable y siempre alineada a las fuentes oficiales, reduciendo solicitudes repetidas y acelerando la toma de decisión.',
      benefits: [
        'Tableros y reportes con métricas de las elecciones presidenciales y Congreso 2026.',
        'Tableros y reportes con métricas de las elecciones atipicas',
        'Modelamiento de datos para las elecciones de Presidencia y Congreso 2026 y atipicas',
        'Modelado de datos para analsisis electoral',
      ],
    successMetrics: [
      'Más de 20 tableros versionados publicados a lo largo del ciclo electoral 2025–2026.',
      'Reducción medible de solicitudes ad-hoc al concentrar preguntas frecuentes en reportes base.',
      'Homologación de KPIs entre equipos a partir de un mismo conjunto de reglas de negocio.',
    ],
    /* La vitrina de reportería usa la línea de tiempo electoral; ver index.astro. */
    deliverables: [],
  },

  desarrollo: {
    anchor: 'desarrollo',
    title: 'Desarrollo a la medida enfocado a los datos',
    valueSubtitle: 'Aplicaciones a la medida que mueven los datos a donde el negocio los necesita.',
    shortDesc: 'APIs, integraciones y servicios con reglas de negocio sobre los datos.',
    iconPath: ICON_DESARROLLO,
    videoSrc: '/servicio-desarrollo.mp4',
    painParagraph:
      'Las herramientas existentes no encajan con tu proceso, los integradores comerciales se quedan cortos y cada cambio toma semanas. Mientras tanto, la información sigue fragmentada y los equipos resuelven a mano lo que debería ser automático.',
    solutionParagraph:
      'Desarrollamos APIs, servicios y aplicaciones a la medida que materializan tus reglas de negocio sobre los datos. Encapsulamos integraciones, validaciones y enriquecimientos en componentes reutilizables, con pruebas, observabilidad y despliegue controlado.',
    benefits: [
      'APIs y servicios a la medida que materializan tus reglas de negocio.',
      'Integraciones robustas con manejo de errores, reintentos y observabilidad incorporada.',
      'Componentes reutilizables: una vez construidos, sirven para varios consumos.',
      'Pruebas automatizadas y despliegue controlado para que cada cambio sea seguro.',
    ],
    successMetrics: [
      'APIs y microservicios internos que centralizan la lógica de negocio sobre los datos.',
      'Flujos a la medida que reducen dependencias manuales y aceleran el time-to-insight.',
      'Empaquetado de reglas y transformaciones con pruebas automatizadas y despliegue trazable.',
    ],
    deliverables: [
      {
        kind: 'link',
        subtitle: 'SIMAE',
        title: 'Sistema integral de monitoreo y analitica electoral',
        description:
          'Tablero de Experiencia Electoral para la presidencial 2026.',
        url: 'https://simae.actoreselectorales.com/login',
      },
      {
        kind: 'link',
        subtitle: 'Aplicación analítica',
        title: 'Analítica de Presidencia',
        description:
          'Herramienta a la medida para el análisis histórico de elecciones presidenciales en Colombia.',
        url: 'https://analisis-presidencia-colombia.vercel.app/',
      },
    ],
  },

  estructuracion: {
    anchor: 'estructuracion',
    title: 'Estructuración y normalización de información',
    valueSubtitle: 'Bases de datos consistentes, sincronizadas y listas para crecer con el negocio.',
    shortDesc: 'Modelado, migraciones y sincronización entre entornos y sistemas.',
    iconPath: ICON_ESTRUCTURACION,
    videoSrc: '/servicio-basesdatos.mp4',
    painParagraph:
      'Los datos viven dispersos en bases que no conversan entre sí: estructuras inconsistentes, migraciones manuales y discrepancias entre entornos que dilatan cualquier análisis o desarrollo nuevo.',
    solutionParagraph:
      'Modelamos y normalizamos las bases con convenciones claras, gobernamos las migraciones con análisis de impacto y montamos procesos de sincronización con control de duplicados, deltas y monitoreo. El resultado: datos consistentes entre sistemas y entornos, listos para ser consumidos.',
    benefits: [
      'Modelos lógicos y físicos pensados para crecer sin tener que reescribir el esquema.',
      'Migraciones gobernadas con análisis de impacto y plan de reversibilidad.',
      'Sincronización entre sistemas con control de duplicados y deltas incrementales.',
      'Homologación de entornos: desarrollo, pruebas y producción siempre alineados.',
    ],
    successMetrics: [
      'Refactor de esquemas para nuevos productos de datos sin interrumpir la operación diaria.',
      'Pipelines de sincronización con recuperación ante fallos y alertas de desviación.',
      'Homologación de entornos (desarrollo, pruebas, producción) con scripts y revisiones trazables.',
    ],
    deliverables: [
      {
        kind: 'placeholder',
        subtitle: 'Modelo de datos',
        title: 'Diagrama entidad-relación',
        description:
          'Vista del modelo lógico con entidades, relaciones e índices clave del dominio.',
      },
      {
        kind: 'placeholder',
        subtitle: 'Migraciones',
        title: 'Versionado de migraciones',
        description:
          'Histórico de cambios de esquema con plan de despliegue, validaciones y reversibilidad.',
      },
      {
        kind: 'placeholder',
        subtitle: 'Sincronización',
        title: 'Flujo de sincronización entre entornos',
        description:
          'Esquema operativo de cargas incrementales, control de duplicados y monitoreo de consistencia.',
      },
    ],
  },
};

/** Tarjetas del índice horizontal: orden controlado + numeración 01..NN. */
export const indexedServices = serviceOrder.map((key, idx) => ({
  key,
  number: String(idx + 1).padStart(2, '0'),
  ...services[key],
}));

export const totalServices = String(serviceOrder.length).padStart(2, '0');
