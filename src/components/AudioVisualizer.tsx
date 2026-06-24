import { useRef, useEffect } from 'react';
import { useAudioVisualizer } from '@/hooks/useAudioVisualizer';

interface AudioVisualizerProps {
  stream: MediaStream | null;
  isActive: boolean;
  height?: number;
  className?: string;
}

export function AudioVisualizer({ stream, isActive, height = 80, className = '' }: AudioVisualizerProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  useAudioVisualizer(canvasRef, stream, isActive);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    if (!isActive) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const barCount = 48;
      const barWidth = (canvas.width / barCount) - 2;
      let x = 0;
      for (let i = 0; i < barCount; i++) {
        const barH = 4;
        ctx.fillStyle = 'rgba(16, 185, 129, 0.2)';
        const radius = 2;
        const bY = canvas.height - barH;
        ctx.beginPath();
        ctx.moveTo(x + radius, bY);
        ctx.lineTo(x + barWidth - radius, bY);
        ctx.quadraticCurveTo(x + barWidth, bY, x + barWidth, bY + radius);
        ctx.lineTo(x + barWidth, canvas.height);
        ctx.lineTo(x, canvas.height);
        ctx.lineTo(x, bY + radius);
        ctx.quadraticCurveTo(x, bY, x + radius, bY);
        ctx.closePath();
        ctx.fill();
        x += barWidth + 2;
      }
    }
  }, [isActive]);

  return (
    <canvas
      ref={canvasRef}
      width={600}
      height={height}
      className={`w-full rounded-lg ${className}`}
      style={{ height: `${height}px` }}
    />
  );
}
