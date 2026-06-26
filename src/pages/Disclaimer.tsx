import { AlertTriangle } from 'lucide-react';
import { Layout } from '@/components/Layout';
import SEO from '@/components/SEO';

export default function Disclaimer() {
  return (
    <Layout>
      <SEO
        title="Disclaimer | RecordPilot"
        description="RecordPilot disclaimer."
        canonical="/disclaimer"
        />
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex items-start gap-4 mb-10">
          <div className="w-12 h-12 rounded-full bg-warning/10 border border-warning/20 flex items-center justify-center flex-shrink-0 mt-1">
            <AlertTriangle className="w-5 h-5 text-warning" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white">Disclaimer</h1>
            <p className="mt-2 text-muted-foreground">Last updated: June 2026</p>
          </div>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. General Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              The information and services provided by RecordPilot ("the Service") are offered on an "as is" and "as available" basis. RecordPilot makes no representations or warranties of any kind, express or implied, regarding the operation of the Service, the accuracy of any information provided through the Service, or the results that may be obtained from the use of the Service. Your use of the Service is entirely at your own risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Recording Quality & Compatibility</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">
              RecordPilot relies on browser-native APIs including <code className="text-primary text-xs bg-primary/10 px-1 py-0.5 rounded">getDisplayMedia</code>, <code className="text-primary text-xs bg-primary/10 px-1 py-0.5 rounded">getUserMedia</code>, and <code className="text-primary text-xs bg-primary/10 px-1 py-0.5 rounded">MediaRecorder</code>. The availability, behavior, and quality of these APIs vary by browser, operating system, hardware, and browser version. RecordPilot does not guarantee:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {[
                'Consistent video or audio quality across all devices and browsers',
                'Availability of all recording modes on all platforms (e.g., system audio capture is not available in all browsers)',
                'Specific output resolution, frame rate, or bitrate',
                'Successful recording on older or unsupported browser versions',
                'Uninterrupted recording sessions on low-memory devices',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-warning mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. User Responsibility for Recordings</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are solely and entirely responsible for all content you record using RecordPilot. This includes ensuring you have obtained the necessary legal permissions and consents from all parties whose likeness, voice, screen content, or intellectual property appears in your recordings. RecordPilot accepts no liability for recordings that:
            </p>
            <ul className="space-y-2 text-muted-foreground text-sm mt-3">
              {[
                'Are made without the knowledge or consent of all recorded parties',
                'Infringe on copyrights, trademarks, or other intellectual property rights',
                'Capture private or confidential information belonging to third parties',
                'Violate wiretapping, eavesdropping, or privacy laws in your jurisdiction',
                'Are used for illegal, harmful, defamatory, or harassing purposes',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-warning mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. No Professional Advice</h2>
            <p className="text-muted-foreground leading-relaxed">
              Nothing on RecordPilot constitutes legal, medical, financial, or professional advice of any kind. If you are uncertain about the legality of recording specific content or people in your jurisdiction, you should consult a qualified legal professional before using RecordPilot for that purpose.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Third-Party Content</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot may contain links to third-party websites or resources. These links are provided for convenience only. RecordPilot does not endorse, control, or take responsibility for the content, products, or services offered by any third-party site. Accessing third-party links is done at your own discretion and risk.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Data Loss Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              All recordings are stored temporarily in your browser's memory during the recording session. RecordPilot does not back up or cloud-store any recordings. Recordings will be permanently lost if you close the browser tab, refresh the page, or navigate away before downloading. RecordPilot accepts no liability for recordings lost due to browser crashes, power failures, accidental tab closure, or any other interruption to the recording session.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Browser & Platform Limitations</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot is a web-based application dependent on modern browser capabilities. Features that work in one browser may not work in another. RecordPilot does not control browser updates, and a browser update may affect the functionality of RecordPilot without prior notice. We recommend using the latest version of Google Chrome or Microsoft Edge for the best experience.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Service Availability</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot makes no guarantee of continuous, uninterrupted service availability. The Service may be temporarily unavailable due to maintenance, technical issues, infrastructure outages, or other factors outside our control. We are not liable for any loss or inconvenience caused by service downtime or unavailability.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the fullest extent permitted by applicable law, RecordPilot and its operators shall not be liable for any direct, indirect, incidental, special, consequential, punitive, or exemplary damages arising out of or in any way connected with your use of the Service or with the inability to use the Service, even if RecordPilot has been advised of the possibility of such damages.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Changes to This Disclaimer</h2>
            <p className="text-muted-foreground leading-relaxed">
              RecordPilot reserves the right to modify this disclaimer at any time without prior notice. Changes take effect immediately upon posting to this page. By continuing to use RecordPilot after changes are posted, you accept the updated disclaimer.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">11. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              If you have questions about this disclaimer, please contact us via the{' '}
              <a href="/contact" className="text-primary hover:underline">Contact page</a>.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
