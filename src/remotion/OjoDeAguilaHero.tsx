import React from 'react';
import {
  AbsoluteFill,
  OffthreadVideo,
  Sequence,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const W = 1280;
const H = 720;

const SRC =
  'herraminetas_imagenes_videos/ojo_de_aguila/ojo_de_aguila_territoriales.mp4';

const COLORS = {
  bgDeep: '#020617',
  panelBorder: 'rgba(56, 189, 248, 0.48)',
  panelBorderSoft: 'rgba(56, 189, 248, 0.22)',
  gridFaint: 'rgba(56, 189, 248, 0.08)',
  gridGlow: 'rgba(56, 189, 248, 0.24)',
  cyan: '#22d3ee',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  amber: '#fbbf24',
  glow: 'rgba(34, 211, 238, 0.55)',
  glowBlue: 'rgba(59, 130, 246, 0.45)',
  glowViolet: 'rgba(139, 92, 246, 0.42)',
};

const VIDEO_FILTER =
  'brightness(1.05) contrast(1.08) saturate(1.1)';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
const easeOutQuint = (t: number) => 1 - Math.pow(1 - t, 5);

type SceneVariant = 'centerZoom' | 'parallaxRight' | 'composite' | 'pullback';

type SceneSpec = {
  from: number;
  dur: number;
  variant: SceneVariant;
  startFromMain: number;
  startFromA?: number;
  startFromB?: number;
  startFromC?: number;
};

const SCENES: SceneSpec[] = [
  {
    from: 0,
    dur: 130,
    variant: 'centerZoom',
    startFromMain: 90,
  },
  {
    from: 112,
    dur: 130,
    variant: 'parallaxRight',
    startFromMain: 540,
    startFromA: 240,
    startFromB: 780,
  },
  {
    from: 224,
    dur: 140,
    variant: 'composite',
    startFromMain: 1110,
    startFromA: 1380,
    startFromB: 1650,
    startFromC: 1920,
  },
  {
    from: 346,
    dur: 70,
    variant: 'pullback',
    startFromMain: 2080,
    startFromA: 2200,
    startFromB: 2320,
  },
];

const TOTAL = 416;

export const OjoDeAguilaHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const globalOp = interpolate(
    frame,
    [0, 14, durationInFrames - 24, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bgDeep, overflow: 'hidden' }}
    >
      <BackgroundLayers />
      <PerspectiveGrid />
      <Starfield />
      <Aurora />
      <DataRings />

      <AbsoluteFill style={{ opacity: globalOp }}>
        {SCENES.map((s, i) => (
          <Sequence key={i} from={s.from} durationInFrames={s.dur}>
            <CinematicScene spec={s} />
          </Sequence>
        ))}
      </AbsoluteFill>

      <HudOverlay />
      <FloatingParticles />
      <ScanBeam />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const CinematicScene: React.FC<{ spec: SceneSpec }> = ({ spec }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const len = durationInFrames;

  const fadeIn = interpolate(frame, [0, 24], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [len - 24, len], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = Math.min(fadeIn, fadeOut);

  const t = frame / Math.max(1, len);
  const eased = easeInOutCubic(t);
  const out = easeOutCubic(t);

  const reveal = spring({
    frame: frame - 6,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  if (spec.variant === 'centerZoom') {
    const scale = 0.72 + out * 0.32;
    const tx = Math.sin(frame * 0.04) * 6;
    const ty = Math.cos(frame * 0.035) * 5;
    const screenW = 1060;
    const screenH = 596;
    return (
      <AbsoluteFill style={{ opacity: op }}>
        <RadialHalo intensity={0.5 * reveal} />
        <VideoPanel
          startFrom={spec.startFromMain}
          x={W / 2}
          y={H / 2}
          w={screenW}
          h={screenH}
          tx={tx}
          ty={ty}
          scale={scale}
          rotate={0}
          opacity={reveal}
          intensity="hero"
        />
        <CornerBrackets opacity={reveal} />
        <ScanLines opacity={0.18} />
        <SideTicks opacity={reveal * 0.7} />
      </AbsoluteFill>
    );
  }

  if (spec.variant === 'parallaxRight') {
    const scale = 0.92 + out * 0.1;
    const tx = 34 - eased * 28;
    const ty = Math.cos(frame * 0.035) * 5;
    const screenW = 880;
    const screenH = 500;
    return (
      <AbsoluteFill style={{ opacity: op }}>
        <RadialHalo intensity={0.4 * reveal} cx="68%" cy="50%" />
        <OrbitalRings frame={frame} />

        {/* Companions appearing before main slides in */}
        <VideoCard
          startFrom={spec.startFromA ?? 0}
          x={70}
          y={86}
          w={280}
          h={168}
          rotate={-5}
          opacity={interpolate(frame, [10, 42], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }) * (1 - Math.max(0, (frame - (len - 22)) / 22))}
          framePhase={frame}
          delay={0}
          accent="cyan"
        />
        <VideoCard
          startFrom={spec.startFromB ?? 0}
          x={68}
          y={464}
          w={280}
          h={168}
          rotate={6}
          opacity={interpolate(frame, [20, 56], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }) * (1 - Math.max(0, (frame - (len - 22)) / 22))}
          framePhase={frame}
          delay={18}
          accent="violet"
        />

        {/* Main */}
        <VideoPanel
          startFrom={spec.startFromMain}
          x={W - 60 - screenW / 2}
          y={H / 2}
          w={screenW}
          h={screenH}
          tx={tx}
          ty={ty}
          scale={scale}
          rotate={0}
          opacity={reveal}
          intensity="mid"
        />
        <ScanLines opacity={0.14} />
      </AbsoluteFill>
    );
  }

  if (spec.variant === 'composite') {
    const scale = 0.86 + out * 0.12;
    const tx = Math.sin(frame * 0.045) * 7;
    const ty = Math.cos(frame * 0.04) * 5;
    const screenW = 760;
    const screenH = 430;

    const cardOp = interpolate(frame, [18, 48], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const cardOpOut = interpolate(frame, [len - 26, len - 4], [1, 0], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
    const cOp = Math.min(cardOp, cardOpOut);

    return (
      <AbsoluteFill style={{ opacity: op }}>
        <RadialHalo intensity={0.45 * reveal} />
        <OrbitalRings frame={frame} />

        {/* Three flanking panels */}
        <VideoCard
          startFrom={spec.startFromA ?? 0}
          x={156}
          y={140}
          w={236}
          h={140}
          rotate={-7}
          opacity={cOp}
          framePhase={frame}
          delay={0}
          accent="cyan"
        />
        <VideoCard
          startFrom={spec.startFromB ?? 0}
          x={W - 156}
          y={140}
          w={236}
          h={140}
          rotate={7}
          opacity={cOp}
          framePhase={frame}
          delay={12}
          accent="violet"
        />
        <VideoCard
          startFrom={spec.startFromC ?? 0}
          x={W / 2}
          y={H - 86}
          w={332}
          h={130}
          rotate={0}
          opacity={cOp}
          framePhase={frame}
          delay={24}
          accent="blue"
        />

        {/* Center main */}
        <VideoPanel
          startFrom={spec.startFromMain}
          x={W / 2}
          y={H / 2 - 28}
          w={screenW}
          h={screenH}
          tx={tx}
          ty={ty}
          scale={scale}
          rotate={0}
          opacity={reveal}
          intensity="mid"
        />
        <ConnectorLines opacity={cOp * 0.6} />
        <ScanLines opacity={0.12} />
      </AbsoluteFill>
    );
  }

  // pullback
  const scale = 0.92 - out * 0.18;
  const tx = 0;
  const ty = Math.cos(frame * 0.04) * 4;
  const screenW = 1060;
  const screenH = 596;
  const cardOp = interpolate(frame, [4, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardOpOut = interpolate(frame, [len - 22, len - 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cOp = Math.min(cardOp, cardOpOut);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <RadialHalo intensity={0.6 * reveal} />
      <VideoCard
        startFrom={spec.startFromA ?? 0}
        x={140}
        y={H / 2}
        w={220}
        h={130}
        rotate={-8}
        opacity={cOp}
        framePhase={frame}
        delay={0}
        accent="cyan"
      />
      <VideoCard
        startFrom={spec.startFromB ?? 0}
        x={W - 140}
        y={H / 2}
        w={220}
        h={130}
        rotate={8}
        opacity={cOp}
        framePhase={frame}
        delay={10}
        accent="violet"
      />
      <VideoPanel
        startFrom={spec.startFromMain}
        x={W / 2}
        y={H / 2}
        w={screenW}
        h={screenH}
        tx={tx}
        ty={ty}
        scale={scale}
        rotate={0}
        opacity={reveal}
        intensity="hero"
      />
      <CornerBrackets opacity={reveal * 0.8} />
      <ScanLines opacity={0.14} />
    </AbsoluteFill>
  );
};

type Intensity = 'hero' | 'mid';

const VideoPanel: React.FC<{
  startFrom: number;
  x: number;
  y: number;
  w: number;
  h: number;
  tx: number;
  ty: number;
  scale: number;
  rotate: number;
  opacity: number;
  intensity: Intensity;
}> = ({ startFrom, x, y, w, h, tx, ty, scale, rotate, opacity, intensity }) => {
  const shadow =
    intensity === 'hero'
      ? `0 0 70px ${COLORS.glow}, 0 0 200px ${COLORS.glowBlue}`
      : `0 0 50px ${COLORS.glow}, 0 0 140px ${COLORS.glowBlue}`;
  return (
    <div
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) rotate(${rotate}deg) scale(${scale})`,
        borderRadius: 20,
        overflow: 'hidden',
        boxShadow: shadow,
        border: `1.6px solid ${COLORS.panelBorder}`,
        opacity,
        willChange: 'transform',
      }}
    >
      <OffthreadVideo
        src={staticFile(SRC)}
        muted
        startFrom={startFrom}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: VIDEO_FILTER,
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(2,6,23,0.32) 0%, transparent 26%, transparent 72%, rgba(2,6,23,0.5) 100%)`,
          pointerEvents: 'none',
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, rgba(34,211,238,0.10) 0%, transparent 50%, rgba(139,92,246,0.10) 100%)`,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />
      <PanelTicker />
    </div>
  );
};

const VideoCard: React.FC<{
  startFrom: number;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  opacity: number;
  framePhase: number;
  delay: number;
  accent: 'cyan' | 'violet' | 'blue';
}> = ({ startFrom, x, y, w, h, rotate, opacity, framePhase, delay, accent }) => {
  const drift = Math.sin((framePhase + delay) * 0.05) * 6;
  const driftY = Math.cos((framePhase + delay) * 0.045) * 5;
  const accentColor =
    accent === 'cyan' ? COLORS.cyan : accent === 'violet' ? COLORS.violet : COLORS.blue;
  const accentGlow =
    accent === 'cyan' ? COLORS.glow : accent === 'violet' ? COLORS.glowViolet : COLORS.glowBlue;
  return (
    <div
      style={{
        position: 'absolute',
        left: x + drift,
        top: y + driftY,
        width: w,
        height: h,
        transform: `translate(-50%, -50%) rotate(${rotate}deg)`,
        opacity,
        borderRadius: 12,
        overflow: 'hidden',
        border: `1.3px solid ${accentColor}aa`,
        boxShadow: `0 18px 50px rgba(2,6,23,0.7), 0 0 30px ${accentGlow}`,
        background: COLORS.bgDeep,
      }}
    >
      <OffthreadVideo
        src={staticFile(SRC)}
        muted
        startFrom={startFrom}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(1.02) contrast(1.06) saturate(1.06)',
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, ${accentColor}1f 0%, transparent 50%, ${accentColor}26 100%)`,
          pointerEvents: 'none',
          mixBlendMode: 'screen',
        }}
      />
      <AbsoluteFill
        style={{
          background: `linear-gradient(180deg, rgba(2,6,23,0.3) 0%, transparent 30%, transparent 70%, rgba(2,6,23,0.45) 100%)`,
          pointerEvents: 'none',
        }}
      />
      <div
        style={{
          position: 'absolute',
          left: 8,
          top: 8,
          width: 7,
          height: 7,
          borderRadius: '50%',
          background: accentColor,
          boxShadow: `0 0 12px ${accentColor}`,
        }}
      />
    </div>
  );
};

const PanelTicker: React.FC = () => {
  const frame = useCurrentFrame();
  const phase = (frame * 1.4) % 1000;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox="0 0 1000 60"
      preserveAspectRatio="none"
      style={{
        position: 'absolute',
        left: 0,
        bottom: 0,
        height: 60,
        opacity: 0.55,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    >
      <defs>
        <linearGradient id="tickerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0" />
          <stop offset="30%" stopColor={COLORS.cyan} stopOpacity="0.5" />
          <stop offset="70%" stopColor={COLORS.cyan} stopOpacity="0.5" />
          <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
        </linearGradient>
      </defs>
      <g transform={`translate(${-phase % 200}, 0)`}>
        {Array.from({ length: 18 }).map((_, i) => {
          const x = i * 70;
          const hh = 6 + ((i * 13) % 18);
          return (
            <rect
              key={i}
              x={x}
              y={50 - hh}
              width={3}
              height={hh}
              fill="url(#tickerGrad)"
            />
          );
        })}
      </g>
    </svg>
  );
};

const ConnectorLines: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const dash = (frame * 1.6) % 12;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: 'absolute',
        inset: 0,
        opacity,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    >
      <g stroke={COLORS.cyan} strokeWidth="1" strokeOpacity="0.6" fill="none">
        <line
          x1={156}
          y1={140}
          x2={W / 2}
          y2={H / 2 - 28}
          strokeDasharray="3 6"
          strokeDashoffset={-dash}
        />
        <line
          x1={W - 156}
          y1={140}
          x2={W / 2}
          y2={H / 2 - 28}
          strokeDasharray="3 6"
          strokeDashoffset={-dash}
        />
        <line
          x1={W / 2}
          y1={H - 86}
          x2={W / 2}
          y2={H / 2 - 28}
          strokeDasharray="3 6"
          strokeDashoffset={-dash}
        />
      </g>
      <g fill={COLORS.cyan}>
        <circle cx={156} cy={140} r="3.5" opacity="0.8" />
        <circle cx={W - 156} cy={140} r="3.5" opacity="0.8" />
        <circle cx={W / 2} cy={H - 86} r="3.5" opacity="0.8" />
      </g>
    </svg>
  );
};

const RadialHalo: React.FC<{
  intensity: number;
  cx?: string;
  cy?: string;
}> = ({ intensity, cx = '50%', cy = '50%' }) => (
  <AbsoluteFill
    style={{
      background: `radial-gradient(46% 38% at ${cx} ${cy}, ${COLORS.glow} 0%, transparent 65%)`,
      opacity: intensity,
      pointerEvents: 'none',
    }}
  />
);

const CornerBrackets: React.FC<{ opacity: number }> = ({ opacity }) => {
  const margin = 84;
  const size = 42;
  const stroke = 2;
  const color = COLORS.cyan;
  const corners: Array<[number, number, number, number, number, number]> = [
    [margin, margin, margin + size, margin, margin, margin + size],
    [W - margin, margin, W - margin - size, margin, W - margin, margin + size],
    [margin, H - margin, margin + size, H - margin, margin, H - margin - size],
    [
      W - margin,
      H - margin,
      W - margin - size,
      H - margin,
      W - margin,
      H - margin - size,
    ],
  ];
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}
    >
      {corners.map(([x1, y1, x2, y2, x3, y3], i) => (
        <g key={i} stroke={color} strokeWidth={stroke} fill="none" opacity={0.8}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} />
          <line x1={x1} y1={y1} x2={x3} y2={y3} />
          <circle cx={x1} cy={y1} r="3" fill={color} opacity="0.9" />
        </g>
      ))}
    </svg>
  );
};

