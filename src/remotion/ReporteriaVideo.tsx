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
  violet: '#a78bfa',
  white: '#ffffff',
  panelBg: 'rgba(15, 37, 90, 0.42)',
  panelBorder: 'rgba(96, 165, 250, 0.28)',
};

const W = 1280;
const H = 720;

export const ReporteriaVideo: React.FC = () => {
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
          background: `radial-gradient(120% 90% at 78% 20%, ${COLORS.bgMid} 0%, ${COLORS.bgDeep} 65%)`,
        }}
      />
      <BackgroundGrid />
      <NetworkParticles />
      <AbsoluteFill style={{ opacity, padding: 56 }}>
        <StatusDot />
        <Pipeline />
        <BottomPanels />
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
      const seed = i + 100;
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
          width: 64,
          height: 4,
          background: `linear-gradient(90deg, transparent, ${COLORS.amber})`,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: COLORS.amber,
          boxShadow: `0 0 14px ${COLORS.amber}`,
          opacity: 0.5 + 0.5 * Math.sin(frame * 0.18),
        }}
      />
    </div>
  );
};

type Node = {
  x: number;
  y: number;
  icon: 'catalog' | 'version' | 'distribute';
  color: string;
};

const NODES: Node[] = [
  { x: 180, y: 130, icon: 'catalog', color: COLORS.blueSoft },
  { x: 590, y: 130, icon: 'version', color: COLORS.violet },
  { x: 1000, y: 130, icon: 'distribute', color: COLORS.amber },
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
          <linearGradient id="rEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.blueSoft} />
            <stop offset="100%" stopColor={COLORS.violet} />
          </linearGradient>
          <linearGradient id="rEdgeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.violet} />
            <stop offset="100%" stopColor={COLORS.amber} />
          </linearGradient>
        </defs>

        <Edge from={NODES[0]} to={NODES[1]} stroke="url(#rEdgeGrad)" appearAt={36} />
        <Edge from={NODES[1]} to={NODES[2]} stroke="url(#rEdgeGrad2)" appearAt={56} />

        <Packets from={NODES[0]} to={NODES[1]} startFrame={64} color={COLORS.blueSoft} shape="square" />
        <Packets from={NODES[1]} to={NODES[2]} startFrame={84} color={COLORS.violet} shape="square" />

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
  shape?: 'circle' | 'square';
}> = ({ from, to, startFrame, color, shape = 'circle' }) => {
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
        if (shape === 'square') {
          return (
            <g key={i}>
              <rect
                x={x - 9}
                y={y - 9}
                width="18"
                height="18"
                rx="3"
                fill={color}
                opacity={fade * 0.18}
              />
              <rect
                x={x - 5}
                y={y - 5}
                width="10"
                height="10"
                rx="2"
                fill={color}
                opacity={fade}
              />
            </g>
          );
        }
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
  if (name === 'catalog') {
    return (
      <g stroke={color} strokeWidth="2.5" fill="none" strokeLinejoin="round">
        <rect x="-14" y="-12" width="20" height="24" rx="2" fill={COLORS.bgMid} />
        <rect x="-10" y="-9" width="20" height="24" rx="2" fill={COLORS.bgMid} />
        <rect x="-6" y="-6" width="20" height="24" rx="2" fill={COLORS.bgMid} />
        <line x1="-2" y1="0" x2="10" y2="0" />
        <line x1="-2" y1="6" x2="10" y2="6" />
        <line x1="-2" y1="12" x2="6" y2="12" />
      </g>
    );
  }
  if (name === 'version') {
    return <VersionTree color={color} />;
  }
  return <DistributeFan color={color} />;
};

