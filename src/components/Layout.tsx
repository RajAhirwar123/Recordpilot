import { TrustBar } from './TrustBar';
import { Header } from './Header';
import { Footer } from './Footer';
import { LeaderboardAd, FooterAd } from './AdUnit';

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <TrustBar />
      <Header />

      {/*
       * TOP LEADERBOARD AD
       * Placement: directly below the header, above all page content.
       * Desktop: 728×90 | Mobile: 320×50
       * Reserved height via clamp() prevents Cumulative Layout Shift (CLS).
       */}
      <LeaderboardAd />

      <main className="flex-1">
        {children}
      </main>

      {/*
       * FOOTER AD
       * Placement: above the footer, full-width responsive unit.
       * Lazy-loaded — only renders when scrolled into viewport.
       */}
      <FooterAd />

      <Footer />
    </div>
  );
}
