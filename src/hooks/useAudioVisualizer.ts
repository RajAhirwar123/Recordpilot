import { useRef, useCallback, useEffect } from 'react';

export function useAudioVisualizer(canvasRef: React.RefObject<HTMLCanvasElement>, stream: MediaStream | null, isActive: boolean) {
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceRef = useRef<MediaStreamAudioSourceNode | null>(null);
  const animFrameRef = useRef<number | null>(null);

  const stopVisualizer = useCallback(() => {
    if (animFrameRef.current) {
      cancelAnimationFrame(animFrameRef.current);
      animFrameRef.current = null;
    }
    if (sourceRef.current) {
      sourceRef.current.disconnect();
      sourceRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    analyserRef.current = null;
  }, []);

  useEffect(() => {
    if (!isActive || !stream || !canvasRef.current) {
      stopVisualizer();
      return;
    }

    const audioTracks = stream.getAudioTracks();
    if (audioTracks.length === 0) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const audioContext = new AudioContextClass();
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 256;
      analyser.smoothingTimeConstant = 0.8;

      const source = audioContext.createMediaStreamSource(stream);
      source.connect(analyser);

      audioContextRef.current = audioContext;
      analyserRef.current = analyser;
      sourceRef.current = source;

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);
      const canvas = canvasRef.current;

      const draw = () => {
        if (!canvasRef.current) return;
        animFrameRef.current = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const width = canvas.width;
        const height = canvas.height;
        ctx.clearRect(0, 0, width, height);

        const barCount = 48;
        const barWidth = (width / barCount) - 2;
        let x = 0;

        for (let i = 0; i < barCount; i++) {
          const index = Math.floor((i / barCount) * bufferLength);
          const value = dataArray[index];
          const barHeight = (value / 255) * height * 0.85;

          const gradient = ctx.createLinearGradient(0, height, 0, height - barHeight);
          gradient.addColorStop(0, 'rgba(16, 185, 129, 0.9)');
          gradient.addColorStop(0.5, 'rgba(16, 185, 129, 0.6)');
          gradient.addColorStop(1, 'rgba(16, 185, 129, 0.3)');

          ctx.fillStyle = gradient;
          const radius = Math.min(barWidth / 2, 3);
          const barX = x;
          const barY = height - barHeight;
          ctx.beginPath();
          ctx.moveTo(barX + radius, barY);
          ctx.lineTo(barX + barWidth - radius, barY);
          ctx.quadraticCurveTo(barX + barWidth, barY, barX + barWidth, barY + radius);
          ctx.lineTo(barX + barWidth, height);
          ctx.lineTo(barX, height);
          ctx.lineTo(barX, barY + radius);
          ctx.quadraticCurveTo(barX, barY, barX + radius, barY);
          ctx.closePath();
          ctx.fill();

          x += barWidth + 2;
        }
      };

      draw();
    } catch (err) {
      console.warn('Audio visualizer error:', err);
    }

    return () => stopVisualizer();
  }, [isActive, stream, canvasRef, stopVisualizer]);

  return { stopVisualizer };
}
