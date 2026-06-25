import { useState, useRef, useEffect } from 'react';
import { Link } from 'wouter';
import { motion } from 'framer-motion';
import {
  Monitor, Mic, Video, Shield, Scissors, Infinity, Globe, Lock, Zap, Eye, Download, ChevronDown,
  Circle, Play, CheckCircle, Users, Clock
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Layout } from '@/components/Layout';

const features = [
  { icon: Monitor, title: 'Screen Recording', desc: 'Capture your entire screen, a specific app window, or just a browser tab with crystal-clear quality.' },
  { icon: Video, title: 'Webcam Recording', desc: 'Record yourself with your webcam alongside your screen or as a standalone video.' },
  { icon: Mic, title: 'Audio Recording', desc: 'Capture microphone audio with real-time waveform visualization.' },
  { icon: Globe, title: 'System Audio Capture', desc: 'Record computer sounds and system audio together with your screen recording.' },
  { icon: Eye, title: 'Picture in Picture', desc: 'Overlay your webcam feed as a picture-in-picture window on your screen recording.' },
  { icon: Scissors, title: 'Video Trimming', desc: 'Trim the start and end of your recording right in the browser using dual-range controls.' },
  { icon: Scissors, title: 'Audio Trimming', desc: 'Precisely trim audio recordings with a waveform preview and segment playback.' },
  { icon: Infinity, title: 'Unlimited Recording', desc: 'No time limits, no recording caps. Record as long as your session needs.' },
  { icon: Globe, title: '100% Browser Based', desc: 'Everything runs inside your browser. No extensions, no plugins, no installs needed.' },
  { icon: Shield, title: 'Privacy First', desc: 'Your recordings never leave your device. Zero server uploads, zero data collection.' },
  { icon: Lock, title: 'No Watermarks', desc: 'Download clean, watermark-free recordings every time. Your content, your brand.' },
  { icon: Zap, title: 'No Login Required', desc: 'Start recording immediately. No account, no email, no friction.' },
];

const steps = [
  { n: '01', icon: Monitor, title: 'Choose Recording Mode', desc: 'Select from screen, webcam, audio-only, or any combination.' },
  { n: '02', icon: Shield, title: 'Allow Permissions', desc: "Your browser will ask for screen or microphone access. Click 'Allow' once." },
  { n: '03', icon: Circle, title: 'Start Recording', desc: 'Hit the green button and your recording begins immediately.' },
  { n: '04', icon: Video, title: 'Record Screen & Audio', desc: 'Capture everything you need — screen, webcam, mic, system audio.' },
  { n: '05', icon: CheckCircle, title: 'Stop Recording', desc: 'Click Stop when you\'re done. Your recording is processed instantly.' },
  { n: '06', icon: Scissors, title: 'Trim Your Recording', desc: 'Use the browser-side trimmer to cut the beginning or end.' },
  { n: '07', icon: Download, title: 'Download Video', desc: 'Save your recording as a WebM file directly to your device.' },
];

