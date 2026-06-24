import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, AppWindow, Globe, Video, Mic, MonitorSpeaker, Combine,
  Play, Pause, Square, Download, Trash2, Circle, AlertCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Layout } from '@/components/Layout';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { VideoPlayer } from '@/components/VideoPlayer';
import { VideoTrimmer } from '@/components/VideoTrimmer';
import { SidebarAd } from '@/components/AdUnit';
import { useRecording } from '@/hooks/useRecording';
import { useTimer } from '@/hooks/useTimer';
import type { RecordingMode, RecordingSettings } from '@/types/recording';

const modes: { id: RecordingMode; icon: typeof Monitor; label: string; desc: string }[] = [
  { id: 'screen', icon: Monitor, label: 'Entire Screen', desc: 'Full display capture' },
  { id: 'window', icon: AppWindow, label: 'App Window', desc: 'Specific application' },
  { id: 'tab', icon: Globe, label: 'Browser Tab', desc: 'Single tab only' },
  { id: 'webcam', icon: Video, label: 'Webcam Only', desc: 'Camera feed' },
  { id: 'audio', icon: Mic, label: 'Audio Only', desc: 'Microphone only' },
  { id: 'screen-audio', icon: MonitorSpeaker, label: 'Screen + Audio', desc: 'Screen with mic' },
  { id: 'screen-webcam', icon: Combine, label: 'Screen + Webcam', desc: 'Screen with camera' },
  { id: 'screen-webcam-audio', icon: Combine, label: 'Screen + Webcam + Audio', desc: 'Full capture' },
];

const defaultSettings: RecordingSettings = {
  microphone: true,
  systemAudio: false,
  webcamOverlay: false,
  pictureInPicture: false,
  hdRecording: true,
  autoDownload: false,
};

