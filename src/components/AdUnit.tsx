// import { useEffect, useRef, useState } from 'react';

// /**
//  * AdUnit — reusable advertisement container for Google AdSense.
//  *
//  * ADSENSE INTEGRATION INSTRUCTIONS:
//  * 1. Replace the placeholder <div> inside .ad-slot-inner with your <ins> tag:
//  *    <ins class="adsbygoogle"
//  *         style="display:block"
//  *         data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
//  *         data-ad-slot="XXXXXXXXXX"
//  *         data-ad-format="auto"
//  *         data-full-width-responsive="true" />
//  * 2. Add the AdSense script to index.html <head>:
//  *    <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXXX" crossorigin="anonymous"></script>
//  * 3. After inserting the <ins> tag, call: (adsbygoogle = window.adsbygoogle || []).push({});
//  */

// export type AdSlot =
//   | 'leaderboard'   // 728×90 desktop / 320×50 mobile — top of page
//   | 'sidebar'       // 300×600 — sticky right sidebar (desktop only)
//   | 'rectangle'     // 300×250 — inline content / recording result
//   | 'responsive';   // fully fluid — SEO articles, FAQ transitions, footer

// interface AdUnitProps {
//   slot: AdSlot;
//   /** Additional class names for the outer wrapper */
//   className?: string;
//   /** Defer rendering until the element enters the viewport (default: false) */
//   lazy?: boolean;
//   /** Accessible label for screen readers */
//   label?: string;
// }

// /** Reserved pixel heights per slot — prevents Cumulative Layout Shift (CLS) */
// const SLOT_CONFIG: Record<AdSlot, { minH: string; mobileMinH?: string; maxW?: string }> = {
//   leaderboard: { minH: '90px',  mobileMinH: '50px', maxW: '728px' },
//   sidebar:     { minH: '600px',                      maxW: '300px' },
//   rectangle:   { minH: '250px',                      maxW: '336px' },
//   responsive:  { minH: '250px' },
// };

// export function AdUnit({ slot, className = '', lazy = false, label = 'Advertisement' }: AdUnitProps) {
//   const ref = useRef<HTMLDivElement>(null);
//   const [visible, setVisible] = useState(!lazy);

//   useEffect(() => {
//     if (!lazy || visible) return;
//     const el = ref.current;
//     if (!el || !('IntersectionObserver' in window)) {
//       setVisible(true);
//       return;
//     }
//     const observer = new IntersectionObserver(
//       ([entry]) => {
//         if (entry.isIntersecting) {
//           setVisible(true);
//           observer.disconnect();
//         }
//       },
//       { rootMargin: '200px' }
//     );
//     observer.observe(el);
//     return () => observer.disconnect();
//   }, [lazy, visible]);

//   const cfg = SLOT_CONFIG[slot];

//   return (
//     <div
//       ref={ref}
//       className={`ad-unit ad-unit--${slot} w-full ${className}`}
//       role="complementary"
//       aria-label={label}
//     >
//       {/* "Advertisement" disclosure label — required by most ad policies */}
//       <p className="text-[10px] text-muted-foreground/50 text-center uppercase tracking-widest mb-1 select-none">
//         Advertisement
//       </p>

//       {/* Reserved container — fixed min-height prevents CLS */}
//       <div
//         className="ad-slot-inner mx-auto bg-secondary/20 border border-border/30 rounded-lg overflow-hidden flex items-center justify-center"
//         style={{
//           minHeight: cfg.minH,
//           maxWidth: cfg.maxW ?? '100%',
//           width: '100%',
//         }}
//         data-ad-slot={slot}
//       >
//         {visible ? (
//           /*
//            * ── ADSENSE PLACEMENT ──────────────────────────────────────────
//            * Replace this entire comment block with your AdSense <ins> tag.
//            * Example:
//            *
//            *   <ins
//            *     className="adsbygoogle"
//            *     style={{ display: 'block', width: '100%', height: '100%' }}
//            *     data-ad-client="ca-pub-XXXXXXXXXXXXXXXXX"
//            *     data-ad-slot="XXXXXXXXXX"
//            *     data-ad-format={slot === 'responsive' ? 'auto' : undefined}
//            *     data-full-width-responsive={slot === 'responsive' ? 'true' : undefined}
//            *   />
//            *
//            * Then initialize in a useEffect:
//            *   (window.adsbygoogle = window.adsbygoogle || []).push({});
//            * ──────────────────────────────────────────────────────────────
//            *
//            * DEVELOPMENT PLACEHOLDER (remove when inserting real AdSense code):
//            */
//           <div className="flex flex-col items-center justify-center gap-1 p-4 w-full h-full text-center pointer-events-none select-none" aria-hidden="true">
//             <div className="w-8 h-8 rounded-md bg-border/40 flex items-center justify-center mb-1">
//               <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4 text-muted-foreground/30" stroke="currentColor" strokeWidth={1.5}>
//                 <rect x="3" y="3" width="18" height="18" rx="2" />
//                 <path d="M9 9h6M9 12h6M9 15h4" />
//               </svg>
//             </div>
//             <span className="text-[10px] text-muted-foreground/30 font-mono leading-tight">
//               {slot.toUpperCase()} AD<br />
//               {cfg.maxW ? `${cfg.maxW} × ${cfg.minH}` : `responsive × ${cfg.minH}`}
//             </span>
//           </div>
//         ) : (
//           /* Skeleton while lazy-loading — same reserved height, no layout shift */
//           <div className="w-full h-full" style={{ minHeight: cfg.minH }} aria-hidden="true" />
//         )}
//       </div>
//     </div>
//   );
// }

