import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import { Layout } from '@/components/Layout';
import { ContentAd } from '@/components/AdUnit';

const faqs = [
  {
    category: 'Privacy & Security',
    items: [
      { q: 'Is my recording uploaded to your servers?', a: 'No. RecordPilot is built on a 100% client-side architecture. Your recording data never leaves your device. The MediaRecorder API captures and encodes video entirely in your browser memory. We have no servers that receive video data — it\'s architecturally impossible for us to see your recordings.' },
      { q: 'Do you store or save my videos anywhere?', a: 'We do not store anything. All recording data lives temporarily in your browser\'s memory and is discarded when you close the tab, click Discard, or navigate away. There is no cloud storage, no database, and no server that retains any part of your recording.' },
      { q: 'Is RecordPilot safe to use for sensitive content?', a: 'Yes. Because recordings never leave your device, RecordPilot is safe for recording sensitive content like financial dashboards, medical information, confidential business data, or any other material you would not want transmitted to third parties. The architecture enforces privacy — not just policy.' },
    ],
  },
  {
    category: 'Recording Features',
    items: [
      { q: 'How does browser-based recording work?', a: 'Modern browsers (Chrome, Edge, Firefox) expose native APIs — getDisplayMedia for screen capture, getUserMedia for webcam and microphone, and MediaRecorder for encoding. RecordPilot uses these standard browser APIs to give you a full recording experience without any software installation. Everything happens in JavaScript running in your browser tab.' },
      { q: 'Can I record system audio (computer sounds)?', a: 'Yes, on Chrome and Edge for Windows and Chrome OS. When you select a recording mode that includes system audio, your browser\'s screen share permission dialog will show a "Share system audio" checkbox. If checked, all computer sounds — videos, music, notifications, game audio — are included in your recording. Safari does not currently support system audio capture.' },
      { q: 'Can I record my webcam and screen at the same time?', a: 'Yes. Choose "Screen + Webcam" or "Screen + Webcam + Audio" mode. RecordPilot captures both your screen and your webcam stream simultaneously. The webcam feed is included as a video track in the recording.' },
      { q: 'Is there a time limit on recordings?', a: 'No. RecordPilot imposes no time limits. The practical limit is your device\'s available RAM — very long recordings require more memory. For recordings longer than 30 minutes, we recommend checking your device\'s free memory beforehand and closing other browser tabs to maximize available resources.' },
    ],
  },
  {
    category: 'Technical & Compatibility',
    items: [
      { q: 'Which browsers work with RecordPilot?', a: 'Chrome and Edge (Chromium-based) offer the best support, including system audio capture. Firefox supports screen and microphone recording but has some limitations on system audio. Safari on macOS supports basic camera/mic recording but screen capture support is limited. We recommend Chrome for the most complete feature set, especially if you need system audio.' },
      { q: 'Can I trim videos after recording?', a: 'Yes. The built-in video trimmer appears automatically after you stop a recording. Drag the dual-range slider handles to set your start and end trim points. Click "Preview Segment" to watch just the selected portion. Then click "Export Trimmed" to generate a new file containing only your selected segment — all processed locally in your browser.' },
      { q: 'Can I trim audio recordings?', a: 'Yes. After completing an audio recording on the Audio Recorder page, a trimmer with a visual waveform preview appears. Set your trim points, preview the segment, and download the trimmed audio file — no external tools needed.' },
      { q: 'Is RecordPilot completely free?', a: 'Yes, completely free. No free tier, no premium plan, no paywall. Every feature — HD recording, all recording modes, video trimming, audio trimming — is available to every user without payment or registration. RecordPilot is supported by non-intrusive display advertising, which is how we keep the service free.' },
    ],
  },
];

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-border rounded-xl overflow-hidden">
      <button
        className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-secondary/40 transition-colors"
        onClick={() => setOpen(!open)}
        aria-expanded={open}
        data-testid={`faq-${q.slice(0, 15).replace(/\s+/g, '-').toLowerCase()}`}
      >
        <span className="text-white font-medium pr-4 text-sm">{q}</span>
        <ChevronDown className={`w-4 h-4 text-muted-foreground flex-shrink-0 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-4 border-t border-border">
          <p className="pt-3 text-muted-foreground text-sm leading-relaxed">{a}</p>
        </div>
      )}
    </div>
  );
}

export default function FAQ() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white">Frequently Asked Questions</h1>
          <p className="mt-4 text-muted-foreground">Everything you need to know about RecordPilot.</p>
        </div>

        {/* FAQ categories — Privacy and Recording Features sections */}
        <div className="space-y-8">
          {faqs.slice(0, 2).map(({ category, items }) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">{category}</h2>
              <div className="space-y-2">
                {items.map(({ q, a }) => (
                  <FAQItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/*
         * FAQ TRANSITION AD
         * Placement: between the first two FAQ categories (Privacy & Recording Features)
         * and the final category (Technical & Compatibility).
         * Acts as a natural visual break between sections of the FAQ content.
         * Lazy-loaded, fully responsive.
         */}
        <ContentAd />

        {/* Final FAQ category — Technical & Compatibility */}
        <div className="space-y-8">
          {faqs.slice(2).map(({ category, items }) => (
            <div key={category}>
              <h2 className="text-sm font-semibold text-primary uppercase tracking-wider mb-3">{category}</h2>
              <div className="space-y-2">
                {items.map(({ q, a }) => (
                  <FAQItem key={q} q={q} a={a} />
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-12 bg-card border border-border rounded-2xl p-8 text-center">
          <h3 className="text-white font-semibold mb-2">Still have questions?</h3>
          <p className="text-muted-foreground text-sm mb-4">Our team typically responds within 1–3 business days.</p>
          <a href="/contact" className="inline-flex items-center gap-2 text-primary hover:underline text-sm font-medium">
            Contact Us
          </a>
        </div>
      </div>
    </Layout>
  );
}
