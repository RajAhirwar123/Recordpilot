import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Upload, Film, Info, Download, RotateCcw, Volume2, VolumeX,
  Camera, Scissors, Play, Pause, ChevronRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { VideoTrimmer } from '@/components/VideoTrimmer';

/* ── helpers ─────────────────────────────────────────────────────────────── */
function formatFileSize(bytes: number) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}
function formatDuration(s: number) {
  if (!isFinite(s) || s === 0) return '--:--';
  const m = Math.floor(s / 60);
  const sec = Math.floor(s % 60);
  return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`;
}

type EditorTab = 'trim' | 'preview';

export default function VideoEditor() {
  /* ── file state ─────────────────────────────────────────────── */
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoUrl, setVideoUrl] = useState<string>('');
  const [videoDuration, setVideoDuration] = useState(0);
  const [videoMeta, setVideoMeta] = useState<{ width: number; height: number } | null>(null);
  const [isDraggingOver, setIsDraggingOver] = useState(false);
  const [loadError, setLoadError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  /* ── preview player state ───────────────────────────────────── */
  const [playing, setPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [muted, setMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [activeTab, setActiveTab] = useState<EditorTab>('preview');
  const videoRef = useRef<HTMLVideoElement>(null);

  /* ── file loading ───────────────────────────────────────────── */
  const handleFile = useCallback((file: File) => {
    const isVideo = file.type.startsWith('video/');
    const isAudio = file.type.startsWith('audio/');
    if (!isVideo && !isAudio) {
      setLoadError('Unsupported file type. Please choose an MP4, WebM, MOV, or other video file.');
      return;
    }
    setLoadError('');
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    const url = URL.createObjectURL(file);
    setVideoFile(file);
    setVideoUrl(url);
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoDuration(0);
    setVideoMeta(null);
    setActiveTab('preview');

    // Probe metadata
    const probe = document.createElement('video');
    probe.preload = 'metadata';
    probe.onloadedmetadata = () => {
      const dur = isFinite(probe.duration) ? probe.duration : 0;
      setVideoDuration(dur);
      setVideoMeta({ width: probe.videoWidth, height: probe.videoHeight });
      probe.src = '';
    };
    probe.onerror = () => { probe.src = ''; };
    probe.src = url;
  }, [videoUrl]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = '';
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDraggingOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const resetEditor = () => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setVideoFile(null);
    setVideoUrl('');
    setPlaying(false);
    setCurrentTime(0);
    setDuration(0);
    setVideoDuration(0);
    setVideoMeta(null);
    setActiveTab('preview');
    setLoadError('');
  };

  /* ── player controls ────────────────────────────────────────── */
  const togglePlay = () => {
    const v = videoRef.current;
    if (!v) return;
    if (playing) { v.pause(); setPlaying(false); }
    else { v.play(); setPlaying(true); }
  };
  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = parseFloat(e.target.value);
    setCurrentTime(v.currentTime);
  };
  const changeVolume = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    if (videoRef.current) videoRef.current.volume = val;
    setVolume(val);
    setMuted(val === 0);
  };
  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = !muted;
    setMuted(!muted);
  };
  const changeRate = (rate: number) => {
    if (videoRef.current) videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
  };

  /* ── snapshot ───────────────────────────────────────────────── */
  const takeSnapshot = () => {
    const v = videoRef.current;
    if (!v) return;
    const canvas = document.createElement('canvas');
    canvas.width = v.videoWidth || 1280;
    canvas.height = v.videoHeight || 720;
    canvas.getContext('2d')?.drawImage(v, 0, 0);
    canvas.toBlob(blob => {
      if (!blob) return;
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `RecordPilot-snapshot-${Math.floor(v.currentTime)}s.png`;
      a.click();
    }, 'image/png');
  };

  /* ── download trimmed ───────────────────────────────────────── */
  const downloadTrimmed = (blob: Blob) => {
    const ext = blob.type.includes('mp4') ? 'mp4' : 'webm';
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `RecordPilot-edited.${ext}`;
    a.click();
  };

  /* ── download original ──────────────────────────────────────── */
  const downloadOriginal = () => {
    if (!videoFile || !videoUrl) return;
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = videoFile.name;
    a.click();
  };

  const pct = duration > 0 ? (currentTime / duration) * 100 : 0;
  const SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2];
  const isAudio = videoFile?.type.startsWith('audio/') ?? false;

  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Video Editor</h1>
          <p className="mt-2 text-muted-foreground">
            Upload any video, preview it, trim it, take snapshots — all in your browser.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {/* ── DROP ZONE ───────────────────────────────────────────── */}
          {!videoUrl ? (
            <motion.div key="upload" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <div
                className={`border-2 border-dashed rounded-2xl p-16 text-center cursor-pointer transition-colors ${
                  isDraggingOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50'
                }`}
                onDrop={handleDrop}
                onDragOver={e => { e.preventDefault(); setIsDraggingOver(true); }}
                onDragLeave={() => setIsDraggingOver(false)}
                onClick={() => inputRef.current?.click()}
                data-testid="dropzone-video"
              >
                <input
                  ref={inputRef}
                  type="file"
                  accept="video/*,audio/*"
                  className="hidden"
                  onChange={handleInputChange}
                  data-testid="input-video-file"
                />
                <div className={`mx-auto w-20 h-20 rounded-full flex items-center justify-center mb-6 transition-colors ${isDraggingOver ? 'bg-primary/20' : 'bg-primary/10'}`}>
                  <Upload className={`w-9 h-9 transition-colors ${isDraggingOver ? 'text-primary' : 'text-primary/70'}`} />
                </div>
                <h3 className="text-xl font-semibold text-white mb-2">
                  {isDraggingOver ? 'Drop to load video' : 'Drop your video here'}
                </h3>
                <p className="text-muted-foreground text-sm mb-6">or click to browse your files</p>
                <Button
                  variant="outline"
                  className="border-border hover:bg-secondary"
                  onClick={e => { e.stopPropagation(); inputRef.current?.click(); }}
                  data-testid="button-browse-files"
                >
                  <Film className="w-4 h-4 mr-2" />
                  Choose File
                </Button>
                <p className="mt-5 text-xs text-muted-foreground">Supports MP4, WebM, MOV, MKV, OGG, AVI and most video formats</p>
              </div>

              {loadError && (
                <div className="mt-4 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3 text-sm text-destructive">
                  {loadError}
                </div>
              )}
            </motion.div>

          ) : (
            /* ── EDITOR ───────────────────────────────────────────────── */
            <motion.div
              key="editor"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-5"
            >
              {/* File info bar */}
              <div className="bg-card border border-border rounded-xl p-4 flex flex-wrap items-center gap-4">
                <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Info className="w-4 h-4 text-primary" />
                </div>
                <div className="flex flex-wrap gap-x-6 gap-y-1 flex-1 text-sm">
                  <span className="text-muted-foreground">
                    <span className="text-white font-medium">{videoFile!.name}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Size: <span className="text-white">{formatFileSize(videoFile!.size)}</span>
                  </span>
                  <span className="text-muted-foreground">
                    Duration: <span className="text-white font-mono">{formatDuration(videoDuration)}</span>
                  </span>
                  {videoMeta && videoMeta.width > 0 && (
                    <span className="text-muted-foreground">
                      Resolution: <span className="text-white">{videoMeta.width}×{videoMeta.height}</span>
                    </span>
                  )}
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetEditor}
                  className="text-muted-foreground hover:text-white flex-shrink-0 gap-1.5"
                  data-testid="button-change-file"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Change
                </Button>
              </div>

              {/* Video player */}
              <div className="bg-card border border-border rounded-xl overflow-hidden">
                {!isAudio && (
                  <div className="relative bg-black aspect-video">
                    <video
                      ref={videoRef}
                      src={videoUrl}
                      className="w-full h-full object-contain"
                      preload="auto"
                      onLoadedMetadata={e => {
                        const v = e.currentTarget;
                        const dur = isFinite(v.duration) ? v.duration : 0;
                        setDuration(dur);
                        if (dur > 0) setVideoDuration(dur);
                        if (v.videoWidth > 0) setVideoMeta({ width: v.videoWidth, height: v.videoHeight });
                      }}
                      onTimeUpdate={e => setCurrentTime(e.currentTarget.currentTime)}
                      onPlay={() => setPlaying(true)}
                      onPause={() => setPlaying(false)}
                      onEnded={() => setPlaying(false)}
                      data-testid="video-preview"
                    />
                  </div>
                )}
                {isAudio && (
                  <audio
                    ref={videoRef as React.RefObject<HTMLVideoElement>}
                    src={videoUrl}
                    preload="auto"
                    className="hidden"
                    onLoadedMetadata={e => {
                      const dur = (e.currentTarget as HTMLAudioElement).duration;
                      if (isFinite(dur)) { setDuration(dur); setVideoDuration(dur); }
                    }}
                    onTimeUpdate={e => setCurrentTime((e.currentTarget as HTMLAudioElement).currentTime)}
                    onPlay={() => setPlaying(true)}
                    onPause={() => setPlaying(false)}
                    onEnded={() => setPlaying(false)}
                  />
                )}

                {/* Player controls */}
                <div className="p-4 space-y-3">
                  {/* Seek bar */}
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-mono text-muted-foreground w-10 text-right tabular-nums">
                      {formatDuration(currentTime)}
                    </span>
                    <div className="relative flex-1 h-2 group cursor-pointer">
                      <div className="absolute inset-0 rounded-full bg-secondary" />
                      <div className="absolute inset-y-0 left-0 rounded-full bg-primary transition-all" style={{ width: `${pct}%` }} />
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
                    <span className="text-xs font-mono text-muted-foreground w-10 tabular-nums">
                      {formatDuration(duration)}
                    </span>
                  </div>

                  {/* Bottom controls */}
                  <div className="flex items-center justify-between flex-wrap gap-3">
                    {/* Left: play + volume */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={togglePlay}
                        className="w-9 h-9 rounded-full bg-primary hover:bg-primary/90 flex items-center justify-center text-white transition-colors"
                        data-testid="button-play-pause"
                      >
                        {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
                      </button>
                      <button
                        onClick={toggleMute}
                        className="w-8 h-8 rounded-md flex items-center justify-center text-muted-foreground hover:text-white transition-colors"
                        data-testid="button-mute"
                      >
                        {muted || volume === 0 ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                      </button>
                      <input
                        type="range" min={0} max={1} step={0.05}
                        value={muted ? 0 : volume}
                        onChange={changeVolume}
                        className="w-20 accent-primary cursor-pointer"
                        data-testid="slider-volume"
                      />
                    </div>

                    {/* Right: speed + actions */}
                    <div className="flex items-center gap-2 flex-wrap">
                      {/* Playback speed */}
                      <div className="flex items-center gap-0.5 bg-secondary/50 rounded-lg px-1 py-0.5">
                        {SPEEDS.map(s => (
                          <button
                            key={s}
                            onClick={() => changeRate(s)}
                            className={`text-xs px-1.5 py-1 rounded transition-colors font-medium ${
                              playbackRate === s
                                ? 'bg-primary text-white'
                                : 'text-muted-foreground hover:text-white'
                            }`}
                            data-testid={`button-speed-${s}`}
                          >
                            {s}×
                          </button>
                        ))}
                      </div>

                      {/* Snapshot */}
                      {!isAudio && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={takeSnapshot}
                          className="border-border hover:bg-secondary h-8 px-3 gap-1.5"
                          data-testid="button-snapshot"
                        >
                          <Camera className="w-3.5 h-3.5" />
                          Snapshot
                        </Button>
                      )}

                      {/* Download original */}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={downloadOriginal}
                        className="border-border hover:bg-secondary h-8 px-3 gap-1.5"
                        data-testid="button-download-original"
                      >
                        <Download className="w-3.5 h-3.5" />
                        Download
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Tab bar */}
              <div className="flex items-center gap-2 border-b border-border pb-0">
                {([
                  { id: 'preview', label: 'Info', icon: Info },
                  { id: 'trim',    label: 'Trim & Export', icon: Scissors },
                ] as { id: EditorTab; label: string; icon: typeof Scissors }[]).map(({ id, label, icon: Icon }) => (
                  <button
                    key={id}
                    onClick={() => setActiveTab(id)}
                    className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-colors -mb-px ${
                      activeTab === id
                        ? 'border-primary text-primary'
                        : 'border-transparent text-muted-foreground hover:text-white'
                    }`}
                    data-testid={`tab-${id}`}
                  >
                    <Icon className="w-4 h-4" />
                    {label}
                  </button>
                ))}
              </div>

              {/* Tab content */}
              <AnimatePresence mode="wait">
                {activeTab === 'preview' && (
                  <motion.div
                    key="tab-preview"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <div className="bg-card border border-border rounded-xl p-6 space-y-4">
                      <h3 className="text-sm font-semibold text-white">File Details</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                        {[
                          { label: 'File Name',   value: videoFile!.name },
                          { label: 'File Size',   value: formatFileSize(videoFile!.size) },
                          { label: 'Duration',    value: formatDuration(videoDuration) },
                          { label: 'File Type',   value: videoFile!.type || 'video/unknown' },
                          ...(videoMeta && videoMeta.width > 0
                            ? [{ label: 'Resolution', value: `${videoMeta.width}×${videoMeta.height}` }]
                            : []),
                        ].map(({ label, value }) => (
                          <div key={label} className="bg-secondary/30 rounded-lg px-3 py-2.5">
                            <p className="text-xs text-muted-foreground mb-0.5">{label}</p>
                            <p className="text-sm text-white font-medium truncate">{value}</p>
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 border-t border-border">
                        <h4 className="text-sm font-semibold text-white mb-3">Quick Actions</h4>
                        <div className="flex flex-wrap gap-3">
                          <Button
                            onClick={() => setActiveTab('trim')}
                            className="bg-primary hover:bg-primary/90 text-white gap-2"
                            data-testid="button-go-to-trim"
                          >
                            <Scissors className="w-4 h-4" />
                            Trim Video
                            <ChevronRight className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="outline"
                            onClick={downloadOriginal}
                            className="border-border hover:bg-secondary gap-2"
                            data-testid="button-download-info"
                          >
                            <Download className="w-4 h-4" />
                            Download Original
                          </Button>
                          {!isAudio && (
                            <Button
                              variant="outline"
                              onClick={takeSnapshot}
                              className="border-border hover:bg-secondary gap-2"
                              data-testid="button-snapshot-info"
                            >
                              <Camera className="w-4 h-4" />
                              Take Snapshot
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {activeTab === 'trim' && videoUrl && (
                  <motion.div
                    key="tab-trim"
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                  >
                    <VideoTrimmer
                      videoUrl={videoUrl}
                      blob={videoFile!}
                      onDownload={downloadTrimmed}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Bottom info */}
              <div className="bg-card border border-border rounded-xl px-5 py-4 text-sm text-muted-foreground leading-relaxed">
                <span className="text-primary font-medium">100% local processing —</span>{' '}
                Your video never leaves your device. Trimming, snapshots, and downloads all happen directly in your browser.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </Layout>
  );
}
