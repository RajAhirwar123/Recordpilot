import { Link } from 'wouter';
import { Circle } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border bg-card mt-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary">
                <Circle className="w-3 h-3 fill-white text-white" />
              </div>
              <span className="text-lg font-bold text-white">RecordPilot</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Free, private browser-based screen recording. No uploads, no accounts, no limits.
            </p>
            <p className="text-xs text-muted-foreground mt-3 italic">
              All processing happens in your browser. We never see your recordings.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Tools</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Screen Recorder', href: '/screen-recorder' },
                { label: 'Audio Recorder', href: '/audio-recorder' },
                { label: 'Video Editor', href: '/video-editor' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Resources</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'How It Works', href: '/how-it-works' },
                { label: 'Features', href: '/features' },
                { label: 'FAQ', href: '/faq' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Legal</h3>
            <ul className="space-y-2.5">
              {[
                { label: 'Privacy Policy', href: '/privacy' },
                { label: 'Terms of Service', href: '/terms' },
                { label: 'Disclaimer', href: '/disclaimer' },
                { label: 'Contact Us', href: '/contact' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-10 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} RecordPilot. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            100% browser-based · No server uploads · GDPR & CCPA friendly
          </p>
        </div>
      </div>
    </footer>
  );
}