const SideTicks: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + 0.4 * Math.abs(Math.sin(frame * 0.06));
  const ticks = Array.from({ length: 10 }).map((_, i) => i);
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{ position: 'absolute', inset: 0, opacity, pointerEvents: 'none' }}
    >
      <g stroke={COLORS.cyan} strokeWidth="1.2">
        {ticks.map((i) => {
          const y = 180 + i * 36;
          const len = i === 5 ? 22 : 12;
          return (
            <line
              key={`l${i}`}
              x1={30}
              x2={30 + len}
              y1={y}
              y2={y}
              opacity={i === 5 ? pulse : 0.45}
            />
          );
        })}
        {ticks.map((i) => {
          const y = 180 + i * 36;
          const len = i === 5 ? 22 : 12;
          return (
            <line
              key={`r${i}`}
              x1={W - 30 - len}
              x2={W - 30}
              y1={y}
              y2={y}
              opacity={i === 5 ? pulse : 0.45}
            />
          );
        })}
      </g>
    </svg>
  );
};

const HudOverlay: React.FC = () => {
  const frame = useCurrentFrame();
  const pulse = 0.55 + 0.35 * Math.abs(Math.sin(frame * 0.07));
  const rot = frame * 0.4;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.7,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    >
      {/* small targeting reticle top-right */}
      <g transform={`translate(${W - 78}, 60)`} stroke={COLORS.cyan} fill="none">
        <circle r="14" strokeWidth="1" opacity="0.7" />
        <circle r="22" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.5" transform={`rotate(${rot})`} />
        <circle r="4" fill={COLORS.cyan} stroke="none" opacity={pulse} />
      </g>
      {/* small targeting reticle bottom-left */}
      <g transform={`translate(60, ${H - 60})`} stroke={COLORS.violet} fill="none">
        <circle r="12" strokeWidth="1" opacity="0.7" />
        <circle r="20" strokeWidth="0.8" strokeDasharray="2 4" opacity="0.45" transform={`rotate(${-rot})`} />
        <circle r="3.5" fill={COLORS.violet} stroke="none" opacity={pulse} />
      </g>
    </svg>
  );
};

