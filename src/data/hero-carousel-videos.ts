/** Clips de fondo del hero (orden de reproducción del carrusel). */
export interface HeroCarouselClip {
  src: string;
  /** Texto para `aria-label` del vídeo. */
  ariaLabel: string;
}

export const heroCarouselVideos: HeroCarouselClip[] = [
  { src: '/carrucel/hero_carrucel_v1_tablero_simae.mp4', ariaLabel: 'Tablero SIMAE' },
  { src: '/carrucel/hero_carrucel_v1_ojo_de_aguila.mp4', ariaLabel: 'Ojo de Aguila' },
  {
    src: '/carrucel/hero_carrucel_v1_historico_presidencia_ojodeaguila.mp4',
    ariaLabel: 'Histórico de resultados presidenciales',
  },
  {
    src: '/carrucel/hero_carrucel_v1_historico_territoriales_ojodeaguila.mp4',
    ariaLabel: 'Histórico de resultados territoriales',
  },
  {
    src: '/carrucel/hero_carrucel_v1_tableros_elecciones_powerbi.mp4',
    ariaLabel: 'Tableros electorales en Power BI',
  },
  { src: '/carrucel/hero_carrucel_v1_appbi.mp4', ariaLabel: 'Ejemplo de aplicación BI' },
  { src: '/carrucel/hero_carrucel_v1_bot-bi.mp4', ariaLabel: 'Ejemplo de bot de BI' },
  { src: '/carrucel/hero_carrucel_v1_credenciales.mp4', ariaLabel: 'Ejemplo de credenciales' },
  { src: '/carrucel/hero_carrucel_v1_seguimiento-data.mp4', ariaLabel: 'Seguimiento de datos' },
];
