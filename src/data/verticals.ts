/**
 * Verticales especializados: sectores donde el área aplica los pilares de
 * capacidad con una propuesta diferenciada y evidencia. Cada vertical describe
 * el perfil del cliente, los dolores que atiende, sus ofertas insignia, la
 * evidencia disponible y las métricas de valor.
 *
 * El estado (`statusType`) refleja la madurez: `active` (probado en producción),
 * `priority` (capacidad/metodología lista) y `next` (diseño listo).
 */

export type VerticalStatus = 'active' | 'priority' | 'next';

/** Clave de acento cromático; se mapea a clases Tailwind en el componente. */
export type VerticalAccent = 'blue' | 'emerald' | 'amber' | 'sky';

export type VerticalOffering = {
  name: string;
  desc: string;
};

export type VerticalProof = {
  title: string;
  desc: string;
};

export type Vertical = {
  /** Identificador para anclas y para las pestañas. */
  id: string;
  /** Nombre completo de la vertical. */
  name: string;
  /** Etiqueta corta para el chip de la sub-nav. */
  shortLabel: string;
  /** Frase de posicionamiento. */
  tagline: string;
  /** Texto del estado/madurez. */
  status: string;
  statusType: VerticalStatus;
  accent: VerticalAccent;
  /** Path SVG (viewBox 24×24, stroke) del icono de la vertical. */
  iconPath: string;
  /** Perfil del cliente al que se dirige. */
  targets: string[];
  /** Dolores que atendemos. */
  pains: string[];
  /** Ofertas insignia. */
  offerings: VerticalOffering[];
  /** Evidencia de respaldo. */
  proof: VerticalProof;
  /** Métricas de valor. */
  metrics: string[];
  /** Ancla interna opcional con la evidencia viva (p. ej. "#evidencia"). */
  evidenceHref?: string;
};

