import React from 'react';

export function MobileAppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Background ambient radial gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-cyan-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-[100px]" />
      </div>

      {/* Responsive Shell: Full-width on mobile, centered Pro Card on Desktop */}
      <div className="relative z-10 w-full max-w-md mx-auto flex-1 flex flex-col bg-slate-950/80 sm:my-6 sm:border sm:border-slate-800/80 sm:rounded-[36px] sm:shadow-2xl sm:shadow-black/60 overflow-hidden min-h-[92vh]">
        {children}
      </div>
    </div>
  );
}
