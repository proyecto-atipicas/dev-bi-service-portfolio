export type ServiceDetail = {
  badge: string;
  title: string;
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
    title: 'Automatizacion',
    videoSrc: '/servicio-automatizacion.mp4',
    summary:
      'Automatizacion de captura, procesamiento y monitoreo de informacion para BI. El alcance cubre ingesta asistida con bots, visores de documentos y apps de captacion; reglas de limpieza, validacion y transformacion del dato; orquestacion de procesos complejos con flujos automatizados (por ejemplo n8n) para reducir intervencion manual; y monitoreo continuo de KPIs, alertas y excepciones alineado a las capas analiticas del area, de modo que la informacion llegue oportuna, gobernada y trazable al consumo analitico.',
    bullets: [
      'Implementacion de bots, visores de documentos y apps de captacion de datos.',
      'Flujos automatizados con n8n para orquestar procesos complejos con minima intervencion manual.',
      'Apps de seguimiento de KPIs para PMO integradas con capas analiticas del area.',
    ],
    successCases: [
      'Automatizacion de ciclos de captura documental con reduccion del tiempo operativo.',
      'Integracion de procesos con n8n para disminuir retrabajos y aumentar trazabilidad.',
      'Seguimiento centralizado de KPIs de PMO con actualizacion continua de indicadores.',
    ],
  },
  reporteria: {
    badge: 'Servicio 2',
    title: 'Reporteria',
    videoSrc: '/servicio-reporteria.mp4',
    summary:
      'Reporteria para el consumo interno de informacion de negocio. Definimos catalogos de reportes y extractos con criterios de negocio acordados, versionamos definiciones de metricas y dimensiones frente a fuentes oficiales del BI, programamos entregas recurrentes y suscripciones (correo, carpetas compartidas o portales internos), y homologamos formatos y plantillas para que cada area reciba cifras comparables, auditables y alineadas a la gobernanza de datos, reduciendo solicitudes ad-hoc repetitivas.',
    bullets: [
      'Diseno y publicacion de reportes y extractos con criterios de negocio acordados.',
      'Programacion de envios, suscripciones y formatos estandar para areas usuarias.',
      'Alineacion de definiciones, metricas y calidad de datos con las fuentes oficiales.',
    ],
    successCases: [
      'Ciclos de reporteria recurrente con entregas puntuales y trazabilidad de versiones.',
      'Reduccion de solicitudes ad-hoc al concentrar preguntas frecuentes en reportes base.',
      'Homologacion de KPIs entre equipos a partir de un mismo conjunto de reglas.',
    ],
  },
  'desarrollo-medida-datos': {
    badge: 'Servicio 3',
    title: 'Desarrollo a la medida enfocado a los datos',
    videoSrc: '/servicio-desarrollo.mp4',
    summary:
      'Desarrollo a la medida enfocado a los datos. Construimos APIs, servicios y componentes que materializan reglas de negocio sobre la informacion; integramos sistemas heterogeneos con contratos de entrada y salida, manejo de errores y politicas de reintento; encapsulamos validaciones, enriquecimientos y transformaciones reutilizables; y acompanamos el ciclo con pruebas automatizadas y observabilidad (logs, metricas y trazas) para acelerar el diagnostico, el despliegue seguro y el time-to-insight frente a cambios de negocio.',
    bullets: [
      'Aplicaciones y servicios que consumen, transforman y exponen datos segun contratos acordados.',
      'Integraciones entre sistemas con foco en consistencia, versionado y observabilidad del dato.',
      'Componentes reutilizables para validaciones, enriquecimientos y orquestacion ligera de procesos de datos.',
    ],
    successCases: [
      'APIs y microservicios internos para centralizar logica de negocio sobre conjuntos de datos.',
      'Flujos de datos a medida que reducen dependencias manuales y aceleran time-to-insight.',
      'Empaquetado de reglas y transformaciones con pruebas y despliegue controlado.',
    ],
  },
  'estructuracion-bases-sincronizacion': {
    badge: 'Servicio 4',
    title: 'Estructuracion de bases de datos y sincronizacion',
    videoSrc: '/servicio-basesdatos.mp4',
    summary:
      'Estructuracion de bases de datos y sincronizacion. Trabajamos el modelo logico y fisico (entidades, relaciones, indices, particiones y convenciones de nombrado), planificamos migraciones y cambios de esquema con analisis de impacto sobre reportes, aplicaciones y pipelines existentes, y disenamos procesos de sincronizacion entre origenes y destinos con cargas incrementales o completas, control de duplicados, colas de reintentos, ventanas de mantenimiento y comprobaciones de consistencia para mantener datos alineados entre entornos (desarrollo, pruebas, produccion) y entre sistemas operativos.',
    bullets: [
      'Modelado y normalizacion de esquemas, indices, particiones y convenciones para consultas y cargas eficientes.',
      'Migraciones, gobierno de cambios y compatibilidad con consumos existentes (reportes, apps, pipelines).',
      'Sincronizacion entre sistemas con control de duplicados, deltas, reintentos y monitoreo de consistencia.',
    ],
    successCases: [
      'Refactor de esquemas para nuevos productos de datos sin interrumpir operacion diaria.',
      'Pipelines de sincronizacion con recuperacion ante fallos y alertas de desviacion.',
      'Homologacion de entornos (dev, pruebas, produccion) con scripts y revisiones trazables.',
    ],
  },
};
