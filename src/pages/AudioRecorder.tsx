import { useState, useRef, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mic, Square, Pause, Play, Download, Trash2, AlertCircle, Circle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { AudioVisualizer } from '@/components/AudioVisualizer';
import { VideoPlayer } from '@/components/VideoPlayer';
import { useRecording } from '@/hooks/useRecording';
import { useTimer } from '@/hooks/useTimer';

export default function AudioRecorder() {
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
    await startRecording('audio', {
      microphone: true,
      systemAudio: false,
      webcamOverlay: false,
      pictureInPicture: false,
      hdRecording: false,
      autoDownload: false,
    });
  }, [startRecording, resetTimer]);

  const handleDiscard = useCallback(() => {
    discardRecording();
    resetTimer();
    setActiveStream(null);
  }, [discardRecording, resetTimer]);

  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white">Audio Recorder</h1>
          <p className="mt-2 text-muted-foreground">Record your microphone with real-time waveform visualization.</p>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="mb-6 flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl px-4 py-3"
            >
              <AlertCircle className="w-5 h-5 text-destructive flex-shrink-0 mt-0.5" />
              <p className="text-sm text-destructive">{error}</p>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="bg-card border border-border rounded-2xl overflow-hidden">
          <div className="p-8 text-center space-y-6">
            {/* Mic Icon */}
            <div className={`relative inline-flex mx-auto ${isRecording ? 'animate-pulse' : ''}`}>
              <div className={`w-24 h-24 rounded-full flex items-center justify-center border-2 transition-colors ${
                isRecording ? 'bg-destructive/20 border-destructive' :
                isPaused ? 'bg-warning/20 border-warning' :
                isStopped ? 'bg-primary/20 border-primary' :
                'bg-secondary border-border'
              }`}>
                <Mic className={`w-10 h-10 ${
                  isRecording ? 'text-destructive' :
                  isPaused ? 'text-warning' :
                  isStopped ? 'text-primary' :
                  'text-muted-foreground'
                }`} />
              </div>
              {isRecording && (
                <span className="absolute -top-1 -right-1 flex h-4 w-4">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-destructive opacity-75" />
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-destructive" />
                </span>
              )}
            </div>

            {/* Status */}
            <div className="space-y-1">
              {isActive && (
                <div className="flex items-center justify-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${isRecording ? 'bg-destructive animate-pulse' : 'bg-warning'}`} />
                  <span className={`text-sm font-semibold ${isRecording ? 'text-destructive' : 'text-warning'}`}>
                    {isPaused ? 'Recording Paused' : 'Recording in Progress'}
                  </span>
                </div>
              )}
              <p className="text-4xl font-mono font-bold text-white tracking-widest">{formatted}</p>
              {status === 'idle' && <p className="text-muted-foreground text-sm">Click the button below to start recording</p>}
              {isStopped && <p className="text-primary text-sm">Recording complete</p>}
            </div>

            {/* Visualizer */}
            <div className="bg-secondary/30 rounded-xl p-4 min-h-[80px] flex items-center">
              <AudioVisualizer
                stream={activeStream}
                isActive={isRecording}
                height={72}
                className="w-full"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center gap-3 flex-wrap">
              {status === 'idle' && (
                <Button
                  size="lg"
                  className="bg-primary hover:bg-primary/90 text-white px-10 h-12 text-base font-semibold"
                  onClick={handleStart}
                  data-testid="button-start-audio"
                >
                  <Circle className="w-4 h-4 fill-white mr-2" />
                  Start Recording
                </Button>
              )}
              {status === 'requesting' && (
                <Button disabled size="lg" className="px-10 h-12">
                  <span className="animate-spin mr-2 w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                  Requesting Mic Access...
                </Button>
              )}
              {isActive && (
                <>
                  <Button
                    variant="outline"
                    size="lg"
                    onClick={isPaused ? resumeRecording : pauseRecording}
                    className="border-border hover:bg-secondary h-12"
                    data-testid="button-audio-pause-resume"
                  >
                    {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
                  </Button>
                  <Button
                    size="lg"
                    onClick={stopRecording}
                    className="bg-destructive hover:bg-destructive/90 text-white h-12 px-6"
                    data-testid="button-audio-stop"
                  >
                    <Square className="w-5 h-5 fill-current" />
                  </Button>
                </>
              )}
              {isStopped && (
                <>
                  <Button
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white h-12 px-6"
                    onClick={() => downloadRecording('RecordPilot-audio')}
                    data-testid="button-audio-download"
                  >
                    <Download className="w-5 h-5 mr-2" />
                    Download Audio
                  </Button>
                  <Button
                    variant="ghost"
                    size="lg"
                    className="text-muted-foreground hover:text-destructive h-12 px-6"
                    onClick={handleDiscard}
                    data-testid="button-audio-discard"
                  >
                    <Trash2 className="w-5 h-5" />
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Audio Preview */}
        <AnimatePresence>
          {isStopped && videoUrl && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Preview Your Recording</h2>
              <VideoPlayer
                src={videoUrl}
                isAudio
                onDownload={() => downloadRecording('RecordPilot-audio')}
                onReplace={handleDiscard}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-8 bg-card border border-border rounded-xl p-5">
          <h2 className="text-sm font-semibold text-white mb-3">Tips for Better Audio</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Record in a quiet room to minimize background noise</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Position your microphone 6–12 inches from your mouth</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Use headphones to prevent echo from your speakers</li>
            <li className="flex items-start gap-2"><span className="text-primary mt-0.5">•</span> Check the waveform — a healthy recording fills the middle third of the meter</li>
          </ul>
        </div>
      </div>
    </Layout>
  );
}
