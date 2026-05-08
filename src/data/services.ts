export type ServiceDetail = {
  badge: string;
  title: string;
  /** Texto corto (1 línea) para la lista de pestañas del showcase de la home. */
  shortDesc: string;
  /** Ruta pública del video de portada del servicio (p. ej. `/servicio-automatizacion.mp4`). */
  videoSrc: string;
  summary: string;
  bullets?: string[];
  successCases?: string[];
  modalityA?: string;
  modalityB?: string;
  closing?: string;
};

export const services: Record<string, ServiceDetail> = {
  automatizacion: {
    badge: 'Servicio 1',
    title: 'Automatización',
    shortDesc: 'Bots, n8n y monitoreo de KPIs que reducen el trabajo manual.',
    videoSrc: '/servicio-automatizacion.mp4',
    summary:
      'Automatización de la captura, el procesamiento y el monitoreo de información para Business Intelligence. El alcance cubre ingesta asistida con bots, visores de documentos y aplicaciones de captación; reglas de limpieza, validación y transformación del dato; orquestación de procesos complejos con flujos automatizados (por ejemplo n8n) para reducir la intervención manual; y monitoreo continuo de KPIs, alertas y excepciones alineado a las capas analíticas del área, de modo que la información llegue oportuna, gobernada y trazable al consumo analítico.',
    bullets: [
      'Implementación de bots, visores de documentos y aplicaciones de captación de datos.',
      'Flujos automatizados con n8n para orquestar procesos complejos con mínima intervención manual.',
      'Aplicaciones de seguimiento de KPIs para PMO integradas con las capas analíticas del área.',
    ],
    successCases: [
      'Automatización de ciclos de captura documental con reducción del tiempo operativo.',
      'Integración de procesos con n8n para disminuir retrabajos y aumentar la trazabilidad.',
      'Seguimiento centralizado de KPIs de PMO con actualización continua de indicadores.',
    ],
  },
  reporteria: {
    badge: 'Servicio 2',
    title: 'Reportería',
    shortDesc: 'Tableros y reportes versionados, con la línea de tiempo electoral viva.',
    videoSrc: '/servicio-reporteria.mp4',
    summary:
      'Reportería para el consumo interno de información de negocio y el análisis electoral. Definimos catálogos de reportes y extractos con criterios de negocio acordados, versionamos definiciones de métricas y dimensiones frente a las fuentes oficiales del área, programamos entregas recurrentes y suscripciones (correo, carpetas compartidas o portales internos), y homologamos formatos y plantillas para que cada área reciba cifras comparables, auditables y alineadas a la gobernanza de datos, reduciendo las solicitudes ad-hoc repetitivas. Este servicio ha acompañado la evolución de los tableros de elecciones atípicas, Congreso y Presidencia 2026, consolidando una práctica viva de analítica electoral.',
    bullets: [
      'Diseño y publicación de reportes y extractos con criterios de negocio acordados.',
      'Programación de envíos, suscripciones y formatos estándar para las áreas usuarias.',
      'Alineación de definiciones, métricas y calidad de datos con las fuentes oficiales.',
    ],
    successCases: [
      'Ciclos de reportería recurrente con entregas puntuales y trazabilidad de versiones.',
      'Reducción de solicitudes ad-hoc al concentrar preguntas frecuentes en reportes base.',
      'Homologación de KPIs entre equipos a partir de un mismo conjunto de reglas.',
    ],
  },
  'desarrollo-medida-datos': {
    badge: 'Servicio 3',
    title: 'Desarrollo a la medida enfocado a los datos',
    shortDesc: 'APIs, integraciones y servicios con reglas de negocio sobre los datos.',
    videoSrc: '/servicio-desarrollo.mp4',
    summary:
      'Desarrollo a la medida enfocado a los datos. Construimos APIs, servicios y componentes que materializan reglas de negocio sobre la información; integramos sistemas heterogéneos con contratos de entrada y salida, manejo de errores y políticas de reintento; encapsulamos validaciones, enriquecimientos y transformaciones reutilizables; y acompañamos el ciclo con pruebas automatizadas y observabilidad (logs, métricas y trazas) para acelerar el diagnóstico, el despliegue seguro y el time-to-insight frente a cambios de negocio.',
    bullets: [
      'Aplicaciones y servicios que consumen, transforman y exponen datos según contratos acordados.',
      'Integraciones entre sistemas con foco en consistencia, versionado y observabilidad del dato.',
      'Componentes reutilizables para validaciones, enriquecimientos y orquestación ligera de procesos de datos.',
    ],
    successCases: [
      'APIs y microservicios internos para centralizar lógica de negocio sobre conjuntos de datos.',
      'Flujos de datos a la medida que reducen dependencias manuales y aceleran el time-to-insight.',
      'Empaquetado de reglas y transformaciones con pruebas y despliegue controlado.',
    ],
  },
  'estructuracion-bases-sincronizacion': {
    badge: 'Servicio 4',
    title: 'Estructuración de bases de datos y sincronización',
    shortDesc: 'Modelado, migraciones y sincronización con consistencia entre entornos.',
    videoSrc: '/servicio-basesdatos.mp4',
    summary:
      'Estructuración de bases de datos y sincronización. Trabajamos el modelo lógico y físico (entidades, relaciones, índices, particiones y convenciones de nombrado), planificamos migraciones y cambios de esquema con análisis de impacto sobre reportes, aplicaciones y pipelines existentes, y diseñamos procesos de sincronización entre orígenes y destinos con cargas incrementales o completas, control de duplicados, colas de reintentos, ventanas de mantenimiento y comprobaciones de consistencia para mantener los datos alineados entre entornos (desarrollo, pruebas, producción) y entre sistemas operativos.',
    bullets: [
      'Modelado y normalización de esquemas, índices, particiones y convenciones para consultas y cargas eficientes.',
      'Migraciones, gobierno de cambios y compatibilidad con consumos existentes (reportes, aplicaciones, pipelines).',
      'Sincronización entre sistemas con control de duplicados, deltas, reintentos y monitoreo de consistencia.',
    ],
    successCases: [
      'Refactor de esquemas para nuevos productos de datos sin interrumpir la operación diaria.',
      'Pipelines de sincronización con recuperación ante fallos y alertas de desviación.',
      'Homologación de entornos (desarrollo, pruebas, producción) con scripts y revisiones trazables.',
    ],
  },
};
