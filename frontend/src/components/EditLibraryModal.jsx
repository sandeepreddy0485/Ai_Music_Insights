import React, { useState, useEffect } from 'react';
import { RatingStars } from './RatingStars';
import { X, Edit3, Loader2 } from 'lucide-react';

export const EditLibraryModal = ({ item, isOpen, onClose, onUpdate, loading }) => {
  const [rating, setRating] = useState(5);
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (item) {
      setRating(item.userRating || 5);
      setNotes(item.userNotes || '');
    }
  }, [item]);

  if (!isOpen || !item) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(item.id, {
      userRating: rating,
      userNotes: notes.trim()
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-lg glass-panel rounded-2xl border border-slate-700/80 shadow-2xl overflow-hidden relative">
        {/* Header */}
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Edit3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white">Edit Library Album</h3>
              <p className="text-xs text-slate-400">Update your rating & review notes</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Album Cover Summary */}
        <div className="p-6 bg-slate-900/60 border-b border-slate-800/80 flex items-center gap-4">
          <img
            src={item.artworkUrl ? item.artworkUrl.replace('http://', 'https://').replace('100x100bb', '600x600bb') : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
            alt={item.title}
            className="w-16 h-16 rounded-xl object-cover shadow-md border border-slate-700"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
            }}
          />
          <div className="min-w-0 flex-1">
            <h4 className="font-semibold text-white truncate">{item.title}</h4>
            <p className="text-sm text-indigo-400 truncate">{item.artistName}</p>
            <p className="text-xs text-slate-500 mt-1">
              {item.genre} • {item.releaseDate ? item.releaseDate.substring(0, 4) : 'N/A'}
            </p>
          </div>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Your Rating
            </label>
            <div className="flex items-center gap-4 bg-slate-900/80 p-3.5 rounded-xl border border-slate-800">
              <RatingStars rating={rating} onRatingChange={setRating} size="lg" />
              <span className="text-sm font-bold text-amber-400">{rating}.0 / 5.0</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-300 mb-2">
              Personal Review & Notes
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Update your review or thoughts..."
              className="w-full p-3.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-white placeholder-slate-500 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl font-semibold text-sm text-white gradient-btn flex items-center gap-2 shadow-lg shadow-purple-600/30 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Updating...</span>
                </>
              ) : (
                <span>Save Changes</span>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
