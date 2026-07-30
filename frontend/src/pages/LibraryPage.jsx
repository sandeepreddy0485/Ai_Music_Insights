import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { libraryService } from '../services/libraryService';
import { RatingStars } from '../components/RatingStars';
import { EditLibraryModal } from '../components/EditLibraryModal';
import { Library, Search, Trash2, Edit3, Filter, ArrowUpDown, Calendar, Music, Sparkles, Loader2, MessageSquare } from 'lucide-react';

export const LibraryPage = () => {
  const [library, setLibrary] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Filtering & Sorting
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [sortBy, setSortBy] = useState('NEWEST');

  // Edit Modal State
  const [editingItem, setEditingItem] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    fetchLibrary();
  }, []);

  const fetchLibrary = async () => {
    setLoading(true);
    setError('');
    try {
      const data = await libraryService.getLibrary();
      setLibrary(data || []);
    } catch (err) {
      setError('Failed to load your music library. Please refresh.');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenEdit = (item) => {
    setEditingItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = async (id, updateData) => {
    setActionLoading(true);
    try {
      const updated = await libraryService.updateLibraryItem(id, updateData);
      setLibrary(prev => prev.map(item => (item.id === id ? updated : item)));
      setIsEditModalOpen(false);
    } catch (err) {
      alert('Failed to update album. Please try again.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteItem = async (id, title) => {
    if (!window.confirm(`Are you sure you want to remove "${title}" from your library?`)) {
      return;
    }

    try {
      await libraryService.deleteLibraryItem(id);
      setLibrary(prev => prev.filter(item => item.id !== id));
    } catch (err) {
      alert('Failed to delete album from library.');
    }
  };

  // Compute Unique Genres for Filter Dropdown
  const uniqueGenres = ['ALL', ...Array.from(new Set(library.map(i => i.genre).filter(Boolean)))];

  // Apply Filter & Sort
  const filteredAndSortedLibrary = library
    .filter(item => selectedGenre === 'ALL' || item.genre === selectedGenre)
    .sort((a, b) => {
      if (sortBy === 'RATING_DESC') {
        return (b.userRating || 0) - (a.userRating || 0);
      }
      if (sortBy === 'TITLE_ASC') {
        return a.title.localeCompare(b.title);
      }
      // Default: NEWEST (created_at desc)
      return new Date(b.createdAt) - new Date(a.createdAt);
    });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-slate-800 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-purple-500/10 border border-purple-500/20 text-purple-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <Library className="w-3.5 h-3.5" />
            <span>Personal Collection</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            My Saved <span className="gradient-text">Library</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Manage your saved albums, review ratings, personal notes, and catalog collection metrics.
          </p>
        </div>

        <Link
          to="/search"
          className="relative z-10 px-6 py-3.5 rounded-2xl font-semibold text-sm text-white gradient-btn flex items-center gap-2 shadow-xl shadow-indigo-600/30 hover:scale-105 transition-transform"
        >
          <Search className="w-4 h-4" />
          <span>Discover More Albums</span>
        </Link>
      </div>

      {/* Filter & Controls Bar */}
      {!loading && library.length > 0 && (
        <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <Filter className="w-4 h-4 text-indigo-400" />
              Genre:
            </span>
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre}</option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
              <ArrowUpDown className="w-4 h-4 text-purple-400" />
              Sort By:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-slate-900 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="NEWEST">Recently Added</option>
              <option value="RATING_DESC">Highest Rated</option>
              <option value="TITLE_ASC">Title (A-Z)</option>
            </select>
          </div>
        </div>
      )}

      {/* Content Section */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
          <p className="text-slate-400 text-sm font-medium">Loading your collection...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-center">
          {error}
        </div>
      ) : library.length === 0 ? (
        /* Empty State */
        <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 p-8 max-w-xl mx-auto space-y-6">
          <div className="w-16 h-16 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center mx-auto">
            <Library className="w-8 h-8" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-white">Your Library is Empty</h3>
            <p className="text-sm text-slate-400 mt-2">
              You haven't saved any albums yet. Search Apple's iTunes catalog to collect your favorite records and unlock AI insights!
            </p>
          </div>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white gradient-btn shadow-lg shadow-indigo-600/30"
          >
            <Search className="w-4 h-4" />
            <span>Search iTunes Catalog</span>
          </Link>
        </div>
      ) : (
        /* Grid Display */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredAndSortedLibrary.map((item) => (
            <div key={item.id} className="glass-card rounded-2xl overflow-hidden flex flex-col group relative">
              {/* Artwork Container */}
              <div className="relative aspect-square overflow-hidden bg-slate-900">
                <img
                  src={item.artworkUrl ? item.artworkUrl.replace('http://', 'https://').replace('100x100bb', '600x600bb') : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                  }}
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-purple-300">
                    {item.genre || 'Music'}
                  </span>
                </div>
              </div>

              {/* Info Container */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-purple-400 transition-colors">
                    {item.title}
                  </h3>
                  <p className="text-sm text-indigo-400 font-medium line-clamp-1 mt-0.5">
                    {item.artistName}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-slate-400 mt-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-500" />
                      {item.releaseDate ? item.releaseDate.substring(0, 4) : 'N/A'}
                    </span>
                    {item.trackCount && (
                      <span className="flex items-center gap-1">
                        <Music className="w-3.5 h-3.5 text-slate-500" />
                        {item.trackCount} tracks
                      </span>
                    )}
                  </div>

                  {/* Rating Display */}
                  <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between">
                    <RatingStars rating={item.userRating || 0} readOnly size="sm" />
                    <span className="text-xs font-bold text-amber-400">
                      {item.userRating ? `${item.userRating.toFixed(1)} / 5.0` : 'Unrated'}
                    </span>
                  </div>

                  {/* Notes Snippet */}
                  {item.userNotes && (
                    <div className="mt-3 p-2.5 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 flex items-start gap-2">
                      <MessageSquare className="w-3.5 h-3.5 text-purple-400 shrink-0 mt-0.5" />
                      <p className="line-clamp-2 italic">"{item.userNotes}"</p>
                    </div>
                  )}
                </div>

                {/* Card Controls */}
                <div className="flex items-center gap-2 pt-2 border-t border-slate-800/80">
                  <button
                    onClick={() => handleOpenEdit(item)}
                    className="flex-1 py-2 px-3 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-slate-200 hover:text-white border border-slate-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5 text-purple-400" />
                    <span>Edit</span>
                  </button>

                  <button
                    onClick={() => handleDeleteItem(item.id, item.title)}
                    className="p-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold flex items-center justify-center transition-all cursor-pointer"
                    title="Delete Album"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      <EditLibraryModal
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateItem}
        loading={actionLoading}
      />
    </div>
  );
};
