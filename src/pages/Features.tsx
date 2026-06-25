import { Monitor, Mic, Video, Globe, Eye, Scissors, Infinity, Shield, Lock, Zap, CheckCircle, X } from 'lucide-react';
import { Link } from 'wouter';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

const features = [
  { icon: Monitor, title: 'Screen Recording', desc: 'Capture your full display, a specific app window, or a browser tab at up to 1080p HD. The getDisplayMedia API ensures native-quality capture with no performance impact on most systems.' },
  { icon: Video, title: 'Webcam Recording', desc: 'Record from your webcam as standalone content or as an overlay on your screen recording. RecordPilot supports all USB and built-in webcams compatible with your browser.' },
  { icon: Mic, title: 'Microphone Recording', desc: 'Capture crystal-clear narration with microphone audio. The real-time waveform visualizer confirms your mic is active and gives you live feedback on audio levels.' },
  { icon: Globe, title: 'System Audio Capture', desc: 'Record the sounds your computer makes — music, video audio, game sounds, notification sounds — alongside your screen capture using Chrome\'s built-in system audio API.' },
  { icon: Eye, title: 'Picture-in-Picture', desc: 'Use your browser\'s native Picture-in-Picture mode to monitor your recording preview while working in another window.' },
  { icon: Scissors, title: 'Browser-Side Video Trimmer', desc: 'Trim the start and end of your recording using a dual-range slider without leaving your browser. Preview the trimmed segment before exporting.' },
  { icon: Scissors, title: 'Audio Trimmer', desc: 'Dedicated audio trimming with waveform visualization. Select your segment, preview it, and download the trimmed clip.' },
  { icon: Infinity, title: 'No Recording Limits', desc: 'RecordPilot imposes zero time limits on recordings. Record for as long as you need — the only limit is your device memory.' },
  { icon: Globe, title: '100% Browser Based', desc: 'No installation. No extension. No plugin. RecordPilot runs entirely in modern browsers using standard Web APIs. Open the URL and start recording.' },
  { icon: Shield, title: 'Zero Data Collection', desc: 'We collect absolutely no data. No analytics on recordings, no usage tracking, no behavioral profiling. Your recording workflow is completely private.' },
  { icon: Lock, title: 'No Watermarks', desc: 'Every recording you download is clean and watermark-free. Your content belongs to you, branded however you choose.' },
  { icon: Zap, title: 'Instant Start, No Login', desc: 'There\'s no account, no registration, no onboarding flow. Open RecordPilot and click Record. That\'s it.' },
];

const comparison = [
  { feature: 'Free to use', RecordPilot: true, screenrecordercom: true, obs: true, loom: false },
  { feature: 'No login required', RecordPilot: true, screenrecordercom: true, obs: true, loom: false },
  { feature: 'No upload to servers', RecordPilot: true, screenrecordercom: false, obs: true, loom: false },
  { feature: 'Browser-based', RecordPilot: true, screenrecordercom: true, obs: false, loom: true },
  { feature: 'No watermarks', RecordPilot: true, screenrecordercom: false, obs: true, loom: false },
  { feature: 'Video trimmer', RecordPilot: true, screenrecordercom: false, obs: false, loom: true },
  { feature: 'System audio', RecordPilot: true, screenrecordercom: true, obs: true, loom: true },
  { feature: 'HD recording', RecordPilot: true, screenrecordercom: true, obs: true, loom: true },
  { feature: 'No install required', RecordPilot: true, screenrecordercom: true, obs: false, loom: true },
  { feature: 'No time limits', RecordPilot: true, screenrecordercom: false, obs: true, loom: false },
];

const cols = ['RecordPilot', 'Screen-Recorder.com', 'OBS Studio', 'Loom'];

export default function Features() {
  return (
    <Layout>
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-14">
          <h1 className="text-4xl font-bold text-white">Features</h1>
          <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Everything a professional screen recorder should have — free, private, and browser-based.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-16">
          {features.map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-white font-semibold mb-2">{title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>

        <div className="mb-16">
          <h2 className="text-2xl font-bold text-white mb-6">How RecordPilot Compares</h2>
          <div className="bg-card border border-border rounded-xl overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left text-muted-foreground font-medium px-4 py-3 w-48">Feature</th>
                    {cols.map(col => (
                      <th key={col} className={`text-center font-semibold px-4 py-3 ${col === 'RecordPilot' ? 'text-primary' : 'text-white'}`}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {comparison.map(({ feature, RecordPilot, screenrecordercom, obs, loom }) => (
                    <tr key={feature} className="border-b border-border/50 hover:bg-secondary/20 transition-colors">
                      <td className="text-muted-foreground px-4 py-3">{feature}</td>
                      {[RecordPilot, screenrecordercom, obs, loom].map((val, i) => (
                        <td key={i} className="text-center px-4 py-3">
                          {val
                            ? <CheckCircle className="w-4 h-4 text-primary mx-auto" />
                            : <X className="w-4 h-4 text-muted-foreground/40 mx-auto" />
                          }
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
           <div className="text-center mb-14">
         
            <p className="mt-4 text-muted-foreground max-w-xl mx-auto">
              Feature comparison is based on publicly available information and may change over time.
              Please verify features on the respective websites.
            </p>
            </div>
        </div>
      

        <div className="text-center bg-card border border-border rounded-2xl p-10">
          <h2 className="text-2xl font-bold text-white mb-3">Try All Features Free</h2>
          <p className="text-muted-foreground mb-6">No account, no payment, no catch.</p>
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <Link href="/screen-recorder">
              <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8" data-testid="button-features-cta">
                Start Recording
              </Button>
            </Link>
            <Link href="/how-it-works">
              <Button size="lg" variant="outline" className="border-border hover:bg-secondary px-8" data-testid="button-features-how">
                How It Works
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </Layout>
  );
}
