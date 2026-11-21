# Moon Tune — Architecture & Implementation Plan (Version 1)
**Zero-Backend, Client-Side Hardware-Accelerated Video-to-Audio Converter**
**Design Philosophy:** Mobile-First Professional UI/UX Architecture
**Target Hosting:** Vercel (100% Static & Client-Side Edge Distribution)

---

## 1. Executive Summary & Product Vision

**Moon Tune** is a high-performance, minimalist audio utility designed to extract, convert, trim, and enhance audio from video files directly inside the browser.

### 1.1 The Problem with Traditional Web Converters
Traditional video converters suffer from severe usability friction:
1. **Bandwidth Waste & High Latency:** Users must upload a 200MB+ video file over mobile data to a remote cloud server, wait for server conversion, and then download the 10MB audio file back.
2. **Server Costs & Scaling Bottlenecks:** Hosting video processing backends (like `ffmpeg` on Render/AWS) requires expensive CPU/RAM instances. Free cloud tiers (e.g. Render 512MB RAM) easily crash under video workloads and shut down after 15 minutes of inactivity.
3. **Privacy Vulnerability:** Users' personal videos (screen recordings, voice memos, private clips) are transmitted to external servers.

### 1.2 The Moon Tune Solution (v1 Paradigm)
Moon Tune v1 eliminates the backend entirely:
* **100% Client-Side Processing:** All demuxing, decoding, trimming, and re-encoding occur on the user's phone or computer.
* **Zero Hosting Cost:** Deployed as a static React application on **Vercel** with worldwide CDN distribution, zero cold starts, and zero hosting fees.
* **Instantaneous Processing:** Utilizes modern **WebCodecs API** and **WebAssembly (WASM)** to tap directly into the client's GPU and media hardware acceleration.
* **Complete Privacy:** Files never leave the user's local device memory.
* **Mobile-First Experience:** Crafted to feel like an Apple App Store or Google Play Store native utility app rather than a clunky website.

---

## 2. Technical Strategy: Client-Side Audio Engine

```
[ Local Video (MP4 / MOV / WebM) ]
               │
               ▼
   [ Fast-Path Analysis ]
        │             │
        │ Is AAC/M4A  │ Needs Transcode
        │ (90% cases) │ (WAV / MP3 / Custom Bitrate)
        ▼             ▼
┌──────────────┐   ┌──────────────────────────────┐
│  Direct      │   │  WebCodecs / WASM Engine     │
│  Demuxing    │   │  (Web Worker multi-threaded) │
│  (< 0.5s)    │   │  - Hardware GPU Decoding     │
└───────┬──────┘   │  - Trimming & Sample Rate    │
        │          └──────────────┬───────────────┘
        ▼                         ▼
   [ Audio Buffer & Waveform Generation ]
        │
        ├─► [ Visual Waveform & Trimmer UI ]
        ├─► [ Frame Grabber -> ID3 Album Art Embed ]
        │
        ▼
   [ Instant In-Browser Preview & 1-Tap Download ]
```

### 2.1 Fast-Path Demuxing (The "Zero-Second" Extract)
* Most mobile recordings (iOS `.mov`, Android `.mp4`) and internet clips encode audio as **AAC**.
* When the user requests `.m4a` / `.aac` output, Moon Tune skips re-encoding altogether: it strips the video container packets and writes the audio track directly.
* **Performance:** Extracts audio from a 500MB video in **under 0.5 seconds** with **100% lossless fidelity** and near-zero battery consumption.

### 2.2 WebCodecs + WebAssembly Transcoding (MP3 / WAV)
* For MP3 (320k, 192k, 128k) and uncompressed WAV:
  * Uses **WebCodecs API** (`AudioDecoder`) for hardware-accelerated stream decoding.
  * Offloads encoding to a dedicated **Web Worker** using lightweight WebAssembly (`lamejs` / `@ffmpeg/ffmpeg`) to prevent any UI stutter or frame drops.

### 2.3 Automatic Video Frame to Album Art
* An offscreen `<video>` element captures a crisp representative frame (at 10% duration or user-selected point).
* Automatically scaled to a 500x500 JPEG/PNG and injected as the ID3 APIC frame (cover art) inside the output MP3/M4A.

---

## 3. Mobile-First Professional UI/UX Specification

Moon Tune is designed from the ground up for handheld mobile interaction. It adheres to **Apple Human Interface Guidelines (HIG)** and **Material 3** principles to deliver a polished, commercial-grade experience.