const faqs = [
  { q: 'Is my recording uploaded to your servers?', a: 'No. RecordPilot is 100% client-side. Your recording is processed entirely in your browser and never transmitted to any server. We have no servers that handle video — it\'s architecturally impossible for us to receive your recordings.' },
  { q: 'Do you store or save my videos?', a: 'We do not store anything. All data exists temporarily in your browser\'s memory and is cleared when you close the tab or click discard. We have no database, no cloud storage, and no persistent storage of any kind.' },
  { q: 'How does browser-based recording work?', a: 'Modern browsers expose APIs like getDisplayMedia and MediaRecorder that allow JavaScript to capture screen content and encode it to video — entirely client-side. RecordPilot uses these standard browser APIs to give you a professional recording experience without any server.' },
  { q: 'Can I record system audio (computer sounds)?', a: 'Yes. When capturing your screen using Chrome or Edge on desktop, you can check "Share system audio" in the browser permission dialog. This captures all computer sounds including music, video audio, and notification sounds.' },
  { q: 'Can I record my webcam and screen together?', a: 'Yes. Select the "Screen + Webcam" mode to capture both simultaneously. Your webcam feed is included as a separate video track in the recording.' },
  { q: 'Is there a recording time limit?', a: 'No. RecordPilot imposes no time limits on recordings. The only practical limit is your device\'s available RAM and the browser\'s memory ceiling. For very long recordings, we recommend downloading frequently.' },
  { q: 'Does it work on Chrome and Firefox?', a: 'RecordPilot works best on Chrome, Edge, and other Chromium-based browsers which have full support for all recording APIs. Firefox supports most features. Safari has limited screen capture support. We recommend Chrome for the best experience.' },
  { q: 'Can I trim videos after recording?', a: 'Yes. After stopping a recording, the built-in video trimmer appears. Use the dual-range slider to set your start and end points, preview the segment, then export the trimmed version — all without leaving your browser.' },
  { q: 'Can I trim audio recordings?', a: 'Yes. The Audio Recorder page includes a dedicated audio trimmer with a visual timeline. Set trim points, preview the segment, and download the trimmed audio file.' },
  { q: 'Is RecordPilot completely free?', a: 'Yes, completely free with no hidden charges, no premium tiers, no feature gates. Every feature is available to every user without payment or registration.' },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/50 transition-colors"
        onClick={() => setOpen(!open)}
        data-testid={`faq-toggle-${q.slice(0, 20).replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="text-white font-medium pr-4">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 text-muted-foreground text-sm leading-relaxed border-t border-border">
          <p className="pt-3">{a}</p>
        </div>
      )}
    </div>
  );
}

const containerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
};
const cardVariants = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

export default function Home() {
  const featuresRef = useRef<HTMLElement>(null);
  const scrollToFeatures = () => featuresRef.current?.scrollIntoView({ behavior: 'smooth' });

  return (
    <Layout>
      <div className="overflow-x-hidden">
        {/* Hero */}
        <section className="relative py-24 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 bg-gradient-to-b from-primary/5 via-transparent to-transparent pointer-events-none" />
          <div className="relative mx-auto max-w-5xl text-center">
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
                <Circle className="w-2 h-2 fill-current" />
                Free · Private · No Login
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight"
            >
              Free Online Screen Recorder<br />
              <span className="text-primary">No Login Required</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
            >
              Record your screen, webcam, microphone, and system audio directly inside your browser.
              No downloads. No sign up. No uploads. Your recordings never leave your device.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link href="/screen-recorder">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-8 py-3 text-base font-semibold h-auto" data-testid="button-hero-start">
                  <Circle className="w-3 h-3 fill-white mr-2" />
                  Start Recording
                </Button>
              </Link>
              <Button
                size="lg"
                variant="outline"
                className="border-border hover:bg-secondary text-white px-8 py-3 text-base h-auto"
                onClick={scrollToFeatures}
                data-testid="button-hero-learn-more"
              >
                <Play className="w-4 h-4 mr-2" />
                Learn More
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="mt-16 relative mx-auto max-w-3xl"
            >
              <div className="bg-card border border-border rounded-2xl overflow-hidden shadow-2xl">
                <div className="bg-secondary/50 px-4 py-3 flex items-center gap-2 border-b border-border">
                  <div className="w-3 h-3 rounded-full bg-destructive" />
                  <div className="w-3 h-3 rounded-full bg-warning" />
                  <div className="w-3 h-3 rounded-full bg-success" />
                  <span className="ml-3 text-xs text-muted-foreground font-mono">Recordpilot — Recording Studio</span>
                  <div className="ml-auto flex items-center gap-2">
                    <div className="flex items-center gap-1.5 bg-destructive/20 border border-destructive/30 rounded-full px-3 py-1">
                      <span className="w-2 h-2 rounded-full bg-destructive animate-pulse" />
                      <span className="text-xs text-destructive font-semibold">REC</span>
                    </div>
                    <span className="text-xs font-mono text-white">00:02:34</span>
                  </div>
                </div>
                <div className="p-5 space-y-4">
                  <div className="bg-secondary/60 rounded-lg aspect-video relative overflow-hidden">

                      {/* Main Video */}
                      <video
                        autoPlay
                        muted
                        loop
                        playsInline
                        className="w-full h-full object-cover"
                      >
                        <source src="" type="video/mp4" />
                      </video>

                      {/* Webcam Preview */}
                      <div className="absolute bottom-3 right-3 w-24 h-16 rounded-lg overflow-hidden border border-border shadow-lg">
                        <video
                          autoPlay
                          muted
                          loop
                          playsInline
                          className="w-full h-full object-cover"
                        >
                          <source src="/video-project-5.mp4" type="video/mp4" />
                        </video>
                      </div>

                    </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['Microphone', 'System Audio', 'Webcam'].map((label, i) => (
                      <div key={label} className="bg-secondary/40 rounded-lg p-3">
                        <p className="text-xs text-muted-foreground mb-1.5">{label}</p>
                        <div className="flex gap-0.5 items-end h-4">
                          {Array.from({ length: 8 }, (_, j) => (
                            <div
                              key={j}
                              className="flex-1 rounded-sm bg-primary"
                              style={{ height: `${Math.random() * 100}%`, opacity: 0.6 + (i === 1 ? 0.4 : 0) }}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center justify-center gap-3">
                    {['Pause', 'Stop', 'Download'].map((action) => (
                      <div key={action} className={`px-4 py-2 rounded-lg text-xs font-medium border border-border ${action === 'Stop' ? 'bg-destructive/20 border-destructive/30 text-destructive' : 'bg-secondary text-muted-foreground'}`}>
                        {action}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="mt-10 flex items-center justify-center gap-8 text-sm text-muted-foreground flex-wrap"
            >
              {[
                { icon: Users, label: '250K+ Users' },
                { icon: Shield, label: 'Zero Uploads' },
                { icon: Clock, label: 'No Time Limits' },
                { icon: Lock, label: 'No Login' },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-2">
                  <Icon className="w-4 h-4 text-primary" />
                  <span>{label}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Features */}
        <section ref={featuresRef as React.RefObject<HTMLElement>} className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-6xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything You Need to Record</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Professional screen recording tools, all running securely in your browser.</p>
            </div>
            <motion.div
              variants={containerVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-50px' }}
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4"
            >
              {features.map(({ icon: Icon, title, desc }) => (
                <motion.div key={title} variants={cardVariants} className="bg-card border border-border rounded-xl p-5 hover:border-primary/30 transition-colors">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{desc}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* How It Works */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/30">
          <div className="mx-auto max-w-5xl">
            <div className="text-center mb-14">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">How It Works</h2>
              <p className="mt-4 text-muted-foreground max-w-xl mx-auto">Start recording in seconds. No setup required.</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {steps.map(({ n, icon: Icon, title, desc }) => (
                <div key={n} className="relative">
                  <div className="bg-card border border-border rounded-xl p-5">
                    <div className="flex items-center gap-3 mb-4">
                      <span className="text-3xl font-black text-primary/20 leading-none">{n}</span>
                      <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="w-4 h-4 text-primary" />
                      </div>
                    </div>
                    <h3 className="text-white font-semibold mb-2 text-sm">{title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/screen-recorder">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-white px-10" data-testid="button-how-it-works-cta">
                  Try It Now — It's Free
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold text-white">Frequently Asked Questions</h2>
              <p className="mt-4 text-muted-foreground">Everything you need to know about RecordPilot.</p>
            </div>
            <div className="space-y-3">
              {faqs.map(({ q, a }) => (
                <FAQItem key={q} q={q} a={a} />
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/faq" className="text-primary hover:underline text-sm">View all FAQs</Link>
            </div>
          </div>
        </section>

        {/* SEO Article */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 bg-card/20">
          <div className="mx-auto max-w-4xl prose prose-invert prose-sm max-w-none">
            <h2 className="text-2xl font-bold text-white mb-6">The Complete Guide to Free Online Screen Recording</h2>
            <div className="space-y-6 text-muted-foreground leading-relaxed">
              <p>
                Whether you're a software developer documenting a bug, a teacher creating an online course, a gamer capturing a highlight reel, or a remote worker explaining a workflow, screen recording has become an essential skill in the modern digital era. <strong className="text-white">RecordPilot is a free online screen recorder with no login required</strong> — a fully browser-based tool that eliminates the complexity, cost, and privacy concerns of traditional recording software.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">What Is a Browser-Based Screen Recorder?</h3>
              <p>
                A browser-based screen recorder uses your web browser's built-in capabilities — specifically the <code className="text-primary">getDisplayMedia</code>, <code className="text-primary">getUserMedia</code>, and <code className="text-primary">MediaRecorder</code> APIs — to capture screen content, webcam video, microphone input, and system audio. Unlike traditional software that requires installation, updates, and system permissions, browser recorders work immediately with no setup. Unlike cloud-based recorders, browser recorders never upload your video to external servers — everything stays on your device.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">Screen Recording for Education</h3>
              <p>
                Teachers, professors, and instructional designers use screen recording to create tutorial videos, record lectures for asynchronous students, demonstrate software tools, and provide personalized feedback on student submissions. With RecordPilot's free online screen recorder with audio, educators can capture narrated walkthroughs of complex concepts, record demonstrations of scientific simulations, and build entire course libraries — all without paying for expensive recording software or worrying about student data privacy since recordings never leave their device.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">Screen Recording for Business and Remote Work</h3>
              <p>
                The shift to remote work has made asynchronous video communication critical. Instead of scheduling another meeting, professionals use screen recording to demonstrate product features, document workflows for onboarding, report bugs with visual context, provide design feedback, and create training videos for distributed teams. A secure browser screen recorder that never uploads data is especially valuable in corporate environments with strict data governance policies.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">Screen Recording for Content Creators and Gaming</h3>
              <p>
                Content creators and gamers need reliable, high-quality recording tools. RecordPilot supports HD recording at 1080p with microphone and system audio capture, making it suitable for gaming highlight clips, software reviews, coding livestream source footage, and YouTube tutorial content. The browser-based trimmer means creators can rough-cut their videos before importing into a dedicated editor, saving time and storage.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">Screen Recording for Customer Support and Software Demos</h3>
              <p>
                Support teams use screen recording to create visual explanations for common issues, reducing ticket resolution time. Sales teams record personalized product demos for prospects. QA engineers capture bug reproductions. Project managers document requirements with annotated walkthroughs. RecordPilot's no-login, no-upload approach means teams can record and share instantly without IT approval or data compliance concerns.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">Privacy and Security: Why Browser Recording Is Safer</h3>
              <p>
                Traditional cloud recording services upload your video to their servers — which means your screen content, including potentially sensitive documents, code, financial data, or personal information, is transmitted across the internet and stored on third-party infrastructure. RecordPilot's architecture makes this impossible: the MediaRecorder API writes encoded video directly to browser memory, which is then made available as a local Blob object. The video is never serialized over a network connection. This makes RecordPilot <strong className="text-white">the most private free screen recorder online</strong> — not just by policy, but by design.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">Technical Comparison: RecordPilot vs. Traditional Screen Recorders</h3>
              <p>
                OBS Studio is the gold standard for professional streaming and recording, but requires installation, a learning curve, and system resources. Loom offers polished cloud recording but uploads your videos to their servers and charges for advanced features. RecordPilot offers the simplicity of a web tool with the privacy of local software — capturing everything at HD quality, right in the browser, for free, with no account required.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">How to Record Your Screen Without Downloading Software</h3>
              <p>
                Recording your screen without downloading software is now possible through modern browser APIs. Open RecordPilot at RecordPilot.io (or this URL), select your recording mode, click "Start Recording," and grant the browser permission to access your screen. The browser's native permission dialog will appear, letting you choose what to share — your entire screen, a specific window, or just a browser tab. Once you click Share, recording begins immediately. When you're done, click Stop, review your recording, trim if needed, and download it directly to your device.
              </p>
              <h3 className="text-xl font-semibold text-white mt-8">Browser Compatibility for Screen Recording</h3>
              <p>
                Chrome and Edge (Chromium-based) browsers offer the most complete screen recording API support, including system audio capture on Windows and Chrome OS. Firefox supports screen and webcam recording but has limitations on system audio. Safari on macOS supports basic screen capture but lacks some advanced features. For the best experience with RecordPilot's full feature set including system audio, we recommend Google Chrome or Microsoft Edge on a desktop computer.
              </p>
            </div>
          </div>
        </section>
      </div>
    </Layout>
  );
}
