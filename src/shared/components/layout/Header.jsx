import React from 'react';
import { Sparkles, RotateCcw } from 'lucide-react';
import { useHaptic } from '../../hooks/useHaptic';

export function Header({ hasFile, onReset }) {
  const { trigger } = useHaptic();

  return (
    <header className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-slate-800/40">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-cyan-400 to-indigo-500 p-0.5 shadow-md shadow-cyan-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
            <span className="text-cyan-400 font-black text-base">🌙</span>
          </div>
        </div>
        <div>
          <div className="flex items-center gap-1.5">
            <h1 className="font-extrabold text-base tracking-tight text-white">MoonTune</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md bg-cyan-400/10 text-cyan-400 border border-cyan-400/20">
              v1
            </span>
          </div>
          <p className="text-[11px] text-slate-400">Video to Audio Engine</p>
        </div>
      </div>

      {/* Action / Reset */}
      {hasFile && (
        <button
          onClick={() => {
            trigger('medium');
            onReset();
          }}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-slate-100 transition-colors flex items-center gap-1 text-xs"
          title="Start with new video"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">New</span>
        </button>
      )}
    </header>
  );
}