```
┌─────────────────────────────────┐
│  [ MoonTune ]          (●) PRO  │  ◄ Header: Minimal, Dark Glass
│                                 │
│  ┌───────────────────────────┐  │
│  │     [ Video Preview ]     │  │  ◄ Responsive Media Card / Video Frame
│  │   "screen-rec-09.mp4"     │  │
│  └───────────────────────────┘  │
│                                 │
│  ┌─ WAVEFORM & TRIMMER ──────┐  │
│  │  |||||||||||||||||||||||  │  │  ◄ Touch Waveform with 48px Scrubbers
│  │  [00:15]          [01:45] │  │
│  └───────────────────────────┘  │
│                                 │
│  Format: [ M4A ⚡ ] [ MP3 ] [WAV]│  ◄ Pill Selector (Thumb-Zone Friendly)
│                                 │
│  ┌───────────────────────────┐  │
│  │ ⚡ EXTRACT AUDIO (0.5s)   │  │  ◄ Primary Floating Action CTA
│  └───────────────────────────┘  │
│                                 │
│  [ ▶  0:24 / 1:30   ⬇ SAVE ]   │  ◄ Bottom Persistent Mini-Player Bar
└─────────────────────────────────┘
```

### 3.1 The "Thumb Zone" Ergonomics
* **Bottom 50% Rule:** All high-frequency touch actions (Upload CTA, Format Picker, Convert Button, Play/Pause, and Save) reside strictly in the natural thumb sweep area.
* **No Top-Corner Reach Fatigue:** Users never need to stretch their fingers to the top corners of the screen to confirm an action.

### 3.2 Native-Style Bottom Sheet Drawers
* Instead of jarring desktop modal dialogs, secondary workflows slide up smoothly from the bottom:
  * **Format & Quality Drawer:** Swipe-up sheet with radio cards (`M4A - Instant`, `MP3 320kbps - Studio`, `MP3 128kbps - Voice`).
  * **ID3 Tag & Cover Art Drawer:** Edit Track Name, Artist, and toggle embedded album art.

### 3.3 Touch-Optimized Waveform & Trimmer
* **Minimum 48x48px Touch Targets:** Handles on the start/end cut sliders use generous bounding boxes so users never miss a handle.
* **Haptic & Visual Feedback:** Dynamic millisecond timestamps update in real-time as thumbs drag the scrubbers.

### 3.4 Floating Persistent Bottom Action & Player Bar
* **Instant Audio Preview:** Once audio is extracted, a sleek, frosted-glass player bar docks to the bottom edge.
* **1-Tap Save:** Direct download hook triggers the native mobile save dialog (`iOS Files app` / `Android Downloads folder`).

### 3.5 Progressive Web App (PWA) Capabilities
* **Standalone Display Mode:** When added to the iPhone or Android Home Screen, the browser address bar and navigation controls disappear completely.
* **Custom App Icon & Splash:** Custom dark moon icon with seamless dark-mode splash screen.

### 3.6 Responsive Desktop Shell (Adaptive Canvas)
* **Mobile (< 640px):** 100% full-bleed edge-to-edge native mobile viewport.
* **Desktop / Tablet (>= 640px):** The interface elegantly centers inside a sleek, dark-slate **floating app card** (`max-w-md` / 480px width) with subtle glassmorphic borders and ambient backdrop glow, accompanied by desktop keyboard shortcuts (Spacebar for play/pause).

---

## 4. Scope & Roadmap: v1 (MVP) vs v2 (Future Expansion)

### Version 1: "Moon Tune Lite" (Immediate Scope)
- [x] **Zero-Backend Architecture:** 100% client-side, hosted on Vercel.
- [x] **Mobile-First Professional UI:** Thumb-zone layout, bottom sheet drawers, touch trimmer.
- [x] **File Sources:** Phone camera roll / gallery, local file picker, and desktop drag-and-drop.
- [x] **Supported Input Containers:** `.mp4`, `.mov`, `.webm`, `.mkv`, `.avi`.
- [x] **Output Formats:**
  - `M4A (AAC)`: Instant lossless extraction (Fast-path $< 0.5$s).
  - `MP3`: 320 kbps (High Quality), 192 kbps (Standard), 128 kbps (Voice/Podcast).
  - `WAV`: Uncompressed studio audio.
- [x] **Interactive Trimmer:** Visual start & end scrubbers to cut specific segments.
- [x] **Player Preview:** Integrated waveform player to verify before saving.
- [x] **Album Art & Metadata:** Auto-extracted video frame cover + customizable Title/Artist tags.
- [x] **PWA Configuration:** Web app manifest with standalone display.

### Version 2: "Cloud Bridge & URL Downloader" (Post-Launch Scope)
- [ ] **External URL Support:** Paste YouTube, TikTok, or Twitter/X links.
- [ ] **Decoupled URL Extractor:** Integration with a public Cobalt API bridge or Vercel Edge proxy to circumvent CORS restrictions without heavy server hosting.
- [ ] **Batch Conversion:** Process multiple video files in parallel.

