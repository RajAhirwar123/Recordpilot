import { Layout } from '@/components/Layout';

export default function Terms() {
  return (
    <Layout>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-10">
          <h1 className="text-4xl font-bold text-white">Terms of Service</h1>
          <p className="mt-3 text-muted-foreground">Last updated: June 2026</p>
        </div>

        <div className="prose prose-invert prose-sm max-w-none space-y-8">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">1. Acceptance of Terms</h2>
            <p className="text-muted-foreground leading-relaxed">
              By accessing and using ScreenCraft ("the Service"), you accept and agree to be bound by these Terms of Service. If you do not agree to these terms, please do not use the Service. ScreenCraft reserves the right to modify these terms at any time, with changes effective upon posting to this page.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">2. Description of Service</h2>
            <p className="text-muted-foreground leading-relaxed">
              ScreenCraft is a browser-based screen recording application that enables users to record their screen, webcam, and audio using browser-native APIs. The Service processes all data locally within the user's browser. ScreenCraft does not store, transmit, or process user recordings on any server infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">3. Acceptable Use</h2>
            <p className="text-muted-foreground leading-relaxed mb-3">You agree to use ScreenCraft only for lawful purposes and in accordance with these Terms. You agree NOT to use ScreenCraft to:</p>
            <ul className="space-y-2 text-muted-foreground text-sm">
              {[
                'Record any content without the knowledge and consent of all parties being recorded, where required by applicable law',
                'Create recordings that infringe on the intellectual property rights of others',
                'Record, produce, or distribute illegal, defamatory, obscene, or harmful content',
                'Record the private activities of individuals without their consent',
                'Create recordings intended to harass, threaten, or harm others',
                'Circumvent any security features of the Service',
                'Attempt to access our systems in unauthorized ways',
              ].map(item => (
                <li key={item} className="flex items-start gap-2">
                  <span className="text-primary mt-0.5">•</span>
                  {item}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">4. Recording Consent and Legal Compliance</h2>
            <p className="text-muted-foreground leading-relaxed">
              You are solely responsible for ensuring you have obtained all necessary consents and comply with all applicable laws before recording any person, screen, audio, or content using ScreenCraft. Recording laws vary significantly by jurisdiction. In many jurisdictions, recording telephone calls or conversations without consent is illegal. ScreenCraft assumes no liability for illegal recordings made using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">5. Intellectual Property</h2>
            <p className="text-muted-foreground leading-relaxed">
              You retain full ownership of all content you record using ScreenCraft. ScreenCraft makes no claim over recordings you create. The ScreenCraft application itself, including its code, design, trademarks, and content, is owned by ScreenCraft and protected by intellectual property law. You may not reproduce, distribute, or create derivative works from the ScreenCraft application without written permission.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">6. Disclaimer of Warranties</h2>
            <p className="text-muted-foreground leading-relaxed">
              ScreenCraft is provided "as is" and "as available" without warranties of any kind, either express or implied. We do not warrant that the Service will be uninterrupted, error-free, or free of viruses. Browser API support and recording quality depend on your browser, operating system, and hardware, which are outside our control. We make no warranty regarding recording quality, completeness, or compatibility with any particular system or use case.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">7. Limitation of Liability</h2>
            <p className="text-muted-foreground leading-relaxed">
              To the maximum extent permitted by applicable law, ScreenCraft shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of, or inability to use, the Service. This includes but is not limited to loss of recordings, loss of data, or damages arising from recordings made using the Service. Our total liability for any claim related to the Service is limited to the greater of $0 or the amount you paid to use the Service (which is $0, as the Service is free).
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">8. Indemnification</h2>
            <p className="text-muted-foreground leading-relaxed">
              You agree to indemnify and hold harmless ScreenCraft and its operators from any claims, damages, losses, and expenses (including legal fees) arising from your use of the Service, your violation of these Terms, your violation of any third-party rights, or any content you record using the Service.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">9. Governing Law</h2>
            <p className="text-muted-foreground leading-relaxed">
              These Terms are governed by and construed in accordance with applicable laws. Any dispute arising from these Terms or your use of the Service shall be resolved through binding arbitration or the courts of competent jurisdiction.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">10. Contact</h2>
            <p className="text-muted-foreground leading-relaxed">
              Questions about these Terms of Service? Contact us through the Contact page. We will respond within 5 business days.
            </p>
          </section>
        </div>
      </div>
    </Layout>
  );
}
