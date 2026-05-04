import React from 'react';
import {
  AbsoluteFill,
  interpolate,
  random,
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
const LOOP = 120;

export const DesarrolloVideo: React.FC = () => {
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
          background: `radial-gradient(120% 90% at 50% 25%, ${COLORS.bgMid} 0%, ${COLORS.bgDeep} 65%)`,
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
  const breathe = 0.14 + 0.04 * Math.sin((frame / LOOP) * Math.PI * 2);
  const cell = 80;
  const cols = Math.ceil(W / cell) + 1;
  const rows = Math.ceil(H / cell) + 1;
  return (
    <AbsoluteFill style={{ opacity: breathe }}>
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
  const N = 50;

  const points = React.useMemo(() => {
    return Array.from({ length: N }).map((_, i) => {
      const seed = i + 200;
      const baseX = (random(`x${seed}`) as number) * W;
      const baseY = (random(`y${seed}`) as number) * H;
      const phase = (random(`p${seed}`) as number) * Math.PI * 2;
      const size = 1.2 + (random(`sz${seed}`) as number) * 2.0;
      return { baseX, baseY, phase, size };
    });
  }, []);

  const t = (frame / LOOP) * Math.PI * 2;

  const live = points.map((p, i) => {
    const x = p.baseX + Math.sin(t + p.phase) * 18;
    const y = p.baseY + Math.cos(t + p.phase) * 14;
    const blink =
      0.45 + 0.55 * Math.abs(Math.sin((frame / LOOP) * Math.PI * 4 + i));
    return { x, y, size: p.size, opacity: blink };
  });

  return (
    <AbsoluteFill>
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
  const t = (frame / LOOP) * Math.PI * 4;
  return (
    <div
      style={{
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
          background: `linear-gradient(90deg, transparent, ${COLORS.cyan})`,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: COLORS.cyan,
          boxShadow: `0 0 14px ${COLORS.cyan}`,
          opacity: 0.5 + 0.5 * Math.sin(t),
        }}
      />
    </div>
  );
};

type Node = {
  x: number;
  y: number;
  icon: 'api' | 'module' | 'observe';
  color: string;
};

const NODES: Node[] = [
  { x: 180, y: 130, icon: 'api', color: COLORS.cyan },
  { x: 590, y: 130, icon: 'module', color: COLORS.blueSoft },
  { x: 1000, y: 130, icon: 'observe', color: COLORS.green },
];

const Pipeline: React.FC = () => {
  return (
    <div
      style={{
        marginTop: 24,
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
          <linearGradient id="dEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} />
            <stop offset="100%" stopColor={COLORS.blueSoft} />
          </linearGradient>
          <linearGradient id="dEdgeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.blueSoft} />
            <stop offset="100%" stopColor={COLORS.green} />
          </linearGradient>
        </defs>

        <Edge from={NODES[0]} to={NODES[1]} stroke="url(#dEdgeGrad)" />
        <Edge from={NODES[1]} to={NODES[2]} stroke="url(#dEdgeGrad2)" />

        <Packets from={NODES[0]} to={NODES[1]} offset={0} color={COLORS.cyan} />
        <Packets from={NODES[1]} to={NODES[2]} offset={15} color={COLORS.blueSoft} />

        {NODES.map((n, i) => (
          <PipelineNode key={i} node={n} index={i} />
        ))}
      </svg>
    </div>
  );
};

const Edge: React.FC<{
  from: Node;
  to: Node;
  stroke: string;
}> = ({ from, to, stroke }) => {
  return (
    <line
      x1={from.x + 55}
      y1={from.y}
      x2={to.x - 55}
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
  offset: number;
  color: string;
}> = ({ from, to, offset, color }) => {
  const frame = useCurrentFrame();
  const COUNT = 4;
  const SPAN = 30;
  const x1 = from.x + 55;
  const x2 = to.x - 55;

  return (
    <>
      {Array.from({ length: COUNT }).map((_, i) => {
        const t = (((frame + offset) - i * (SPAN / COUNT)) % SPAN + SPAN) % SPAN / SPAN;
        const x = x1 + (x2 - x1) * t;
        const y = from.y;
        const fade = Math.sin(t * Math.PI);
        return (
          <g key={i}>
            <rect
              x={x - 8}
              y={y - 6}
              width="16"
              height="12"
              rx="2"
              fill={color}
              opacity={fade * 0.18}
            />
            <text
              x={x}
              y={y + 3}
              textAnchor="middle"
              fontSize="10"
              fontFamily="monospace"
              fontWeight="700"
              fill={color}
              opacity={fade}
            >
              {/* purely shape, no text rendered */}
            </text>
            <rect
              x={x - 4}
              y={y - 3}
              width="8"
              height="6"
              rx="1.5"
              fill={color}
              opacity={fade}
            />
          </g>
        );
      })}
    </>
  );
};

const PipelineNode: React.FC<{
  node: Node;
  index: number;
}> = ({ node, index }) => {
  const frame = useCurrentFrame();
  const tCycle = (frame / LOOP) * Math.PI * 2;
  const pulse = 1 + Math.sin(tCycle * 2 + index * 1.2) * 0.04;
  const haloOp = 0.18 + 0.14 * Math.sin(tCycle * 2 + index * 1.2);

  return (
    <g transform={`translate(${node.x} ${node.y}) scale(${pulse})`}>
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
  if (name === 'api') {
    return <ApiBracketsIcon color={color} />;
  }
  if (name === 'module') {
    return <SpinningModuleIcon color={color} />;
  }
  return <PulseIcon color={color} />;
};

const ApiBracketsIcon: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const t = (frame / LOOP) * Math.PI * 2;
  const offset = Math.sin(t * 2) * 1.5;
  return (
    <g
      stroke={color}
      strokeWidth="3"
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polyline points={`-2,-14 -16,${-offset} -2,14`} />
      <polyline points={`2,-14 16,${offset} 2,14`} />
      <line
        x1="-2"
        y1={4 + Math.sin(t * 4) * 2}
        x2="2"
        y2={-4 + Math.sin(t * 4) * 2}
        stroke={color}
        strokeWidth="2.5"
      />
    </g>
  );
};

const SpinningModuleIcon: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const angle = (frame / LOOP) * 360;
  return (
    <g transform={`rotate(${angle})`} stroke={color} strokeWidth="2.5" fill="none">
      <rect x="-16" y="-16" width="14" height="14" rx="2" fill={color} opacity="0.25" />
      <rect x="2" y="-16" width="14" height="14" rx="2" fill={color} opacity="0.45" />
      <rect x="-16" y="2" width="14" height="14" rx="2" fill={color} opacity="0.45" />
      <rect x="2" y="2" width="14" height="14" rx="2" fill={color} opacity="0.25" />
      <line x1="-2" y1="-9" x2="2" y2="-9" />
      <line x1="-9" y1="-2" x2="-9" y2="2" />
      <line x1="9" y1="-2" x2="9" y2="2" />
      <line x1="-2" y1="9" x2="2" y2="9" />
    </g>
  );
};

const PulseIcon: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const points = 24;
  const w = 36;
  const path = Array.from({ length: points })
    .map((_, i) => {
      const x = -w / 2 + (i / (points - 1)) * w;
      const phase = (i / points) * Math.PI * 4 - (frame / LOOP) * Math.PI * 4;
      let y = Math.sin(phase) * 3;
      const center = points / 2;
      if (Math.abs(i - center) < 2) {
        y = (i - center) % 2 === 0 ? -10 : 10;
      }
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
  return (
    <g>
      <path
        d={path}
        stroke={color}
        strokeWidth="2.5"
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="0" cy="0" r="2.5" fill={color} />
    </g>
  );
};

const BottomPanels: React.FC = () => {
  return (
    <div
      style={{
        marginTop: 22,
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 18,
      }}
    >
      <Panel>
        <CodeScrollVisual />
      </Panel>
      <Panel>
        <ObservabilityVisual />
      </Panel>
      <Panel>
        <ValidationGridVisual />
      </Panel>
    </div>
  );
};

const Panel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: COLORS.panelBg,
      border: `1px solid ${COLORS.panelBorder}`,
      borderRadius: 14,
      padding: 14,
      height: 130,
      position: 'relative',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

const CodeScrollVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const ROWS = 12;
  const ROW_H = 14;
  const totalH = ROWS * ROW_H;
  const scrollY = (frame / LOOP) * totalH;

  const indents = [0, 12, 24, 12, 0, 8, 20, 28, 12, 0, 16, 24];
  const widths = [70, 130, 100, 80, 150, 110, 60, 90, 140, 75, 105, 95];
  const colors = [
    COLORS.cyan,
    COLORS.blueLight,
    COLORS.violet,
    COLORS.blueSoft,
    COLORS.cyan,
    COLORS.amber,
    COLORS.blueLight,
    COLORS.green,
    COLORS.blueSoft,
    COLORS.cyan,
    COLORS.violet,
    COLORS.blueLight,
  ];

  return (
    <svg width="100%" height="100%" viewBox="0 0 320 100" preserveAspectRatio="none">
      {Array.from({ length: ROWS * 2 }).map((_, idx) => {
        const i = idx % ROWS;
        const y = idx * ROW_H - (scrollY % totalH);
        if (y < -ROW_H || y > 100) return null;
        return (
          <g key={idx}>
            <rect
              x={10 + indents[i]}
              y={y + 3}
              width="6"
              height="6"
              rx="1"
              fill={colors[i]}
              opacity="0.7"
            />
            <rect
              x={20 + indents[i]}
              y={y + 4}
              width={widths[i] * 0.6}
              height="4"
              rx="1.5"
              fill={colors[i]}
              opacity="0.55"
            />
            <rect
              x={20 + indents[i] + widths[i] * 0.6 + 4}
              y={y + 4}
              width={widths[i] * 0.4 - 4}
              height="4"
              rx="1.5"
              fill={COLORS.blueLight}
              opacity="0.3"
            />
          </g>
        );
      })}
      <rect x="0" y="0" width="320" height="10" fill={COLORS.bgDeep} opacity="0.85" />
      <rect x="0" y="90" width="320" height="10" fill={COLORS.bgDeep} opacity="0.85" />
    </svg>
  );
};

const ObservabilityVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const w = 320;
  const h = 100;
  const N = 80;
  const t = (frame / LOOP) * Math.PI * 2;

  const data = Array.from({ length: N }).map((_, i) => {
    const x = (i / (N - 1)) * w;
    const baseY =
      h * 0.55 +
      Math.sin(i * 0.4 + t * 2) * 14 +
      Math.cos(i * 0.18 + t) * 8;
    return { x, y: baseY };
  });

  const path = data
    .map((p, i) => `${i === 0 ? 'M' : 'L'} ${p.x.toFixed(2)} ${p.y.toFixed(2)}`)
    .join(' ');
  const last = data[data.length - 1];
  const first = data[0];
  const areaD = `${path} L ${last.x.toFixed(2)} ${h} L ${first.x.toFixed(2)} ${h} Z`;

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      <defs>
        <linearGradient id="obsArea" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={COLORS.green} stopOpacity="0.45" />
          <stop offset="100%" stopColor={COLORS.green} stopOpacity="0" />
        </linearGradient>
        <linearGradient id="obsLine" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={COLORS.cyan} />
          <stop offset="100%" stopColor={COLORS.green} />
        </linearGradient>
      </defs>
      {[0.25, 0.5, 0.75].map((p, i) => (
        <line
          key={i}
          x1="0"
          y1={h * p}
          x2={w}
          y2={h * p}
          stroke={COLORS.blueLight}
          strokeOpacity="0.1"
          strokeDasharray="3 4"
        />
      ))}
      <path d={areaD} fill="url(#obsArea)" />
      <path
        d={path}
        fill="none"
        stroke="url(#obsLine)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle
        cx={data[Math.floor(N * 0.5)].x}
        cy={data[Math.floor(N * 0.5)].y}
        r={3 + Math.sin(t * 4) * 1}
        fill={COLORS.green}
      />
    </svg>
  );
};

const ValidationGridVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const COLS = 6;
  const ROWS = 3;
  const cell = 36;
  const gap = 8;
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
        const stagger = (idx * (LOOP / (ROWS * COLS))) % LOOP;
        const phase = ((frame - stagger) % LOOP + LOOP) % LOOP;
        const t = phase / LOOP;
        const fill = interpolate(
          t,
          [0, 0.3, 0.6, 1],
          [0, 1, 1, 0],
          { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' }
        );
        const checkReveal = interpolate(t, [0.3, 0.55], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const cx = x + cell / 2;
        const cy = y + cell / 2;
        return (
          <g key={idx}>
            <rect
              x={x}
              y={y}
              width={cell}
              height={cell}
              rx="6"
              fill={COLORS.bgMid}
              stroke={COLORS.green}
              strokeOpacity={0.25 + fill * 0.5}
              strokeWidth="1.5"
            />
            <rect
              x={x + 3}
              y={y + 3}
              width={cell - 6}
              height={cell - 6}
              rx="4"
              fill={COLORS.green}
              opacity={fill * 0.35}
            />
            <path
              d={`M ${cx - 8} ${cy} L ${cx - 2} ${cy + 5} L ${cx + 8} ${cy - 5}`}
              stroke={COLORS.green}
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="22"
              strokeDashoffset={22 - 22 * checkReveal}
            />
          </g>
        );
      })}
    </svg>
  );
};
