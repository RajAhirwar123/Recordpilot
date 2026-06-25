import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Circle, Menu, X, Video } from 'lucide-react';
import { Button } from '@/components/ui/button';

const navLinks = [
  { label: 'Screen Recorder', href: '/screen-recorder' },
  { label: 'Audio Recorder', href: '/audio-recorder' },
  { label: 'Video Editor', href: '/video-editor' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'Features', href: '/features' },
  { label: 'Privacy', href: '/privacy' },
  { label: 'Contact', href: '/contact' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [location] = useLocation();

  return (
    <header className="sticky top-8 z-40 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative flex items-center justify-center w-8 h-8 rounded-full bg-primary">
              <Circle className="w-3 h-3 fill-white text-white" />
            </div>
            <span className="text-lg font-bold text-white tracking-tight">RecordPilot</span>
          </Link>

          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location === link.href
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/screen-recorder">
              <Button size="sm" className="hidden sm:flex items-center gap-2 bg-primary hover:bg-primary/90 text-white" data-testid="button-start-recording-nav">
                <Video className="w-4 h-4" />
                Start Recording
              </Button>
            </Link>
            <button
              className="lg:hidden p-2 rounded-md text-muted-foreground hover:text-foreground"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle navigation"
              data-testid="button-mobile-menu"
            >
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      {mobileOpen && (
        <div className="lg:hidden border-t border-border bg-card">
          <nav className="flex flex-col px-4 py-3 gap-1">
            {navLinks.map(link => (
              <Link
                key={link.href}
                href={link.href}
                className={`px-3 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  location === link.href
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                }`}
                onClick={() => setMobileOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <Link href="/screen-recorder" onClick={() => setMobileOpen(false)}>
              <Button className="w-full mt-2 bg-primary hover:bg-primary/90 text-white" data-testid="button-start-recording-mobile">
                <Video className="w-4 h-4 mr-2" />
                Start Recording
              </Button>
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
