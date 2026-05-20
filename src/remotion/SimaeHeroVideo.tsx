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
  bgMid: '#060d1f',
  panelBorder: 'rgba(56, 189, 248, 0.42)',
  panelBorderSoft: 'rgba(56, 189, 248, 0.22)',
  gridFaint: 'rgba(56, 189, 248, 0.07)',
  gridGlow: 'rgba(56, 189, 248, 0.22)',
  cyan: '#22d3ee',
  cyanDeep: '#06b6d4',
  blue: '#3b82f6',
  blueDeep: '#1d4ed8',
  violet: '#8b5cf6',
  red: '#ef4444',
  glow: 'rgba(34, 211, 238, 0.55)',
  glowBlue: 'rgba(59, 130, 246, 0.45)',
};

const ASSET_VIDEO = 'SIMAE_hero/video.mp4';
const ASSET_GLOBE = 'SIMAE_hero/image1.png';
const ASSET_MAP = 'SIMAE_hero/Screenshot_1.png';
const ASSET_ORGS = 'SIMAE_hero/Screenshot_2.png';

const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
const easeInOutCubic = (t: number) =>
  t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

export const SimaeHeroVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const globalOp = interpolate(
    frame,
    [0, 10, durationInFrames - 18, durationInFrames - 1],
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

      <AbsoluteFill style={{ opacity: globalOp }}>
        <Sequence from={0} durationInFrames={90}>
          <Scene1Intro />
        </Sequence>

        <Sequence from={70} durationInFrames={108}>
          <Scene2Globe />
        </Sequence>

        <Sequence from={158} durationInFrames={108}>
          <Scene3Colombia />
        </Sequence>

        <Sequence from={246} durationInFrames={74}>
          <Scene4Composite />
        </Sequence>
      </AbsoluteFill>

      <FloatingParticles />
      <ScanBeam />
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

/* ---------------------------- Scene 1: Intro ---------------------------- */

const Scene1Intro: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = 90;

  const fadeIn = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [len - 18, len], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = Math.min(fadeIn, fadeOut);

  const t = Math.min(1, frame / 70);
  const scale = 0.55 + easeOutCubic(t) * 0.5;
  const driftX = Math.sin(frame * 0.05) * 6;
  const driftY = Math.cos(frame * 0.04) * 5;

  const ringPulse = 0.55 + 0.45 * Math.sin(frame * 0.14);

  const reveal = spring({
    frame: frame - 10,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(45% 38% at 50% 50%, ${COLORS.glow} 0%, transparent 65%)`,
          opacity: 0.55 * reveal,
        }}
      />

      <div
        style={{
          position: 'absolute',
          left: '50%',
          top: '50%',
          width: 1040,
          height: 588,
          transform: `translate(-50%, -50%) translate(${driftX}px, ${driftY}px) scale(${scale})`,
          borderRadius: 18,
          overflow: 'hidden',
          boxShadow: `0 0 60px ${COLORS.glow}, 0 0 180px ${COLORS.glowBlue}`,
          border: `1.5px solid ${COLORS.panelBorder}`,
          opacity: reveal,
        }}
      >
        <OffthreadVideo
          src={staticFile(ASSET_VIDEO)}
          muted
          startFrom={0}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.05) contrast(1.05) saturate(1.05)',
          }}
        />
        <AbsoluteFill
          style={{
            background: `linear-gradient(180deg, rgba(2,6,23,0.2) 0%, transparent 30%, transparent 70%, rgba(2,6,23,0.35) 100%)`,
            pointerEvents: 'none',
          }}
        />
      </div>

      <RingGlow
        cx={W / 2}
        cy={H / 2}
        rx={620 * scale * 0.5}
        ry={350 * scale * 0.5}
        opacity={ringPulse * 0.4}
      />
      <CornerBrackets opacity={reveal} />
    </AbsoluteFill>
  );
};

/* ----------------------- Scene 2: Globe Dashboard ----------------------- */

const Scene2Globe: React.FC = () => {
  const frame = useCurrentFrame();
  const len = 108;

  const fadeIn = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [len - 22, len], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = Math.min(fadeIn, fadeOut);

  const t = frame / len;
  const scale = 1.22 - easeInOutCubic(t) * 0.16;
  const tx = -28 + easeInOutCubic(t) * 48;
  const ty = 14 - easeInOutCubic(t) * 28;

  const cardA = interpolate(frame, [22, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardAOut = interpolate(frame, [len - 28, len - 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardOp = Math.min(cardA, cardAOut);

  const ringRot = frame * 0.6;

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          willChange: 'transform',
        }}
      >
        <Img
          src={staticFile(ASSET_GLOBE)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.04) contrast(1.06) saturate(1.08)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: `radial-gradient(18% 26% at 50% 50%, rgba(34,211,238,0.28), transparent 80%)`,
          mixBlendMode: 'screen',
          opacity: 0.85,
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{
          position: 'absolute',
          inset: 0,
          mixBlendMode: 'screen',
          opacity: 0.65,
        }}
      >
        <defs>
          <radialGradient id="s2OrbitGrad" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0" />
            <stop offset="70%" stopColor={COLORS.cyan} stopOpacity="0.55" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
          </radialGradient>
        </defs>
        {[180, 220, 270].map((r, i) => (
          <ellipse
            key={i}
            cx={W / 2}
            cy={H / 2}
            rx={r}
            ry={r * 0.38}
            fill="none"
            stroke={COLORS.cyan}
            strokeOpacity={0.18 + i * 0.06}
            strokeWidth={i === 1 ? 1.4 : 1}
            strokeDasharray={i === 0 ? '4 12' : '0'}
            transform={`rotate(${ringRot * (i + 1) * 0.3} ${W / 2} ${H / 2})`}
          />
        ))}
        {Array.from({ length: 18 }).map((_, i) => {
          const a = (i / 18) * Math.PI * 2 + frame * 0.018;
          const cx = W / 2 + Math.cos(a) * 220;
          const cy = H / 2 + Math.sin(a) * 220 * 0.38;
          const depth = Math.sin(a) * 0.5 + 0.5;
          return (
            <circle
              key={`od${i}`}
              cx={cx}
              cy={cy}
              r={1.6 + depth * 1.8}
              fill={i % 4 === 0 ? COLORS.violet : COLORS.cyan}
              opacity={0.35 + depth * 0.55}
            />
          );
        })}
      </svg>

      <FloatingCard
        src={ASSET_MAP}
        x={62}
        y={446}
        w={252}
        h={148}
        rotate={-6}
        opacity={cardOp}
        framePhase={frame}
        delay={0}
      />
      <FloatingCard
        src={ASSET_ORGS}
        x={964}
        y={104}
        w={252}
        h={148}
        rotate={5}
        opacity={cardOp}
        framePhase={frame}
        delay={10}
      />

      <ScanLines opacity={0.18} />
    </AbsoluteFill>
  );
};

/* --------------------- Scene 3: Colombia Heat Map --------------------- */

const Scene3Colombia: React.FC = () => {
  const frame = useCurrentFrame();
  const len = 108;

  const fadeIn = interpolate(frame, [0, 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [len - 22, len], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = Math.min(fadeIn, fadeOut);

  const t = frame / len;
  const scale = 1.28 - easeInOutCubic(t) * 0.22;
  const tx = 30 - easeInOutCubic(t) * 50;
  const ty = -14 + easeInOutCubic(t) * 26;

  const heatPulse = 0.45 + 0.55 * Math.abs(Math.sin(frame * 0.11));

  const cardA = interpolate(frame, [26, 54], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardAOut = interpolate(frame, [len - 28, len - 6], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const cardOp = Math.min(cardA, cardAOut);

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill
        style={{
          transform: `scale(${scale}) translate(${tx}px, ${ty}px)`,
          willChange: 'transform',
        }}
      >
        <Img
          src={staticFile(ASSET_MAP)}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            filter: 'brightness(1.04) contrast(1.08) saturate(1.1)',
          }}
        />
      </AbsoluteFill>

      <AbsoluteFill
        style={{
          background: `radial-gradient(14% 22% at 49% 52%, rgba(239,68,68,${
            0.18 * heatPulse
          }), transparent 80%)`,
          mixBlendMode: 'screen',
        }}
      />

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{
          position: 'absolute',
          inset: 0,
          mixBlendMode: 'screen',
          opacity: 0.85,
        }}
      >
        {[40, 70, 110].map((r, i) => {
          const local = (frame + i * 28) % 80;
          const progress = local / 80;
          const radius = r + progress * 80;
          const fade = 1 - progress;
          return (
            <circle
              key={i}
              cx={620}
              cy={372}
              r={radius}
              fill="none"
              stroke={COLORS.red}
              strokeWidth="1.8"
              opacity={fade * 0.6}
            />
          );
        })}
        <circle
          cx={620}
          cy={372}
          r={6}
          fill={COLORS.red}
          opacity={0.7 + 0.3 * Math.sin(frame * 0.22)}
        />
        <circle cx={620} cy={372} r={14} fill={COLORS.red} opacity={0.22} />
      </svg>

      <FloatingCard
        src={ASSET_GLOBE}
        x={62}
        y={102}
        w={262}
        h={154}
        rotate={4}
        opacity={cardOp}
        framePhase={frame}
        delay={0}
      />
      <FloatingCard
        src={ASSET_ORGS}
        x={960}
        y={446}
        w={258}
        h={150}
        rotate={-6}
        opacity={cardOp}
        framePhase={frame}
        delay={12}
      />

      <ScanLines opacity={0.16} />
    </AbsoluteFill>
  );
};

/* ----------------------- Scene 4: Composite Outro ----------------------- */

const Scene4Composite: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const len = 74;

  const fadeIn = interpolate(frame, [0, 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const fadeOut = interpolate(frame, [len - 22, len], [1, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const op = Math.min(fadeIn, fadeOut);

  const e = spring({
    frame: frame - 6,
    fps,
    config: { damping: 22, stiffness: 70 },
  });

  const drift = Math.sin(frame * 0.04) * 8;
  const burst = interpolate(frame, [len - 30, len - 6], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const cards: Array<{
    src: string;
    x: number;
    y: number;
    w: number;
    h: number;
    rotate: number;
    z: number;
    delay: number;
  }> = [
    {
      src: ASSET_GLOBE,
      x: W / 2 - 280,
      y: H / 2 - 170,
      w: 560,
      h: 340,
      rotate: 0,
      z: 3,
      delay: 0,
    },
    {
      src: ASSET_MAP,
      x: 86,
      y: 168,
      w: 360,
      h: 218,
      rotate: -10,
      z: 1,
      delay: 8,
    },
    {
      src: ASSET_ORGS,
      x: 834,
      y: 168,
      w: 360,
      h: 218,
      rotate: 10,
      z: 1,
      delay: 14,
    },
  ];

  return (
    <AbsoluteFill style={{ opacity: op }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(60% 50% at 50% 50%, ${COLORS.glowBlue}, transparent 70%)`,
          opacity: 0.55,
        }}
      />

      <AbsoluteFill style={{ perspective: 1400 }}>
        {cards.map((c, i) => {
          const local = spring({
            frame: frame - c.delay,
            fps,
            config: { damping: 20, stiffness: 80 },
          });
          const liftY = (1 - local) * 30;
          const px = c.x + Math.sin((frame + i * 30) * 0.04) * 6;
          const py = c.y + Math.cos((frame + i * 30) * 0.05) * 5 + liftY;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                left: px,
                top: py,
                width: c.w,
                height: c.h,
                transform: `rotateY(${c.rotate}deg) rotateX(${-c.rotate * 0.18}deg) scale(${
                  0.88 + local * 0.12
                })`,
                transformStyle: 'preserve-3d',
                opacity: local,
                zIndex: c.z,
                borderRadius: 14,
                overflow: 'hidden',
                border: `1.4px solid ${COLORS.panelBorder}`,
                boxShadow: `0 18px 60px rgba(2,6,23,0.55), 0 0 ${
                  i === 0 ? 70 : 40
                }px ${COLORS.glow}`,
                background: COLORS.bgDeep,
              }}
            >
              <Img
                src={staticFile(c.src)}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  filter: 'brightness(1.04) saturate(1.08)',
                }}
              />
              <AbsoluteFill
                style={{
                  background: `linear-gradient(180deg, rgba(56,189,248,0.06) 0%, transparent 40%, transparent 60%, rgba(2,6,23,0.45) 100%)`,
                  pointerEvents: 'none',
                }}
              />
            </div>
          );
        })}
      </AbsoluteFill>

      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        style={{
          position: 'absolute',
          inset: 0,
          mixBlendMode: 'screen',
          opacity: e,
        }}
      >
        <defs>
          <linearGradient id="s4LineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0" />
            <stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.75" />
            <stop offset="100%" stopColor={COLORS.violet} stopOpacity="0" />
          </linearGradient>
        </defs>
        <line
          x1={W / 2 - 230 + drift}
          y1={H / 2}
          x2={300}
          y2={290}
          stroke="url(#s4LineGrad)"
          strokeWidth="1.4"
          strokeDasharray="3 6"
        />
        <line
          x1={W / 2 + 230 + drift}
          y1={H / 2}
          x2={W - 300}
          y2={290}
          stroke="url(#s4LineGrad)"
          strokeWidth="1.4"
          strokeDasharray="3 6"
        />
      </svg>

      <AbsoluteFill
        style={{
          background: `radial-gradient(40% 40% at 50% 50%, rgba(255,255,255,${
            burst * 0.18
          }), transparent 70%)`,
          mixBlendMode: 'screen',
          pointerEvents: 'none',
        }}
      />
    </AbsoluteFill>
  );
};

