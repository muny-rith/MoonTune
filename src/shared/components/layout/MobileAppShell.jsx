import React from 'react';

export function MobileAppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#06080D] text-slate-100 flex flex-col justify-center items-center p-0 sm:py-8 sm:px-4 selection:bg-cyan-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[500px] h-[500px] bg-gradient-to-b from-cyan-500/15 via-indigo-600/10 to-transparent rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[140px]" />
      </div>

      {/* Modern Device Frame: 100% on phone, sleek iPhone 16 Pro mockup on Desktop */}
      <div className="relative z-10 w-full max-w-[430px] flex-1 sm:flex-initial flex flex-col bg-[#0B0F19]/95 backdrop-blur-2xl sm:rounded-[44px] sm:border sm:border-slate-800/90 sm:shadow-[0_25px_70px_-15px_rgba(0,0,0,0.85)] sm:ring-1 sm:ring-white/10 overflow-hidden sm:min-h-[820px] transition-all">
        {/* Subtle top phone speaker / notch bar on desktop */}
        <div className="hidden sm:flex justify-center pt-3 pb-1">
          <div className="w-24 h-1.5 bg-slate-800/90 rounded-full" />
        </div>

        {children}
      </div>
    </div>
  );
}
