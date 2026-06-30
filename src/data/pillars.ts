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
        target: 'Proyectos con datos dispersos, sin una visión consolidada.',
        includes:
          'Inventario de fuentes, mapeo de calidad y hoja de ruta priorizada, con entregable ejecutivo y técnico.',
      },
      {
        name: 'Estructuración y normalización de bases',
        target: 'Proyectos con bases que no conversan entre sí y migraciones manuales.',
        includes:
          'Modelado lógico y físico, migraciones gobernadas y sincronización entre entornos con control de duplicados.',
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
        target: 'Proyectos con datos crudos sin una capa de negocio coherente.',
        includes:
          'Modelo semántico optimizado, medidas DAX, seguridad por fila (RLS) y documentación automática.',
      },
      {
        name: 'Análisis geoespacial',
        target: 'Proyectos con datos territoriales donde el mapa cuenta la historia.',
        includes:
          'Mapas interactivos por nivel administrativo, uniones georreferenciadas y rendimiento para volúmenes nacionales.',
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
        target: 'Cualquier organización que necesite visualizar datos para decidir.',
        includes:
          'Tres variantes —ejecutiva, operacional y embebida—, solas o combinadas según el caso.',
      },
      {
        name: 'Visualización interactiva',
        target: 'Proyectos que requieren tableros de uso diario y diferenciados.',
        includes:
          'Desglose multinivel, mapas y gráficos interactivos, datos en tiempo real y exportación auditable.',
      },
      {
        name: 'Automatización de procesos',
        target: 'Equipos que pierden horas capturando y moviendo datos a mano.',
        includes:
          'Bots y flujos en n8n que operan 24/7, con monitoreo de KPIs y alertas tempranas.',
      },
      {
        name: 'Desarrollo a la medida enfocado a datos',
        target: 'Procesos donde las herramientas existentes se quedan cortas.',
        includes:
          'APIs, servicios y aplicaciones a la medida, con pruebas automatizadas y despliegue controlado.',
      },
    ],
  },
];