/* ---------------------------- Shared Pieces ---------------------------- */

const FloatingCard: React.FC<{
  src: string;
  x: number;
  y: number;
  w: number;
  h: number;
  rotate: number;
  opacity: number;
  framePhase: number;
  delay: number;
}> = ({ src, x, y, w, h, rotate, opacity, framePhase, delay }) => {
  const drift = Math.sin((framePhase + delay) * 0.05) * 5;
  const driftY = Math.cos((framePhase + delay) * 0.045) * 4;
  const isCneMap = src === ASSET_MAP;
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
      <Img
        src={staticFile(src)}
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
          filter: 'brightness(1.02) saturate(1.05)',
        }}
      />
      {isCneMap && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '8%',
            height: '10%',
            background: COLORS.bgDeep,
            zIndex: 10,
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

const RingGlow: React.FC<{
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  opacity: number;
}> = ({ cx, cy, rx, ry, opacity }) => {
  return (
    <svg
      width="100%"
      height="100%"
      viewBox={`0 0 ${W} ${H}`}
      style={{
        position: 'absolute',
        inset: 0,
        mixBlendMode: 'screen',
        opacity,
        pointerEvents: 'none',
      }}
    >
      <defs>
        <radialGradient id="ringGlowGrad" cx="50%" cy="50%" r="50%">
          <stop offset="55%" stopColor={COLORS.cyan} stopOpacity="0" />
          <stop offset="80%" stopColor={COLORS.cyan} stopOpacity="0.45" />
          <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
        </radialGradient>
      </defs>
      <ellipse cx={cx} cy={cy} rx={rx + 40} ry={ry + 24} fill="url(#ringGlowGrad)" />
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
    [
      margin,
      H - margin,
      margin + size,
      H - margin,
      margin,
      H - margin - size,
    ],
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

/* ---------------------------- Background ---------------------------- */

const BackgroundLayers: React.FC = () => {
  return (
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
};

const PerspectiveGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 32], [0, 0.7], {
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
        x: (random(`sx${seed}`) as number) * W,
        y: (random(`sy${seed}`) as number) * H,
        r: 0.4 + (random(`sr${seed}`) as number) * 1.4,
        phase: (random(`sp${seed}`) as number) * Math.PI * 2,
        speed: 0.04 + (random(`ss${seed}`) as number) * 0.08,
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
          <linearGradient id="hsAuroraA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0" />
            <stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.35" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="hsAuroraB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.violet} stopOpacity="0" />
            <stop offset="55%" stopColor={COLORS.violet} stopOpacity="0.30" />
            <stop offset="100%" stopColor={COLORS.violet} stopOpacity="0" />
          </linearGradient>
          <filter id="hsAuroraBlur">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <g filter="url(#hsAuroraBlur)">
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
            fill="url(#hsAuroraA)"
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
            fill="url(#hsAuroraB)"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const FloatingParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const particles = React.useMemo(() => {
    return Array.from({ length: 42 }).map((_, i) => {
      const seed = i + 200;
      return {
        baseX: (random(`px${seed}`) as number) * W,
        baseY: (random(`py${seed}`) as number) * H,
        phase: (random(`pp${seed}`) as number) * Math.PI * 2,
        speed: 0.35 + (random(`ps${seed}`) as number) * 0.7,
        size: 1.2 + (random(`psz${seed}`) as number) * 2.4,
        hue: (random(`ph${seed}`) as number) > 0.78,
      };
    });
  }, []);

  return (
    <AbsoluteFill
      style={{ pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.7 }}
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {particles.map((p, i) => {
          const x =
            p.baseX + Math.sin(frame * 0.012 * p.speed + p.phase) * 22;
          const y =
            p.baseY + Math.cos(frame * 0.014 * p.speed + p.phase) * 18;
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
  const op = Math.sin(phase * Math.PI) * 0.32;
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

const Vignette: React.FC = () => {
  return (
    <AbsoluteFill
      style={{
        pointerEvents: 'none',
        background:
          'radial-gradient(120% 90% at 50% 50%, transparent 50%, rgba(2, 6, 23, 0.92) 100%)',
      }}
    />
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = React.useMemo(() => {
    return Array.from({ length: 180 }).map((_, i) => {
      const seed = i + 1;
      return {
        x: (random(`gx${seed}`) as number) * W,
        y: (random(`gy${seed}`) as number) * H,
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