// /**
//  * LeaderboardAd — 728×90 desktop / 320×50 mobile banner, placed directly below the header.
//  * Responsive: shrinks to mobile banner size on small screens via CSS.
//  */
// export function LeaderboardAd() {
//   return (
//     <div
//       className="w-full border-b border-border/30 bg-background/60"
//       aria-label="Advertisement banner"
//       /* Reserved height prevents CLS even before the ad loads */
//       style={{ minHeight: 'clamp(50px, 8vw, 90px)' }}
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-center">
//         {/*
//          * ── LEADERBOARD AD PLACEMENT ──────────────────────────────────────
//          * Desktop:  728×90 leaderboard
//          * Mobile:   320×50 banner
//          *
//          * Replace with your AdSense <ins> tag targeting this slot.
//          * Ensure data-full-width-responsive="true" for automatic size switching.
//          * ─────────────────────────────────────────────────────────────────
//          */}
//         <AdUnit slot="leaderboard" />
//       </div>
//     </div>
//   );
// }

// /**
//  * SidebarAd — 300×600 sticky sidebar, desktop only (hidden on mobile via CSS).
//  * Place inside a sticky-positioned column next to the recorder dashboard.
//  */
// export function SidebarAd() {
//   return (
//     <aside
//       className="hidden xl:flex flex-col items-center w-[320px] flex-shrink-0"
//       aria-label="Sidebar advertisement"
//     >
//       {/*
//        * ── SIDEBAR AD PLACEMENT ──────────────────────────────────────────
//        * Preferred:  300×600 half-page
//        * Fallback:   300×250 medium rectangle
//        *
//        * Replace with your AdSense <ins> tag targeting this slot.
//        * ─────────────────────────────────────────────────────────────────
//        */}
//       <AdUnit slot="sidebar" lazy />
//     </aside>
//   );
// }

// /**
//  * RecordingResultAd — shown after the recording preview, before the trimmer.
//  * Responsive rectangle format.
//  */
// export function RecordingResultAd() {
//   return (
//     <div className="my-2" aria-label="Advertisement">
//       {/*
//        * ── RECORDING RESULT AD PLACEMENT ────────────────────────────────
//        * Position: after VideoPlayer, before VideoTrimmer.
//        * Format:   responsive rectangle (336×280 default).
//        * Never appears during an active recording session.
//        * ─────────────────────────────────────────────────────────────────
//        */}
//       <AdUnit slot="rectangle" lazy className="max-w-xl mx-auto" />
//     </div>
//   );
// }

// /**
//  * ContentAd — inserted naturally inside long-form SEO content after ~600–800 words.
//  * Fully responsive.
//  */
// export function ContentAd() {
//   return (
//     <div className="my-8" aria-label="Advertisement">
//       {/*
//        * ── SEO CONTENT AD PLACEMENT ─────────────────────────────────────
//        * Position: inline, after the 4th step/section of long-form content.
//        * Format:   responsive (fluid width, fixed min-height).
//        * ─────────────────────────────────────────────────────────────────
//        */}
//       <AdUnit slot="responsive" lazy />
//     </div>
//   );
// }

// /**
//  * FooterAd — placed directly above the site footer.
//  * Fully responsive.
//  */
// export function FooterAd() {
//   return (
//     <div
//       className="w-full border-t border-border/30 bg-background py-4"
//       aria-label="Advertisement"
//     >
//       <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
//         {/*
//          * ── FOOTER AD PLACEMENT ──────────────────────────────────────────
//          * Position: above the footer, full-width container.
//          * Format:   responsive (fluid).
//          * ─────────────────────────────────────────────────────────────────
//          */}
//         <AdUnit slot="responsive" lazy />
//       </div>
//     </div>
//   );
// }
import { useEffect, useRef, useState } from 'react';

