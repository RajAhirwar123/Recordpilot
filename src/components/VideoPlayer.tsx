import { useState, useRef, useCallback, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, Download, PictureInPicture2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  src: string;
  onDownload?: () => void;
  onReplace?: () => void;
  isAudio?: boolean;
}

export function VideoPlayer({ src, onDownload, onReplace, isAudio = false }: VideoPlayerProps) {
  const mediaRef = useRef<HTMLVideoElement & HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [speed, setSpeed] = useState(1);

  useEffect(() => {
    const el = mediaRef.current;
    if (!el) return;
    const onTime = () => setCurrentTime(el.currentTime);
    const onMeta = () => setDuration(el.duration);
    const onEnded = () => setPlaying(false);
    el.addEventListener('timeupdate', onTime);
    el.addEventListener('loadedmetadata', onMeta);
    el.addEventListener('ended', onEnded);
    return () => {
      el.removeEventListener('timeupdate', onTime);
      el.removeEventListener('loadedmetadata', onMeta);
      el.removeEventListener('ended', onEnded);
    };
  }, []);

  const togglePlay = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    if (playing) { el.pause(); setPlaying(false); }
    else { el.play(); setPlaying(true); }
  }, [playing]);

  const seek = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const el = mediaRef.current;
    if (!el) return;
    el.currentTime = parseFloat(e.target.value);
  }, []);

  const toggleMute = useCallback(() => {
    const el = mediaRef.current;
    if (!el) return;
    el.muted = !muted;
    setMuted(!muted);
  }, [muted]);

  const handleVolume = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = parseFloat(e.target.value);
    const el = mediaRef.current;
    if (el) el.volume = v;
    setVolume(v);
  }, []);

  const setPlaybackSpeed = useCallback((s: number) => {
    const el = mediaRef.current;
    if (el) el.playbackRate = s;
    setSpeed(s);
  }, []);

  const togglePip = useCallback(async () => {
    const el = mediaRef.current as HTMLVideoElement | null;
    if (!el || isAudio) return;
    try {
      if (document.pictureInPictureElement) {
        await document.exitPictureInPicture();
      } else {
        await el.requestPictureInPicture();
      }
    } catch {}
  }, [isAudio]);

  const fullscreen = useCallback(() => {
    const el = mediaRef.current as HTMLVideoElement | null;
    if (!el || isAudio) return;
    el.requestFullscreen?.().catch(() => {});
  }, [isAudio]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const speeds = [0.5, 0.75, 1, 1.25, 1.5, 2];

  return (
    <div className="bg-card border border-border rounded-xl overflow-hidden">
      {!isAudio && (
        <div className="relative bg-black aspect-video">
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            src={src}
            className="w-full h-full object-contain"
            preload="metadata"
            data-testid="video-preview"
          />
        </div>
      )}
      {isAudio && (
        <audio ref={mediaRef as React.RefObject<HTMLAudioElement>} src={src} preload="metadata" className="hidden" />
      )}

      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-muted-foreground w-10 text-right">{fmt(currentTime)}</span>
          <div className="relative flex-1 h-2">
            <div className="absolute inset-0 rounded-full bg-secondary" />
            <div className="absolute inset-y-0 left-0 rounded-full bg-primary" style={{ width: `${pct}%` }} />
            <input
              type="range"
              min={0}
              max={duration || 100}
              step={0.1}
              value={currentTime}
              onChange={seek}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              data-testid="slider-seek"
            />
          </div>
          <span className="text-xs font-mono text-muted-foreground w-10">{fmt(duration)}</span>
        </div>

        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-2">
            <Button
              size="icon"
              variant="ghost"
              onClick={togglePlay}
              className="w-9 h-9 text-white hover:bg-secondary"
              data-testid="button-play-pause"
            >
              {playing ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={toggleMute}
              className="w-8 h-8 text-muted-foreground hover:text-white hover:bg-secondary"
              data-testid="button-mute"
            >
              {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
            </Button>

            <input
              type="range"
              min={0}
              max={1}
              step={0.05}
              value={muted ? 0 : volume}
              onChange={handleVolume}
              className="w-20 accent-primary"
              data-testid="slider-volume"
            />
          </div>

          <div className="flex items-center gap-1.5 flex-wrap">
            <div className="flex items-center gap-1">
              {speeds.map(s => (
                <button
                  key={s}
                  onClick={() => setPlaybackSpeed(s)}
                  className={`text-xs px-1.5 py-0.5 rounded transition-colors ${speed === s ? 'bg-primary text-white' : 'text-muted-foreground hover:text-white'}`}
                  data-testid={`button-speed-${s}`}
                >
                  {s}x
                </button>
              ))}
            </div>

            {!isAudio && (
              <>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={togglePip}
                  className="w-8 h-8 text-muted-foreground hover:text-white hover:bg-secondary"
                  data-testid="button-pip"
                >
                  <PictureInPicture2 className="w-4 h-4" />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  onClick={fullscreen}
                  className="w-8 h-8 text-muted-foreground hover:text-white hover:bg-secondary"
                  data-testid="button-fullscreen"
                >
                  <Maximize className="w-4 h-4" />
                </Button>
              </>
            )}

            {onDownload && (
              <Button
                size="sm"
                onClick={onDownload}
                className="bg-primary hover:bg-primary/90 text-white h-8 px-3"
                data-testid="button-download-video"
              >
                <Download className="w-4 h-4 mr-1.5" />
                Download
              </Button>
            )}
            {onReplace && (
              <Button
                size="sm"
                variant="outline"
                onClick={onReplace}
                className="border-border hover:bg-secondary h-8 px-3"
                data-testid="button-replace-recording"
              >
                Replace
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
