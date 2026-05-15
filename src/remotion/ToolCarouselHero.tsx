import React from 'react';
import {
  AbsoluteFill,
  Img,
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

const COLORS = {
  bgDeep: '#020617',
  panelBorder: 'rgba(56, 189, 248, 0.42)',
  panelBorderSoft: 'rgba(56, 189, 248, 0.22)',
  gridFaint: 'rgba(56, 189, 248, 0.07)',
  gridGlow: 'rgba(56, 189, 248, 0.22)',
  cyan: '#22d3ee',
  blue: '#3b82f6',
  violet: '#8b5cf6',
  glow: 'rgba(34, 211, 238, 0.55)',
  glowBlue: 'rgba(59, 130, 246, 0.45)',
};

export type CarouselAsset = {
  kind: 'image' | 'video';
  src: string;
  zoomFrom?: number;
  zoomTo?: number;
  panX?: number;
  panY?: number;
  startFrom?: number;
};

export type ToolCarouselHeroProps = {
  assets: CarouselAsset[];
  sceneDuration?: number;
  accent?: 'cyan' | 'violet' | 'blue';
};

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const ToolCarouselHero: React.FC<ToolCarouselHeroProps> = ({
  assets,
  sceneDuration = 90,
  accent = 'cyan',
}) => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const globalOp = interpolate(
    frame,
    [0, 10, durationInFrames - 18, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  const overlap = 12;

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bgDeep, overflow: 'hidden' }}
    >
      <BackgroundLayers />
      <PerspectiveGrid />
      <Starfield />
      <Aurora />

      <AbsoluteFill style={{ opacity: globalOp }}>
        {assets.map((asset, i) => {
          const from = Math.max(0, i * (sceneDuration - overlap));
          const dur = sceneDuration + (i === assets.length - 1 ? 0 : overlap);
          const variant: SceneVariant = i % 4 === 0
            ? 'centerZoom'
            : i % 4 === 1
              ? 'parallaxRight'
              : i % 4 === 2
                ? 'parallaxLeft'
                : 'composite';
          return (
            <Sequence key={i} from={from} durationInFrames={dur}>
              <CinematicScene
                asset={asset}
                variant={variant}
                accent={accent}
                companions={getCompanions(assets, i)}
              />
            </Sequence>
          );
        })}
      </AbsoluteFill>

      <FloatingParticles />
      <ScanBeam />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const getCompanions = (
  assets: CarouselAsset[],
  current: number
): CarouselAsset[] => {
  const others = assets.filter((_, i) => i !== current && _.kind === 'image');
  if (others.length === 0) return [];
  const a = others[(current + 1) % others.length];
  const b = others[(current + 2) % others.length];
  return [a, b].filter(Boolean) as CarouselAsset[];
};

type SceneVariant = 'centerZoom' | 'parallaxLeft' | 'parallaxRight' | 'composite';

const CinematicScene: React.FC<{
  asset: CarouselAsset;
  variant: SceneVariant;
  accent: 'cyan' | 'violet' | 'blue';
  companions: CarouselAsset[];
}> = ({ asset, variant, companions }) => {
  const frame = useCurrentFrame();
  const { fps, durationInFrames } = useVideoConfig();
  const len = durationInFrames;

  const fadeIn = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [len - 22, len], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = Math.min(fadeIn, fadeOut);

  const t = frame / Math.max(1, len);
  const eased = easeInOutCubic(t);

  let scale = 1;
  let tx = 0;
  let ty = 0;
  let screenW = 1040;
  let screenH = 588;
  let screenAnchor: 'center' | 'left' | 'right' = 'center';

  if (variant === 'centerZoom') {
    const zStart = asset.zoomFrom ?? 0.62;
    const zEnd = asset.zoomTo ?? 1.05;
    scale = zStart + easeOutCubic(t) * (zEnd - zStart);
    tx = Math.sin(frame * 0.04) * 6;
    ty = Math.cos(frame * 0.035) * 5;
  } else if (variant === 'parallaxLeft') {
    scale = 0.96 + easeOutCubic(t) * 0.1;
    tx = -34 + eased * 26;
    ty = Math.cos(frame * 0.035) * 5;
    screenW = 880;
    screenH = 500;
    screenAnchor = 'left';
  } else if (variant === 'parallaxRight') {
    scale = 0.96 + easeOutCubic(t) * 0.1;
    tx = 34 - eased * 26;
    ty = Math.cos(frame * 0.04) * 5;
    screenW = 880;
    screenH = 500;
    screenAnchor = 'right';
  } else {
    scale = 0.9 + easeOutCubic(t) * 0.16;
    tx = Math.sin(frame * 0.045) * 8;
    ty = Math.cos(frame * 0.04) * 6;
    screenW = 1000;
    screenH = 568;
  }

  const reveal = spring({
    frame: frame - 6,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  const cardA = interpolate(frame, [22, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardAOut = interpolate(frame, [len - 26, len - 4], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardOp = Math.min(cardA, cardAOut);

  const showCompanions = variant !== 'centerZoom';

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 38% at 50% 50%, ${COLORS.glow} 0%, transparent 65%)`,
          opacity: 0.45 * reveal,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left:
            screenAnchor === 'left'
              ? `${60 + screenW / 2}px`
              : screenAnchor === 'right'
                ? `${W - 60 - screenW / 2}px`
                : '50%',
          top: '50%',
          width: screenW,
          height: screenH,
          transform: `translate(-50%, -50%) translate(${tx}px, ${ty}px) scale(${scale})`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: `0 0 60px ${COLORS.glow}, 0 0 180px ${COLORS.glowBlue}`,
          border: `1.5px solid ${COLORS.panelBorder}`,
          opacity: reveal,
          willChange: 'transform',
        }}
      >
        {asset.kind === 'video' ? (
          <OffthreadVideo
            src={staticFile(asset.src)}
            muted
            startFrom={asset.startFrom ?? 0}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(1.04) contrast(1.06) saturate(1.08)',
            }}
          />
        ) : (
          <Img
            src={staticFile(asset.src)}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              filter: 'brightness(1.04) contrast(1.06) saturate(1.08)',
            }}
          />
        )}
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(2,6,23,0.25) 0%, transparent 28%, transparent 72%, rgba(2,6,23,0.45) 100%)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      {variant === 'centerZoom' && (
        <CornerBrackets opacity={reveal} />
      )}

      {showCompanions && companions[0] && (
        <FloatingCard
          asset={companions[0]}
          x={variant === 'parallaxRight' ? 62 : 932}
          y={variant === 'parallaxRight' ? 446 : 96}
          w={264}
          h={156}
          rotate={variant === 'parallaxRight' ? -6 : 5}
          opacity={cardOp}
          framePhase={frame}
          delay={0}
        />
      )}
      {showCompanions && companions[1] && (
        <FloatingCard
          asset={companions[1]}
          x={variant === 'parallaxRight' ? 944 : 60}
          y={variant === 'parallaxRight' ? 102 : 448}
          w={264}
          h={156}
          rotate={variant === 'parallaxRight' ? 6 : -5}
          opacity={cardOp}
          framePhase={frame}
          delay={12}
        />
      )}

      <OrbitalRings frame={frame} hidden={variant !== 'parallaxLeft' && variant !== 'parallaxRight'} />

      <ScanLines opacity={0.16} />
    </AbsoluteFill>
  );
};

const FloatingCard: React.FC<{
  asset: CarouselAsset;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  opacity: number;
  framePhase: number;
  delay: number;
}> = ({ asset, x, y, w, h, rotate, opacity, framePhase, delay }) => {
  const drift = Math.sin((framePhase + delay) * 0.05) * 5;
  const driftY = Math.cos((framePhase + delay) * 0.045) * 4;
  return (
    <div
      style={{
        position: 'absolute',
        left: x + drift,
        top: y + driftY,
        width: w,
        height: h,
        opacity,
        transform: `rotate(${rotate}deg)`,
        borderRadius: 10,
        overflow: 'hidden',
        border: `1.2px solid ${COLORS.panelBorder}`,
        boxShadow: `0 16px 48px rgba(2,6,23,0.6), 0 0 26px ${COLORS.glow}`,
        background: COLORS.bgDeep,
      }}
    >
      {asset.kind === 'video' ? (
        <OffthreadVideo
          src={staticFile(asset.src)}
          muted
          startFrom={asset.startFrom ?? 0}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.02) saturate(1.05)',
          }}
        />
      ) : (
        <Img
          src={staticFile(asset.src)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.02) saturate(1.05)',
          }}
        />
      )}
      <AbsoluteFill
        style={{
          background: `linear-gradient(135deg, rgba(34,211,238,0.08) 0%, transparent 50%, rgba(139,92,246,0.08) 100%)`,
          pointerEvents: 'none',
        }}
      />
    </div>
  );
};

const OrbitalRings: React.FC<{ frame: number; hidden: boolean }> = ({
  frame,
  hidden,
}) => {
  if (hidden) return null;
  const ringRot = frame * 0.6;
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: 'absolute',
        inset: 0,
        mixBlendMode: 'screen',
        opacity: 0.4,
        pointerEvents: 'none',
      }}
    >
      {[180, 220, 270].map((r, i) => (
        <ellipse
          key={i}
          cx={W / 2}
          cy={H / 2}
          rx={r}
          ry={r * 0.38}
          fill="none"
          stroke={COLORS.cyan}
          strokeOpacity={0.16 + i * 0.05}
          strokeWidth={i === 1 ? 1.4 : 1}
          strokeDasharray={i === 0 ? '4 12' : '0'}
          transform={`rotate(${ringRot * (i + 1) * 0.3} ${W / 2} ${H / 2})`}
        />
      ))}
    </svg>
  );
};

const CornerBrackets: React.FC<{ opacity: number }> = ({ opacity }) => {
  const margin = 92;
  const size = 38;
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
        <g key={i} stroke={color} strokeWidth={stroke} fill="none" opacity={0.7}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} />
          <line x1={x1} y1={y1} x2={x3} y2={y3} />
        </g>
      ))}
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
        background: `radial-gradient(80% 60% at 76% 18%, rgba(34, 211, 238, 0.15) 0%, transparent 60%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(70% 60% at 18% 88%, rgba(59, 130, 246, 0.16) 0%, transparent 60%)`,
      }}
    />
    <AbsoluteFill
      style={{
        background: `radial-gradient(50% 40% at 50% 55%, rgba(139, 92, 246, 0.08) 0%, transparent 70%)`,
      }}
    />
  </>
);

const PerspectiveGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 32], [0, 0.6], {
    extrapolateRight: 'clamp',
  });
  const horizonY = H * 0.62;
  const vanishX = W / 2;
  const scroll = (frame * 1.2) % 80;

  const radials: React.ReactElement[] = [];
  for (let i = -10; i <= 10; i += 1) {
    const x = vanishX + i * 70;
    radials.push(
      <line
        key={`r${i}`}
        x1={vanishX}
        y1={horizonY}
        x2={x}
        y2={H + 60}
        stroke={COLORS.gridFaint}
        strokeWidth={i === 0 ? 1.2 : 1}
        opacity={i === 0 ? 0.4 : 0.55}
      />
    );
  }

  const horizontals: React.ReactElement[] = [];
  for (let i = 0; i < 9; i += 1) {
    const progress = (i + scroll / 80) / 9;
    const eased = Math.pow(progress, 1.8);
    const y = horizonY + (H + 60 - horizonY) * eased;
    const op = (1 - Math.abs(0.35 - eased)) * 0.42 + 0.08;
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
    return Array.from({ length: 90 }).map((_, i) => {
      const seed = i + 1;
      return {
        x: (random(`csx${seed}`) as number) * W,
        y: (random(`csy${seed}`) as number) * H,
        r: 0.4 + (random(`csr${seed}`) as number) * 1.4,
        phase: (random(`csp${seed}`) as number) * Math.PI * 2,
        speed: 0.04 + (random(`css${seed}`) as number) * 0.08,
      };
    });
  }, []);

  return (
    <AbsoluteFill style={{ pointerEvents: 'none' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {stars.map((s, i) => {
          const op =
            0.18 + 0.4 * Math.abs(Math.sin(frame * s.speed + s.phase));
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
      style={{ mixBlendMode: 'screen', opacity: 0.35, pointerEvents: 'none' }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="tchAuroraA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0" />
            <stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.35" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="tchAuroraB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.violet} stopOpacity="0" />
            <stop offset="55%" stopColor={COLORS.violet} stopOpacity="0.30" />
            <stop offset="100%" stopColor={COLORS.violet} stopOpacity="0" />
          </linearGradient>
          <filter id="tchAuroraBlur">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <g filter="url(#tchAuroraBlur)">
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
            fill="url(#tchAuroraA)"
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
            fill="url(#tchAuroraB)"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const FloatingParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    return Array.from({ length: 38 }).map((_, i) => {
      const seed = i + 700;
      return {
        baseX: (random(`tcpx${seed}`) as number) * W,
        baseY: (random(`tcpy${seed}`) as number) * H,
        phase: (random(`tcpp${seed}`) as number) * Math.PI * 2,
        speed: 0.35 + (random(`tcps${seed}`) as number) * 0.7,
        size: 1.2 + (random(`tcpsz${seed}`) as number) * 2.2,
        hue: (random(`tcph${seed}`) as number) > 0.78,
      };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.7 }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {particles.map((p, i) => {
          const x = p.baseX + Math.sin(frame * 0.012 * p.speed + p.phase) * 22;
          const y = p.baseY + Math.cos(frame * 0.014 * p.speed + p.phase) * 18;
          const blink =
            0.3 + 0.55 * Math.abs(Math.sin((frame + i * 7) * 0.05));
          return (
            <g key={i}>
              <circle
                cx={x}
                cy={y}
                r={p.size + 2}
                fill={p.hue ? COLORS.violet : COLORS.cyan}
                opacity={blink * 0.15}
              />
              <circle
                cx={x}
                cy={y}
                r={p.size}
                fill={p.hue ? COLORS.violet : COLORS.cyan}
                opacity={blink * 0.85}
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
  const cycle = 200;
  const phase = (frame % cycle) / cycle;
  const y = -140 + phase * (H + 280);
  const op = Math.sin(phase * Math.PI) * 0.28;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: y,
          height: 130,
          background: `linear-gradient(180deg, transparent 0%, ${COLORS.cyan}30 45%, ${COLORS.cyan}55 50%, ${COLORS.cyan}30 55%, transparent 100%)`,
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
        'radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(2, 6, 23, 0.92) 100%)',
    }}
  />
);

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = React.useMemo(() => {
    return Array.from({ length: 160 }).map((_, i) => {
      const seed = i + 401;
      return {
        x: (random(`tcgx${seed}`) as number) * W,
        y: (random(`tcgy${seed}`) as number) * H,
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
