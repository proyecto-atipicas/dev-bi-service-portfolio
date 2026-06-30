/**
 * Rutas de adopción empaquetadas: formas de empezar y de adoptar BI con
 * alcance y nivel de compromiso acotados. Van de la exploración de bajo
 * riesgo (Descubrimiento BI) a la plataforma completa y la migración.
 */

export type Journey = {
  /** Clase Tailwind de color para el borde-acento, p. ej. "border-l-sky-400". */
  accent: string;
  /** Nombre de la ruta. */
  name: string;
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
    name: 'Descubrimiento BI',
    tags: ['Entrada', 'Bajo riesgo'],
    target: 'Proyectos nuevos que quieren saber qué aporta BI antes de invertir en grande.',
    body:
      'Auditoría de fuentes, prototipo navegable y hoja de ruta priorizada. Inversión acotada y aprendizaje garantizado.',
  },
  {
    accent: 'border-l-blue-400',
    name: 'Tablero exprés',
    tags: ['Un caso de uso', 'Valor rápido'],
    target: 'Proyectos con un caso de uso claro que necesitan un resultado visible pronto.',
    body:
      'Un tablero de principio a fin —modelado, datos, visualización y despliegue— para una dirección de negocio.',
  },
  {
    accent: 'border-l-blue-600',
    name: 'Plataforma BI completa',
    tags: ['Implementación completa', 'Plurianual'],
    target: 'Proyectos que adoptan BI como capacidad permanente, con varios casos de uso.',
    body:
      'Los tres pilares activos: datos, modelo semántico, 4–6 tableros, gobernanza y capacitación. Con 4 KPIs contractuales.',
  },
  {
    accent: 'border-l-emerald-500',
    name: 'BI Embebido B2B',
    tags: ['Producto del cliente', 'Premium'],
    target: 'Negocios que ofrecen información a terceros y necesitan el tablero dentro de su producto.',
    body:
      'El patrón SIMAE generalizado: tableros embebidos, marca blanca, autenticación contextual y datos en vivo.',
  },
  {
    accent: 'border-l-amber-500',
    name: 'Migración BI',
    tags: ['Desde lo heredado', 'Tecnología propia'],
    target: 'Proyectos con BI heredado (Excel, Tableau, Looker) o con límites de licencia en Power BI.',
    body:
      'Diagnóstico, mapeo de reportes, migración por olas y operación en paralelo. Ganas independencia de licencias y rendimiento.',
  },
];
