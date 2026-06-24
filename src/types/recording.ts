export type RecordingMode =
  | 'screen'
  | 'window'
  | 'tab'
  | 'webcam'
  | 'audio'
  | 'screen-webcam'
  | 'screen-audio'
  | 'screen-webcam-audio';

export type RecordingStatus = 'idle' | 'requesting' | 'recording' | 'paused' | 'stopped';

export interface RecordingSettings {
  microphone: boolean;
  systemAudio: boolean;
  webcamOverlay: boolean;
  pictureInPicture: boolean;
  hdRecording: boolean;
  autoDownload: boolean;
}

export interface RecordingState {
  status: RecordingStatus;
  mode: RecordingMode;
  settings: RecordingSettings;
  elapsed: number;
  blob: Blob | null;
  videoUrl: string | null;
  error: string | null;
}

export interface AudioState {
  status: RecordingStatus;
  elapsed: number;
  blob: Blob | null;
  audioUrl: string | null;
  error: string | null;
}
