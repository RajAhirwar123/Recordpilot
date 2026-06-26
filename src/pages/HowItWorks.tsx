import { Monitor, Shield, Circle, Video, Square, Scissors, Download, CheckCircle } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';
import { ContentAd } from '@/components/AdUnit';
import SEO from '@/components/SEO';

const steps = [
  {
    n: '01',
    icon: Monitor,
    title: 'Choose Your Recording Mode',
    desc: 'RecordPilot offers 8 recording modes to match every use case. Choose "Entire Screen" to capture your whole display, "Browser Tab" for a single tab, "Webcam Only" for camera-only content, or "Screen + Webcam + Audio" for a full professional recording. Each mode is optimized for its specific use case.',
    tip: 'For tutorial videos, "Screen + Audio" gives the best result. For presentations, "Entire Screen" ensures your audience sees everything.',
  },
  {
    n: '02',
    icon: Shield,
    title: 'Allow Browser Permissions',
    desc: "When you click Start Recording, your browser will display a permission prompt. For screen recording, you'll choose what to share — your entire display, a window, or a browser tab. For microphone recording, grant audio access. These permissions are standard browser security — RecordPilot never stores or transmits this access.",
    tip: 'Permissions are requested fresh each recording session. RecordPilot never stores persistent device access.',
  },
  {
    n: '03',
    icon: Circle,
    title: 'Start Recording',
    desc: 'Once permissions are granted, recording begins immediately. You\'ll see a red "REC" indicator with a live timer, and the audio level meter activates if microphone is enabled. The recording status is always visible so you know exactly what\'s being captured.',
    tip: 'A countdown gives you a moment to prepare before capture begins.',
  },
  {
    n: '04',
    icon: Video,
    title: 'Record Your Screen & Audio',
    desc: 'RecordPilot captures everything in real time using the MediaRecorder API, encoding your video to WebM format as you record. The audio visualizer shows a live waveform of your microphone input. You can pause and resume at any point without losing your recording — paused segments are seamlessly stitched together.',
    tip: 'The audio visualizer helps you confirm your microphone is active. If the bars don\'t move, check your microphone selection.',
  },
];

const stepsTwo = [
  {
    n: '05',
    icon: Square,
    title: 'Stop Your Recording',
    desc: 'Click the Stop button when you\'re done. RecordPilot finalizes the video file from the collected data chunks and generates a preview immediately. For screen recordings, stopping the browser\'s screen share dialog also stops recording automatically.',
    tip: 'If your browser tab shows the screen share notification bar, you can also click "Stop sharing" there.',
  },
  {
    n: '06',
    icon: Scissors,
    title: 'Trim Your Recording',
    desc: 'After stopping, the built-in video trimmer appears below your recording. Drag the dual-range slider handles to set your start and end points. Click "Preview Segment" to watch just that portion before committing. When satisfied, click "Export Trimmed" to generate a new file with only the selected segment.',
    tip: 'Trimming is completely optional. You can skip to downloading the full recording if no trimming is needed.',
  },
  {
    n: '07',
    icon: Download,
    title: 'Download Your Video',
    desc: 'Click Download to save your recording directly to your device. The file is saved as a WebM video file, which is natively supported by Chrome, Firefox, and Edge, and can be imported into any professional video editor like DaVinci Resolve, Premiere Pro, or CapCut for further editing.',
    tip: 'WebM files can be converted to MP4 using free tools like HandBrake if needed for sharing on social media.',
  },
];

function StepCard({ n, icon: Icon, title, desc, tip }: typeof steps[0]) {
  return (
    <div className="bg-card border border-border rounded-xl p-6 flex flex-col sm:flex-row gap-5">
      <div className="flex-shrink-0">
        <div className="w-14 h-14 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center relative">
          <Icon className="w-6 h-6 text-primary" />
          <span className="absolute -top-2 -left-2 text-xs font-bold text-primary/60 bg-background px-1 rounded">{n}</span>
        </div>
      </div>
      <div className="flex-1">
        <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
        <p className="text-muted-foreground text-sm leading-relaxed mb-3">{desc}</p>
        <div className="flex items-start gap-2 bg-primary/5 border border-primary/15 rounded-lg px-3 py-2">
          <CheckCircle className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
          <p className="text-xs text-muted-foreground"><span className="text-primary font-medium">Pro tip:</span> {tip}</p>
        </div>
      </div>
    </div>
  );
}

export default function HowItWorks() {
  return (
    <Layout>
      <SEO
        title="How RecordPilot Works"
        description="Learn how to use RecordPilot step by step."
        canonical="/how-it-works"
        />
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white">How RecordPilot Works</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
            From opening the app to downloading your recording in 7 simple steps.
          </p>
        </div>

        {/* Steps 1–4: ~600 words of content */}
        <div className="space-y-6">
          {steps.map(step => <StepCard key={step.n} {...step} />)}
        </div>

        {/*
         * SEO CONTENT AD
         * Placement: after approximately 600–800 words (steps 1–4 above).
         * Inserted naturally between content sections, not inside any step card.
         * Fully responsive, lazy-loaded.
         */}
        <ContentAd />

        {/* Steps 5–7: continuation of long-form content */}
        <div className="space-y-6">
          {stepsTwo.map(step => <StepCard key={step.n} {...step} />)}
        </div>

        <div className="mt-14 text-center bg-card border border-border rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Ready to Start Recording?</h2>
          <p className="text-muted-foreground mb-6">No account needed. No download required. Just click and record.</p>
          <Link href="/screen-recorder">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10" data-testid="button-how-it-works-cta">
              Open Screen Recorder
            </Button>
          </Link>
        </div>
      </div>
    </Layout>
  );
}
