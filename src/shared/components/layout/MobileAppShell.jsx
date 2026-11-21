import React from 'react';

export function MobileAppShell({ children }) {
  return (
    <div className="min-h-screen bg-[#070A0F] text-slate-100 flex flex-col justify-between selection:bg-cyan-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-gradient-to-b from-cyan-500/10 via-indigo-600/5 to-transparent rounded-full blur-[140px]" />
        <div className="absolute bottom-0 right-10 w-[500px] h-[400px] bg-purple-600/5 rounded-full blur-[160px]" />
      </div>

      {/* Clean full-width app shell without phone border mockup */}
      <div className="relative z-10 w-full flex-1 flex flex-col">
        {children}
      </div>
    </div>
  );
}
