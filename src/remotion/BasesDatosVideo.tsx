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
  rose: '#fb7185',
  white: '#ffffff',
  panelBg: 'rgba(15, 37, 90, 0.42)',
  panelBorder: 'rgba(96, 165, 250, 0.28)',
};

const W = 1280;
const H = 720;
const LOOP = 120;

export const BasesDatosVideo: React.FC = () => {
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
          background: `radial-gradient(120% 90% at 30% 80%, ${COLORS.bgMid} 0%, ${COLORS.bgDeep} 65%)`,
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
      const seed = i + 300;
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
          background: `linear-gradient(90deg, transparent, ${COLORS.violet})`,
          borderRadius: 2,
        }}
      />
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: '50%',
          background: COLORS.violet,
          boxShadow: `0 0 14px ${COLORS.violet}`,
          opacity: 0.5 + 0.5 * Math.sin(frame * 0.18),
        }}
      />
    </div>
  );
};

type Node = {
  x: number;
  y: number;
  icon: 'cylinder' | 'migrate' | 'sync';
  color: string;
};

const NODES: Node[] = [
  { x: 180, y: 130, icon: 'cylinder', color: COLORS.violet },
  { x: 590, y: 130, icon: 'migrate', color: COLORS.cyan },
  { x: 1000, y: 130, icon: 'sync', color: COLORS.green },
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
          <linearGradient id="bdEdgeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.violet} />
            <stop offset="100%" stopColor={COLORS.cyan} />
          </linearGradient>
          <linearGradient id="bdEdgeGrad2" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={COLORS.cyan} />
            <stop offset="100%" stopColor={COLORS.green} />
          </linearGradient>
        </defs>

        <Edge from={NODES[0]} to={NODES[1]} stroke="url(#bdEdgeGrad)" appearAt={36} />
        <Edge from={NODES[1]} to={NODES[2]} stroke="url(#bdEdgeGrad2)" appearAt={56} />

        <RowPackets from={NODES[0]} to={NODES[1]} startFrame={64} color={COLORS.violet} />
        <RowPackets from={NODES[1]} to={NODES[2]} startFrame={84} color={COLORS.cyan} />

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

const RowPackets: React.FC<{
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
            <rect
              x={x - 12}
              y={y - 4}
              width="24"
              height="8"
              rx="3"
              fill={color}
              opacity={fade * 0.18}
            />
            <rect
              x={x - 9}
              y={y - 2.5}
              width="18"
              height="5"
              rx="2"
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
  if (name === 'cylinder') {
    return <CylinderIcon color={color} />;
  }
  if (name === 'migrate') {
    return <MigrateIcon color={color} />;
  }
  return <SyncIcon color={color} />;
};

const CylinderIcon: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const t = (frame / LOOP) * Math.PI * 2;
  const fillReveal = (Math.sin(t) + 1) / 2;
  return (
    <g stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round">
      <ellipse cx="0" cy="-12" rx="14" ry="4" fill={color} fillOpacity="0.35" />
      <line x1="-14" y1="-12" x2="-14" y2="12" />
      <line x1="14" y1="-12" x2="14" y2="12" />
      <ellipse cx="0" cy="12" rx="14" ry="4" fill={COLORS.bgMid} />
      <ellipse cx="0" cy="-2" rx="14" ry="4" strokeOpacity="0.55" />
      <ellipse
        cx="0"
        cy="2"
        rx="12"
        ry={3 + fillReveal * 1.5}
        fill={color}
        fillOpacity={0.25 + fillReveal * 0.25}
        stroke="none"
      />
    </g>
  );
};

const MigrateIcon: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const t = (frame / LOOP) * Math.PI * 2;
  const arrowX = -6 + Math.sin(t * 2) * 3;
  return (
    <g stroke={color} strokeWidth="2.2" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <rect x="-18" y="-12" width="12" height="24" rx="2" fill={color} fillOpacity="0.18" />
      <line x1="-18" y1="-5" x2="-6" y2="-5" />
      <line x1="-18" y1="2" x2="-6" y2="2" />
      <rect x="6" y="-12" width="12" height="24" rx="2" fill={color} fillOpacity="0.35" />
      <line x1="6" y1="-5" x2="18" y2="-5" />
      <line x1="6" y1="2" x2="18" y2="2" />
      <line x1={arrowX} y1="0" x2={arrowX + 8} y2="0" strokeWidth="2.5" />
      <polyline points={`${arrowX + 4},-3 ${arrowX + 8},0 ${arrowX + 4},3`} strokeWidth="2.5" />
    </g>
  );
};