const OrbitalRings: React.FC<{ frame: number }> = ({ frame }) => {
  const ringRot = frame * 0.55;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: 'absolute',
        inset: 0,
        mixBlendMode: 'screen',
        opacity: 0.42,
        pointerEvents: 'none',
      }}
    >
      {[200, 260, 320].map((r, i) => (
        <ellipse
          key={i}
          cx={W / 2}
          cy={H / 2}
          rx={r}
          ry={r * 0.4}
          fill="none"
          stroke={COLORS.cyan}
          strokeOpacity={0.18 + i * 0.06}
          strokeWidth={i === 1 ? 1.4 : 1}
          strokeDasharray={i === 0 ? '4 12' : '0'}
          transform={`rotate(${ringRot * (i + 1) * 0.32} ${W / 2} ${H / 2})`}
        />
      ))}
    </svg>
  );
};

const DataRings: React.FC = () => {
  const frame = useCurrentFrame();
  const rot = frame * 0.18;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: 'absolute',
        inset: 0,
        opacity: 0.18,
        pointerEvents: 'none',
        mixBlendMode: 'screen',
      }}
    >
      <g transform={`translate(${W / 2}, ${H / 2})`}>
        <circle r="420" fill="none" stroke={COLORS.blue} strokeOpacity="0.18" strokeWidth="0.6" strokeDasharray="1 5" transform={`rotate(${rot})`} />
        <circle r="490" fill="none" stroke={COLORS.cyan} strokeOpacity="0.16" strokeWidth="0.6" strokeDasharray="2 6" transform={`rotate(${-rot * 0.7})`} />
      </g>
    </svg>
  );
};

