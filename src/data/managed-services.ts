/**
 * Servicios continuos (managed): operación recurrente sobre proyectos ya
 * atendidos por la Suite BI. Delegan la operación, la optimización y la
 * evolución del portafolio de tableros con cadencias acordadas.
 */

export type ManagedService = {
  /** Nombre del servicio continuo. */
  name: string;
  /** Cadencia o recurrencia, p. ej. "Mensual recurrente". */
  cadence: string;
  /** A quién va dirigido. */
  target: string;
  /** Qué incluye. */
  includes: string;
};

export const managedServices: ManagedService[] = [
  {
    name: 'Operación BI gestionada',
    cadence: 'Mensual recurrente',
    target: 'Proyectos ya atendidos por la Suite BI que quieren delegar la operación.',
    includes:
      'Monitoreo, gestión de incidencias, refresco de datos y soporte de primer nivel, con SLA por contrato.',
  },
  {
    name: 'Optimización continua',
    cadence: 'Ciclos trimestrales',
    target: 'Tableros en producción con lentitud, baja adopción o desviación de datos.',
    includes:
      'Análisis de rendimiento, optimización de DAX y consultas, y ajuste de KPIs según el negocio.',
  },
  {
    name: 'Soporte y guardia',
    cadence: 'Mensual',
    target: 'Tableros críticos como eventos en vivo o picos estacionales.',
    includes:
      'Cobertura de guardia 24/7 en ventanas críticas, con tiempo de respuesta garantizado.',
  },
  {
    name: 'Evolución del portafolio',
    cadence: 'Anual',
    target: 'Relaciones de largo plazo que quieren ampliar el uso de BI año tras año.',
    includes:
      'Revisión estratégica, nuevos casos, retiro de tableros sin uso y plan de inversión.',
  },
];