const SyncIcon: React.FC<{ color: string }> = ({ color }) => {
  const frame = useCurrentFrame();
  const angle = (frame / LOOP) * 360;
  return (
    <g transform={`rotate(${angle})`} stroke={color} strokeWidth="2.5" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M -14 -3 A 12 12 0 0 1 12 -8" />
      <polyline points="8,-12 12,-8 8,-4" />
      <path d="M 14 3 A 12 12 0 0 1 -12 8" />
      <polyline points="-8,12 -12,8 -8,4" />
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
      <Panel index={0} startFrame={110} fps={fps} frame={frame}>
        <SchemaTableVisual />
      </Panel>
      <Panel index={1} startFrame={122} fps={fps} frame={frame}>
        <BiSyncVisual />
      </Panel>
      <Panel index={2} startFrame={134} fps={fps} frame={frame}>
        <DedupVisual />
      </Panel>
    </div>
  );
};

const Panel: React.FC<{
  index: number;
  startFrame: number;
  fps: number;
  frame: number;
  children: React.ReactNode;
}> = ({ index, startFrame, fps, frame, children }) => {
  const e = spring({
    frame: frame - startFrame,
    fps,
    config: { damping: 18, stiffness: 100 },
  });
  return (
    <div
      style={{
        opacity: e,
        transform: `translateY(${(1 - e) * 18}px)`,
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
};

const SchemaTableVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const COLS = 6;
  const ROWS = 5;
  const cellW = 48;
  const cellH = 18;
  const gap = 2;
  const startX = (320 - (COLS * cellW + (COLS - 1) * gap)) / 2;
  const startY = (100 - (ROWS * cellH + (ROWS - 1) * gap)) / 2;
  const headerColor = COLORS.violet;
  const palette = [COLORS.cyan, COLORS.blueLight, COLORS.violet, COLORS.green, COLORS.amber];

  return (
    <svg width="100%" height="100%" viewBox="0 0 320 100" preserveAspectRatio="none">
      {Array.from({ length: ROWS }).map((_, r) =>
        Array.from({ length: COLS }).map((_, c) => {
          const x = startX + c * (cellW + gap);
          const y = startY + r * (cellH + gap);
          const isHeader = r === 0;
          const cellStart = 130 + (r * COLS + c) * 1.6;
          const reveal = interpolate(frame, [cellStart, cellStart + 12], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const fillColor = isHeader ? headerColor : palette[c % palette.length];
          return (
            <g key={`${r}-${c}`}>
              <rect
                x={x}
                y={y}
                width={cellW}
                height={cellH}
                rx="2"
                fill={COLORS.bgMid}
                stroke={fillColor}
                strokeOpacity={isHeader ? 0.6 : 0.25 + reveal * 0.3}
                strokeWidth="1"
              />
              {isHeader ? (
                <rect
                  x={x + 4}
                  y={y + 6}
                  width={(cellW - 8) * reveal}
                  height="6"
                  rx="2"
                  fill={fillColor}
                  opacity="0.85"
                />
              ) : (
                <rect
                  x={x + 4}
                  y={y + 7}
                  width={(cellW - 10) * reveal}
                  height="4"
                  rx="1.5"
                  fill={fillColor}
                  opacity={0.3 + reveal * 0.4}
                />
              )}
            </g>
          );
        })
      )}
    </svg>
  );
};

const BiSyncVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const w = 320;
  const h = 100;
  const leftX = 50;
  const rightX = w - 50;
  const cyl = (cx: number, cy: number, color: string) => (
    <g stroke={color} strokeWidth="1.8" fill="none">
      <ellipse cx={cx} cy={cy - 22} rx="20" ry="6" fill={color} fillOpacity="0.3" />
      <line x1={cx - 20} y1={cy - 22} x2={cx - 20} y2={cy + 22} />
      <line x1={cx + 20} y1={cy - 22} x2={cx + 20} y2={cy + 22} />
      <ellipse cx={cx} cy={cy + 22} rx="20" ry="6" fill={COLORS.bgMid} />
      <ellipse cx={cx} cy={cy - 8} rx="20" ry="6" strokeOpacity="0.5" />
      <ellipse cx={cx} cy={cy + 8} rx="20" ry="6" strokeOpacity="0.5" />
    </g>
  );

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {cyl(leftX, h / 2, COLORS.violet)}
      {cyl(rightX, h / 2, COLORS.green)}
      {[-12, 0, 12].map((dy, i) => {
        const dir = i % 2 === 0 ? 1 : -1;
        const SPAN = 40;
        const offset = i * 12;
        return Array.from({ length: 2 }).map((_, k) => {
          const t = ((frame - offset - k * 20) % SPAN + SPAN) % SPAN / SPAN;
          const x =
            dir === 1
              ? leftX + 20 + (rightX - 20 - leftX - 20) * t
              : rightX - 20 - (rightX - 20 - leftX - 20) * t;
          const y = h / 2 + dy;
          const fade = Math.sin(t * Math.PI);
          const color = dir === 1 ? COLORS.violet : COLORS.green;
          return (
            <g key={`${i}-${k}`}>
              <rect
                x={x - 6}
                y={y - 2}
                width="12"
                height="4"
                rx="1.5"
                fill={color}
                opacity={fade * 0.85}
              />
            </g>
          );
        });
      })}
      <line
        x1={leftX + 22}
        y1={h / 2 - 12}
        x2={rightX - 22}
        y2={h / 2 - 12}
        stroke={COLORS.violet}
        strokeOpacity="0.18"
        strokeDasharray="3 4"
      />
      <line
        x1={leftX + 22}
        y1={h / 2}
        x2={rightX - 22}
        y2={h / 2}
        stroke={COLORS.cyan}
        strokeOpacity="0.18"
        strokeDasharray="3 4"
      />
      <line
        x1={leftX + 22}
        y1={h / 2 + 12}
        x2={rightX - 22}
        y2={h / 2 + 12}
        stroke={COLORS.green}
        strokeOpacity="0.18"
        strokeDasharray="3 4"
      />
    </svg>
  );
};

const DedupVisual: React.FC = () => {
  const frame = useCurrentFrame();
  const w = 320;
  const h = 100;
  const ROWS = 6;
  const rowH = 14;
  const startY = (h - ROWS * rowH) / 2;

  const items = [
    { col: 0, dup: false },
    { col: 0, dup: true },
    { col: 1, dup: false },
    { col: 0, dup: true },
    { col: 2, dup: false },
    { col: 1, dup: true },
  ];

  const palette = [COLORS.violet, COLORS.cyan, COLORS.green];

  return (
    <svg width="100%" height="100%" viewBox={`0 0 ${w} ${h}`} preserveAspectRatio="none">
      {items.map((it, i) => {
        const y = startY + i * rowH;
        const cycle = LOOP;
        const phase = ((frame - 130 - i * 6) % cycle + cycle) % cycle;
        const t = phase / cycle;
        const collapse = it.dup
          ? interpolate(t, [0.5, 0.75], [0, 1], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          : 0;
        const op = it.dup
          ? interpolate(t, [0.5, 0.75], [0.85, 0], {
              extrapolateLeft: 'clamp',
              extrapolateRight: 'clamp',
            })
          : 0.85;
        const reveal = interpolate(t, [0, 0.2], [0, 1], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        });
        const xShift = collapse * 60;
        return (
          <g key={i} opacity={op}>
            <rect
              x={20 + xShift}
              y={y + 1}
              width={(w - 40) * reveal}
              height={rowH - 4}
              rx="2"
              fill={COLORS.bgMid}
              stroke={palette[it.col]}
              strokeOpacity="0.55"
              strokeWidth="1"
            />
            <rect
              x={26 + xShift}
              y={y + 4}
              width="6"
              height="4"
              rx="1"
              fill={palette[it.col]}
            />
            <rect
              x={36 + xShift}
              y={y + 4}
              width={120 * reveal}
              height="4"
              rx="1.5"
              fill={palette[it.col]}
              opacity="0.55"
            />
            <rect
              x={170 + xShift}
              y={y + 4}
              width={60 * reveal}
              height="4"
              rx="1.5"
              fill={COLORS.blueLight}
              opacity="0.4"
            />
            {it.dup && t > 0.5 && (
              <line
                x1={26 + xShift}
                y1={y + (rowH - 4) / 2 + 1}
                x2={26 + xShift + 200 * (1 - collapse)}
                y2={y + (rowH - 4) / 2 + 1}
                stroke={COLORS.rose}
                strokeWidth="2"
                opacity={op}
              />
            )}
          </g>
        );
      })}
    </svg>
  );
};
