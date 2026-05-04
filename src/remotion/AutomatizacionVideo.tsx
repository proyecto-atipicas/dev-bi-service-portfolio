import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from 'remotion';

const COLORS = {
  bgDeep: '#050b1a',
  bgMid: '#0f265a',
  blue: '#2563eb',
  blueSoft: '#60a5fa',
  blueLight: '#93c5fd',
  cyan: '#22d3ee',
  green: '#22c55e',
  amber: '#f59e0b',
  white: '#ffffff',
  panelBg: 'rgba(15, 37, 90, 0.42)',
  panelBorder: 'rgba(96, 165, 250, 0.28)',
};

const W = 1280;
const H = 720;

export const AutomatizacionVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames } = useVideoConfig();
  const opacity = interpolate(
    frame,
    [0, 14, durationInFrames - 22, durationInFrames - 1],
    [0, 1, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
  );

  return (
    <AbsoluteFill style={{ backgroundColor: COLORS.bgDeep }}>
      <AbsoluteFill
        style={{
          background: `radial-gradient(120% 90% at 22% 20%, ${COLORS.bgMid} 0%, ${COLORS.bgDeep} 65%)`,
        }}
      />
      <BackgroundGrid />
      <NetworkParticles />
      <AbsoluteFill style={{ opacity, padding: 56 }}>
        <StatusDot />
        <Pipeline />
        <AbstractBars />
      </AbsoluteFill>
      <AbsoluteFill
        style={{
          pointerEvents: 'none',
          background:
            'radial-gradient(80% 60% at 50% 50%, transparent 55%, rgba(0,0,0,0.55) 100%)',
        }}
      />
    </AbsoluteFill>
  );
};

const BackgroundGrid: React.FC = () => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [0, 30], [0, 0.16], {
    extrapolateRight: 'clamp',
  });
  const cell = 80;
  const cols = Math.ceil(W / cell) + 1;
  const rows = Math.ceil(H / cell) + 1;
  return (
    <AbsoluteFill style={{ opacity }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="none"
      >
        {Array.from({ length: cols }).map((_, i) => (
          <line
            key={`v${i}`}
            x1={i * cell}
            y1="0"
            x2={i * cell}
            y2={H}
            stroke={COLORS.blueLight}
            strokeWidth="1"
          />
        ))}
        {Array.from({ length: rows }).map((_, i) => (
          <line
            key={`h${i}`}
            x1="0"
            y1={i * cell}
            x2={W}
            y2={i * cell}
            stroke={COLORS.blueLight}
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
      const baseX = (random(`x${seed}`) as number) * W;
      const baseY = (random(`y${seed}`) as number) * H;
      const phase = (random(`p${seed}`) as number) * Math.PI * 2;
      const speed = 0.4 + (random(`s${seed}`) as number) * 0.7;
      const size = 1.2 + (random(`sz${seed}`) as number) * 2.0;
      return { baseX, baseY, phase, speed, size };
    });
  }, []);

  const live = points.map((p, i) => {
    const x = p.baseX + Math.sin(frame * 0.01 * p.speed + p.phase) * 18;
    const y = p.baseY + Math.cos(frame * 0.012 * p.speed + p.phase) * 14;
    const blink = 0.35 + Math.abs(Math.sin((frame + i * 7) * 0.04)) * 0.65;
    return { x, y, size: p.size, opacity: blink };
  });

  return (
    <AbsoluteFill style={{ opacity: fadeIn }}>
      <svg width="100%" height="100%" viewBox={`0 0 ${W} ${H}`}>
        {live.map((p, i) => (
          <circle
            key={i}
            cx={p.x}
            cy={p.y}
            r={p.size}
            fill={COLORS.blueSoft}
            opacity={p.opacity * 0.55}
          />
        ))}
      </svg>
    </AbsoluteFill>
  );
};

const StatusDot: React.FC = () => {
  const frame = useCurrentFrame();
  const op = interpolate(frame, [22, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  return (
    <div
      style={{
        opacity: op,
        display: 'flex',
        justifyContent: 'flex-end',
        alignItems: 'center',
        gap: 10,
      }}
    >
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: COLORS.green,
          boxShadow: `0 0 14px ${COLORS.green}`,
          opacity: 0.5 + 0.5 * Math.sin(frame * 0.18),
        }}
      />
      <div
        style={{
          width: 64,
          height: 4,
          background: `linear-gradient(90deg, ${COLORS.green}, transparent)`,
          borderRadius: 2,
        }}
      />
    </div>
  );
};