export type AdSlot =
  | 'leaderboard'
  | 'sidebar'
  | 'rectangle'
  | 'responsive';

interface AdUnitProps {
  slot: AdSlot;
  className?: string;
  lazy?: boolean;
  label?: string;
}

const SLOT_CONFIG: Record<AdSlot, { minH: string; mobileMinH?: string; maxW?: string }> = {
  leaderboard: { minH: '90px',  mobileMinH: '50px', maxW: '728px' },
  sidebar:     { minH: '600px',                      maxW: '300px' },
  rectangle:   { minH: '280px',                      maxW: '336px' },
  responsive:  { minH: '280px' },
};

const ADSTERRA_CONFIG: Record<AdSlot, {
  key: string;
  width: number;
  height: number;
}> = {
  leaderboard: { key: '614db1d792a2f719b0634c19cece7f5a', width: 728, height: 90  },
  sidebar:     { key: 'YOUR_SIDEBAR_KEY',     width: 300, height: 600 },
  rectangle:   { key: 'YOUR_RECTANGLE_KEY',   width: 336, height: 280 },
  responsive:  { key: 'YOUR_RESPONSIVE_KEY',  width: 336, height: 280 },
};

// ── Adsterra Display Banner (iframe format) ───────────────────────────────────
function AdsterraBanner({ slot }: { slot: AdSlot }) {
  const cfg = ADSTERRA_CONFIG[slot];

  // Agar key placeholder hai toh kuch mat dikhao
  if (!cfg.key || cfg.key.startsWith('YOUR_')) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <span className="text-[10px] text-muted-foreground/30 font-mono">
          {slot.toUpperCase()} — KEY NOT SET
        </span>
      </div>
    );
  }

  return (
    <iframe
      src={`//www.highperformanceformat.com/${cfg.key}/invoke`}
      width={cfg.width}
      height={cfg.height}
      frameBorder="0"
      scrolling="no"
      style={{ maxWidth: '100%' }}
      title="Advertisement"
    />
  );
}

export function AdUnit({ slot, className = '', lazy = false, label = 'Advertisement' }: AdUnitProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(!lazy);

  useEffect(() => {
    if (!lazy || visible) return;
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) {
      setVisible(true);
      return;
    }
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [lazy, visible]);

  const cfg = SLOT_CONFIG[slot];

  return (
    <div
      ref={ref}
      className={`ad-unit ad-unit--${slot} w-full ${className}`}
      role="complementary"
      aria-label={label}
    >
      <p className="text-[10px] text-muted-foreground/50 text-center uppercase tracking-widest mb-1 select-none">
        Advertisement
      </p>

      <div
        className="ad-slot-inner mx-auto bg-secondary/20 border border-border/30 rounded-lg overflow-hidden flex items-center justify-center"
        style={{
          minHeight: cfg.minH,
          maxWidth: cfg.maxW ?? '100%',
          width: '100%',
        }}
        data-ad-slot={slot}
      >
        {visible ? (
          <AdsterraBanner slot={slot} />
        ) : (
          <div className="w-full h-full" style={{ minHeight: cfg.minH }} aria-hidden="true" />
        )}
      </div>
    </div>
  );
}

export function LeaderboardAd() {
  return (
    <div
      className="w-full border-b border-border/30 bg-background/60"
      aria-label="Advertisement banner"
      style={{ minHeight: 'clamp(50px, 8vw, 90px)' }}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-1.5 flex items-center justify-center">
        <AdUnit slot="leaderboard" />
      </div>
    </div>
  );
}

export function SidebarAd() {
  return (
    <aside
      className="hidden xl:flex flex-col items-center w-[320px] flex-shrink-0"
      aria-label="Sidebar advertisement"
    >
      <AdUnit slot="sidebar" lazy />
    </aside>
  );
}

export function RecordingResultAd() {
  return (
    <div className="my-2" aria-label="Advertisement">
      <AdUnit slot="rectangle" lazy className="max-w-xl mx-auto" />
    </div>
  );
}

export function ContentAd() {
  return (
    <div className="my-8" aria-label="Advertisement">
      <AdUnit slot="responsive" lazy />
    </div>
  );
}

export function FooterAd() {
  return (
    <div
      className="w-full border-t border-border/30 bg-background py-4"
      aria-label="Advertisement"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <AdUnit slot="responsive" lazy />
      </div>
    </div>
  );
}