---

## 5. Frontend Architecture & Feature-Driven Folder Structure

Following Moon Pulse's proven modular and feature-driven conventions:

```text
MoonTune/
├── public/
│   ├── favicon.svg
│   ├── manifest.json            # PWA support for mobile home-screen install
│   └── icons/                   # PWA icons (192x192, 512x512)
│
├── src/
│   ├── assets/                  # Brand logos, default audio cover art, icons
│   │
│   ├── features/                # Domain-specific modules
│   │   ├── uploader/            # Video selection & mobile file picker
│   │   │   ├── components/      # VideoPickerButton.jsx, FileInfoBadge.jsx
│   │   │   └── hooks/           # useFilePicker.js
│   │   │
│   │   ├── engine/              # Core client-side conversion logic
│   │   │   ├── services/        # demuxer.js, audioDecoder.js, mp3Encoder.js
│   │   │   ├── workers/         # converter.worker.js (background processing)
│   │   │   └── hooks/           # useAudioConverter.js (progress, state, cancel)
│   │   │
│   │   ├── trimmer/             # Touch-friendly time cutter & region selector
│   │   │   ├── components/      # RangeSlider.jsx, TimeInput.jsx
│   │   │   └── utils/           # timeFormatters.js
│   │   │
│   │   ├── preview/             # Audio playback & visual feedback
│   │   │   ├── components/      # AudioPlayerBar.jsx, WaveformView.jsx
│   │   │   └── hooks/           # useWaveform.js
│   │   │
│   │   └── metadata/            # ID3 Tag editor & frame grabber
│   │       ├── components/      # TagEditorDrawer.jsx, CoverArtPreview.jsx
│   │       └── services/        # frameGrabber.js, id3Tagger.js
│   │
│   ├── shared/                  # Reusable components, hooks & design tokens
│   │   ├── components/
│   │   │   ├── layout/          # MobileAppShell.jsx, Header.jsx
│   │   │   └── ui/              # Button.jsx, BottomSheet.jsx, ProgressBar.jsx, PillSelect.jsx
│   │   ├── hooks/               # useMediaQuery.js, useHaptics.js
│   │   └── utils/               # byteFormatter.js, mimeTypes.js
│   │
│   ├── App.jsx                  # Main application flow
│   ├── index.css                # Mobile viewport reset, touch rules, dark theme
│   └── main.jsx                 # Entry point
│
├── .gitignore
├── index.html
├── package.json
├── vercel.json                  # Cross-Origin headers for WASM / SharedArrayBuffer
└── vite.config.js
```

---

## 6. Key Technical Specifications

### 6.1 Vercel Configuration (`vercel.json`)
WebAssembly multi-threading requires `SharedArrayBuffer`, which enforces strict browser isolation headers:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "Cross-Origin-Embedder-Policy", "value": "require-corp" }
      ]
    }
  ]
}
```

### 6.2 Mobile Viewport & PWA (`index.html` & `manifest.json`)
```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, viewport-fit=cover" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
```

### 6.3 Dependency Matrix
* **Core:** React 19, Vite 6/7
* **Icons:** `lucide-react`
* **Media & Audio:**
  * `mediabunny` / `@ffmpeg/ffmpeg` (for client-side demuxing & WASM transcode)
  * `wavesurfer.js` (for interactive, touch-friendly waveform rendering)
  * `browser-id3-writer` (for embedding album art and metadata directly in browser)
  * `lamejs` (for client-side MP3 chunk encoding)

---

## 7. Implementation Milestones

| Step | Milestone | Deliverable |
| :---: | :--- | :--- |
| **1** | **Project Scaffold & Mobile Shell** | Initialize Vite + React 19, setup `MobileAppShell`, Vercel headers, and dark-theme design tokens. |
| **2** | **Mobile Video Uploader & Fast-Path Demuxer** | Add tap-to-pick from camera roll and instant ($< 0.5$s) M4A audio extraction. |
| **3** | **Web Worker MP3/WAV Transcoder** | Background worker encoding to high-quality MP3 (320k) and WAV with progress indicator. |
| **4** | **Touch Trimmer & Waveform Preview** | 48px touch-target range slider with live audio preview before downloading. |
| **5** | **Auto Frame Album Art & ID3 Tagging** | Frame capture from video; embed cover art into exported audio. |
| **6** | **PWA Manifest & Vercel Deployment** | Configure "Add to Home Screen" standalone PWA and deploy directly to Vercel. |

---

## 8. Review & Next Action

> **Status:** Plan updated with **Mobile-First Professional UI/UX Architecture** at `MoonTune/plan/plan.md`.
> **Next Step:** Upon approval, initiate **Step 1 (Project Scaffolding & Mobile Shell Setup)** in `MoonTune`.
