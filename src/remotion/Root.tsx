import { Composition } from 'remotion';
import { TestVideo } from './TestVideo';
import { HeroVideo } from './HeroVideo';
import { SimaeHeroVideo } from './SimaeHeroVideo';
import { AutomatizacionVideo } from './AutomatizacionVideo';
import { ReporteriaVideo } from './ReporteriaVideo';
import { DesarrolloVideo } from './DesarrolloVideo';
import { BasesDatosVideo } from './BasesDatosVideo';
import {
  ToolCarouselHero,
  type CarouselAsset,
  type ToolCarouselHeroProps,
} from './ToolCarouselHero';
import {
  OjoDeAguilaHero,
  OJO_DE_AGUILA_HERO_DURATION,
} from './OjoDeAguilaHero';

const ROOT = 'herraminetas_imagenes_videos';

const carrucelTools: Array<{
  id: string;
  durationInFrames: number;
  sceneDuration: number;
  assets: CarouselAsset[];
}> = [
  {
    id: 'CarrucelAppbi',
    sceneDuration: 84,
    durationInFrames: 84 + 72 + 72,
    assets: [
      { kind: 'image', src: `${ROOT}/appbi/login_appbi.png` },
      { kind: 'image', src: `${ROOT}/appbi/dashboard_appbi.png` },
      { kind: 'video', src: `${ROOT}/appbi/appbi_seguimiento.mp4` },
    ],
  },
  {
    id: 'CarrucelBotBi',
    sceneDuration: 90,
    durationInFrames: 90 + 78,
    assets: [
      { kind: 'image', src: `${ROOT}/bot-bi/botbi_login_token.png` },
      { kind: 'image', src: `${ROOT}/bot-bi/cargadatos.png` },
    ],
  },
  {
    id: 'CarrucelCredenciales',
    sceneDuration: 90,
    durationInFrames: 90 + 78,
    assets: [
      { kind: 'image', src: `${ROOT}/credenciales/dashboard.png` },
      { kind: 'image', src: `${ROOT}/credenciales/descarga_credenciales.png` },
    ],
  },
  {
    id: 'CarrucelHistoricoPresidencia',
    sceneDuration: 90,
    durationInFrames: 90 + 78,
    assets: [
      {
        kind: 'image',
        src: `${ROOT}/historico_presidencia_ojodeaguila/dashboard.png`,
      },
      {
        kind: 'image',
        src: `${ROOT}/historico_presidencia_ojodeaguila/versus.png`,
      },
    ],
  },
  {
    id: 'CarrucelHistoricoTerritoriales',
    sceneDuration: 90,
    durationInFrames: 90 + 78,
    assets: [
      {
        kind: 'image',
        src: `${ROOT}/historico_territoriales_ojodeaguila/impacto_socioeconomico.png`,
      },
      {
        kind: 'image',
        src: `${ROOT}/historico_territoriales_ojodeaguila/versus.png`,
      },
    ],
  },
  {
    id: 'CarrucelSeguimientoData',
    sceneDuration: 90,
    durationInFrames: 90 + 78,
    assets: [
      { kind: 'image', src: `${ROOT}/seguimiento-data/analisis_tableros_powerbi.png` },
      { kind: 'image', src: `${ROOT}/seguimiento-data/trackingjobs.png` },
    ],
  },
  {
    id: 'CarrucelTablerosElecciones',
    sceneDuration: 84,
    durationInFrames: 84 + 72 + 72,
    assets: [
      {
        kind: 'image',
        src: `${ROOT}/tableros_elecciones_powerbi/1405_consulados_simae_logico.png`,
      },
      {
        kind: 'image',
        src: `${ROOT}/tableros_elecciones_powerbi/1504_mesasincobertura_consulados.png`,
      },
      {
        kind: 'video',
        src: `${ROOT}/tableros_elecciones_powerbi/tablero_logico_presidencia.mp4`,
      },
    ],
  },
  {
    id: 'CarrucelTableroSimae',
    sceneDuration: 84,
    durationInFrames: 84 + 72 + 72,
    assets: [
      { kind: 'image', src: `${ROOT}/Tablero SIMAE/1405_image1.png` },
      { kind: 'image', src: `${ROOT}/Tablero SIMAE/1405_image2.png` },
      { kind: 'video', src: `${ROOT}/Tablero SIMAE/video_tablerosimae.mp4` },
    ],
  },
];

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="HeroVideo"
        component={HeroVideo}
        durationInFrames={210}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="SimaeHeroVideo"
        component={SimaeHeroVideo}
        durationInFrames={320}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="AutomatizacionVideo"
        component={AutomatizacionVideo}
        durationInFrames={270}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="ReporteriaVideo"
        component={ReporteriaVideo}
        durationInFrames={270}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="DesarrolloVideo"
        component={DesarrolloVideo}
        durationInFrames={240}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="BasesDatosVideo"
        component={BasesDatosVideo}
        durationInFrames={270}
        fps={30}
        width={1280}
        height={720}
      />
      <Composition
        id="TestVideo"
        component={TestVideo}
        durationInFrames={150}
        fps={30}
        width={1920}
        height={1080}
      />

      <Composition
        id="CarrucelOjoDeAguila"
        component={OjoDeAguilaHero}
        durationInFrames={OJO_DE_AGUILA_HERO_DURATION}
        fps={30}
        width={1280}
        height={720}
      />

      {carrucelTools.map((t) => (
        <Composition<ToolCarouselHeroProps>
          key={t.id}
          id={t.id}
          component={ToolCarouselHero}
          durationInFrames={t.durationInFrames}
          fps={30}
          width={1280}
          height={720}
          defaultProps={{
            assets: t.assets,
            sceneDuration: t.sceneDuration,
            accent: 'cyan',
          }}
        />
      ))}
    </>
  );
};
