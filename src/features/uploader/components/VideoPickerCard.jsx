import React, { useRef } from 'react';
import { UploadCloud, Sparkles, Zap, Scissors, ShieldCheck, Film } from 'lucide-react';
import { useHaptic } from '../../../shared/hooks/useHaptic';

export function VideoPickerCard({ onFileSelect, isLoading }) {
  const fileInputRef = useRef(null);
  const { trigger } = useHaptic();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      trigger('medium');
      onFileSelect(file);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith('video/')) {
      trigger('medium');
      onFileSelect(file);
    }
  };

  return (
    <div className="flex-1 flex flex-col justify-between p-5 space-y-5 animate-fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Hero Description */}
      <div className="text-center pt-2 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-[11px] font-semibold tracking-wide">
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-soundwave-1" />
            <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-soundwave-2" />
            <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-soundwave-3" />
            <span className="w-0.5 h-2.5 bg-cyan-400 rounded-full animate-soundwave-4" />
          </div>
          <span>FAST ON-DEVICE CONVERTER</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight leading-tight">
          Turn Video Into <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">Studio Audio</span>
        </h2>
        <p className="text-xs text-slate-400 max-w-[320px] mx-auto leading-relaxed">
          Extract 320kbps MP3, Lossless WAV or M4A directly in your browser. Fast, private, zero server upload.
        </p>
      </div>

      {/* Center Interactive Upload Card */}
      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="group relative cursor-pointer rounded-3xl p-7 flex flex-col items-center justify-center text-center transition-all bg-gradient-to-b from-slate-900/90 via-slate-900/60 to-slate-950/90 border border-slate-700/80 hover:border-cyan-400/60 active:scale-[0.98] shadow-xl shadow-black/40 overflow-hidden"
      >
        {/* Ambient Glow Aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-indigo-500/10 opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl group-hover:bg-cyan-500/20 transition-all" />

        {/* Pulsing Concentric Sound Icon */}
        <div className="relative mb-4">
          <div className="absolute -inset-2 rounded-3xl bg-cyan-500/20 blur-md group-hover:bg-cyan-400/30 transition-all" />
          <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-cyan-400 transition-all">
            <UploadCloud className="w-8 h-8 text-cyan-300" />
          </div>
        </div>

        {/* Call to action typography */}
        <h3 className="text-base font-bold text-white mb-1 group-hover:text-cyan-300 transition-colors">
          Tap to Select Video
        </h3>
        <p className="text-xs text-slate-400 mb-5 leading-normal">
          From Camera Roll, Gallery, or Drag & Drop here
        </p>

        {/* Format Badges */}
        <div className="flex flex-wrap items-center justify-center gap-1.5">
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/70">
            MP4
          </span>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/70">
            MOV
          </span>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/70">
            WEBM
          </span>
          <span className="text-[10px] font-mono font-semibold px-2.5 py-1 rounded-lg bg-slate-800/90 text-slate-300 border border-slate-700/70">
            MKV
          </span>
        </div>
      </div>

      {/* Feature Highlights Grid (Fills space with premium context) */}
      <div className="grid grid-cols-3 gap-2 pt-1 pb-2">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 text-center flex flex-col items-center">
          <div className="w-7 h-7 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center mb-1.5">
            <Zap className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-200">0.5s Fast</span>
          <span className="text-[9px] text-slate-400">Direct Demux</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 text-center flex flex-col items-center">
          <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center mb-1.5">
            <Scissors className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-200">Trimmer</span>
          <span className="text-[9px] text-slate-400">Cut Audio Clip</span>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-2.5 text-center flex flex-col items-center">
          <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center mb-1.5">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <span className="text-[11px] font-bold text-slate-200">100% Private</span>
          <span className="text-[9px] text-slate-400">Never Uploaded</span>
        </div>
      </div>
    </div>
  );
}
