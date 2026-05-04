import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  staticFile,
  useCurrentFrame,
  useVideoConfig,
  Video,
} from 'remotion';

const COLORS = {
  bgBase: '#f8fafc',
  bgSoft: '#e0ecff',
  bgAccent: '#dbeafe',
  panelBg: 'rgba(255, 255, 255, 0.78)',
  panelBorder: 'rgba(148, 163, 184, 0.28)',
  gridLine: 'rgba(100, 116, 139, 0.12)',
  text: '#0f172a',
  textDim: '#475569',
  textSoft: '#64748b',
  blue: '#2563eb',
  blueSoft: '#3b82f6',
  blueLight: '#93c5fd',
  cyan: '#0891b2',
  cyanLight: '#22d3ee',
  green: '#16a34a',
  greenLight: '#22c55e',
};

const FONT = 'system-ui, -apple-system, "Segoe UI", Roboto, sans-serif';

export const HeroVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 14, durationInFrames - 22, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgBase, fontFamily: FONT }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 80% 10%, ${COLORS.bgAccent} 0%, ${COLORS.bgBase} 55%)`,
        }}
      />
      <AbsoluteFill
        style={{
          background: `radial-gradient(90% 70% at 10% 90%, ${COLORS.bgSoft} 0%, transparent 55%)`,
        }}
      />
      <BackgroundGrid />
      <NetworkParticles />
      <AbsoluteFill style={{ opacity, padding: 56 }}>
        <Header />
        <Dashboard />
      </AbsoluteFill>
    </AbsoluteFill>
  );
};

const BackgroundGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const cell = 80;
  const cols = Math.ceil(1280 / cell) + 1;
  const rows = Math.ceil(720 / cell) + 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 1280 720"
        preserveAspectRatio="none"
      >
        {Array.from({ length: cols }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * cell}
            y1="0"
            x2={i * cell}
            y2="720"
            stroke={COLORS.gridLine}
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: rows }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * cell}
            x2="1280"
            y2={i * cell}
            stroke={COLORS.gridLine}
            strokeWidth="1"
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const NetworkParticles: React.FC = () => {
  const frame = useCurrentFrame();
  const fadeIn = interpolate(frame, [0, 40], [0, 1], {
    extrapolateRight: 'clamp',
  });
  const N = 50;

  const points = React.useMemo(() => {
    return Array.from({ length: N }).map((_, i) => {
      const seed = i + 1;
      const baseX = (random(`x${seed}`) as number) * 1280;
      const baseY = (random(`y${seed}`) as number) * 720;
      const phase = (random(`p${seed}`) as number) * Math.PI * 2;
      const speed = 0.4 + (random(`s${seed}`) as number) * 0.7;
      const size = 1.2 + (random(`sz${seed}`) as number) * 2.0;
      return { baseX, baseY, phase, speed, size };
    });
  }, []);

  const live = points.map((p, i) => {
    const x = p.baseX + Math.sin(frame * 0.01 * p.speed + p.phase) * 20;
    const y = p.baseY + Math.cos(frame * 0.012 * p.speed + p.phase) * 16;
    const blink =
      0.35 + Math.abs(Math.sin((frame + i * 7) * 0.04)) * 0.65;
    return { x, y, size: p.size, opacity: blink };
  });

  const lines: { x1: number; y1: number; x2: number; y2: number; o: number }[] = [];
  const maxDistSq = 16000;
  for (let i = 0; i < N; i += 1) {
    for (let j = i + 1; j < N; j += 1) {
      const dx = live[i].x - live[j].x;
      const dy = live[i].y - live[j].y;
      const d2 = dx * dx + dy * dy;
      if (d2 < maxDistSq) {
        lines.push({
          x1: live[i].x,
          y1: live[i].y,
          x2: live[j].x,
          y2: live[j].y,
          o: (1 - d2 / maxDistSq) * 0.16,
        });
      }
    }
  }

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width="100%" height="100%" viewBox="0 0 1280 720">
        {lines.map((l, i) => (
          <line
            key={i}
            x1={l.x1}
            y1={l.y1}
            x2={l.x2}
            y2={l.y2}
            stroke={COLORS.blueSoft}
            strokeWidth="1"
            opacity={l.o}
          />
        ))}
        {live.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={COLORS.blueSoft}
            opacity={p.opacity * 0.45}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const Header: React.FC = () => {
  const frame = useCurrentFrame();
  const titleY = interpolate(frame, [10, 38], [-18, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const titleOp = interpolate(frame, [10, 38], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dotOp = interpolate(frame, [22, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <div style={{ transform: `translateY(${titleY}px)`, opacity: titleOp }}>
        <div
          style={{
            color: COLORS.cyan,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 4,
            textTransform: 'uppercase',
            marginBottom: 8,
          }}
        >
          Business Intelligence
        </div>
        <div
          style={{
            color: COLORS.text,
            fontSize: 36,
            fontWeight: 600,
            lineHeight: 1.1,
            letterSpacing: -0.5,
          }}
        >
          Datos en decisiones.
        </div>
      </div>
      <div
        style={{
          opacity: dotOp,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 56,
            height: 3,
            background: `linear-gradient(90deg, transparent, ${COLORS.green})`,
            borderRadius: 2,
          }}
        />
        <div
          style={{
            width: 9,
            height: 9,
            borderRadius: '50%',
            background: COLORS.green,
            boxShadow: `0 0 12px ${COLORS.greenLight}`,
            opacity: 0.55 + 0.45 * Math.sin(frame * 0.18),
          }}
        />
        <div
          style={{
            color: COLORS.textSoft,
            fontSize: 12,
            fontWeight: 600,
            letterSpacing: 2,
            textTransform: 'uppercase',
          }}
        >
          en vivo
        </div>
      </div>
    </div>
  );
};

const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const entry = (offset: number) =>
    spring({
      frame: frame - offset,
      fps,
      config: { damping: 18, stiffness: 90 },
    });

  return (
    <div
      style={{
        marginTop: 36,
        display: 'grid',
        gridTemplateColumns: '1fr 1.25fr',
        gap: 22,
        height: 480,
      }}
    >
      <div
        style={{
          opacity: entry(28),
          transform: `translateY(${(1 - entry(28)) * 22}px)`,
          background: COLORS.panelBg,
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: 18,
          padding: 22,
          height: 460,
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0,
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <div
          style={{
            position: 'relative',
            flex: 1,
            minHeight: 0,
            borderRadius: 12,
            overflow: 'hidden',
          }}
        >
          <Video
            src={staticFile('servicio-automatizacion.mp4')}
            muted
            loop
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
            }}
          />
        </div>
      </div>
      <div
        style={{
          opacity: entry(40),
          transform: `translateY(${(1 - entry(40)) * 22}px)`,
          background: COLORS.panelBg,
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: 18,
          padding: 26,
          height: 460,
          boxShadow: '0 18px 40px rgba(15, 23, 42, 0.06)',
          backdropFilter: 'blur(8px)',
        }}
      >
        <LineChartPanel />
      </div>
    </div>
  );
};

const LineChartPanel: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const N = 28;
  const w = 540;
  const h = 320;

  const data = Array.from({ length: N }).map((_, i) => {
    const x = (i / (N - 1)) * w;
    const t = i / (N - 1);
    const baseY = h * 0.85 - h * 0.55 * t;
    const wave = Math.sin(i * 0.6 + frame * 0.04) * 22;
    const wave2 = Math.cos(i * 0.4 + frame * 0.03) * 13;
    const y = Math.min(h - 8, Math.max(8, baseY + wave + wave2));
    return { x, y };
  });

  const reveal = interpolate(frame, [50, 130], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const visibleCount = Math.max(2, Math.floor(N * reveal));
  const visible = data.slice(0, visibleCount);
  const pathD = visible
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');
  const last = visible[visible.length - 1];
  const first = visible[0];
  const areaD = `${pathD} L ${last.x.toFixed(2)} ${h} L ${first.x.toFixed(2)} ${h} Z`;

  const kpi = spring({
    frame: frame - 50,
    fps,
    config: { damping: 22, stiffness: 80 },
  });
  const kpiVal = Math.round(kpi * 247).toString();

  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 18,
        }}
      >
        <div>
          <div
            style={{
              color: COLORS.textSoft,
              fontSize: 11,
              fontWeight: 600,
              letterSpacing: 2,
              textTransform: 'uppercase',
            }}
          >
            Adopción
          </div>
          <div
            style={{
              color: COLORS.text,
              fontSize: 18,
              fontWeight: 600,
              marginTop: 2,
            }}
          >
            Tableros activos
          </div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div
            style={{
              color: COLORS.blue,
              fontSize: 30,
              fontWeight: 700,
              fontVariantNumeric: 'tabular-nums',
              lineHeight: 1,
            }}
          >
            +{kpiVal}
          </div>
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <svg
          width="100%"
          height="100%"
          viewBox={`0 0 ${w} ${h}`}
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="areaGrad" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor={COLORS.blueSoft} stopOpacity="0.35" />
              <stop offset="100%" stopColor={COLORS.blueSoft} stopOpacity="0" />
            </linearGradient>
            <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={COLORS.blue} />
              <stop offset="100%" stopColor={COLORS.cyan} />
            </linearGradient>
          </defs>
          {[0.25, 0.5, 0.75].map((t, i) => (
            <line
              key={i}
              x1="0"
              y1={h * t}
              x2={w}
              y2={h * t}
              stroke={COLORS.textSoft}
              strokeOpacity="0.12"
              strokeDasharray="4 4"
            />
          ))}
          <path d={areaD} fill="url(#areaGrad)" />
          <path
            d={pathD}
            fill="none"
            stroke="url(#lineGrad)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <circle cx={last.x} cy={last.y} r="6" fill={COLORS.cyan} />
          <circle
            cx={last.x}
            cy={last.y}
            r="14"
            fill={COLORS.cyanLight}
            opacity={0.25 + 0.2 * Math.sin(frame * 0.18)}
          />
        </svg>
      </div>
    </div>
  );
};
