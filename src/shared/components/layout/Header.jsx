import React from 'react';
import { Moon, RotateCcw, Activity } from 'lucide-react';
import { useHaptic } from '../../hooks/useHaptic';

export function Header({ hasFile, onReset }) {
  const { trigger } = useHaptic();

  return (
    <header className="w-full border-b border-slate-800/80 bg-[#0B0F19]/80 backdrop-blur-xl sticky top-0 z-40">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Brand Logo & Name */}
        <div className="flex items-center gap-3">
          <div className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
              <Moon className="w-4 h-4 sm:w-5 sm:h-5 text-cyan-300 fill-cyan-400/20" />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg tracking-tight text-white leading-none">
                MoonTune
              </h1>
              <span className="text-[10px] sm:text-xs font-mono font-bold tracking-wider px-2 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25">
                PRO
              </span>
            </div>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-medium text-slate-400">Audio Studio Engine</span>
            </div>
          </div>
        </div>

        {/* Action / Reset */}
        {hasFile ? (
          <button
            onClick={() => {
              trigger('medium');
              onReset();
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-200 hover:text-white transition-all flex items-center gap-2 text-xs sm:text-sm font-semibold shadow-sm active:scale-95"
            title="New Video"
          >
            <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
            <span>New Video</span>
          </button>
        ) : (
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-400 bg-slate-900/90 px-3 py-1.5 rounded-full border border-slate-800">
            <Activity className="w-3.5 h-3.5 text-cyan-400" />
            <span>Offline GPU Acceleration</span>
          </div>
        )}
      </div>
    </header>
  );
}
