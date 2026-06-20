/**
 * Journeys empaquetados: formas de empezar y de adoptar BI con alcance,
 * tiempo y nivel de compromiso acotados. Van de la exploración de bajo
 * riesgo (Discovery Sprint) a la plataforma completa y la migración.
 */

export type Journey = {
  /** Clase Tailwind de color para el borde-acento, p. ej. "border-l-sky-400". */
  accent: string;
  /** Nombre del journey. */
  name: string;
  /** Duración aproximada, p. ej. "2 semanas". */
  time: string;
  /** Etiquetas cortas (chips). */
  tags: string[];
  /** A quién va dirigido. */
  target: string;
  /** Descripción del alcance y la promesa. */
  body: string;
};

export const journeys: Journey[] = [
  {
    accent: 'border-l-sky-400',
    name: 'BI Discovery Sprint',
    time: '2 semanas',
    tags: ['Entrada', 'Bajo riesgo'],
    target:
      'Proyectos nuevos que necesitan entender qué les aporta BI antes de comprometer un presupuesto grande.',
    body:
      'Auditoría de fuentes, un prototipo navegable y una hoja de ruta priorizada a 6 meses. Inversión acotada, contrato corto y aprendizaje garantizado aunque no se contrate la fase siguiente.',
  },
  {
    accent: 'border-l-blue-400',
    name: 'Tablero Express',
    time: '6 semanas',
    tags: ['Un caso de uso', 'Time-to-value rápido'],
    target:
      'Proyectos con un caso de uso claro que necesitan un resultado visible pronto para defender la inversión internamente.',
    body:
      'Un tablero end-to-end: modelado, pipeline, visualización y despliegue, acotado a una dirección de negocio. Sirve como prueba para escalar a la plataforma completa.',
  },
  {
    accent: 'border-l-blue-600',
    name: 'Plataforma BI completa',
    time: '12 semanas',
    tags: ['Implementación full', 'Plurianual'],
    target:
      'Proyectos que adoptan BI como capacidad permanente, con varios responsables y casos de uso.',
    body:
      'Los tres pilares activos: capa de datos, modelo semántico, 4–6 tableros en producción, embebido, gobernanza y capacitación. Marco de 4 KPIs contractuales para medir el cumplimiento.',
  },
  {
    accent: 'border-l-emerald-500',
    name: 'BI Embebido B2B',
    time: '10–16 semanas',
    tags: ['Producto del cliente', 'Premium'],
    target:
      'Negocios cuya propuesta es ofrecer información a terceros y necesitan que el tablero sea parte de su producto.',
    body:
      'El patrón SIMAE generalizado: tableros embebidos en el portal del cliente, white-label, autenticación contextual y datos en vivo. El modelo más rentable porque el cliente lo monetiza directamente.',
  },
  {
    accent: 'border-l-amber-500',
    name: 'Migración BI',
    time: '8–20 semanas · variable',
    tags: ['Desde legacy', 'Sale-side'],
    target:
      'Proyectos con BI existente (Excel pesados, Tableau antiguo, Looker sin uso) o tableros Power BI con límites de licencia que quieren migrar a un stack propio y moderno.',
    body:
      'Análisis del estado actual, mapeo de los reportes existentes, plan de migración por olas y operación en paralelo durante la transición. El valor: independencia de licencias, mejor rendimiento y mayor flexibilidad de integración.',
  },
];