export const verticals: Vertical[] = [
  {
    id: 'electoral',
    name: 'Electoral y Gubernamental',
    shortLabel: 'Electoral',
    tagline: 'Información oficial confiable, en vivo y ante múltiples observadores.',
    status: 'Probado en producción · SIMAE',
    statusType: 'active',
    accent: 'blue',
    iconPath: 'M12 3 4 6v5c0 4.2 3.1 7.4 8 8.7 4.9-1.3 8-4.5 8-8.7V6l-8-3Zm-2.3 8.3 1.7 1.7 3.2-3.4',
    targets: [
      'Autoridades electorales (CNE, Registraduría)',
      'Superintendencias y entidades de control',
      'Gobiernos territoriales y entidades estadísticas oficiales',
      'Organismos internacionales con observación en Colombia',
    ],
    pains: [
      'Picos extremos de demanda en ventanas críticas como las jornadas electorales',
      'Necesidad de transparencia auditable ante observadores múltiples',
      'Reporte territorial multinivel: departamento, municipio, puesto y mesa',
      'Embebido seguro en portales institucionales con identidad gráfica propia',
    ],
    offerings: [
      {
        name: 'Tablero de cobertura territorial en tiempo real',
        desc: 'Datos en vivo con semáforo por nivel territorial y desglose que preserva el contexto.',
      },
      {
        name: 'Centro de monitoreo de jornadas',
        desc: 'Tablero de comando para los días críticos, con simulacros de carga y equipo de guardia.',
      },
      {
        name: 'Visualización geoespacial multinivel',
        desc: 'Mapas interactivos con desglose de departamento a puesto, optimizados para volúmenes nacionales.',
      },
      {
        name: 'Embebido seguro institucional',
        desc: 'Integración en portales del cliente con autenticación contextual e identidad gráfica oficial.',
      },
    ],
    proof: {
      title: 'SIMAE para el CNE · Presidenciales 2026',
      desc: '156.564 actores y 122.016 mesas en 33 departamentos. Cero incidentes mayores y 100 % de cumplimiento contractual.',
    },
    metrics: [
      'Disponibilidad en ventana crítica ≥ 99,5 %',
      'Tiempo entre evento y visualización < 5 segundos',
      'Trazabilidad completa de la jornada para auditoría posterior',
    ],
    evidenceHref: '#evidencia',
  },
  {
    id: 'financiero',
    name: 'Financiero y de Consumo',
    shortLabel: 'Financiero',
    tagline: 'Detección de patrones críticos y experiencias embebidas para el cliente final.',
    status: 'Capacidad técnica lista',
    statusType: 'priority',
    accent: 'emerald',
    iconPath: 'M12 2v20M16.5 6.5H10a3 3 0 0 0 0 6h4a3 3 0 0 1 0 6H7',
    targets: [
      'Bancos comerciales y cooperativas financieras',
      'Fintechs en etapa de escala',
      'Aseguradoras y compañías de crédito de consumo',
      'Grandes minoristas con datos transaccionales',
    ],
    pains: [
      'Detección de fraude y comportamiento atípico transaccional en tiempo real',
      'Reporte regulatorio recurrente ante la Superfinanciera y otros entes',
      'Necesidad de ofrecer tableros al cliente final desde la app o el portal',
      'Análisis de portafolio, exposición de riesgo y comportamiento de cohortes',
    ],
    offerings: [
      {
        name: 'Motor de detección de atípicas transaccionales',
        desc: 'Algoritmos estadísticos y de aprendizaje automático con precisión ≥ 90 % en validación.',
      },
      {
        name: 'Tableros de riesgo y exposición',
        desc: 'Vista consolidada del portafolio con desglose por producto, segmento y geografía.',
      },
      {
        name: 'Analítica embebida en apps del cliente final',
        desc: 'Tableros embebidos en la app del cliente final, con la marca del banco.',
      },
      {
        name: 'Reportes regulatorios automatizados',
        desc: 'Reportes periódicos para los entes de control, con trazabilidad de cifras y firma electrónica.',
      },
    ],
    proof: {
      title: 'Núcleo técnico transferible desde lo electoral',
      desc: 'El motor de detección de atípicas y el embebido seguro certificados en SIMAE se adaptan directo al sector financiero, con menos tiempo y riesgo.',
    },
    metrics: [
      'Reducción del tiempo de detección de patrones críticos',
      'Precisión de la puntuación ≥ 90 % en validación',
      'Adopción de la analítica embebida por el cliente final',
    ],
  },
  {
    id: 'operaciones',
    name: 'Operaciones, Logística y Manufactura',
    shortLabel: 'Operaciones',
    tagline: 'Un centro de control con visibilidad en tiempo real sobre operaciones complejas.',
    status: 'Metodología validada',
    statusType: 'priority',
    accent: 'amber',
    iconPath: 'M3 8h10v8H3zM13 11h4l3 3v2h-7M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    targets: [
      'Empresas de logística y transporte (terrestre, mensajería, marítimo)',
      'Manufactureras con cadenas multinivel',
      'Operadores de servicios públicos (energía, agua, telecomunicaciones)',
      'Empresas con flotas o redes territoriales extensas',
    ],
    pains: [
      'Visibilidad operacional fragmentada entre sistemas heredados',
      'KPIs de SLA y disponibilidad sin instrumentación unificada',
      'Análisis geoespacial de rutas, cobertura y capacidad de red',
      'Necesidad de centros de control con alertas en múltiples niveles',
    ],
    offerings: [
      {
        name: 'Centro de Control operacional integral',
        desc: 'Un tablero único con KPIs, alertas y mapas que reemplaza la dispersión de Excel y reportes inconexos.',
      },
      {
        name: 'Marco de KPIs operacionales en 4 dimensiones',
        desc: 'Velocidad, calidad, eficiencia e impacto al negocio, con umbrales semafóricos y un responsable por KPI.',
      },
      {
        name: 'Análisis geoespacial de rutas y red',
        desc: 'Cobertura, zonas críticas y optimización de capacidad por nivel territorial.',
      },
      {
        name: 'Sistema de alertas multinivel',
        desc: 'Reglas configurables con escalamiento automático por severidad e integración con los canales del cliente.',
      },
    ],
    proof: {
      title: 'Metodología propia validada internamente',
      desc: 'El Centro de Control que gestiona nuestros 4 KPIs contractuales en Operaciones 360 es una metodología probada y replicable, lista para adaptarse al cliente.',
    },
    metrics: [
      'Cumplimiento de SLA por servicio',
      'Tiempo entre detección y mitigación de incidencias',
      'Visibilidad consolidada sobre una operación dispersa',
    ],
  },
  {
    id: 'comercial',
    name: 'Comercial, Ventas y Analítica de Clientes',
    shortLabel: 'Comercial',
    tagline: 'Tableros que dejan de ser reportes y se vuelven herramientas de uso diario.',
    status: 'Diseño listo',
    statusType: 'next',
    accent: 'sky',
    iconPath: 'M3 17l5-5 4 4 8-8M21 8v5h-5',
    targets: [
      'Empresas B2B con ciclos de venta largos y embudo complejo',
      'Comercio electrónico y venta digital de volumen medio a alto',
      'SaaS de Latinoamérica en escala, con foco en el éxito del cliente',
      'Compañías con modelos de suscripción e ingresos recurrentes',
    ],
    pains: [
      'Visibilidad del embudo y precisión del pronóstico a 90 días',
      'Análisis de cohortes, valor del cliente y retención sin instrumentación',
      'Predicción de fuga con ventana de acción suficiente',
      'Tableros comerciales genéricos que no logran adopción del equipo',
    ],
    offerings: [
      {
        name: 'Tableros ejecutivos de embudo y pronóstico',
        desc: 'Vista de la dirección con desglose a la oportunidad, salud del embudo y proyección probabilística.',
      },
      {
        name: 'Análisis de cohortes y valor del cliente',
        desc: 'Comportamiento de cohortes y valor del cliente por segmento y canal.',
      },
      {
        name: 'Modelos de predicción de fuga',
        desc: 'Puntuación de probabilidad de baja, integrada con los flujos de éxito del cliente.',
      },
      {
        name: 'Embebido en el CRM comercial',
        desc: 'Integración nativa con el CRM del cliente (Salesforce, HubSpot) para no cambiar de herramienta.',
      },
    ],
    proof: {
      title: 'Diferenciación por experiencia, no por reporte',
      desc: 'El BI comercial está saturado de tableros genéricos. La ventaja está en combinar visualización interactiva con el embebido contextual que validamos en SIMAE.',
    },
    metrics: [
      'Precisión del pronóstico a 90 días',
      'Reducción de la fuga por intervención temprana',
      'Adopción medida en sesiones activas del equipo comercial',
    ],
  },
];
