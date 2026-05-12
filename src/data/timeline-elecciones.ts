/**
 * Datos de la línea de tiempo vertical de elecciones atípicas, Congreso 2026 y
 * Presidencia 2026. Cada evento documenta una elección con la fecha real, los
 * tableros publicados y, cuando aplica, el carácter de "hito" de la jornada.
 *
 * Las elecciones sin tableros publicados aparecen con `embeds: []`. La línea de
 * tiempo respeta esa lista vacía y muestra un estado de "pendiente de
 * publicación" para que más adelante solo sea cuestión de agregar entradas.
 */

export type TimelineEmbedKind = 'iframe' | 'image' | 'video' | 'link';

export type TimelineEmbed = {
  kind: TimelineEmbedKind;
  /** Título mostrado encima del embebido (p. ej. nombre del tablero). */
  title: string;
  /** URL del recurso (Power BI, imagen, video, link genérico). */
  url: string;
  /** Subtítulo o nombre corto de la sección. Opcional. */
  subtitle?: string;
  /** Descripción breve de 1-2 renglones; se muestra junto al embebido. */
  description?: string;
};

export type TimelineEvent = {
  id: string;
  /** Nombre de la elección (sin la palabra "Despliegue"). */
  title: string;
  /** Fecha en formato ISO (YYYY-MM-DD) — usado para orden y `<time datetime>`. */
  date: string;
  /** Etiqueta legible (p. ej. "17 de agosto de 2025"). */
  dateLabel: string;
  /** Lugar / región vinculada a la elección, opcional. */
  location?: string;
  /** Marca un evento como hito (Congreso 2026, Presidencia 2026). */
  isHito?: boolean;
  /** Resumen del proyecto / contexto de la jornada. */
  description?: string;
  /** Recursos embebidos asociados al evento. Vacío = pendiente de publicar. */
  embeds: TimelineEmbed[];
};

const pbiEmbed = (
  title: string,
  url: string,
  description: string,
  subtitle?: string,
): TimelineEmbed => ({ kind: 'iframe', title, url, description, subtitle });

