import { Shield, Lock, Eye, Server } from 'lucide-react';
import { Layout } from '@/components/Layout';

export default function Privacy() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">Privacy Policy</h1>
          <p className="mt-3 text-muted-foreground">Last updated: June 2026</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
          {[
            { icon: Shield, title: '100% Local Processing', desc: 'All recording, encoding, and editing happens in your browser.' },
            { icon: Server, title: 'No Server Uploads', desc: 'Your video data never leaves your device.' },
            { icon: Eye, title: 'No Tracking', desc: 'We do not track your recordings, usage patterns, or behavior.' },
            { icon: Lock, title: 'No Account Required', desc: 'Zero personal data collected because no account is needed.' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="bg-card border border-border rounded-xl p-4 flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-4 h-4 text-primary" />
              </div>
              <div>
                <p className="text-white font-medium text-sm">{title}</p>
                <p className="text-muted-foreground text-xs mt-0.5">{desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Overview</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot ("we", "our", or "the Service") is a browser-based screen recording tool. This privacy policy explains how RecordPilot handles data. The short version: we don't collect, transmit, store, or process your recordings or personal data. This is not a policy statement we've written for legal compliance and then ignored — it is an architectural truth. Our application has no server endpoints that accept video or audio data, and we have no database where such data could be stored.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Data We Do Not Collect</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">RecordPilot does not collect:</p>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {[
                'Screen recordings, video files, or audio recordings',
                'Webcam footage or camera images',
                'Microphone audio or voice data',
                'Your name, email address, or any personal identifiers',
                'Account credentials (there is no account system)',
                'IP addresses associated with recordings',
                'Device fingerprints linked to recording sessions',
                'Usage analytics tied to individual recordings',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. How Browser Recording Works</h2>
            <p className="text-muted-foreground leading-relaxed">
              When you use RecordPilot, your browser requests access to your screen, microphone, or webcam using standard browser APIs (getDisplayMedia, getUserMedia). The browser uses these streams to create a MediaRecorder instance, which encodes the video data to a WebM blob stored temporarily in your browser's memory. This blob is never transmitted over any network connection. When you click Download, the blob is written directly to your local file system via the browser's native file download mechanism.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Technical Architecture</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot is a static web application served over HTTPS. It has no application server, no database, no cloud storage, and no API endpoints that handle media data. The application code runs entirely in your browser. Any server infrastructure exists only to serve the static HTML, CSS, and JavaScript files of the application itself — equivalent to downloading a file.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Anonymous Usage Analytics</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may use privacy-respecting, cookie-free analytics (such as page view counts) to understand aggregate usage patterns and improve the service. These analytics do not include any recording content, cannot identify individual users, and do not use tracking cookies or cross-site tracking. No personally identifiable information is linked to analytics data.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Third-Party Services</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot may use the following minimal third-party services: a CDN (Content Delivery Network) to serve application files; Google Fonts for typography. Neither service receives your recording data. CDN and font services receive only standard HTTP requests for application assets — the same requests made by any website visitor.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. GDPR Compliance</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot is designed to be GDPR-compliant by default because we do not process personal data. There is no lawful basis to establish for personal data processing because personal data is not processed. EU residents have no data to access, correct, or delete because we hold no data about them.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. CCPA Compliance</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot does not sell personal information. We do not collect personal information as defined by the California Consumer Privacy Act. California residents have no data subject rights to exercise regarding RecordPilot because no personal information is collected.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Children's Privacy</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot does not knowingly collect personal information from children under 13 (or under 16 in the EU). Because we collect no personal information from any user, this requirement is satisfied by design.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Policy</h2>
            <p className="text-muted-foreground leading-relaxed">
              We may update this privacy policy to reflect changes in our practices or applicable law. Changes will be posted on this page with an updated date. Continued use of RecordPilot after changes constitutes acceptance of the revised policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about this privacy policy? Use the contact form on our Contact page. We aim to respond within 3 business days.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