const ScanLines: React.FC<{ opacity: number }> = ({ opacity }) => {
  const frame = useCurrentFrame();
  const offset = (frame * 0.6) % 6;
  return (
    <AbsoluteFill
      style={{
        backgroundImage: `repeating-linear-gradient(0deg, rgba(34,211,238,0.0) 0px, rgba(34,211,238,0.0) 2px, rgba(34,211,238,0.14) 3px, rgba(34,211,238,0.0) 4px, rgba(34,211,238,0.0) 6px)`,
        backgroundPosition: `0 ${offset}px`,
        mixBlendMode: 'screen',
        opacity,
        pointerEvents: 'none',
      }}
    />
  );
};

const BackgroundLayers: React.FC = () => (
  <>
    <AbsoluteFill
      style={{
        background: `radial-gradient(80% 60% at 78% 18%, rgba(34, 211, 238, 0.16) 0%, transparent 60%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(72% 60% at 16% 86%, rgba(59, 130, 246, 0.17) 0%, transparent 60%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(54% 42% at 50% 55%, rgba(139, 92, 246, 0.10) 0%, transparent 70%)`,
      }}
    />
  </>
);

const PerspectiveGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 36], [0, 0.65], {
    extrapolateRight: 'clamp',
  });
  const horizonY = H * 0.6;
  const vanishX = W / 2;
  const scroll = (frame * 1.3) % 80;

  const radials: React.ReactElement[] = [];
  for (let i = -10; i <= 10; i += 1) {
    const x = vanishX + i * 72;
    radials.push(
      <line
        key={`r${i}`}
        x1={vanishX}
        y1={horizonY}
        x2={x}
        y2={H + 60}
        stroke={COLORS.gridFaint}
        strokeWidth={i === 0 ? 1.2 : 1}
        opacity={i === 0 ? 0.42 : 0.55}
      />
    );
  }

  const horizontals: React.ReactElement[] = [];
  for (let i = 0; i < 10; i += 1) {
    const progress = (i + scroll / 80) / 10;
    const eased = Math.pow(progress, 1.85);
    const y = horizonY + (H + 60 - horizonY) * eased;
    const op = (1 - Math.abs(0.35 - eased)) * 0.45 + 0.08;
    horizontals.push(
      <line
        key={`h${i}`}
        x1="-100"
        y1={y}
        x2={W + 100}
        y2={y}
        stroke={COLORS.gridGlow}
        strokeWidth="1"
        opacity={op}
      />
    );
  }

  return (
    <AbsoluteFill style={{ opacity: fade }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {radials}
        {horizontals}
      </svg>
    </AbsoluteFill>
  );
};