export const electionTimeline: TimelineEvent[] = [
  {
    id: 'melgar-2025',
    title: 'Atípica de Melgar',
    date: '2025-08-17',
    dateLabel: '17 de agosto de 2025',
    location: 'Melgar, Tolima',
    description:
      'Primera atípica del ciclo: marcó la línea base de los tableros de seguimiento de jornada electoral del área de BI.',
    embeds: [
      pbiEmbed(
        'Tablero Melgar',
        `https://app.powerbi.com/view?r=eyJrIjoiYjg5MzM0NWItMjg1Yy00Y2EzLTgwYjMtYzI3Y2NhNThhNzNmIiwidCI6IjRiZjM4ZWEyLTgzMmQtNDU1Mi1iNTA4LTQyMTU3MGRhNDNmZiIsImMiOjR9`,
        'Vista integral de la jornada en Melgar con métricas de mesa, puesto y participación.',
        'Power BI · Melgar',
      ),
    ],
  },
  {
    id: 'cmj-2025',
    title: 'CMJ',
    date: '2025-10-19',
    dateLabel: '19 de octubre de 2025',
    description:
      'Despliegue del Consejo Municipal de Juventudes (CMJ): se sumaron tableros de SOC, Moodle, redes sociales y actores electorales.',
    embeds: [
      pbiEmbed(
        'Tablero SOC',
        'https://app.powerbi.com/view?r=eyJrIjoiMTkwOGZkOTAtY2Q3Yi00MzYyLWI3MDktMjU2NjdhMDA1MDY5IiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Centro de operaciones de seguridad: incidencias y eventos durante la jornada.',
        'Power BI · SOC',
      ),
      pbiEmbed(
        'Tablero Moodle',
        'https://app.powerbi.com/view?r=eyJrIjoiOTNhM2I5NjMtMzcwMC00NzI5LTg1ZTItMzM3ODAzODYzMmQ2IiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Avance y consumo de las capacitaciones publicadas para la jornada.',
        'Power BI · Capacitaciones',
      ),
      pbiEmbed(
        'Tablero Redes Sociales',
        'https://app.powerbi.com/view?r=eyJrIjoiYjEwMmEzYzctN2FlYy00Yzk3LTljOTYtNTJkM2FlOGMxNmU5IiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Escucha activa y métricas de conversación digital alrededor de la jornada.',
        'Power BI · Redes Sociales',
      ),
      pbiEmbed(
        'Tablero Actores Electorales',
        'https://app.powerbi.com/view?r=eyJrIjoiODRlNGU4NzAtNmQ5YS00ODhhLTg5ZDctNjE4YmMxNGQzZTM0IiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Mapeo y distribución de actores electorales dispuestos en territorio.',
        'Power BI · Actores Electorales',
      ),
    ],
  },
  {
    id: 'consulta-partidos-2025',
    title: 'Consulta Partidos',
    date: '2025-10-26',
    dateLabel: '26 de octubre de 2025',
    description:
      'Despliegue completo de la consulta interna de partidos: testigos en mobile, mapa general, presidencia, Senado y Cámara.',
    embeds: [
      pbiEmbed(
        'Testigos Mobile',
        'https://app.powerbi.com/view?r=eyJrIjoiNjU2OTIxNDMtYWI0Yi00MDBkLTgzZWUtMzY5NDY2N2IzMjYzIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Vista responsiva orientada a la operación móvil de testigos electorales.',
        'Power BI · Testigos Mobile',
      ),
      pbiEmbed(
        'Tablero Presidencia',
        'https://app.powerbi.com/view?r=eyJrIjoiOTA1NGVmOGMtNGM5Ny00NTY3LWE1MTAtNjIyY2ViN2YzMWIxIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Lectura de resultados de la consulta de presidencia con cortes territoriales.',
        'Power BI · Presidencia',
      ),
      pbiEmbed(
        'Tablero Mapa General',
        'https://app.powerbi.com/view?r=eyJrIjoiOGUxNmFmZjYtMDczZS00MDNlLThhNGQtM2MzYjAyODYxZmFhIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Mapa nacional con resultados consolidados por departamento y municipio.',
        'Power BI · Mapa General',
      ),
      pbiEmbed(
        'Tablero Senado y Cámara',
        'https://app.powerbi.com/view?r=eyJrIjoiZmRmOWMyZjYtMmQyMC00MTAyLWIyZjgtNDdlN2YyZjI5NzRiIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Análisis cruzado de Senado y Cámara con detalle por listas y candidaturas.',
        'Power BI · Senado y Cámara',
      ),
      pbiEmbed(
        'Tablero General de Testigos',
        'https://app.powerbi.com/view?r=eyJrIjoiOTIwNDMyNTktMzIwMi00ZTA5LWEzNjMtNDRjZTIwODI4OGViIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Visión integral de cobertura, ubicación y reporte de testigos en territorio.',
        'Power BI · Testigos · Vista General',
      ),
    ],
  },
  {
    id: 'atipica-villeta-2025',
    title: 'Atípica de Villeta',
    date: '2025-11-09',
    dateLabel: '9 de noviembre de 2025',
    location: 'Villeta, Cundinamarca',
    description:
      'Atípica que consolidó la plantilla de tableros locales: vista municipal y vista general en un mismo flujo.',
    embeds: [
      pbiEmbed(
        'Tablero Atípicas Villeta',
        'https://app.powerbi.com/view?r=eyJrIjoiYTZmODcxYWUtMmI0YS00OGVkLWIzMDAtODg1ZTJlNDE2ZDVhIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Cierre municipal de Villeta con métricas de mesa, puesto y participación.',
        'Power BI · Villeta',
      ),
      pbiEmbed(
        'Tablero General Atípicas Villeta',
        'https://app.powerbi.com/view?r=eyJrIjoiODAyMzVkMGUtNTg5MS00YjAzLWFkYjUtOGQ4NWZiMmMwNDAzIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Vista general consolidada de la atípica con cortes ejecutivos para la mesa de seguimiento.',
        'Power BI · Villeta · Vista General',
      ),
    ],
  },
  {
    id: 'atipica-magdalena-2025',
    title: 'Atípica de Magdalena',
    date: '2025-11-23',
    dateLabel: '23 de noviembre de 2025',
    location: 'Magdalena',
    description:
      'Atípica departamental: profundización de la vista cruzada entre tablero local y vista general.',
    embeds: [
      pbiEmbed(
        'Tablero Atípicas Magdalena',
        'https://app.powerbi.com/view?r=eyJrIjoiMWQ5ZTU0ZTUtZWQ5YS00YWIxLTgxMTEtZDc5OTBkNWQyMDU0IiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Resultados y cobertura de la atípica de Magdalena.',
        'Power BI · Magdalena',
      ),
      pbiEmbed(
        'Tablero General Atípicas Magdalena',
        'https://app.powerbi.com/view?r=eyJrIjoiZTRiYWU3NGEtY2E0Zi00YzAxLWIyNDUtZTM4ZDA0MzM4OThkIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Lectura ejecutiva de la jornada con cortes consolidados para la mesa de seguimiento.',
        'Power BI · Magdalena · Vista General',
      ),
    ],
  },
  {
    id: 'atipica-bucaramanga-2025',
    title: 'Atípica de Bucaramanga',
    date: '2025-12-14',
    dateLabel: '14 de diciembre de 2025',
    location: 'Bucaramanga, Santander',
    description:
      'Atípica de cierre de año en Bucaramanga: incorporación de mapa específico y vista general consolidada.',
    embeds: [
      pbiEmbed(
        'Tablero Mapa Bucaramanga',
        'https://app.powerbi.com/view?r=eyJrIjoiNDlmMDE0ZDEtZWM0NS00MzFjLTg1MGUtYWVmMTNiY2Y3MGY2IiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Mapa de la jornada en Bucaramanga con detalle por puesto de votación.',
        'Power BI · Bucaramanga · Mapa',
      ),
      pbiEmbed(
        'Tablero General Atípicas Bucaramanga',
        'https://app.powerbi.com/view?r=eyJrIjoiYTU1N2RiYWMtZjE4NC00NTMzLWE5ZjMtNjgzNzk3N2FlYTUxIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Vista general consolidada de la atípica para la mesa de seguimiento.',
        'Power BI · Bucaramanga · Vista General',
      ),
    ],
  },
  {
    id: 'atipica-giron-2026',
    title: 'Atípica de Girón',
    date: '2026-01-18',
    dateLabel: '18 de enero de 2026',
    location: 'Girón, Santander',
    description:
      'Primer despliegue del año: ajuste fino del modelo de datos heredado de Bucaramanga aplicado a Girón.',
    embeds: [
      pbiEmbed(
        'Tablero Girón',
        'https://app.powerbi.com/view?r=eyJrIjoiNzhkNmE5OGUtZWVmNC00Y2U2LTk3MWEtODRkZTkwN2M0YmE5IiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Resultados y cobertura de la atípica de Girón con cortes territoriales.',
        'Power BI · Girón',
      ),
    ],
  },
  {
    id: 'atipica-ponedera-2026',
    title: 'Atípica de Ponedera',
    date: '2026-02-01',
    dateLabel: '1 de febrero de 2026',
    location: 'Ponedera, Atlántico',
    description:
      'Atípica del Atlántico: consolidación del tablero municipal homologado con la familia de atípicas.',
    embeds: [
      pbiEmbed(
        'Tablero Ponedera',
        'https://app.powerbi.com/view?r=eyJrIjoiNjcxMmMyNTgtZjBkZC00YTFjLWIwMmUtYTM1ODU5Yjg4NTMzIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Resultados y cobertura de la atípica de Ponedera.',
        'Power BI · Ponedera',
      ),
    ],
  },
  {
    id: 'congreso-consultas-2026',
    title: 'Congreso y Consultas 2026',
    date: '2026-03-08',
    dateLabel: '8 de marzo de 2026',
    isHito: true,
    description:
      'Hito mayor del ciclo: elecciones de Congreso 2026 con tablero dedicado y tablero de consultas anidado.',
    embeds: [
      pbiEmbed(
        'Elecciones Congreso 2026',
        'https://app.powerbi.com/view?r=eyJrIjoiZDQ5MDQ4NjctNDU0ZC00ZjczLWI2Y2QtYWI5NzBkNWRlODk1IiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Lectura nacional de la jornada de Congreso 2026 con detalle por departamento y partido.',
        'Power BI · Congreso 2026',
      ),
      pbiEmbed(
        'Tablero Consultas 2026',
        'https://app.powerbi.com/view?r=eyJrIjoiOGU5ODFkZWEtMzg1Zi00YjFiLWIwMzYtZDQ5MDdmODA3YWJhIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Resultados de las consultas inter e intra partidistas asociadas a la jornada.',
        'Power BI · Consultas 2026',
      ),
    ],
  },
  {
    id: 'atipica-sitionuevo-2026',
    title: 'Atípica de Sitionuevo',
    date: '2026-04-19',
    dateLabel: '19 de abril de 2026',
    location: 'Sitionuevo, Magdalena',
    description:
      'Atípica posterior al hito de Congreso: tablero municipal con la lectura completa de la jornada.',
    embeds: [
      pbiEmbed(
        'Tablero Sitionuevo',
        'https://app.powerbi.com/view?r=eyJrIjoiNDRiMmVmZmQtZmI0ZS00NDgzLWE3MzYtNzRmODljMTAxY2RlIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Resultados y cobertura de la atípica de Sitionuevo, Magdalena.',
        'Power BI · Sitionuevo',
      ),
    ],
  },
  {
    id: 'atipica-fonseca-2026',
    title: 'Atípica de Fonseca',
    date: '2026-05-03',
    dateLabel: '3 de mayo de 2026',
    location: 'Fonseca, La Guajira',
    description:
      'Atípica de La Guajira con tablero municipal del despliegue.',
    embeds: [
      pbiEmbed(
        'Tablero Fonseca',
        'https://app.powerbi.com/view?r=eyJrIjoiNjRjYTk3MDgtODY2My00ZWVkLWIwMTgtOWYzZDQ4NmY3YTczIiwidCI6IjFiZmY4NTRkLWUwY2YtNDEwZi1iY2IwLWQ5NDkzNDQzMWU0MyIsImMiOjR9',
        'Resultados y cobertura de la atípica de Fonseca, La Guajira.',
        'Power BI · Fonseca',
      ),
    ],
  },
  {
    id: 'presidencia-2026',
    title: 'Presidencia y Vicepresidencia 2026',
    date: '2026-05-31',
    dateLabel: '31 de mayo de 2026',
    isHito: true,
    description:
      'Hito de cierre del ciclo: jornada nacional de Presidencia y Vicepresidencia, con tablero SIMAE de experiencia y tablero lógico.',
    embeds: [
      {
        kind: 'link',
        title: 'Tablero SIMAE',
        url: 'https://simae.actoreselectorales.com/',
        subtitle: 'Sistema Integral de Monitoreo y Analítica Electoral',
        description:
          'Tablero de experiencia que centraliza la lectura de la jornada presidencial; pendiente de embebido oficial.',
      },
      {
        kind: 'link',
        title: 'Tablero Lógico',
        url: '#',
        subtitle: 'Pendiente de publicación',
        description:
          'Tablero lógico operativo de la jornada presidencial; el enlace se publicará al cierre del despliegue.',
      },
    ],
  },
];