type Node = {
  x: number;
  y: number;
  icon: 'capture' | 'gear' | 'monitor';
  color: string;
};

const NODES: Node[] = [
  { x: 180, y: 130, icon: 'capture', color: COLORS.blueSoft },
  { x: 590, y: 130, icon: 'gear', color: COLORS.cyan },
  { x: 1000, y: 130, icon: 'monitor', color: COLORS.green },
];

const Pipeline: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panelE = spring({
    frame: frame - 24,
    fps,
    config: { damping: 18, stiffness: 90 },
  });

  return (
    <div
      style={{
        marginTop: 24,
        opacity: panelE,
        transform: `translateY(${(1 - panelE) * 22}px)`,
        background: COLORS.panelBg,
        border: `1px solid ${COLORS.panelBorder}`,
        borderRadius: 18,
        padding: 24,
        height: 300,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <svg
        width="100%"
        height="260"
        viewBox="0 0 1180 260"
        style={{ position: 'absolute', left: 24, top: 20 }}
      >
        <defs>
          <linearGradient id="edgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.blueSoft} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
          <linearGradient id="edgeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} />
            <stop offset="100%" stopColor={COLORS.green} />
          </linearGradient>
        </defs>

        <Edge from={NODES[0]} to={NODES[1]} stroke="url(#edgeGrad)" appearAt={36} />
        <Edge from={NODES[1]} to={NODES[2]} stroke="url(#edgeGrad2)" appearAt={56} />

        <Packets from={NODES[0]} to={NODES[1]} startFrame={64} color={COLORS.blueSoft} />
        <Packets from={NODES[1]} to={NODES[2]} startFrame={84} color={COLORS.cyan} />

        {NODES.map((n, i) => (
          <PipelineNode key={i} node={n} appearAt={32 + i * 16} index={i} />
        ))}
      </svg>
    </div>
  );
};

const Edge: React.FC<{
  from: Node;
  to: Node;
  stroke: string;
  appearAt: number;
}> = ({ from, to, stroke, appearAt }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [appearAt, appearAt + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const len = to.x - from.x - 110;
  const drawn = len * reveal;
  return (
    <line
      x1={from.x + 55}
      y1={from.y}
      x2={from.x + 55 + drawn}
      y2={to.y}
      stroke={stroke}
      strokeWidth="3"
      strokeLinecap="round"
      strokeDasharray="2 6"
    />
  );
};

const Packets: React.FC<{
  from: Node;
  to: Node;
  startFrame: number;
  color: string;
}> = ({ from, to, startFrame, color }) => {
  const frame = useCurrentFrame();
  const COUNT = 4;
  const SPAN = 36;
  const x1 = from.x + 55;
  const x2 = to.x - 55;

  return (
    <>
      {Array.from({ length: COUNT }).map((_, i) => {
        const t = ((frame - startFrame - i * 14) % SPAN) / SPAN;
        if (frame < startFrame + i * 14) return null;
        if (t < 0 || t > 1) return null;
        const x = x1 + (x2 - x1) * t;
        const y = from.y;
        const fade = Math.sin(t * Math.PI);
        return (
          <g key={i}>
            <circle cx={x} cy={y} r="9" fill={color} opacity={fade * 0.18} />
            <circle cx={x} cy={y} r="4" fill={color} opacity={fade} />
          </g>
        );
      })}
    </>
  );
};

const PipelineNode: React.FC<{
  node: Node;
  appearAt: number;
  index: number;
}> = ({ node, appearAt, index }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const e = spring({
    frame: frame - appearAt,
    fps,
    config: { damping: 16, stiffness: 110 },
  });
  const pulse = 1 + Math.sin((frame + index * 18) * 0.08) * 0.04;
  const haloOp = 0.18 + 0.12 * Math.sin((frame + index * 18) * 0.1);

  return (
    <g
      transform={`translate(${node.x} ${node.y}) scale(${e * pulse})`}
      opacity={e}
    >
      <circle r="62" fill={node.color} opacity={haloOp} />
      <circle r="48" fill={COLORS.bgMid} stroke={node.color} strokeWidth="2.5" />
      <NodeIcon name={node.icon} color={node.color} />
    </g>
  );
};

const NodeIcon: React.FC<{ name: Node['icon']; color: string }> = ({
  name,
  color,
}) => {
  if (name === 'capture') {
    return (
      <g transform="translate(-12 -14)" stroke={color} strokeWidth="2.5" fill="none">
        <rect x="0" y="2" width="22" height="26" rx="2" />
        <line x1="5" y1="9" x2="17" y2="9" />
        <line x1="5" y1="15" x2="17" y2="15" />
        <line x1="5" y1="21" x2="13" y2="21" />
      </g>
    );
  }
  if (name === 'gear') {
    return <SpinningGear color={color} />;
  }
  return (
    <g
      transform="translate(-14 -10)"
      fill="none"
      stroke={color}
      strokeWidth="2.8"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points="0,20 8,10 14,16 22,2 28,8" />
      <circle cx="22" cy="2" r="2.5" fill={color} />
    </g>
  );
};

const SpinningGear: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const teeth = 8;
  const r = 13;
  const rOuter = 19;
  const path = Array.from({ length: teeth })
    .map((_, i) => {
      const a1 = (i / teeth) * Math.PI * 2;
      const a2 = ((i + 0.5) / teeth) * Math.PI * 2;
      const a3 = ((i + 1) / teeth) * Math.PI * 2;
      const x1 = Math.cos(a1) * rOuter;
      const y1 = Math.sin(a1) * rOuter;
      const x2 = Math.cos(a2) * r;
      const y2 = Math.sin(a2) * r;
      const x3 = Math.cos(a3) * rOuter;
      const y3 = Math.sin(a3) * rOuter;
      return `${i === 0 ? 'M' : 'L'} ${x1.toFixed(2)} ${y1.toFixed(2)} L ${x2.toFixed(2)} ${y2.toFixed(2)} L ${x3.toFixed(2)} ${y3.toFixed(2)}`;
    })
    .join(' ') + ' Z';
  return (
    <g transform={`rotate(${frame * 1.8})`}>
      <path d={path} fill={color} opacity={0.95} />
      <circle r="6" fill={COLORS.bgMid} stroke={color} strokeWidth="2" />
    </g>
  );
};

const AbstractBars: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const panels = [
    { color: COLORS.blueSoft, heights: [0.45, 0.7, 0.55, 0.85, 0.65, 0.78, 0.6] },
    { color: COLORS.cyan, heights: [0.6, 0.5, 0.82, 0.7, 0.92, 0.65, 0.78] },
    { color: COLORS.green, heights: [0.5, 0.65, 0.75, 0.6, 0.85, 0.95, 0.8] },
  ];

  return (
    <div
      style={{
        marginTop: 22,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 18,
      }}
    >
      {panels.map((p, pi) => {
        const startFrame = 110 + pi * 12;
        const e = spring({
          frame: frame - startFrame,
          fps,
          config: { damping: 18, stiffness: 100 },
        });
        return (
          <div
            key={pi}
            style={{
              opacity: e,
              transform: `translateY(${(1 - e) * 18}px)`,
              background: COLORS.panelBg,
              border: `1px solid ${COLORS.panelBorder}`,
              borderRadius: 14,
              padding: '20px 22px',
              height: 130,
              display: 'flex',
              alignItems: 'flex-end',
              justifyContent: 'space-around',
              gap: 8,
            }}
          >
            {p.heights.map((h, i) => {
              const startBar = startFrame + 6 + i * 3;
              const grow = spring({
                frame: frame - startBar,
                fps,
                config: { damping: 14, stiffness: 110 },
              });
              const pulse =
                h > 0.85 ? 1 + Math.sin((frame - startBar) * 0.08) * 0.05 : 1;
              const heightPx = Math.max(0, 90 * h * grow * pulse);
              return (
                <div
                  key={i}
                  style={{
                    width: 18,
                    height: heightPx,
                    borderRadius: 4,
                    background: `linear-gradient(180deg, ${p.color}, ${COLORS.blue})`,
                    boxShadow: `0 0 12px ${p.color}55`,
                  }}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
};
