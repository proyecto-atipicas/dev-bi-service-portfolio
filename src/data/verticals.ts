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
        desc: 'Datos en vivo de la operación, con coloreado semafórico por nivel territorial y drill-down que preserva el contexto.',
      },
      {
        name: 'Centro de monitoreo de jornadas',
        desc: 'Tablero de comando para los días críticos, con simulacros de carga previos, equipo on-call y plan de contingencia documentado.',
      },
      {
        name: 'Visualización geoespacial multinivel',
        desc: 'Mapas interactivos con drill-down de departamento a municipio y a puesto, optimizados para volúmenes nacionales.',
      },
      {
        name: 'Embebido seguro institucional',
        desc: 'Integración en los portales del cliente con autenticación contextual, tokens de corta duración e identidad gráfica oficial.',
      },
    ],
    proof: {
      title: 'SIMAE para el CNE · Presidenciales 2026',
      desc: '156.564 actores registrados y 122.016 mesas en 33 departamentos. Cero incidentes mayores en la jornada, 100 % de cumplimiento contractual y 96,7 % de Excelencia Operativa A.C.E. en la primera vuelta presidencial.',
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
      'Retailers grandes con datos transaccionales',
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
        desc: 'Algoritmos estadísticos y de machine learning sobre alto volumen, con precisión ≥ 90 % en validación.',
      },
      {
        name: 'Tableros de riesgo y exposición',
        desc: 'Vista consolidada del portafolio para riesgo, tesorería y dirección, con drill-down por producto, segmento y geografía.',
      },
      {
        name: 'Embedded analytics en apps del cliente final',
        desc: 'Tableros embebidos en la app móvil o web del cliente final, coherentes con la marca del banco.',
      },
      {
        name: 'Reportes regulatorios automatizados',
        desc: 'Generación periódica de reportes para los entes de control, con trazabilidad de cifras y firma electrónica cuando aplica.',
      },
    ],
    proof: {
      title: 'Núcleo técnico transferible desde lo electoral',
      desc: 'El motor de detección de atípicas y la arquitectura de embebido seguro desarrollados y certificados para SIMAE son directamente adaptables al sector financiero. Reduce de forma significativa el tiempo y el riesgo de implementación frente a empezar de cero.',
    },
    metrics: [
      'Reducción del tiempo de detección de patrones críticos',
      'Precisión del scoring ≥ 90 % en validación',
      'Adopción del embedded analytics por el cliente final del banco',
    ],
  },
  {
    id: 'operaciones',
    name: 'Operaciones, Logística y Manufactura',
    shortLabel: 'Operaciones',
    tagline: 'Un centro de control con visibilidad en tiempo real sobre redes operacionales complejas.',
    status: 'Metodología validada',
    statusType: 'priority',
    accent: 'amber',
    iconPath: 'M3 8h10v8H3zM13 11h4l3 3v2h-7M7.5 19a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Zm9 0a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3Z',
    targets: [
      'Empresas logísticas y de transporte (terrestre, courier, marítimo)',
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
        desc: 'Un tablero único que consolida KPIs, alertas, mapas y la cola de decisiones operativas. Reemplaza la dispersión de Excel y reportes inconexos.',
      },
      {
        name: 'Marco de KPIs operacionales en 4 dimensiones',
        desc: 'Marco estandarizado —velocidad, calidad, eficiencia e impacto al negocio— con umbrales semafóricos y un único responsable por KPI.',
      },
      {
        name: 'Análisis geoespacial de rutas y red',
        desc: 'Visualización de cobertura, identificación de zonas críticas y optimización de capacidad por nivel territorial.',
      },
      {
        name: 'Sistema de alertas multitier',
        desc: 'Reglas configurables con criterios cuantitativos, escalamiento automático por severidad e integración con los canales del cliente.',
      },
    ],
    proof: {
      title: 'Metodología propia validada internamente',
      desc: 'El Centro de Control desarrollado para gestionar nuestros 4 KPIs contractuales en el proyecto Operaciones 360 es una metodología probada y replicable. Su estructura, plantillas y marco están listos para adaptarse al cliente.',
    },
    metrics: [
      'Cumplimiento de SLA por servicio',
      'Tiempo entre detección y mitigación de incidencias',
      'Visibilidad consolidada sobre una operación dispersa',
    ],
  },
  {
    id: 'comercial',
    name: 'Comercial, Ventas y Customer Analytics',
    shortLabel: 'Comercial',
    tagline: 'Tableros que dejan de ser reportes y se vuelven herramientas de uso diario.',
    status: 'Diseño listo',
    statusType: 'next',
    accent: 'sky',
    iconPath: 'M3 17l5-5 4 4 8-8M21 8v5h-5',
    targets: [
      'Empresas B2B con ciclos de venta largos y pipeline complejo',
      'E-commerce y retail digital de volumen medio a alto',
      'SaaS LATAM en fase de escala con foco en customer success',
      'Compañías con modelos de suscripción e ingresos recurrentes',
    ],
    pains: [
      'Visibilidad del pipeline y precisión del forecast a 90 días',
      'Análisis de cohortes, CLV y retención sin instrumentación',
      'Predicción de churn con ventana de acción suficiente',
      'Tableros comerciales genéricos que no logran adopción del equipo',
    ],
    offerings: [
      {
        name: 'Tableros ejecutivos de pipeline y forecast',
        desc: 'Vista de la dirección comercial con drill-down a la oportunidad individual, métricas de salud del pipeline y proyección probabilística.',
      },
      {
        name: 'Análisis de cohortes y CLV',
        desc: 'Visualización temporal del comportamiento de cohortes y del customer lifetime value por segmento y canal.',
      },
      {
        name: 'Modelos de churn prediction',
        desc: 'Scoring de probabilidad de baja con ventana de acción configurable e integración con los flujos de customer success.',
      },
      {
        name: 'Embebido en CRMs comerciales',
        desc: 'Integración nativa con el CRM del cliente (Salesforce, HubSpot u otros) para que los comerciales no cambien de herramienta.',
      },
    ],
    proof: {
      title: 'Diferenciación por experiencia, no por reporte',
      desc: 'El mercado de BI comercial está saturado de tableros genéricos. La ventaja está en combinar la visualización interactiva con el embebido contextual que validamos en SIMAE, aplicada al mundo comercial.',
    },
    metrics: [
      'Precisión del forecast a 90 días',
      'Reducción de churn por intervención temprana',
      'Adopción medida en sesiones activas del equipo comercial',
    ],
  },
];
