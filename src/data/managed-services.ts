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
      'Monitoreo de disponibilidad, gestión de incidencias, refresco de datos y soporte de primer nivel, con SLA por contrato.',
  },
  {
    name: 'Optimización continua',
    cadence: 'Ciclos trimestrales',
    target: 'Tableros en producción con lentitud, baja adopción o data drift.',
    includes:
      'Análisis de rendimiento, optimización de DAX y consultas, revisión de la adopción y ajuste de KPIs según la evolución del negocio.',
  },
  {
    name: 'Soporte y on-call',
    cadence: 'Mensual',
    target: 'Tableros críticos como eventos en vivo o picos estacionales.',
    includes:
      'Cobertura on-call 24/7 durante las ventanas críticas, tiempo de respuesta garantizado y sala de crisis virtual cuando aplica.',
  },
  {
    name: 'Evolución del portafolio',
    cadence: 'Anual',
    target: 'Relaciones de largo plazo que quieren ampliar el uso de BI año tras año.',
    includes:
      'Revisión estratégica, identificación de nuevos casos, retiro de tableros sin uso y plan de inversión para el siguiente ciclo.',
  },
];
