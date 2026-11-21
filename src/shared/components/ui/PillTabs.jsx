import React from 'react';
import { useHaptic } from '../../hooks/useHaptic';

export function PillTabs({ options = [], selected, onChange, className = '' }) {
  const { trigger } = useHaptic();

  return (
    <div className={`flex bg-slate-900/90 p-1 rounded-2xl border border-slate-800/80 gap-1 ${className}`}>
      {options.map((opt) => {
        const isSelected = selected === opt.value;
        return (
          <button
            key={opt.value}
            onClick={() => {
              trigger('light');
              onChange(opt.value);
            }}
            className={`flex-1 py-2 px-3 text-xs sm:text-sm font-semibold rounded-xl transition-all duration-200 select-none flex items-center justify-center gap-1.5 ${
              isSelected 
                ? 'bg-gradient-to-r from-cyan-500/20 to-indigo-500/20 text-cyan-300 border border-cyan-500/30 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            }`}
          >
            {opt.icon && <opt.icon className="w-3.5 h-3.5 shrink-0" />}
            <span>{opt.label}</span>
            {opt.badge && (
              <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-mono uppercase tracking-wider ${
                isSelected ? 'bg-cyan-400/20 text-cyan-300' : 'bg-slate-800 text-slate-400'
              }`}>
                {opt.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
