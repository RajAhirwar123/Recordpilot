import { useState, useRef, useCallback } from 'react';
import type { RecordingMode, RecordingSettings, RecordingStatus } from '@/types/recording';

const getMimeType = () => {
  const types = [
    'video/webm;codecs=vp9,opus',
    'video/webm;codecs=vp8,opus',
    'video/webm',
    'video/mp4',
  ];
  return types.find(type => MediaRecorder.isTypeSupported(type)) || 'video/webm';
};

const getAudioMimeType = () => {
  const types = [
    'audio/webm;codecs=opus',
    'audio/webm',
    'audio/ogg;codecs=opus',
    'audio/ogg',
  ];
  return types.find(type => MediaRecorder.isTypeSupported(type)) || 'audio/webm';
};

export function useRecording() {
  const [status, setStatus] = useState<RecordingStatus>('idle');
  const [blob, setBlob] = useState<Blob | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const streamRef = useRef<MediaStream | null>(null);
  const audioStreamRef = useRef<MediaStream | null>(null);

  const stopAllStreams = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop());
    audioStreamRef.current?.getTracks().forEach(t => t.stop());
    streamRef.current = null;
    audioStreamRef.current = null;
  }, []);

  const startRecording = useCallback(async (mode: RecordingMode, settings: RecordingSettings) => {
    setError(null);
    setStatus('requesting');
    chunksRef.current = [];

    try {
      let stream: MediaStream;

      const videoConstraints = settings.hdRecording
        ? { width: { ideal: 1920 }, height: { ideal: 1080 }, frameRate: { ideal: 30 } }
        : { width: { ideal: 1280 }, height: { ideal: 720 }, frameRate: { ideal: 30 } };

      if (mode === 'audio') {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
      } else if (mode === 'webcam') {
        stream = await navigator.mediaDevices.getUserMedia({
          video: videoConstraints,
          audio: settings.microphone,
        });
      } else {
        const displayStream = await navigator.mediaDevices.getDisplayMedia({
          video: videoConstraints,
          audio: settings.systemAudio,
        });

        if (mode === 'screen-webcam' || mode === 'screen-webcam-audio') {
          try {
            const camStream = await navigator.mediaDevices.getUserMedia({
              video: { width: 320, height: 240 },
              audio: settings.microphone,
            });
            const tracks = [...displayStream.getTracks(), ...camStream.getTracks()];
            stream = new MediaStream(tracks);
            audioStreamRef.current = camStream;
          } catch {
            stream = displayStream;
          }
        } else if (settings.microphone && !settings.systemAudio) {
          try {
            const micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
            const tracks = [...displayStream.getTracks(), ...micStream.getTracks()];
            stream = new MediaStream(tracks);
            audioStreamRef.current = micStream;
          } catch {
            stream = displayStream;
          }
        } else {
          stream = displayStream;
        }
      }

      streamRef.current = stream;

      const isAudioOnly = mode === 'audio';
      const mimeType = isAudioOnly ? getAudioMimeType() : getMimeType();

      const recorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const recordedBlob = new Blob(chunksRef.current, { type: mimeType });
        const url = URL.createObjectURL(recordedBlob);
        setBlob(recordedBlob);
        setVideoUrl(url);
        setStatus('stopped');
        stopAllStreams();
      };

      stream.getTracks()[0].onended = () => {
        if (mediaRecorderRef.current?.state === 'recording') {
          mediaRecorderRef.current.stop();
        }
      };

      recorder.start(1000);
      setStatus('recording');
    } catch (err) {
      stopAllStreams();
      setStatus('idle');
      const msg = err instanceof Error ? err.message : String(err);
      if (msg.includes('Permission denied') || msg.includes('NotAllowedError')) {
        setError('Permission denied. Please allow screen/microphone access and try again.');
      } else if (msg.includes('NotFoundError')) {
        setError('No camera or microphone found. Please check your device.');
      } else {
        setError(`Recording failed: ${msg}`);
      }
    }
  }, [stopAllStreams]);

  const pauseRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'recording') {
      mediaRecorderRef.current.pause();
      setStatus('paused');
    }
  }, []);

  const resumeRecording = useCallback(() => {
    if (mediaRecorderRef.current?.state === 'paused') {
      mediaRecorderRef.current.resume();
      setStatus('recording');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
    } else {
      stopAllStreams();
      setStatus('idle');
    }
  }, [stopAllStreams]);

  const downloadRecording = useCallback((filename = 'screencraft-recording') => {
    if (!blob || !videoUrl) return;
    const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('audio') ? 'webm' : 'webm';
    const a = document.createElement('a');
    a.href = videoUrl;
    a.download = `${filename}.${ext}`;
    a.click();
  }, [blob, videoUrl]);

  const discardRecording = useCallback(() => {
    if (videoUrl) URL.revokeObjectURL(videoUrl);
    setBlob(null);
    setVideoUrl(null);
    setStatus('idle');
    setError(null);
    stopAllStreams();
  }, [videoUrl, stopAllStreams]);

  const getStream = useCallback(() => streamRef.current, []);

  return {
    status,
    blob,
    videoUrl,
    error,
    startRecording,
    pauseRecording,
    resumeRecording,
    stopRecording,
    downloadRecording,
    discardRecording,
    getStream,
  };
}
