import React from 'react';

export function ProgressBar({ percent = 0, statusText = '', showPercent = true }) {
  const clamped = Math.max(0, Math.min(100, Math.round(percent)));

  return (
    <div className="w-full space-y-2">
      <div className="flex items-center justify-between text-xs font-medium text-slate-400">
        <span className="truncate pr-2 text-cyan-400">{statusText}</span>
        {showPercent && <span className="font-mono text-slate-300">{clamped}%</span>}
      </div>

      <div className="w-full h-2.5 bg-slate-800/90 rounded-full overflow-hidden p-0.5 border border-slate-700/40">
        <div 
          className="h-full bg-gradient-to-r from-cyan-400 to-indigo-500 rounded-full transition-all duration-300 ease-out shadow-sm shadow-cyan-400/50"
          style={{ width: `${clamped}%` }}
        />
      </div>
    </div>
  );
}
