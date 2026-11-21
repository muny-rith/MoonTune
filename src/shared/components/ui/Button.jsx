import React from 'react';
import { useHaptic } from '../../hooks/useHaptic';

export function Button({
  children,
  variant = 'primary', // primary, secondary, ghost, danger, glow
  size = 'md',        // sm, md, lg
  icon: Icon,
  disabled = false,
  fullWidth = false,
  onClick,
  className = '',
  ...props
}) {
  const { trigger } = useHaptic();

  const handleClick = (e) => {
    if (disabled) return;
    trigger('light');
    onClick?.(e);
  };

  const baseStyles = 'inline-flex items-center justify-center font-medium transition-all select-none active:scale-[0.98] disabled:opacity-50 disabled:pointer-events-none rounded-2xl';

  const sizeStyles = {
    sm: 'text-xs px-3.5 py-2 min-h-[36px] gap-1.5',
    md: 'text-sm px-5 py-3 min-h-[48px] gap-2',
    lg: 'text-base px-6 py-3.5 min-h-[54px] gap-2.5 font-semibold'
  }[size];

  const variantStyles = {
    primary: 'bg-gradient-to-r from-cyan-400 to-cyan-500 hover:from-cyan-300 hover:to-cyan-400 text-slate-950 shadow-lg shadow-cyan-500/20 active:shadow-none font-semibold',
    secondary: 'bg-slate-800/80 hover:bg-slate-800 text-slate-200 border border-slate-700/60 active:bg-slate-700',
    ghost: 'bg-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/40 active:bg-slate-800/60',
    danger: 'bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 active:bg-red-500/30',
    glow: 'bg-gradient-to-r from-cyan-400 via-teal-400 to-indigo-500 text-slate-950 font-bold shadow-xl shadow-cyan-500/30 active:scale-[0.97]'
  }[variant];

  return (
    <button
      disabled={disabled}
      onClick={handleClick}
      className={`${baseStyles} ${sizeStyles} ${variantStyles} ${fullWidth ? 'w-full' : ''} ${className}`}
      {...props}
    >
      {Icon && <Icon className="w-5 h-5 shrink-0" />}
      <span>{children}</span>
    </button>
  );
}
