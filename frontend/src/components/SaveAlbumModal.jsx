import React, { useState } from 'react';
import { RatingStars } from './RatingStars';
import { X, BookmarkPlus, Loader2 } from 'lucide-react';

export const SaveAlbumModal = ({ album, isOpen, onClose, onSave, loading }) => {
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');

  if (!isOpen || !album) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave({
      appleCatalogId: album.appleCatalogId,
      title: album.title,
      artistName: album.artistName,
      genre: album.genre || 'Unspecified',
      releaseDate: album.releaseDate,
      trackCount: album.trackCount,
      artworkUrl: album.artworkUrl,
      userRating: rating,
      userNotes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg bg-[#282828] rounded-xl shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-[#333] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <BookmarkPlus className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Save Album to Library</h3>
              <p className="text-xs text-slate-400">Add personal rating & review notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Album Summary Card */}
        <div className="p-6 bg-[#181818] border-b border-[#333] flex items-center gap-4">
          <img
            src={album.artworkUrl ? album.artworkUrl.replace('http://', 'https://').replace('100x100bb', '600x600bb') : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
            alt={album.title}
            className="w-16 h-16 rounded-xl object-cover shadow-md border border-slate-700"
            onError={(e) => {
              if (album.artworkUrl && e.target.src !== album.artworkUrl) {
                e.target.src = album.artworkUrl;
              } else {
                e.target.onerror = null;
                e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
              }
            }}
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white truncate">{album.title}</h4>
            <p className="text-sm text-indigo-400 truncate">{album.artistName}</p>
            <p className="text-xs text-slate-500 mt-1">
              {album.genre} • {album.releaseDate ? album.releaseDate.substring(0, 4) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-4 bg-[#333] p-3.5 rounded-md border-none">
              <RatingStars rating={rating} onRatingChange={setRating} size="lg" />
              <span className="text-sm font-bold text-amber-400">{rating}.0 / 5.0</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-[#b3b3b3] mb-2">
              Personal Notes & Review
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Write your thoughts about this album..."
              className="w-full p-3.5 rounded-md bg-[#333] border-none text-white placeholder-[#b3b3b3] text-sm focus:outline-none focus:ring-2 focus:ring-fuchsia-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-3 rounded-full text-sm font-bold text-white hover:scale-105 transition-transform"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-full font-bold text-sm text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:scale-105 hover:from-purple-400 hover:to-pink-400 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : (
                <span>Save Album</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
