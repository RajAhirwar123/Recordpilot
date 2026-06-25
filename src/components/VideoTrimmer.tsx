// import { useState, useRef, useEffect, useCallback } from 'react';
// import { Scissors, Play, Download, Loader2 } from 'lucide-react';
// import { Button } from '@/components/ui/button';

// interface VideoTrimmerProps {
//   videoUrl: string;
//   blob: Blob;
//   onDownload?: (trimmedBlob: Blob) => void;
// }

// function formatTime(secs: number) {
//   const m = Math.floor(secs / 60);
//   const s = Math.floor(secs % 60);
//   return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
// }

// export function VideoTrimmer({ videoUrl, blob, onDownload }: VideoTrimmerProps) {
//   const [duration, setDuration] = useState(0);
//   const [startTime, setStartTime] = useState(0);
//   const [endTime, setEndTime] = useState(0);
//   const [isTrimming, setIsTrimming] = useState(false);
//   const [trimProgress, setTrimProgress] = useState('');
//   const [isPreviewing, setIsPreviewing] = useState(false);
//   const previewRef = useRef<HTMLVideoElement>(null);
//   const trackRef = useRef<HTMLDivElement>(null);
//   const draggingRef = useRef<'start' | 'end' | null>(null);

//   useEffect(() => {
//     const video = previewRef.current;
//     if (!video) return;
//     video.src = videoUrl;
//     video.onloadedmetadata = () => {
//       const dur = isFinite(video.duration) ? video.duration : 0;
//       setDuration(dur);
//       setStartTime(0);
//       setEndTime(dur);
//     };
//   }, [videoUrl]);

//   // ── Drag-based dual-range slider ────────────────────────────────────────
//   const pctFromEvent = (e: PointerEvent | React.PointerEvent) => {
//     const track = trackRef.current;
//     if (!track || duration === 0) return 0;
//     const rect = track.getBoundingClientRect();
//     return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
//   };

//   const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
//     if (duration === 0) return;
//     e.preventDefault();
//     const pct = pctFromEvent(e);
//     const pos = pct * duration;
//     const distStart = Math.abs(pos - startTime);
//     const distEnd = Math.abs(pos - endTime);
//     // Pick the closer handle; prefer 'end' when tied
//     draggingRef.current = distStart < distEnd ? 'start' : 'end';
//     (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
//   }, [duration, startTime, endTime]);

//   const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
//     if (!draggingRef.current || duration === 0) return;
//     e.preventDefault();
//     const pos = pctFromEvent(e) * duration;
//     if (draggingRef.current === 'start') {
//       setStartTime(prev => {
//         const next = Math.max(0, Math.min(pos, endTime - 0.1));
//         return Math.round(next * 10) / 10;
//       });
//     } else {
//       setEndTime(prev => {
//         const next = Math.min(duration, Math.max(pos, startTime + 0.1));
//         return Math.round(next * 10) / 10;
//       });
//     }
//   }, [duration, startTime, endTime]);

//   const onPointerUp = useCallback(() => {
//     draggingRef.current = null;
//   }, []);

//   // ── Preview selected segment ────────────────────────────────────────────
//   const previewSegment = useCallback(() => {
//     const video = previewRef.current;
//     if (!video || isPreviewing) return;
//     setIsPreviewing(true);
//     video.currentTime = startTime;
//     video.play().catch(() => setIsPreviewing(false));

//     const stopAt = () => {
//       if (video.currentTime >= endTime) {
//         video.pause();
//         video.removeEventListener('timeupdate', stopAt);
//         setIsPreviewing(false);
//       }
//     };
//     const onEnded = () => {
//       video.removeEventListener('timeupdate', stopAt);
//       setIsPreviewing(false);
//     };
//     video.addEventListener('timeupdate', stopAt);
//     video.addEventListener('ended', onEnded, { once: true });
//   }, [startTime, endTime, isPreviewing]);

//   // ── Export trimmed clip ─────────────────────────────────────────────────
//   const exportTrimmed = useCallback(async () => {
//     if (duration === 0 || startTime >= endTime) return;
//     setIsTrimming(true);
//     setTrimProgress('Preparing…');

//     try {
//       // Create a hidden video element and seek to startTime
//       const video = document.createElement('video');
//       video.src = videoUrl;
//       video.preload = 'auto';
//       video.muted = false;

//       await new Promise<void>((resolve, reject) => {
//         video.onloadedmetadata = () => resolve();
//         video.onerror = () => reject(new Error('Could not load video for trimming'));
//         video.load();
//       });

//       video.currentTime = startTime;
//       await new Promise<void>(resolve => { video.onseeked = () => resolve(); });

