import React, { useRef, useState, useEffect } from 'react';
import { Scissors, Play, Pause } from 'lucide-react';
import { formatTimePrecise } from '../../../shared/utils/formatters';
import { useHaptic } from '../../../shared/hooks/useHaptic';

export function TouchTrimmer({
  duration = 0,
  waveform = [],
  startTime = 0,
  endTime = 0,
  currentTime = 0,
  isPlaying = false,
  onTrimChange,
  onSeek,
  onTogglePlay
}) {
  const containerRef = useRef(null);
  const [activeDrag, setActiveDrag] = useState(null); // 'start', 'end', or null
  const { trigger } = useHaptic();

  const handlePointerDown = (type) => (e) => {
    e.preventDefault();
    e.stopPropagation();
    setActiveDrag(type);
    trigger('medium');
  };

  useEffect(() => {
    const handlePointerMove = (e) => {
      if (!activeDrag || !containerRef.current || duration <= 0) return;
      const rect = containerRef.current.getBoundingClientRect();
      const clientX = e.touches ? e.touches[0].clientX : e.clientX;
      const ratio = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const targetTime = ratio * duration;

      const minGap = Math.min(0.5, duration * 0.05); // at least 0.5s cut

      if (activeDrag === 'start') {
        const newStart = Math.min(targetTime, endTime - minGap);
        onTrimChange(Math.max(0, newStart), endTime);
      } else if (activeDrag === 'end') {
        const newEnd = Math.max(targetTime, startTime + minGap);
        onTrimChange(startTime, Math.min(duration, newEnd));
      }
    };

    const handlePointerUp = () => {
      if (activeDrag) {
        setActiveDrag(null);
        trigger('light');
      }
    };

    if (activeDrag) {
      window.addEventListener('mousemove', handlePointerMove);
      window.addEventListener('mouseup', handlePointerUp);
      window.addEventListener('touchmove', handlePointerMove);
      window.addEventListener('touchend', handlePointerUp);
    }

    return () => {
      window.removeEventListener('mousemove', handlePointerMove);
      window.removeEventListener('mouseup', handlePointerUp);
      window.removeEventListener('touchmove', handlePointerMove);
      window.removeEventListener('touchend', handlePointerUp);
    };
  }, [activeDrag, duration, startTime, endTime, onTrimChange, trigger]);

  // Click on waveform to seek
  const handleWaveformClick = (e) => {
    if (activeDrag || !containerRef.current || duration <= 0) return;
    const rect = containerRef.current.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const target = ratio * duration;
    onSeek(target);
    trigger('light');
  };

  const startPercent = duration > 0 ? (startTime / duration) * 100 : 0;
  const endPercent = duration > 0 ? (endTime / duration) * 100 : 100;
  const currentPercent = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <div className="px-5 py-3 space-y-2 select-none">
      {/* Header with times */}
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-slate-400">
          <Scissors className="w-3.5 h-3.5 text-cyan-400" />
          <span>Cut:</span>
          <span className="font-mono text-cyan-300 font-semibold">{formatTimePrecise(startTime)}</span>
          <span>to</span>
          <span className="font-mono text-cyan-300 font-semibold">{formatTimePrecise(endTime)}</span>
        </div>
        <div className="text-[11px] font-mono text-slate-400">
          Clip: {formatTimePrecise(Math.max(0, endTime - startTime))}
        </div>
      </div>

      {/* Main Waveform & Trimmer Canvas */}
      <div 
        ref={containerRef}
        onClick={handleWaveformClick}
        className="relative h-20 bg-slate-900/90 border border-slate-800 rounded-2xl overflow-hidden cursor-pointer touch-none"
      >
        {/* Waveform Bars */}
        <div className="absolute inset-0 flex items-center justify-between px-3 gap-[2px]">
          {waveform.map((peak, idx) => {
            const barPosPercent = (idx / waveform.length) * 100;
            const isInsideCut = barPosPercent >= startPercent && barPosPercent <= endPercent;
            return (
              <div
                key={idx}
                className={`w-full rounded-full transition-colors duration-150 ${
                  isInsideCut ? 'bg-cyan-400/80 shadow-sm shadow-cyan-400/30' : 'bg-slate-700/40'
                }`}
                style={{ height: `${Math.max(12, peak * 90)}%` }}
              />
            );
          })}
        </div>

        {/* Dimmed Out-of-bounds regions */}
        <div 
          className="absolute inset-y-0 left-0 bg-slate-950/75 pointer-events-none"
          style={{ width: `${startPercent}%` }}
        />
        <div 
          className="absolute inset-y-0 right-0 bg-slate-950/75 pointer-events-none"
          style={{ width: `${100 - endPercent}%` }}
        />

        {/* Playhead indicator */}
        <div 
          className="absolute inset-y-0 w-0.5 bg-white shadow-lg shadow-white/80 z-20 pointer-events-none"
          style={{ left: `${currentPercent}%` }}
        >
          <div className="w-2.5 h-2.5 bg-white rounded-full -ml-1 -mt-1 shadow-md" />
        </div>

        {/* Left Trimmer Handle (48px Touch Target) */}
        <div
          onMouseDown={handlePointerDown('start')}
          onTouchStart={handlePointerDown('start')}
          style={{ left: `calc(${startPercent}% - 14px)` }}
          className="absolute inset-y-0 z-30 w-7 flex items-center justify-center cursor-ew-resize group"
        >
          <div className="w-3.5 h-12 bg-cyan-400 rounded-lg shadow-lg shadow-cyan-500/50 flex flex-col items-center justify-center gap-1 group-active:scale-110 transition-transform">
            <div className="w-0.5 h-3 bg-slate-950 rounded-full" />
            <div className="w-0.5 h-3 bg-slate-950 rounded-full" />
          </div>
        </div>

        {/* Right Trimmer Handle (48px Touch Target) */}
        <div
          onMouseDown={handlePointerDown('end')}
          onTouchStart={handlePointerDown('end')}
          style={{ left: `calc(${endPercent}% - 14px)` }}
          className="absolute inset-y-0 z-30 w-7 flex items-center justify-center cursor-ew-resize group"
        >
          <div className="w-3.5 h-12 bg-cyan-400 rounded-lg shadow-lg shadow-cyan-500/50 flex flex-col items-center justify-center gap-1 group-active:scale-110 transition-transform">
            <div className="w-0.5 h-3 bg-slate-950 rounded-full" />
            <div className="w-0.5 h-3 bg-slate-950 rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
