import React from 'react';
import { Moon, RotateCcw, Activity } from 'lucide-react';
import { useHaptic } from '../../hooks/useHaptic';

export function Header({ hasFile, onReset }) {
  const { trigger } = useHaptic();

  return (
    <header className="px-5 pt-3 sm:pt-2 pb-3.5 flex items-center justify-between border-b border-slate-800/60 bg-slate-950/40 backdrop-blur-md">
      {/* Brand Logo & Name */}
      <div className="flex items-center gap-2.5">
        <div className="relative w-9 h-9 rounded-2xl bg-gradient-to-br from-cyan-400 via-teal-400 to-indigo-600 p-[1.5px] shadow-lg shadow-cyan-500/20 flex items-center justify-center">
          <div className="w-full h-full bg-[#0B0F19] rounded-[14px] flex items-center justify-center">
            <Moon className="w-4 h-4 text-cyan-300 fill-cyan-400/20" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="font-extrabold text-[15px] tracking-tight text-white leading-none">
              MoonTune
            </h1>
            <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded-full bg-cyan-400/10 text-cyan-300 border border-cyan-400/25">
              PRO
            </span>
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[11px] font-medium text-slate-400">Audio Studio</span>
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
          className="px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/60 text-slate-300 hover:text-white transition-all flex items-center gap-1.5 text-xs font-semibold shadow-sm active:scale-95"
          title="New Video"
        >
          <RotateCcw className="w-3.5 h-3.5 text-cyan-400" />
          <span>New Video</span>
        </button>
      ) : (
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 bg-slate-900/80 px-2.5 py-1 rounded-full border border-slate-800">
          <Activity className="w-3 h-3 text-cyan-400" />
          <span>Offline GPU</span>
        </div>
      )}
    </header>
  );
}