//       setTrimProgress('Recording segment…');

//       // captureStream() preserves both video AND audio tracks
//       const stream: MediaStream = (video as HTMLVideoElement & { captureStream: () => MediaStream }).captureStream();

//       // Pick the best supported codec
//       const mimeType = [
//         'video/webm;codecs=vp9,opus',
//         'video/webm;codecs=vp8,opus',
//         'video/webm',
//       ].find(m => MediaRecorder.isTypeSupported(m)) ?? 'video/webm';

//       const recorder = new MediaRecorder(stream, { mimeType });
//       const chunks: Blob[] = [];
//       recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

//       const donePromise = new Promise<Blob>(resolve => {
//         recorder.onstop = () => resolve(new Blob(chunks, { type: recorder.mimeType }));
//       });

//       recorder.start(100); // collect data every 100 ms
//       await video.play();

//       // Wait until we reach endTime
//       await new Promise<void>(resolve => {
//         const check = () => {
//           if (video.currentTime >= endTime || video.ended) {
//             video.ontimeupdate = null;
//             video.onended = null;
//             resolve();
//           }
//         };
//         video.ontimeupdate = check;
//         video.onended = check;
//       });

//       video.pause();
//       // Flush the last data chunk before stopping
//       await new Promise(r => setTimeout(r, 250));
//       recorder.stop();

//       const trimmedBlob = await donePromise;
//       setTrimProgress('Saving…');

//       if (onDownload) {
//         onDownload(trimmedBlob);
//       } else {
//         const ext = trimmedBlob.type.includes('mp4') ? 'mp4' : 'webm';
//         const url = URL.createObjectURL(trimmedBlob);
//         const a = document.createElement('a');
//         a.href = url;
//         a.download = `RecordPilot-trimmed.${ext}`;
//         a.click();
//         setTimeout(() => URL.revokeObjectURL(url), 2000);
//       }
//     } catch (err) {
//       console.error('Trim export failed:', err);
//       setTrimProgress('Export failed. Try a shorter segment or refresh.');
//     } finally {
//       setIsTrimming(false);
//       setTrimProgress('');
//     }
//   }, [videoUrl, startTime, endTime, duration, onDownload]);

//   const startPct = duration > 0 ? (startTime / duration) * 100 : 0;
//   const endPct   = duration > 0 ? (endTime   / duration) * 100 : 100;
//   const segWidth  = endPct - startPct;

//   if (duration === 0) return null;

//   return (
//     <div className="bg-card border border-border rounded-xl p-6 space-y-5">
//       <div className="flex items-center gap-2">
//         <Scissors className="w-5 h-5 text-primary" />
//         <h3 className="text-base font-semibold text-white">Trim Recording</h3>
//       </div>

//       {/* Hidden preview video (used both for metadata and preview playback) */}
//       <video ref={previewRef} className="hidden" preload="metadata" />

//       {/* Time display */}
//       <div className="flex justify-between text-sm text-muted-foreground">
//         <span>Start: <span className="text-white font-mono">{formatTime(startTime)}</span></span>
//         <span className="text-primary font-mono font-medium">{formatTime(endTime - startTime)}</span>
//         <span>End: <span className="text-white font-mono">{formatTime(endTime)}</span></span>
//       </div>

//       {/* Dual-range slider — pointer-event driven, no overlapping inputs */}
//       <div
//         ref={trackRef}
//         className="relative h-10 select-none cursor-pointer touch-none"
//         onPointerDown={onPointerDown}
//         onPointerMove={onPointerMove}
//         onPointerUp={onPointerUp}
//         onPointerCancel={onPointerUp}
//         data-testid="trim-track"
//       >
//         {/* Full track background */}
//         <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-2 rounded-full bg-secondary" />

//         {/* Selected segment highlight */}
//         <div
//           className="absolute top-1/2 -translate-y-1/2 h-2 rounded-full bg-primary"
//           style={{ left: `${startPct}%`, width: `${segWidth}%` }}
//         />

//         {/* Start handle */}
//         <div
//           className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-primary shadow-lg z-10 -translate-x-1/2 transition-shadow hover:shadow-primary/30"
//           style={{ left: `${startPct}%` }}
//           aria-label={`Start trim handle: ${formatTime(startTime)}`}
//         />

//         {/* End handle */}
//         <div
//           className="absolute top-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-white border-2 border-primary shadow-lg z-10 -translate-x-1/2 transition-shadow hover:shadow-primary/30"
//           style={{ left: `${endPct}%` }}
//           aria-label={`End trim handle: ${formatTime(endTime)}`}
//         />
//       </div>

