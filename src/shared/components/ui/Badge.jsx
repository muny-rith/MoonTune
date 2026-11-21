import React from 'react';

export function Badge({ children, variant = 'cyan', size = 'sm' }) {
  const variants = {
    cyan: 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    purple: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    amber: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    slate: 'bg-slate-800 text-slate-300 border-slate-700/60'
  }[variant];

  const sizes = {
    xs: 'text-[10px] px-2 py-0.5',
    sm: 'text-xs px-2.5 py-1'
  }[size];

  return (
    <span className={`inline-flex items-center font-medium rounded-full border ${variants} ${sizes}`}>
      {children}
    </span>
  );
}
