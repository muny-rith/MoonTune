import React, { useRef } from 'react';
import { UploadCloud, Film, Sparkles } from 'lucide-react';
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
    <div className="flex-1 flex flex-col justify-center px-5 py-6">
      <input
        ref={fileInputRef}
        type="file"
        accept="video/*"
        className="hidden"
        onChange={handleFileChange}
      />

      <div
        onClick={() => !isLoading && fileInputRef.current?.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        className="group relative cursor-pointer border-2 border-dashed border-slate-700/80 hover:border-cyan-400/80 active:border-cyan-400 rounded-3xl p-8 flex flex-col items-center justify-center text-center transition-all bg-gradient-to-b from-slate-900/60 to-slate-950/90 active:scale-[0.99] overflow-hidden"
      >
        {/* Glow ambient background on hover */}
        <div className="absolute inset-0 bg-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />

        <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700/80 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-cyan-500/50 group-hover:shadow-lg group-hover:shadow-cyan-500/20 transition-all">
          <UploadCloud className="w-10 h-10 text-cyan-400" />
        </div>

        <h3 className="text-lg font-bold text-slate-100 mb-2">
          Tap to Select Video
        </h3>
        <p className="text-xs text-slate-400 max-w-[260px] leading-relaxed mb-6">
          Choose from your phone gallery, camera roll, or drop any video file here.
        </p>

        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50">
            MP4
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50">
            MOV
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50">
            WEBM
          </span>
          <span className="text-[11px] font-mono px-2.5 py-1 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50">
            MKV
          </span>
        </div>

        <div className="mt-8 flex items-center gap-1.5 text-xs text-cyan-400/90 font-medium bg-cyan-950/40 px-3 py-1.5 rounded-full border border-cyan-800/40">
          <Sparkles className="w-3.5 h-3.5" />
          <span>100% Private • Local GPU Processing</span>
        </div>
      </div>
    </div>
  );
}
