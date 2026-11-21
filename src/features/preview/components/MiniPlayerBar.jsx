import React from 'react';
import { Play, Pause, Download, Volume2, Sparkles } from 'lucide-react';
import { formatTime } from '../../../shared/utils/formatters';
import { useHaptic } from '../../../shared/hooks/useHaptic';

export function MiniPlayerBar({
  audioUrl,
  isPlaying,
  onTogglePlay,
  onDownload,
  currentTime = 0,
  duration = 0,
  formatName = 'MP3',
  fileSizeText = ''
}) {
  const { trigger } = useHaptic();

  if (!audioUrl) return null;

  return (
    <div className="px-5 py-3 border-t border-slate-800/80 bg-slate-900/90 backdrop-blur-md">
      <div className="flex items-center justify-between gap-3">
        {/* Play / Pause Toggle */}
        <button
          onClick={() => {
            trigger('medium');
            onTogglePlay();
          }}
          className="w-12 h-12 rounded-2xl bg-gradient-to-r from-cyan-400 to-cyan-500 text-slate-950 flex items-center justify-center shadow-lg shadow-cyan-500/30 active:scale-95 transition-all shrink-0"
        >
          {isPlaying ? (
            <Pause className="w-5 h-5 fill-slate-950" />
          ) : (
            <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
          )}
        </button>

        {/* Audio Status & Scrubber Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 mb-0.5">
            <span className="text-xs font-bold text-slate-100 uppercase tracking-wider font-mono">
              Ready to Save
            </span>
            <span className="text-[10px] px-1.5 py-0.2 rounded-md bg-cyan-400/20 text-cyan-300 font-bold">
              {formatName}
            </span>
          </div>
          <div className="text-[11px] font-mono text-slate-400 flex items-center gap-2">
            <span>{formatTime(currentTime)} / {formatTime(duration)}</span>
            {fileSizeText && <span>• {fileSizeText}</span>}
          </div>
        </div>

        {/* 1-Tap Save Button */}
        <button
          onClick={() => {
            trigger('success');
            onDownload();
          }}
          className="px-4 py-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-500 text-slate-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-500/20 active:scale-95 transition-all"
        >
          <Download className="w-4 h-4 stroke-[2.5]" />
          <span>Save</span>
        </button>
      </div>
    </div>
  );
}