export default function ScreenRecorder() {
  const [selectedMode, setSelectedMode] = useState<RecordingMode>('screen');
  const [settings, setSettings] = useState<RecordingSettings>(defaultSettings);
  const [activeStream, setActiveStream] = useState<MediaStream | null>(null);

  const {
    status, blob, videoUrl, error,
    startRecording, pauseRecording, resumeRecording,
    stopRecording, downloadRecording, discardRecording,
    getStream,
  } = useRecording();

  const isRecording = status === 'recording';
  const isPaused = status === 'paused';
  const isStopped = status === 'stopped';
  const isActive = isRecording || isPaused;

  const { formatted, reset: resetTimer } = useTimer(isRecording);

  useEffect(() => {
    if (isRecording) {
      setActiveStream(getStream());
    } else if (!isActive) {
      setActiveStream(null);
      if (!isStopped) resetTimer();
    }
  }, [status, isRecording, isActive, isStopped, getStream, resetTimer]);

  const handleStart = useCallback(async () => {
    resetTimer();
    await startRecording(selectedMode, settings);
  }, [selectedMode, settings, startRecording, resetTimer]);

  const handleDiscard = useCallback(() => {
    discardRecording();
    resetTimer();
    setActiveStream(null);
  }, [discardRecording, resetTimer]);

  const toggleSetting = (key: keyof RecordingSettings) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const settingItems: { key: keyof RecordingSettings; label: string }[] = [
    { key: 'microphone', label: 'Record Microphone' },
    { key: 'systemAudio', label: 'Record System Audio' },
    { key: 'webcamOverlay', label: 'Show Webcam Overlay' },
    { key: 'pictureInPicture', label: 'Enable Picture-in-Picture' },
    { key: 'hdRecording', label: 'HD Recording (1080p)' },
    { key: 'autoDownload', label: 'Auto Download on Stop' },
  ];

  return (
    <Layout>
      {/*
       * RECORDER DASHBOARD LAYOUT
       * Desktop: [recorder content (flex-1)] [sticky sidebar ad (300px, xl+ only)]
       * Mobile:  full-width, sidebar hidden
       * The sidebar ad is NEVER shown on mobile and NEVER overlaps recorder controls.
       */}
      <div className="flex gap-6 items-start mx-auto max-w-6xl px-4 sm:px-6 lg:px-8 py-12">

        {/* ── Main recorder content ─────────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-white">Screen Recorder</h1>
            <p className="mt-2 text-muted-foreground">Choose your recording mode and start capturing in seconds.</p>
          </div>

          {/* Error Banner */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mb-6 flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3"
              >
                <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
                <p className="text-sm text-destructive">{error}</p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Recording Indicator */}
          <AnimatePresence>
            {isActive && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="mb-6 bg-card border border-destructive/30 rounded-xl p-5"
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-destructive/20 border border-destructive/30 rounded-full px-3 py-1.5">
                      <span className={`w-2.5 h-2.5 rounded-full bg-destructive ${isRecording ? 'animate-pulse' : ''}`} />
                      <span className="text-destructive text-sm font-bold tracking-wide">
                        {isPaused ? 'PAUSED' : 'REC'}
                      </span>
                    </div>
                    <span className="text-white font-mono text-2xl font-bold tracking-widest">{formatted}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/*
                     * CRITICAL: No ads are placed inside this recording controls block.
                     * Per policy: never place ads near Stop or Pause/Resume buttons.
                     */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      className="border-border hover:bg-secondary"
                      data-testid="button-pause-resume"
                    >
                      {isPaused ? <Play className="w-4 h-4 mr-1.5" /> : <Pause className="w-4 h-4 mr-1.5" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button
                      size="sm"
                      onClick={stopRecording}
                      className="bg-destructive hover:bg-destructive/90 text-white"
                      data-testid="button-stop"
                    >
                      <Square className="w-4 h-4 mr-1.5 fill-current" />
                      Stop
                    </Button>
                  </div>
                </div>
                <div className="mt-4">
                  <p className="text-xs text-muted-foreground mb-2">Audio Level</p>
                  <div className="bg-secondary/30 rounded-lg p-3">
                    <AudioVisualizer
                      stream={activeStream}
                      isActive={isRecording}
                      height={64}
                    />
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left: Mode + Settings */}
            <div className="lg:col-span-2 space-y-6">
              {/* Recording Mode */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4">Recording Mode</h2>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {modes.map(({ id, icon: Icon, label }) => (
                    <button
                      key={id}
                      onClick={() => !isActive && setSelectedMode(id)}
                      disabled={isActive}
                      className={`flex flex-col items-center gap-2 rounded-lg p-3 border transition-all text-left ${
                        selectedMode === id
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border text-muted-foreground hover:border-primary/30 hover:text-foreground'
                      } ${isActive ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
                      data-testid={`mode-${id}`}
                    >
                      <Icon className="w-5 h-5" />
                      <span className="text-xs font-medium text-center leading-tight">{label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Settings — no ads inside settings panel per policy */}
              <div className="bg-card border border-border rounded-xl p-6">
                <h2 className="text-base font-semibold text-white mb-4">Settings</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {settingItems.map(({ key, label }) => (
                    <div key={key} className="flex items-center gap-3">
                      <Checkbox
                        id={`setting-${key}`}
                        checked={settings[key]}
                        onCheckedChange={() => toggleSetting(key)}
                        disabled={isActive}
                        className="border-border"
                        data-testid={`checkbox-${key}`}
                      />
                      <Label htmlFor={`setting-${key}`} className="text-sm text-muted-foreground cursor-pointer select-none">
                        {label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Controls — no ads near Start/Stop/Pause buttons per policy */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6 space-y-3">
                <h2 className="text-base font-semibold text-white mb-4">Controls</h2>

                {status === 'idle' && (
                  <Button
                    className="w-full bg-primary hover:bg-primary/90 text-white h-12 text-base font-semibold"
                    onClick={handleStart}
                    data-testid="button-start-recording"
                  >
                    <Circle className="w-4 h-4 fill-white mr-2" />
                    Start Recording
                  </Button>
                )}

                {status === 'requesting' && (
                  <Button disabled className="w-full h-12 text-base">
                    <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Requesting Permissions...
                  </Button>
                )}

                {isActive && (
                  <>
                    <Button
                      variant="outline"
                      className="w-full border-border hover:bg-secondary"
                      onClick={isPaused ? resumeRecording : pauseRecording}
                      data-testid="button-pause-resume-sidebar"
                    >
                      {isPaused ? <Play className="w-4 h-4 mr-2" /> : <Pause className="w-4 h-4 mr-2" />}
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button
                      className="w-full bg-destructive hover:bg-destructive/90 text-white"
                      onClick={stopRecording}
                      data-testid="button-stop-sidebar"
                    >
                      <Square className="w-4 h-4 fill-current mr-2" />
                      Stop Recording
                    </Button>
                  </>
                )}

                {isStopped && (
                  <>
                    <Button
                      className="w-full bg-primary hover:bg-primary/90 text-white"
                      onClick={() => downloadRecording()}
                      data-testid="button-download"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full border-border hover:bg-secondary"
                      onClick={handleStart}
                      data-testid="button-record-again"
                    >
                      <Circle className="w-4 h-4 mr-2" />
                      Record Again
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                      onClick={handleDiscard}
                      data-testid="button-discard"
                    >
                      <Trash2 className="w-4 h-4 mr-2" />
                      Discard
                    </Button>
                  </>
                )}
              </div>

              <div className="bg-card border border-border rounded-xl p-4">
                <p className="text-xs text-muted-foreground leading-relaxed">
                  <span className="text-primary font-medium">Privacy guaranteed:</span> All recordings are processed locally. Nothing is uploaded. Your content stays on your device.
                </p>
              </div>
            </div>
          </div>

          {/* Video Preview + Recording Result Ad + Trimmer */}
          <AnimatePresence>
            {isStopped && videoUrl && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 space-y-6"
              >
                <h2 className="text-xl font-semibold text-white">Your Recording</h2>

                {/* Video preview player */}
                <VideoPlayer
                  src={videoUrl}
                  isAudio={selectedMode === 'audio'}
                  onDownload={() => downloadRecording()}
                  onReplace={handleDiscard}
                />

                {/* Trim interface */}
                {blob && (
                  <VideoTrimmer
                    videoUrl={videoUrl}
                    blob={blob}
                  />
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/*
         * STICKY SIDEBAR AD
         * Desktop (xl+) only — hidden on all mobile and tablet breakpoints.
         * Sticky position keeps the ad visible while the user scrolls the recorder.
         * Offset accounts for: TrustBar (32px) + Header (64px) + Leaderboard (~92px) + gap (16px).
         * NEVER overlaps recording controls, Start/Stop buttons, or settings panel.
         */}
        <div className="hidden xl:block sticky top-[210px] self-start">
          <SidebarAd />
        </div>

      </div>
    </Layout>
  );
}
