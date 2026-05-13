import { Composition } from 'remotion';
import { TestVideo } from './TestVideo';
import { HeroVideo } from './HeroVideo';
import { SimaeHeroVideo } from './SimaeHeroVideo';
import { AutomatizacionVideo } from './AutomatizacionVideo';
import { ReporteriaVideo } from './ReporteriaVideo';
import { DesarrolloVideo } from './DesarrolloVideo';
import { BasesDatosVideo } from './BasesDatosVideo';

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
    </>
  );
};
