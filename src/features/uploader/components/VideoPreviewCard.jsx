import React from 'react';
import { Film, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { formatBytes, formatTime } from '../../../shared/utils/formatters';

export function VideoPreviewCard({ file, thumbnail, duration, onOpenMetadata }) {
  if (!file) return null;

  return (
    <div className="w-full">
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-4 flex items-center gap-4 shadow-lg">
        {/* Thumbnail or Video Icon */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700/60 flex items-center justify-center">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Film className="w-7 h-7 text-slate-500" />
          )}

          {/* Album Art indicator badge */}
          <button 
            onClick={onOpenMetadata}
            className="absolute bottom-1.5 right-1.5 p-1.5 bg-black/75 backdrop-blur-sm rounded-lg text-cyan-400 hover:text-white"
            title="Edit Tag & Cover Art"
          >
            <ImageIcon className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Video Metadata */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm sm:text-base font-semibold text-slate-100 truncate mb-1">
            {file.name}
          </h4>
          <div className="flex items-center gap-2.5 text-xs sm:text-sm text-slate-400">
            <span>{formatBytes(file.size)}</span>
            <span>•</span>
            <span className="font-mono text-cyan-400 font-semibold">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Edit Tags Button */}
        <button
          onClick={onOpenMetadata}
          className="px-3.5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 text-slate-300 hover:text-cyan-300 transition-colors flex items-center gap-2 text-xs sm:text-sm font-semibold"
          title="Audio Tags & Cover"
        >
          <SlidersHorizontal className="w-4 h-4 text-cyan-400" />
          <span className="hidden sm:inline">Edit Tags & Cover</span>
        </button>
      </div>
    </div>
  );
}