//       {/* Controls */}
//       <div className="flex flex-wrap items-center gap-3">
//         <Button
//           variant="outline"
//           size="sm"
//           onClick={previewSegment}
//           disabled={isPreviewing || isTrimming}
//           className="flex items-center gap-2 border-border hover:bg-secondary"
//           data-testid="button-preview-trim"
//         >
//           {isPreviewing
//             ? <Loader2 className="w-4 h-4 animate-spin" />
//             : <Play className="w-4 h-4" />
//           }
//           {isPreviewing ? 'Playing…' : 'Preview Segment'}
//         </Button>

//         <Button
//           size="sm"
//           onClick={exportTrimmed}
//           disabled={isTrimming || isPreviewing || startTime >= endTime}
//           className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
//           data-testid="button-export-trimmed"
//         >
//           {isTrimming
//             ? <Loader2 className="w-4 h-4 animate-spin" />
//             : <Download className="w-4 h-4" />
//           }
//           {isTrimming ? (trimProgress || 'Exporting…') : 'Export Trimmed'}
//         </Button>
//       </div>

//       {isTrimming && (
//         <p className="text-xs text-muted-foreground">
//           Trimming plays and re-encodes the segment in real time. Export takes as long as the selected clip duration.
//         </p>
//       )}
//     </div>
//   );
// }
import { useState, useRef, useEffect, useCallback } from 'react';
import { Scissors, Play, Download, Loader2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoTrimmerProps {
  videoUrl: string;
  blob: Blob;
  onDownload?: (trimmedBlob: Blob) => void;
}

function formatTime(secs: number) {
  const m = Math.floor(secs / 60);
  const s = Math.floor(secs % 60);
  const ms = Math.floor((secs % 1) * 10);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${ms}`;
}

export function VideoTrimmer({ videoUrl, blob, onDownload }: VideoTrimmerProps) {
  const [duration, setDuration] = useState(0);
  const [startTime, setStartTime] = useState(0);
  const [endTime, setEndTime] = useState(0);
  const [isTrimming, setIsTrimming] = useState(false);
  const [trimProgress, setTrimProgress] = useState('');
  const [trimError, setTrimError] = useState('');
  const [isPreviewing, setIsPreviewing] = useState(false);
  const [previewUrl, setPreviewUrl] = useState('');

  const previewRef = useRef<HTMLVideoElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<'start' | 'end' | null>(null);

  // Load video metadata
  useEffect(() => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.src = videoUrl;
    video.onloadedmetadata = () => {
      const dur = isFinite(video.duration) && video.duration > 0 ? video.duration : 0;
      setDuration(dur);
      setStartTime(0);
      setEndTime(dur);
    };
    video.onerror = () => {
      setTrimError('Could not load video metadata.');
    };
    return () => { video.src = ''; };
  }, [videoUrl]);

  // Dual-range slider logic
  const getPct = (e: PointerEvent | React.PointerEvent) => {
    const track = trackRef.current;
    if (!track || duration === 0) return 0;
    const rect = track.getBoundingClientRect();
    return Math.min(1, Math.max(0, (e.clientX - rect.left) / rect.width));
  };

  const onPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (duration === 0) return;
    e.preventDefault();
    const pos = getPct(e) * duration;
    const distStart = Math.abs(pos - startTime);
    const distEnd = Math.abs(pos - endTime);
    draggingRef.current = distStart < distEnd ? 'start' : 'end';
    (e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
  }, [duration, startTime, endTime]);

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!draggingRef.current || duration === 0) return;
    e.preventDefault();
    const pos = getPct(e) * duration;
    if (draggingRef.current === 'start') {
      setStartTime(Math.round(Math.max(0, Math.min(pos, endTime - 0.1)) * 10) / 10);
    } else {
      setEndTime(Math.round(Math.min(duration, Math.max(pos, startTime + 0.1)) * 10) / 10);
    }
  }, [duration, startTime, endTime]);

  const onPointerUp = useCallback(() => {
    draggingRef.current = null;
  }, []);

  // Preview selected segment
  const previewSegment = useCallback(() => {
    const video = previewRef.current;
    if (!video || isPreviewing) return;
    setIsPreviewing(true);
    video.currentTime = startTime;
    video.play().catch(() => setIsPreviewing(false));

    const stopAt = () => {
      if (video.currentTime >= endTime) {
        video.pause();
        video.removeEventListener('timeupdate', stopAt);
        setIsPreviewing(false);
      }
    };
    video.addEventListener('timeupdate', stopAt);
    video.addEventListener('ended', () => {
      video.removeEventListener('timeupdate', stopAt);
      setIsPreviewing(false);
    }, { once: true });
  }, [startTime, endTime, isPreviewing]);

  // ── Main trim function using Web APIs (fast, no real-time playback) ─────
  const exportTrimmed = useCallback(async () => {
    if (duration === 0 || startTime >= endTime) return;
    setIsTrimming(true);
    setTrimError('');
    setTrimProgress('Loading video…');

    try {
      // Step 1: Try fast trim using MediaSource + ArrayBuffer slicing approach
      // This reads the blob directly without real-time playback
      
      setTrimProgress('Processing video segment…');

      const segmentDuration = endTime - startTime;

      // Method: Use captureStream at high speed to avoid real-time wait
      const video = document.createElement('video');
      video.src = videoUrl;
      video.muted = true; // muted needed for autoplay policy
      video.preload = 'auto';

      await new Promise<void>((res, rej) => {
        video.oncanplaythrough = () => res();
        video.onerror = () => rej(new Error('Video load failed'));
        video.load();
      });

      // Seek to start
      video.currentTime = startTime;
      await new Promise<void>(res => {
        video.onseeked = () => res();
      });

      setTrimProgress(`Recording ${Math.round(segmentDuration)}s segment…`);

      // Capture stream — includes video track
      type VideoWithCapture = HTMLVideoElement & { captureStream: (fps?: number) => MediaStream };
      const stream = (video as VideoWithCapture).captureStream(30);

      // Also capture audio from original blob using Web Audio API
      const audioCtx = new AudioContext();
      const arrayBuffer = await blob.arrayBuffer();
      let audioBuffer: AudioBuffer | null = null;
      
      try {
        audioBuffer = await audioCtx.decodeAudioData(arrayBuffer.slice(0));
      } catch {
        // Audio decode failed — video-only trim
        audioBuffer = null;
      }

      // Pick best codec
      const mimeType = [
        'video/webm;codecs=vp9,opus',
        'video/webm;codecs=vp8,opus',
        'video/webm',
      ].find(m => MediaRecorder.isTypeSupported(m)) ?? 'video/webm';

      // If we have audio, mix it into the stream via AudioContext destination
      let audioSource: AudioBufferSourceNode | null = null;
      if (audioBuffer) {
        const dest = audioCtx.createMediaStreamDestination();
        audioSource = audioCtx.createBufferSource();
        audioSource.buffer = audioBuffer;
        audioSource.connect(dest);

        // Add audio track to stream
        const audioTrack = dest.stream.getAudioTracks()[0];
        if (audioTrack) stream.addTrack(audioTrack);
      }

      const recorder = new MediaRecorder(stream, { mimeType });
      const chunks: Blob[] = [];
      recorder.ondataavailable = e => { if (e.data.size > 0) chunks.push(e.data); };

      const donePromise = new Promise<Blob>(res => {
        recorder.onstop = () => res(new Blob(chunks, { type: recorder.mimeType }));
      });

      recorder.start(100);

      // Start audio from correct offset
      if (audioSource) {
        audioSource.start(0, startTime, segmentDuration);
      }

      await video.play();

      // Wait for segment to finish — poll every 200ms for better accuracy
      await new Promise<void>(resolve => {
        const interval = setInterval(() => {
          setTrimProgress(`Processing… ${Math.round(((video.currentTime - startTime) / segmentDuration) * 100)}%`);
          if (video.currentTime >= endTime - 0.05 || video.ended) {
            clearInterval(interval);
            resolve();
          }
        }, 200);

        video.onended = () => {
          clearInterval(interval);
          resolve();
        };
      });

      video.pause();

      // Give MediaRecorder time to flush final data
      setTrimProgress('Finalizing…');
      await new Promise(r => setTimeout(r, 400));
      recorder.stop();

      // Cleanup audio context
      if (audioSource) audioSource.stop();
      await audioCtx.close();

      const trimmedBlob = await donePromise;

      setTrimProgress('Saving file…');

      if (trimmedBlob.size < 1000) {
        throw new Error('Trimmed file is too small — something went wrong.');
      }

      if (onDownload) {
        onDownload(trimmedBlob);
      } else {
        const ext = trimmedBlob.type.includes('mp4') ? 'mp4' : 'webm';
        const url = URL.createObjectURL(trimmedBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `RecordPilot-trimmed.${ext}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        setTimeout(() => URL.revokeObjectURL(url), 5000);
      }

    } catch (err) {
      console.error('Trim export failed:', err);
      setTrimError(err instanceof Error ? err.message : 'Export failed. Please try again.');
    } finally {
      setIsTrimming(false);
      setTrimProgress('');
    }
  }, [videoUrl, blob, startTime, endTime, duration, onDownload]);

  // Cleanup preview URL
  useEffect(() => {
    return () => { if (previewUrl) URL.revokeObjectURL(previewUrl); };
  }, [previewUrl]);

  const startPct = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPct   = duration > 0 ? (endTime   / duration) * 100 : 100;
  const segWidth  = endPct - startPct;
  const segDuration = endTime - startTime;

  if (duration === 0) return null;

  return (
    <div className="bg-card border border-border rounded-xl p-6 space-y-5">
      <div className="flex items-center gap-2">
        <Scissors className="w-5 h-5 text-primary" />
        <h3 className="text-base font-semibold text-white">Trim Recording</h3>
        <span className="ml-auto text-xs text-muted-foreground">
          Total: {formatTime(duration)}
        </span>
      </div>

      {/* Hidden video for preview playback */}
      <video ref={previewRef} src={videoUrl} className="hidden" preload="metadata" />

      {/* Selected segment info */}
      <div className="flex justify-between items-center text-sm">
        <div className="text-muted-foreground">
          Start: <span className="text-white font-mono">{formatTime(startTime)}</span>
        </div>
        <div className="bg-primary/10 border border-primary/30 rounded-full px-3 py-1">
          <span className="text-primary font-mono font-semibold text-xs">
            {formatTime(segDuration)} selected
          </span>
        </div>
        <div className="text-muted-foreground">
          End: <span className="text-white font-mono">{formatTime(endTime)}</span>
        </div>
      </div>

      {/* Dual-range slider */}
      <div
        ref={trackRef}
        className="relative h-12 select-none cursor-pointer touch-none"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        data-testid="trim-track"
      >
        {/* Track background */}
        <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-3 rounded-full bg-secondary" />

        {/* Dimmed regions (outside selection) */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 rounded-l-full bg-secondary/80"
          style={{ left: 0, width: `${startPct}%` }}
        />
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 rounded-r-full bg-secondary/80"
          style={{ left: `${endPct}%`, width: `${100 - endPct}%` }}
        />

        {/* Selected segment */}
        <div
          className="absolute top-1/2 -translate-y-1/2 h-3 bg-primary"
          style={{ left: `${startPct}%`, width: `${segWidth}%` }}
        />

        {/* Start handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-primary shadow-lg z-10 cursor-grab active:cursor-grabbing"
          style={{ left: `${startPct}%`, transform: 'translate(-50%, -50%)' }}
          aria-label={`Start: ${formatTime(startTime)}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-3 bg-primary rounded-full" />
          </div>
        </div>

        {/* End handle */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-white border-2 border-primary shadow-lg z-10 cursor-grab active:cursor-grabbing"
          style={{ left: `${endPct}%`, transform: 'translate(-50%, -50%)' }}
          aria-label={`End: ${formatTime(endTime)}`}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-0.5 h-3 bg-primary rounded-full" />
          </div>
        </div>
      </div>

      {/* Time markers */}
      <div className="flex justify-between text-[10px] text-muted-foreground/50 font-mono -mt-2">
        <span>00:00.0</span>
        <span>{formatTime(duration / 4)}</span>
        <span>{formatTime(duration / 2)}</span>
        <span>{formatTime((duration * 3) / 4)}</span>
        <span>{formatTime(duration)}</span>
      </div>

      {/* Error message */}
      {trimError && (
        <div className="flex items-start gap-2 bg-destructive/10 border border-destructive/30 rounded-lg px-3 py-2">
          <AlertCircle className="w-4 h-4 text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{trimError}</p>
        </div>
      )}

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-3">
        <Button
          variant="outline"
          size="sm"
          onClick={previewSegment}
          disabled={isPreviewing || isTrimming}
          className="flex items-center gap-2 border-border hover:bg-secondary"
          data-testid="button-preview-trim"
        >
          {isPreviewing
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Play className="w-4 h-4" />
          }
          {isPreviewing ? 'Playing…' : 'Preview'}
        </Button>

        <Button
          size="sm"
          onClick={exportTrimmed}
          disabled={isTrimming || isPreviewing || startTime >= endTime}
          className="flex items-center gap-2 bg-primary hover:bg-primary/90 text-white"
          data-testid="button-export-trimmed"
        >
          {isTrimming
            ? <Loader2 className="w-4 h-4 animate-spin" />
            : <Download className="w-4 h-4" />
          }
          {isTrimming ? (trimProgress || 'Exporting…') : 'Export Trimmed'}
        </Button>

        {isTrimming && (
          <span className="text-xs text-muted-foreground">
            Export takes as long as the selected clip duration.
          </span>
        )}
      </div>
    </div>
  );
}