const Starfield: React.FC = () => {
  const frame = useCurrentFrame();
  const stars = React.useMemo(() => {
    return Array.from({ length: 110 }).map((_, i) => {
      const seed = i + 1;
      return {
        x: (random(`oasx${seed}`) as number) * W,
        y: (random(`oasy${seed}`) as number) * H,
        r: 0.4 + (random(`oasr${seed}`) as number) * 1.5,
        phase: (random(`oasp${seed}`) as number) * Math.PI * 2,
        speed: 0.04 + (random(`oass${seed}`) as number) * 0.08,
      };
    });
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {stars.map((s, i) => {
          const op =
            0.18 + 0.42 * Math.abs(Math.sin(frame * s.speed + s.phase));
          const fill = i % 7 === 0 ? COLORS.cyan : '#cbd5e1';
          return (
            <circle
              key={i}
              cx={s.x}
              cy={s.y}
              r={s.r}
              fill={fill}
              opacity={op}
            />
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const Aurora: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame * 0.012;
  return (
    <AbsoluteFill
      style={{ mixBlendMode: 'screen', opacity: 0.4, pointerEvents: 'none' }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="oahAuroraA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0" />
            <stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.4" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="oahAuroraB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.violet} stopOpacity="0" />
            <stop offset="55%" stopColor={COLORS.violet} stopOpacity="0.32" />
            <stop offset="100%" stopColor={COLORS.violet} stopOpacity="0" />
          </linearGradient>
          <filter id="oahAuroraBlur">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <g filter="url(#oahAuroraBlur)">
          <path
            d={`M -50 ${180 + Math.sin(t) * 18} C 320 ${
              120 + Math.sin(t * 0.7) * 30
            } 760 ${260 + Math.cos(t * 0.9) * 28} ${W + 50} ${
              200 + Math.sin(t * 0.6) * 20
            } L ${W + 50} ${260 + Math.sin(t * 0.6) * 20} C 760 ${
              340 + Math.cos(t * 0.9) * 28
            } 320 ${200 + Math.sin(t * 0.7) * 30} -50 ${
              260 + Math.sin(t) * 18
            } Z`}
            fill="url(#oahAuroraA)"
          />
          <path
            d={`M -50 ${540 + Math.cos(t * 1.1) * 22} C 360 ${
              500 + Math.sin(t * 0.8) * 26
            } 820 ${620 + Math.cos(t) * 24} ${W + 50} ${
              560 + Math.sin(t * 0.9) * 18
            } L ${W + 50} ${620 + Math.sin(t * 0.9) * 18} C 820 ${
              680 + Math.cos(t) * 24
            } 360 ${560 + Math.sin(t * 0.8) * 26} -50 ${
              600 + Math.cos(t * 1.1) * 22
            } Z`}
            fill="url(#oahAuroraB)"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const FloatingParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    return Array.from({ length: 44 }).map((_, i) => {
      const seed = i + 800;
      return {
        baseX: (random(`oahpx${seed}`) as number) * W,
        baseY: (random(`oahpy${seed}`) as number) * H,
        phase: (random(`oahpp${seed}`) as number) * Math.PI * 2,
        speed: 0.35 + (random(`oahps${seed}`) as number) * 0.8,
        size: 1.2 + (random(`oahpsz${seed}`) as number) * 2.4,
        hue: (random(`oahph${seed}`) as number) > 0.78,
      };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.72 }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {particles.map((p, i) => {
          const x = p.baseX + Math.sin(frame * 0.012 * p.speed + p.phase) * 24;
          const y = p.baseY + Math.cos(frame * 0.014 * p.speed + p.phase) * 20;
          const blink =
            0.3 + 0.55 * Math.abs(Math.sin((frame + i * 7) * 0.05));
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={p.size + 2.4}
                fill={p.hue ? COLORS.violet : COLORS.cyan}
                opacity={blink * 0.16}
              />
              <circle
                cx={x}
                cy={y}
                r={p.size}
                fill={p.hue ? COLORS.violet : COLORS.cyan}
                opacity={blink * 0.88}
              />
            </g>
          );
        })}
      </svg>
    </AbsoluteFill>
  );
};

const ScanBeam: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = 210;
  const phase = (frame % cycle) / cycle;
  const y = -140 + phase * (H + 280);
  const op = Math.sin(phase * Math.PI) * 0.3;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: y,
          height: 140,
          background: `linear-gradient(180deg, transparent 0%, ${COLORS.cyan}30 45%, ${COLORS.cyan}60 50%, ${COLORS.cyan}30 55%, transparent 100%)`,
          opacity: op,
          filter: 'blur(2px)',
        }}
      />
    </AbsoluteFill>
  );
};

const Vignette: React.FC = () => (
  <AbsoluteFill
    style={{
      pointerEvents: 'none',
      background:
        'radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(2, 6, 23, 0.94) 100%)',
    }}
  />
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = React.useMemo(() => {
    return Array.from({ length: 180 }).map((_, i) => {
      const seed = i + 901;
      return {
        x: (random(`oahgx${seed}`) as number) * W,
        y: (random(`oahgy${seed}`) as number) * H,
      };
    });
  }, []);
  const shift = frame % 3;
  return (
    <AbsoluteFill style={{ opacity: 0.05, pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {dots.map((d, i) => (
          <circle
            key={i}
            cx={(d.x + shift * 7) % W}
            cy={(d.y + shift * 5) % H}
            r="0.6"
            fill="#94a3b8"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

export const OJO_DE_AGUILA_HERO_DURATION = TOTAL;
