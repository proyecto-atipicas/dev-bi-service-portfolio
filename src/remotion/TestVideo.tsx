import { AbsoluteFill, interpolate, useCurrentFrame, useVideoConfig } from 'remotion';

export const TestVideo: React.FC = () => {
  const frame = useCurrentFrame();
  const { durationInFrames, fps } = useVideoConfig();

  const opacity = interpolate(frame, [0, 20, durationInFrames - 20, durationInFrames], [0, 1, 1, 0]);
  const scale = interpolate(frame, [0, durationInFrames], [1, 1.1]);
  const seconds = Math.floor(frame / fps);

  return (
    <AbsoluteFill
      style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'system-ui, sans-serif',
        color: 'white',
      }}
    >
      <div style={{ opacity, transform: `scale(${scale})`, textAlign: 'center' }}>
        <h1 style={{ fontSize: 120, margin: 0, fontWeight: 800 }}>Remotion</h1>
        <p style={{ fontSize: 40, margin: 0, opacity: 0.8 }}>
          {seconds + 1} / {Math.floor(durationInFrames / fps)} s
        </p>
      </div>
    </AbsoluteFill>
  );
};
