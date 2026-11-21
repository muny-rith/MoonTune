import React from 'react';
import { Film, SlidersHorizontal, Image as ImageIcon } from 'lucide-react';
import { formatBytes, formatTime } from '../../../shared/utils/formatters';

export function VideoPreviewCard({ file, thumbnail, duration, onOpenMetadata }) {
  if (!file) return null;

  return (
    <div className="px-5 pt-3 pb-2">
      <div className="bg-slate-900/90 border border-slate-800/80 rounded-2xl p-3 flex items-center gap-3.5 shadow-lg">
        {/* Thumbnail or Video Icon */}
        <div className="relative w-16 h-16 rounded-xl bg-slate-800 overflow-hidden shrink-0 border border-slate-700/60 flex items-center justify-center">
          {thumbnail ? (
            <img 
              src={thumbnail} 
              alt="Cover preview" 
              className="w-full h-full object-cover"
            />
          ) : (
            <Film className="w-6 h-6 text-slate-500" />
          )}

          {/* Album Art indicator badge */}
          <button 
            onClick={onOpenMetadata}
            className="absolute bottom-1 right-1 p-1 bg-black/70 backdrop-blur-sm rounded-md text-cyan-400 hover:text-white"
            title="Edit Tag & Cover Art"
          >
            <ImageIcon className="w-3 h-3" />
          </button>
        </div>

        {/* Video Metadata */}
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-slate-100 truncate mb-1">
            {file.name}
          </h4>
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span>{formatBytes(file.size)}</span>
            <span>•</span>
            <span className="font-mono text-cyan-400">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Edit Tags Button */}
        <button
          onClick={onOpenMetadata}
          className="p-2 rounded-xl bg-slate-800/60 hover:bg-slate-800 text-slate-400 hover:text-cyan-400 transition-colors"
          title="Audio Tags & Cover"
        >
          <SlidersHorizontal className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
