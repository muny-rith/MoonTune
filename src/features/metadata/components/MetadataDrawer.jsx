import React from 'react';
import { BottomSheet } from '../../../shared/components/ui/BottomSheet';
import { Button } from '../../../shared/components/ui/Button';
import { Tag, User, Disc, Image as ImageIcon } from 'lucide-react';

export function MetadataDrawer({
  isOpen,
  onClose,
  title,
  artist,
  album,
  coverUrl,
  onChangeTitle,
  onChangeArtist,
  onChangeAlbum
}) {
  return (
    <BottomSheet isOpen={isOpen} onClose={onClose} title="Audio Tags & Album Art">
      <div className="space-y-4">
        {/* Cover Art Preview */}
        <div className="flex items-center gap-4 p-3 bg-slate-950/60 rounded-2xl border border-slate-800">
          <div className="w-20 h-20 rounded-xl bg-slate-800 overflow-hidden border border-slate-700 shrink-0">
            {coverUrl ? (
              <img src={coverUrl} alt="Cover Preview" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-600">
                <ImageIcon className="w-6 h-6" />
              </div>
            )}
          </div>
          <div className="min-w-0 text-xs">
            <span className="font-semibold text-slate-200 block mb-1">Embedded Cover Art</span>
            <p className="text-slate-400 leading-relaxed">
              Auto-captured frame from your video. Embedded into ID3 tags for Apple Music & Spotify.
            </p>
          </div>
        </div>

        {/* Title Input */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
            <Tag className="w-3.5 h-3.5 text-cyan-400" />
            <span>Track Title</span>
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => onChangeTitle(e.target.value)}
            placeholder="e.g. My Favorite Melody"
            className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Artist Input */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
            <User className="w-3.5 h-3.5 text-cyan-400" />
            <span>Artist Name</span>
          </label>
          <input
            type="text"
            value={artist}
            onChange={(e) => onChangeArtist(e.target.value)}
            placeholder="e.g. Artist or Creator"
            className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
          />
        </div>

        {/* Album Input */}
        <div>
          <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5 mb-1.5">
            <Disc className="w-3.5 h-3.5 text-cyan-400" />
            <span>Album</span>
          </label>
          <input
            type="text"
            value={album}
            onChange={(e) => onChangeAlbum(e.target.value)}
            placeholder="e.g. MoonTune Extractions"
            className="w-full px-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="pt-2">
          <Button fullWidth variant="primary" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
}
