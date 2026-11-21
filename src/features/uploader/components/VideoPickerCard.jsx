import React, { useRef } from 'react';
import { UploadCloud, Zap, Scissors, ShieldCheck } from 'lucide-react';
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
    <div className="w-full max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-14 flex flex-col justify-center items-center space-y-8 animate-fade-in">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Top Hero Description */}
      <div className="text-center space-y-3 max-w-2xl">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-400/10 border border-cyan-400/20 text-cyan-300 text-xs font-semibold tracking-wide">
          <div className="flex items-center gap-0.5 h-3">
            <span className="w-0.5 h-2 bg-cyan-400 rounded-full animate-soundwave-1" />
            <span className="w-0.5 h-3 bg-cyan-400 rounded-full animate-soundwave-2" />
            <span className="w-0.5 h-1.5 bg-cyan-400 rounded-full animate-soundwave-3" />
            <span className="w-0.5 h-2.5 bg-cyan-400 rounded-full animate-soundwave-4" />
          </div>
          <span>FAST ON-DEVICE AUDIO ENGINE</span>
        </div>

        <h2 className="text-3xl sm:text-5xl font-black text-white tracking-tight leading-tight">
          Turn Any Video Into{' '}
          <span className="bg-gradient-to-r from-cyan-400 via-teal-300 to-indigo-400 bg-clip-text text-transparent">
            Studio Audio
          </span>
        </h2>
        <p className="text-sm sm:text-base text-slate-400 max-w-xl mx-auto leading-relaxed">
          Extract 320kbps MP3, Lossless WAV or M4A directly inside your browser. Lightning-fast, private, zero server uploads.
        </p>
      </div>

      {/* Center Interactive Upload Card */}
      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="group relative w-full max-w-2xl cursor-pointer rounded-3xl p-8 sm:p-14 flex flex-col items-center justify-center text-center transition-all bg-gradient-to-b from-slate-900/90 via-slate-900/50 to-slate-950/90 border-2 border-dashed border-slate-700/80 hover:border-cyan-400/70 active:scale-[0.99] shadow-2xl shadow-black/50 overflow-hidden"
      >
        {/* Ambient Glow Aura */}
        <div className="absolute inset-0 bg-gradient-to-tr from-cyan-500/10 via-transparent to-indigo-500/10 opacity-60 group-hover:opacity-100 transition-opacity" />
        <div className="absolute -top-16 -right-16 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl group-hover:bg-cyan-500/25 transition-all" />

        {/* Pulsing Concentric Sound Icon */}
        <div className="relative mb-5">
          <div className="absolute -inset-3 rounded-3xl bg-cyan-500/20 blur-md group-hover:bg-cyan-400/35 transition-all" />
          <div className="relative w-20 h-20 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 border border-cyan-500/30 flex items-center justify-center shadow-xl group-hover:scale-105 group-hover:border-cyan-400 transition-all">
            <UploadCloud className="w-10 h-10 text-cyan-300" />
          </div>
        </div>

        {/* Call to action typography */}
        <h3 className="text-lg sm:text-xl font-bold text-white mb-2 group-hover:text-cyan-300 transition-colors">
          Tap or Drop Video Here to Convert
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 mb-6 max-w-md leading-normal">
          Works with phone gallery, camera roll, local files, screen recordings, and downloaded clips
        </p>

        {/* Format Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/70">
            MP4
          </span>
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/70">
            MOV
          </span>
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/70">
            WEBM
          </span>
          <span className="text-xs font-mono font-semibold px-3 py-1.5 rounded-xl bg-slate-800/90 text-slate-300 border border-slate-700/70">
            MKV
          </span>
        </div>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-2xl pt-2">
        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center sm:text-left flex sm:flex-row flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-500/10 text-cyan-400 flex items-center justify-center shrink-0">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">0.5s Fast Extraction</h4>
            <p className="text-[11px] text-slate-400">Direct demux without waiting for transcode</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center sm:text-left flex sm:flex-row flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center shrink-0">
            <Scissors className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">Precision Trimmer</h4>
            <p className="text-[11px] text-slate-400">Visual waveform to cut audio clips</p>
          </div>
        </div>

        <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-4 text-center sm:text-left flex sm:flex-row flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs sm:text-sm font-bold text-slate-200">100% Private</h4>
            <p className="text-[11px] text-slate-400">Processed locally on client GPU</p>
          </div>
        </div>
      </div>
    </div>
  );
}
