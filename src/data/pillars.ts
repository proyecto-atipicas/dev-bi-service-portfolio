/**
 * Pilares de capacidad del área de Business Intelligence.
 *
 * Tres pilares concentran las capacidades del área y reagrupan los servicios
 * del portafolio (automatización, reportería, desarrollo y estructuración) según
 * el rol que cumplen en el ciclo del dato: confiabilidad → modelos → producto.
 *
 * Cada servicio comparte la ficha "Para / Incluye" y, cuando aplica, una prueba
 * corta (chip) con evidencia en producción.
 */

export type PillarService = {
  /** Nombre del servicio. */
  name: string;
  /** Duración estimada de la entrega, p. ej. "2–3 sem". */
  time: string;
  /** A quién va dirigido. */
  target: string;
  /** Qué incluye la entrega. */
  includes: string;
  /** Prueba/credencial corta opcional que se muestra como chip. */
  proof?: string;
};

export type Pillar = {
  /** Número de orden, "01"…"03". */
  num: string;
  /** Título del pilar. */
  title: string;
  /** Frase de propósito del pilar. */
  subtitle: string;
  services: PillarService[];
};

export const pillars: Pillar[] = [
  {
    num: '01',
    title: 'Transformación de datos',
    subtitle: 'Volvemos los datos confiables y consultables.',
    services: [
      {
        name: 'Auditoría de fuentes y diagnóstico',
        time: '2–3 sem',
        target:
          'Proyectos con datos dispersos y sin una visión consolidada de su panorama informativo.',
        includes:
          'Inventario de fuentes, mapeo de calidad, evaluación de la gobernanza actual, hoja de ruta priorizada por valor de negocio y estimación de esfuerzo para las fases siguientes. Se entrega un documento ejecutivo y uno técnico.',
      },
      {
        name: 'Estructuración y normalización de bases',
        time: '3–6 sem',
        target:
          'Proyectos con datos en bases que no conversan entre sí, estructuras inconsistentes y migraciones manuales.',
        includes:
          'Modelado lógico y físico con convenciones claras, migraciones gobernadas con análisis de impacto y reversibilidad, y sincronización entre entornos con control de duplicados y deltas incrementales.',
      },
    ],
  },
  {
    num: '02',
    title: 'Analítica avanzada',
    subtitle: 'Convertimos los datos en modelos y señales accionables.',
    services: [
      {
        name: 'Modelado semántico para BI',
        time: '3–6 sem',
        target: 'Proyectos con datos crudos sin una capa de negocio coherente.',
        includes:
          'Modelo semántico optimizado, medidas DAX, seguridad por fila (RLS), documentación automática del modelo y capacitación a usuarios avanzados.',
      },
      {
        name: 'Análisis geoespacial',
        time: '4–6 sem',
        target:
          'Proyectos con datos de dimensión territorial donde el mapa cuenta la historia.',
        includes:
          'Topologías geográficas proyectadas, mapas interactivos por nivel administrativo (departamento, municipio, zona), uniones georreferenciadas y rendimiento optimizado para volúmenes nacionales.',
        proof: 'SIMAE · 33 departamentos',
      },
    ],
  },
  {
    num: '03',
    title: 'Visualización y automatización',
    subtitle: 'El producto que el cliente y sus usuarios ven y operan.',
    services: [
      {
        name: 'Suite de tableros integrales',
        time: '4–10 sem',
        target: 'Cualquier organización que necesite visualizar datos para decidir.',
        includes:
          'Catálogo flexible con tres variantes —ejecutiva (KPIs estratégicos para dirección), operacional (datos en tiempo cuasi-real para los equipos) y embebida (consumo dentro de los productos del cliente)—. Cada variante se entrega sola o combinada según el caso.',
      },
      {
        name: 'Visualización interactiva',
        time: '6–10 sem',
        target:
          'Proyectos que requieren una experiencia diferenciada y de uso diario en sus tableros.',
        includes:
          'Drill-down multinivel con preservación de contexto, mapas y gráficos interactivos, filtros avanzados, datos en tiempo real, exportación auditable, integración con sistemas externos y modo offline opcional para entornos sin red estable.',
        proof: 'Patrón SIMAE · uso institucional',
      },
      {
        name: 'Automatización de procesos',
        time: '3–6 sem',
        target:
          'Equipos que dedican horas cada semana a capturar, mover y revisar datos a mano.',
        includes:
          'Bots, formularios inteligentes y flujos en n8n que ejecutan las tareas 24/7, monitoreo continuo de KPIs con alertas tempranas y trazabilidad de cada ejecución.',
      },
      {
        name: 'Desarrollo a la medida enfocado a datos',
        time: '6–12 sem',
        target:
          'Procesos donde las herramientas existentes no encajan y los integradores comerciales se quedan cortos.',
        includes:
          'APIs, servicios y aplicaciones a la medida que materializan las reglas de negocio sobre los datos, con pruebas automatizadas, observabilidad y despliegue controlado.',
      },
    ],
  },
];
