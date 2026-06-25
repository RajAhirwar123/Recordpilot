# Elite Screen Recorder (RecordPilot)

Free online screen recorder — React + Vite + TailwindCSS v4 + shadcn/ui

## 🚀 Quick Start

```bash
npm install
npm run dev
```

App opens at **http://localhost:5173**

## 📦 Build

```bash
npm run build     # production build → /dist
npm run preview   # preview production build
```

## 💰 AdSense Setup

1. **index.html** — Uncomment the `<script>` tag and replace `ca-pub-XXXXXXXXXXXXXXXXX` with your Publisher ID.

2. **src/components/AdUnit.tsx** — Each ad function has a clear `── PLACEMENT ──` comment block.  
   Replace the comment block with your `<ins class="adsbygoogle" ...>` tag.

3. **Ad slots already placed:**
   - `LeaderboardAd` → below header (728×90 desktop / 320×50 mobile)
   - `SidebarAd` → sticky sidebar on ScreenRecorder page (300×600, desktop only)
   - `RecordingResultAd` → after recording preview (300×250)
   - `ContentAd` → inline in long-form pages (responsive)
   - `FooterAd` → above footer (responsive)

## 🗂️ Project Structure

```
src/
├── components/
│   ├── AdUnit.tsx        ← All ad placements (LeaderboardAd, SidebarAd, etc.)
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Layout.tsx        ← Wraps every page (includes LeaderboardAd + FooterAd)
│   └── ui/               ← shadcn/ui components
├── pages/
│   ├── Home.tsx
│   ├── ScreenRecorder.tsx
│   ├── AudioRecorder.tsx
│   ├── VideoEditor.tsx
│   └── ...
├── hooks/
│   ├── useRecording.ts
│   ├── useTimer.ts
│   └── useAudioVisualizer.ts
└── types/
    └── recording.ts
```

## 🛠️ Tech Stack
- React 18 · Vite 6 · TypeScript
- TailwindCSS v4 · shadcn/ui · Radix UI
- Wouter (routing) · TanStack Query
- Framer Motion · Lucide Icons
