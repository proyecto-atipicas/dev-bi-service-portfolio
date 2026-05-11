import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const W = 1280;
const H = 720;

const COLORS = {
  bgDeep: '#020617',
  bgMid: '#060d1f',
  bgSoft: '#0b1730',
  panelBg: 'rgba(10, 18, 38, 0.55)',
  panelBorder: 'rgba(56, 189, 248, 0.18)',
  gridFaint: 'rgba(56, 189, 248, 0.06)',
  gridGlow: 'rgba(56, 189, 248, 0.22)',
  text: '#f1f5f9',
  textDim: '#94a3b8',
  textSoft: '#64748b',
  cyan: '#22d3ee',
  cyanDeep: '#06b6d4',
  blue: '#3b82f6',
  blueDeep: '#1d4ed8',
  violet: '#8b5cf6',
  emerald: '#10b981',
};

const FONT =
  '"Inter", system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';
const FONT_MONO =
  '"JetBrains Mono", "Fira Code", ui-monospace, SFMono-Regular, Menlo, monospace';

export const HeroVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 12, durationInFrames - 18, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill
      style={{ backgroundColor: COLORS.bgDeep, fontFamily: FONT }}
    >
      <BackgroundLayers />
      <PerspectiveGrid />
      <Aurora />
      <Starfield />
      <Constellation />
      <ScanBeam />
      <AbsoluteFill style={{ opacity }}>
        <OrbitalCore />
        <HoloBars />
        <FloatingChips />
        <ContentLayer />
        <CornerHud />
      </AbsoluteFill>
      <Vignette />
      <Grain />
    </AbsoluteFill>
  );
};

const BackgroundLayers: React.FC = () => {
  return (
    <>
      <AbsoluteFill
        style={{
          background: `radial-gradient(80% 60% at 75% 18%, rgba(34, 211, 238, 0.18) 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(70% 60% at 18% 88%, rgba(59, 130, 246, 0.18) 0%, transparent 60%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(50% 40% at 50% 55%, rgba(139, 92, 246, 0.10) 0%, transparent 70%)`,
        }}
      />
    </>
  );
};

const Aurora: React.FC = () => {
  const frame = useCurrentFrame();
  const t = frame * 0.012;
  return (
    <AbsoluteFill style={{ mixBlendMode: 'screen', opacity: 0.55 }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="auroraA" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0" />
            <stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.35" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
          </linearGradient>
          <linearGradient id="auroraB" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.violet} stopOpacity="0" />
            <stop offset="55%" stopColor={COLORS.violet} stopOpacity="0.30" />
            <stop offset="100%" stopColor={COLORS.violet} stopOpacity="0" />
          </linearGradient>
          <filter id="auroraBlur">
            <feGaussianBlur stdDeviation="22" />
          </filter>
        </defs>
        <g filter="url(#auroraBlur)">
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
            fill="url(#auroraA)"
          />
          <path
            d={`M -50 ${520 + Math.cos(t * 1.1) * 22} C 360 ${
              480 + Math.sin(t * 0.8) * 26
            } 820 ${600 + Math.cos(t) * 24} ${W + 50} ${
              540 + Math.sin(t * 0.9) * 18
            } L ${W + 50} ${600 + Math.sin(t * 0.9) * 18} C 820 ${
              660 + Math.cos(t) * 24
            } 360 ${540 + Math.sin(t * 0.8) * 26} -50 ${
              580 + Math.cos(t * 1.1) * 22
            } Z`}
            fill="url(#auroraB)"
          />
        </g>
      </svg>
    </AbsoluteFill>
  );
};

const PerspectiveGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const horizonY = H * 0.58;
  const vanishX = W / 2;
  const scroll = (frame * 1.6) % 80;

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
        strokeWidth={i === 0 ? 1.4 : 1}
        opacity={i === 0 ? 0.45 : 0.6}
      />
    );
  }

  const horizontals: React.ReactElement[] = [];
  for (let i = 0; i < 10; i += 1) {
    const progress = (i + scroll / 80) / 10;
    const eased = Math.pow(progress, 1.8);
    const y = horizonY + (H + 60 - horizonY) * eased;
    const op = (1 - Math.abs(0.35 - eased)) * 0.5 + 0.1;
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
        <defs>
          <linearGradient id="horizonGlow" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0" />
            <stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.55" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="0" />
          </linearGradient>
        </defs>
        {radials}
        {horizontals}
        <rect
          x="0"
          y={horizonY - 1.5}
          width={W}
          height="3"
          fill="url(#horizonGlow)"
          opacity={0.7 + 0.3 * Math.sin(frame * 0.1)}
        />
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
        x: (random(`sx${seed}`) as number) * W,
        y: (random(`sy${seed}`) as number) * (H * 0.62),
        r: 0.4 + (random(`sr${seed}`) as number) * 1.4,
        phase: (random(`sp${seed}`) as number) * Math.PI * 2,
        speed: 0.04 + (random(`ss${seed}`) as number) * 0.08,
      };
    });
  }, []);

  return (
    <AbsoluteFill>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {stars.map((s, i) => {
          const op =
            0.25 + 0.55 * Math.abs(Math.sin(frame * s.speed + s.phase));
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

const Constellation: React.FC = () => {
  const frame = useCurrentFrame();
  const fade = interpolate(frame, [10, 50], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const N = 36;

  const points = React.useMemo(() => {
    return Array.from({ length: N }).map((_, i) => {
      const seed = i + 21;
      return {
        baseX: (random(`cx${seed}`) as number) * W,
        baseY: (random(`cy${seed}`) as number) * H,
        phase: (random(`cp${seed}`) as number) * Math.PI * 2,
        speed: 0.4 + (random(`cs${seed}`) as number) * 0.7,
        size: 1.4 + (random(`csz${seed}`) as number) * 2.4,
      };
    });
  }, []);

  const live = points.map((p, i) => {
    const x = p.baseX + Math.sin(frame * 0.012 * p.speed + p.phase) * 22;
    const y = p.baseY + Math.cos(frame * 0.014 * p.speed + p.phase) * 18;
    const blink =
      0.45 + Math.abs(Math.sin((frame + i * 9) * 0.05)) * 0.55;
    return { x, y, size: p.size, opacity: blink };
  });

  const edges: {
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    o: number;
  }[] = [];
  const maxDistSq = 22000;
  for (let i = 0; i < N; i += 1) {
    for (let j = i + 1; j < N; j += 1) {
      const dx = live[i].x - live[j].x;
      const dy = live[i].y - live[j].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < maxDistSq) {
        edges.push({
          x1: live[i].x,
          y1: live[i].y,
          x2: live[j].x,
          y2: live[j].y,
          o: (1 - d2 / maxDistSq) * 0.32,
        });
      }
    }
  }

  return (
    <AbsoluteFill style={{ opacity: fade, mixBlendMode: 'screen' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {edges.map((e, i) => (
          <line
            key={`e${i}`}
            x1={e.x1}
            y1={e.y1}
            x2={e.x2}
            y2={e.y2}
            stroke={COLORS.cyan}
            strokeWidth="1"
            opacity={e.o}
          />
        ))}
        {live.map((p, i) => (
          <g key={`n${i}`}>
            <circle
              cx={p.x}
              cy={p.y}
              r={p.size + 2}
              fill={COLORS.cyan}
              opacity={p.opacity * 0.18}
            />
            <circle
              cx={p.x}
              cy={p.y}
              r={p.size}
              fill={COLORS.cyan}
              opacity={p.opacity}
            />
          </g>
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const OrbitalCore: React.FC = () => {
  const frame = useCurrentFrame();
  const cx = 360;
  const cy = 380;
  const fade = interpolate(frame, [20, 70], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const rot = frame * 0.6;
  const pulse = 1 + Math.sin(frame * 0.08) * 0.04;

  const orbitDots = Array.from({ length: 24 }).map((_, i) => {
    const a = (i / 24) * Math.PI * 2 + frame * 0.02;
    const r = 132;
    return {
      x: cx + Math.cos(a) * r,
      y: cy + Math.sin(a) * r * 0.42,
      depth: Math.sin(a) * 0.5 + 0.5,
    };
  });

  return (
    <AbsoluteFill
      style={{ opacity: fade, mixBlendMode: 'screen' }}
      pointerEvents="none"
    >
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={COLORS.cyan} stopOpacity="0.85" />
            <stop offset="40%" stopColor={COLORS.blue} stopOpacity="0.35" />
            <stop offset="100%" stopColor={COLORS.blue} stopOpacity="0" />
          </radialGradient>
          <linearGradient id="ringStroke" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} />
            <stop offset="100%" stopColor={COLORS.violet} />
          </linearGradient>
        </defs>

        <circle cx={cx} cy={cy} r={170} fill="url(#coreGlow)" />

        {[100, 130, 160].map((r, i) => (
          <ellipse
            key={`ring${i}`}
            cx={cx}
            cy={cy}
            rx={r * pulse}
            ry={r * 0.42 * pulse}
            fill="none"
            stroke="url(#ringStroke)"
            strokeWidth={i === 1 ? 1.6 : 1}
            opacity={0.45 - i * 0.08}
            transform={`rotate(${rot * (i + 1) * 0.4} ${cx} ${cy})`}
          />
        ))}

        <ellipse
          cx={cx}
          cy={cy}
          rx={150}
          ry={150 * 0.42}
          fill="none"
          stroke={COLORS.cyan}
          strokeWidth="1.4"
          strokeDasharray="6 14"
          opacity={0.55}
          transform={`rotate(${-rot * 0.5} ${cx} ${cy})`}
        />

        <circle
          cx={cx}
          cy={cy}
          r={6}
          fill={COLORS.cyan}
          opacity={0.95}
        />
        <circle
          cx={cx}
          cy={cy}
          r={14}
          fill={COLORS.cyan}
          opacity={0.25 + 0.2 * Math.sin(frame * 0.18)}
        />

        {orbitDots.map((d, i) => (
          <circle
            key={`od${i}`}
            cx={d.x}
            cy={d.y}
            r={1.6 + d.depth * 1.6}
            fill={i % 4 === 0 ? COLORS.violet : COLORS.cyan}
            opacity={0.35 + d.depth * 0.55}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const HoloBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const reveal = spring({
    frame: frame - 35,
    fps,
    config: { damping: 18, stiffness: 80 },
  });
  if (reveal < 0.02) return null;

  const baseX = 880;
  const baseY = 500;
  const bars = 9;
  const gap = 16;
  const barW = 22;

  return (
    <AbsoluteFill style={{ opacity: reveal, mixBlendMode: 'screen' }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        <defs>
          <linearGradient id="barGrad" x1="0%" y1="100%" x2="0%" y2="0%">
            <stop offset="0%" stopColor={COLORS.blue} stopOpacity="0.15" />
            <stop offset="50%" stopColor={COLORS.cyan} stopOpacity="0.85" />
            <stop offset="100%" stopColor={COLORS.cyan} stopOpacity="1" />
          </linearGradient>
        </defs>
        {Array.from({ length: bars }).map((_, i) => {
          const seed = i * 0.7;
          const t = frame * 0.05 + seed;
          const target = 70 + Math.sin(t) * 50 + Math.cos(t * 0.6) * 30;
          const heightPx = Math.max(20, target);
          const x = baseX + i * (barW + gap);
          const y = baseY - heightPx;
          return (
            <g key={`bar${i}`}>
              <rect
                x={x}
                y={y}
                width={barW}
                height={heightPx}
                rx={4}
                fill="url(#barGrad)"
                opacity={0.75}
              />
              <rect
                x={x}
                y={y - 2}
                width={barW}
                height={3}
                fill={COLORS.cyan}
                opacity={0.95}
              />
            </g>
          );
        })}
        <line
          x1={baseX - 12}
          y1={baseY + 4}
          x2={baseX + bars * (barW + gap) - gap + 12}
          y2={baseY + 4}
          stroke={COLORS.cyan}
          strokeWidth="1"
          opacity={0.5}
        />
      </svg>
    </AbsoluteFill>
  );
};

const FloatingChips: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const chips = [
    { label: 'KPI · Adopción', x: 820, y: 200, delay: 60, accent: COLORS.cyan },
    { label: 'ETL · Activo', x: 980, y: 310, delay: 75, accent: COLORS.emerald },
    { label: 'Stream · OK', x: 110, y: 220, delay: 90, accent: COLORS.violet },
  ];

  return (
    <>
      {chips.map((c, i) => {
        const e = spring({
          frame: frame - c.delay,
          fps,
          config: { damping: 16, stiffness: 90 },
        });
        if (e < 0.02) return null;
        const float = Math.sin(frame * 0.04 + i) * 4;
        return (
          <div
            key={i}
            style={{
              position: 'absolute',
              left: c.x,
              top: c.y + float,
              opacity: e,
              transform: `translateY(${(1 - e) * 12}px)`,
              padding: '8px 14px',
              borderRadius: 999,
              background: 'rgba(8, 14, 30, 0.7)',
              border: `1px solid ${c.accent}55`,
              color: COLORS.text,
              fontSize: 12,
              fontFamily: FONT_MONO,
              fontWeight: 500,
              letterSpacing: 0.5,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              boxShadow: `0 0 22px ${c.accent}33`,
              backdropFilter: 'blur(6px)',
            }}
          >
            <span
              style={{
                width: 6,
                height: 6,
                borderRadius: '50%',
                background: c.accent,
                boxShadow: `0 0 10px ${c.accent}`,
              }}
            />
            {c.label}
          </div>
        );
      })}
    </>
  );
};

const ContentLayer: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const eyebrowOp = interpolate(frame, [12, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const eyebrowY = interpolate(frame, [12, 38], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const title = 'Datos en decisiones.';
  const titleStart = 26;
  const perChar = 1.6;

  const sub = spring({
    frame: frame - 70,
    fps,
    config: { damping: 22, stiffness: 70 },
  });

  return (
    <div
      style={{
        position: 'absolute',
        inset: 0,
        padding: '64px 72px',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <div
          style={{
            opacity: eyebrowOp,
            transform: `translateY(${eyebrowY}px)`,
            display: 'flex',
            alignItems: 'center',
            gap: 12,
          }}
        >
          <div
            style={{
              width: 28,
              height: 1,
              background: `linear-gradient(90deg, transparent, ${COLORS.cyan})`,
            }}
          />
          <div
            style={{
              color: COLORS.cyan,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 5,
              textTransform: 'uppercase',
              fontFamily: FONT_MONO,
            }}
          >
            Business Intelligence
          </div>
        </div>
        <LiveBadge />
      </div>

      <div>
        <h1
          style={{
            margin: 0,
            color: COLORS.text,
            fontSize: 78,
            fontWeight: 700,
            lineHeight: 0.98,
            letterSpacing: -2.2,
            whiteSpace: 'nowrap',
          }}
        >
          {title.split('').map((ch, i) => {
            const start = titleStart + i * perChar;
            const o = interpolate(frame, [start, start + 14], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            const y = interpolate(frame, [start, start + 14], [22, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            });
            return (
              <span
                key={i}
                style={{
                  display: 'inline-block',
                  opacity: o,
                  transform: `translateY(${y}px)`,
                  background:
                    ch === '.'
                      ? `linear-gradient(180deg, ${COLORS.cyan}, ${COLORS.violet})`
                      : 'linear-gradient(180deg, #f8fafc 0%, #cbd5e1 100%)',
                  WebkitBackgroundClip: 'text',
                  backgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  whiteSpace: 'pre',
                }}
              >
                {ch}
              </span>
            );
          })}
        </h1>

        <p
          style={{
            margin: '20px 0 0',
            color: COLORS.textDim,
            fontSize: 20,
            fontWeight: 400,
            lineHeight: 1.45,
            maxWidth: 560,
            opacity: sub,
            transform: `translateY(${(1 - sub) * 14}px)`,
          }}
        >
          Plataforma de inteligencia de negocio que conecta automatización,
          reportería y desarrollo a la medida sobre datos confiables.
        </p>
      </div>
    </div>
  );
};

const LiveBadge: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [22, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const pulse = 0.5 + 0.5 * Math.abs(Math.sin(frame * 0.18));
  return (
    <div
      style={{
        opacity: op,
        display: 'flex',
        alignItems: 'center',
        gap: 10,
        padding: '8px 14px',
        borderRadius: 999,
        background: 'rgba(8, 14, 30, 0.6)',
        border: `1px solid ${COLORS.panelBorder}`,
        backdropFilter: 'blur(6px)',
      }}
    >
      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: COLORS.emerald,
          boxShadow: `0 0 ${8 + pulse * 8}px ${COLORS.emerald}`,
        }}
      />
      <div
        style={{
          color: COLORS.textDim,
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: 2.5,
          textTransform: 'uppercase',
          fontFamily: FONT_MONO,
        }}
      >
        Live · ingest
      </div>
    </div>
  );
};

const CornerHud: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [40, 80], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const tick = Math.floor(frame / 6) % 999;
  return (
    <div
      style={{
        position: 'absolute',
        right: 72,
        bottom: 56,
        opacity: op,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'flex-end',
        gap: 6,
        fontFamily: FONT_MONO,
        color: COLORS.textSoft,
        fontSize: 11,
        letterSpacing: 1.4,
      }}
    >
      <div style={{ color: COLORS.cyan, fontWeight: 600 }}>SYS · 0x{tick.toString(16).toUpperCase().padStart(3, '0')}</div>
      <div>NODES 36 · LINKS LIVE</div>
      <div>UPTIME 99.98%</div>
    </div>
  );
};

const ScanBeam: React.FC = () => {
  const frame = useCurrentFrame();
  const cycle = 180;
  const phase = (frame % cycle) / cycle;
  const y = -120 + phase * (H + 240);
  const op = Math.sin(phase * Math.PI) * 0.45;
  return (
    <AbsoluteFill style={{ pointerEvents: 'none', mixBlendMode: 'screen' }}>
      <div
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          top: y,
          height: 110,
          background: `linear-gradient(180deg, transparent 0%, ${COLORS.cyan}33 45%, ${COLORS.cyan}55 50%, ${COLORS.cyan}33 55%, transparent 100%)`,
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
          'radial-gradient(120% 90% at 50% 50%, transparent 55%, rgba(2, 6, 23, 0.85) 100%)',
      }}
    />
  );
};

const Grain: React.FC = () => {
  const frame = useCurrentFrame();
  const dots = React.useMemo(() => {
    return Array.from({ length: 240 }).map((_, i) => {
      const seed = i + 1;
      return {
        x: (random(`gx${seed}`) as number) * W,
        y: (random(`gy${seed}`) as number) * H,
      };
    });
  }, []);
  const shift = frame % 3;
  return (
    <AbsoluteFill style={{ opacity: 0.06, pointerEvents: 'none' }}>
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