const VersionTree: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const reveal = interpolate(frame, [60, 100], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const dotOn = (delay: number) =>
    interpolate(frame, [60 + delay, 70 + delay], [0, 1], {
      extrapolateLeft: 'clamp',
      extrapolateRight: 'clamp',
    });
  return (
    <g stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round">
      <line x1="-14" y1="0" x2={-14 + 28 * reveal} y2="0" />
      <path
        d={`M -6 0 Q 2 -10, 10 -14`}
        strokeDasharray="40"
        strokeDashoffset={40 - 40 * reveal}
      />
      <path
        d={`M -6 0 Q 2 10, 10 14`}
        strokeDasharray="40"
        strokeDashoffset={40 - 40 * reveal}
      />
      <circle cx="-14" cy="0" r="3.5" fill={color} opacity={dotOn(0)} />
      <circle cx="0" cy="0" r="3.5" fill={color} opacity={dotOn(8)} />
      <circle cx="14" cy="0" r="3.5" fill={color} opacity={dotOn(16)} />
      <circle cx="10" cy="-14" r="3.5" fill={color} opacity={dotOn(20)} />
      <circle cx="10" cy="14" r="3.5" fill={color} opacity={dotOn(24)} />
    </g>
  );
};

const DistributeFan: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const targets = [
    { x: 18, y: -14 },
    { x: 20, y: 0 },
    { x: 18, y: 14 },
  ];
  return (
    <g>
      <circle cx="-14" cy="0" r="5" fill={color} />
      {targets.map((t, i) => {
        const pulse =
          (Math.sin((frame + i * 14) * 0.14) + 1) / 2;
        return (
          <g key={i}>
            <line
              x1="-9"
              y1="0"
              x2={t.x - 4}
              y2={t.y}
              stroke={color}
              strokeWidth="2"
              strokeOpacity={0.4 + pulse * 0.5}
              strokeDasharray="3 3"
            />
            <rect
              x={t.x - 3}
              y={t.y - 3}
              width="7"
              height="6"
              rx="1.5"
              fill={color}
              opacity={0.5 + pulse * 0.5}
            />
          </g>
        );
      })}
    </g>
  );
};

const BottomPanels: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  return (
    <div
      style={{
        marginTop: 22,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 18,
      }}
    >
      <Panel index={0} startFrame={110}>
        <CatalogVisual />
      </Panel>
      <Panel index={1} startFrame={122}>
        <CalendarVisual />
      </Panel>
      <Panel index={2} startFrame={134}>
        <SubscribersVisual />
      </Panel>
    </div>
  );

  function Panel({
    index,
    startFrame,
    children,
  }: {
    index: number;
    startFrame: number;
    children: React.ReactNode;
  }) {
    const e = spring({
      frame: frame - startFrame,
      fps,
      config: { damping: 18, stiffness: 100 },
    });
    return (
      <div
        key={index}
        style={{
          opacity: e,
          transform: `translateY(${(1 - e) * 18}px)`,
          background: COLORS.panelBg,
          border: `1px solid ${COLORS.panelBorder}`,
          borderRadius: 14,
          padding: 18,
          height: 130,
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {children}
      </div>
    );
  }
};

const CatalogVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const ROWS = 4;
  const ROW_H = 22;
  return (
    <svg width="100%" height="100%" viewBox="0 0 320 100" preserveAspectRatio="none">
      {Array.from({ length: ROWS }).map((_, r) => {
        const startBar = 130 + r * 5;
        const reveal = interpolate(frame, [startBar, startBar + 18], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const y = 6 + r * ROW_H;
        return (
          <g key={r}>
            <rect
              x="0"
              y={y}
              width="320"
              height={ROW_H - 6}
              rx="3"
              fill={COLORS.bgMid}
              opacity="0.5"
            />
            <rect x="6" y={y + 4} width="10" height="8" rx="2" fill={COLORS.blueSoft} />
            <rect
              x="22"
              y={y + 5}
              width={140 * reveal}
              height="6"
              rx="2"
              fill={COLORS.blueLight}
              opacity="0.85"
            />
            <rect
              x="170"
              y={y + 5}
              width={60 * reveal}
              height="6"
              rx="2"
              fill={COLORS.cyan}
              opacity="0.7"
            />
            <rect
              x="240"
              y={y + 5}
              width={50 * reveal}
              height="6"
              rx="2"
              fill={COLORS.violet}
              opacity="0.65"
            />
          </g>
        );
      })}
    </svg>
  );
};

const CalendarVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const COLS = 7;
  const ROWS = 4;
  const cell = 36;
  const gap = 4;
  const totalW = COLS * cell + (COLS - 1) * gap;
  const totalH = ROWS * cell + (ROWS - 1) * gap;
  const startX = (320 - totalW) / 2;
  const startY = (100 - totalH) / 2;

  return (
    <svg width="100%" height="100%" viewBox="0 0 320 100" preserveAspectRatio="none">
      {Array.from({ length: ROWS * COLS }).map((_, idx) => {
        const r = Math.floor(idx / COLS);
        const c = idx % COLS;
        const x = startX + c * (cell + gap);
        const y = startY + r * (cell + gap);
        const fillStart = 132 + idx * 2;
        const fillReveal = interpolate(
          frame,
          [fillStart, fillStart + 12],
          [0, 1],
          {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          }
        );
        const isHighlight = (idx + 1) % 5 === 0;
        const fillColor = isHighlight ? COLORS.amber : COLORS.cyan;
        return (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width={cell}
              height={cell}
              rx="4"
              fill={COLORS.bgMid}
              stroke={fillColor}
              strokeOpacity={0.25 + fillReveal * 0.35}
              strokeWidth="1.5"
            />
            <rect
              x={x + 4}
              y={y + 4}
              width={(cell - 8) * fillReveal}
              height={cell - 8}
              rx="2"
              fill={fillColor}
              opacity={isHighlight ? 0.85 : 0.45}
            />
          </g>
        );
      })}
    </svg>
  );
};

const SubscribersVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const ROWS = 4;
  const ROW_H = 22;
  const sourceX = 30;
  const targetX = 280;

  return (
    <svg width="100%" height="100%" viewBox="0 0 320 100" preserveAspectRatio="none">
      <circle cx={sourceX} cy="50" r="9" fill={COLORS.amber} opacity="0.3" />
      <circle cx={sourceX} cy="50" r="5" fill={COLORS.amber} />

      {Array.from({ length: ROWS }).map((_, r) => {
        const startEnv = 138 + r * 6;
        const e = spring({
          frame: frame - startEnv,
          fps,
          config: { damping: 22, stiffness: 70 },
        });
        const y = 6 + r * ROW_H;
        const arriveOp = interpolate(frame, [startEnv + 18, startEnv + 26], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const xPos = sourceX + (targetX - sourceX) * e;
        const yPos = 50 + (y + 8 - 50) * e;
        return (
          <g key={r}>
            <line
              x1={sourceX + 8}
              y1="50"
              x2={targetX - 12}
              y2={y + 8}
              stroke={COLORS.amber}
              strokeWidth="1"
              strokeOpacity="0.18"
              strokeDasharray="3 4"
            />
            <rect
              x={targetX - 6}
              y={y + 2}
              width="34"
              height="14"
              rx="2"
              fill={COLORS.bgMid}
              stroke={COLORS.violet}
              strokeOpacity="0.45"
              strokeWidth="1.2"
            />
            <rect
              x={targetX - 6}
              y={y + 2}
              width={34 * arriveOp}
              height="14"
              rx="2"
              fill={COLORS.violet}
              opacity="0.55"
            />
            {e > 0 && e < 1 && (
              <g opacity={Math.sin(e * Math.PI)}>
                <rect
                  x={xPos - 5}
                  y={yPos - 4}
                  width="10"
                  height="8"
                  rx="1.5"
                  fill={COLORS.amber}
                />
                <line
                  x1={xPos - 5}
                  y1={yPos - 4}
                  x2={xPos}
                  y2={yPos}
                  stroke={COLORS.bgMid}
                  strokeWidth="1"
                />
                <line
                  x1={xPos + 5}
                  y1={yPos - 4}
                  x2={xPos}
                  y2={yPos}
                  stroke={COLORS.bgMid}
                  strokeWidth="1"
                />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
};
