# 🌙 MoonTune — Mobile Video-to-Audio Converter
**A zero-backend, client-side, hardware-accelerated video-to-audio converter with interactive waveform trimming, ID3 tagging, and album art embedding.**

---

## ⚡ Features

- **📱 Mobile-First Native Experience:** Designed with thumb-zone ergonomics, bottom sheet drawers, touch-friendly 48px handles, and PWA (Add to Home Screen) support.
- **🚀 100% Client-Side Hardware Acceleration:** Runs entirely in the browser using the **Web Audio API**, **WebCodecs**, and multi-threaded WebAssembly. No files ever leave your device!
- **⚡ Instant Fast-Path Extraction:** Extracts audio directly from MP4 / MOV videos in $< 0.5$ seconds with zero quality loss.
- **🎛️ Interactive Touch Trimmer:** Visual start and end handles to cut specific sections or chorus clips before saving.
- **🎨 Auto Video Frame to Album Art:** Automatically grabs a high-resolution video frame and embeds it as ID3 cover art into MP3 files for Apple Music and Spotify.
- **🎼 Multiple Formats & Bitrates:**
  - `MP3`: 320 kbps (Studio HQ), 192 kbps (Standard)
  - `M4A`: Fast AAC extraction
  - `WAV`: Uncompressed 16-bit PCM lossless
- **💰 100% Free Hosting on Vercel:** Zero server dependencies, zero database, zero cold starts, zero hosting costs!

---

## 🛠️ Technology Stack

- **Framework:** React 19 + Vite 6
- **Styling:** Tailwind CSS v4 (Mobile-first, dark space theme)
- **Audio & Media:** Web Audio API, `lamejs` MP3 encoder, `browser-id3-writer`
- **Icons:** `lucide-react`
- **Hosting:** Vercel (Edge static distribution)

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```

### 3. Build for Production (Vercel)
```bash
npm run build
```

---

## 📦 Deploying to Vercel

Because MoonTune is a 100% static client-side application:
1. Push this repository to GitHub / GitLab.
2. Import the project into [Vercel](https://vercel.com).
3. Framework Preset: **Vite**.
4. Click **Deploy**. Done!
