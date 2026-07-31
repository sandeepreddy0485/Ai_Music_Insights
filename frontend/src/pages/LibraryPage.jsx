import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { libraryService } from '../services/libraryService';
import { RatingStars } from '../components/RatingStars';
import { EditLibraryModal } from '../components/EditLibraryModal';
import { Search, Loader2, Edit3, Trash2 } from 'lucide-react';

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

  const handleOpenEdit = (e, item) => {
    e.stopPropagation();
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

  const handleDeleteItem = async (e, id, title) => {
    e.stopPropagation();
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
    <div className="relative min-h-full pb-10">
      {/* Sticky Top Header Gradient */}
      <div className="sticky top-0 z-40 bg-gradient-to-b from-[#242424] to-transparent h-48 w-full absolute pointer-events-none -mt-4 opacity-70" />

      {/* Header & Controls */}
      <div className="px-6 pt-8 pb-4 relative z-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Library</h1>

        {!loading && library.length > 0 && (
          <div className="flex items-center gap-4">
            <select
              value={selectedGenre}
              onChange={(e) => setSelectedGenre(e.target.value)}
              className="bg-[#242424] hover:bg-[#2a2a2a] border-none rounded-full px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white transition-colors cursor-pointer"
            >
              {uniqueGenres.map(genre => (
                <option key={genre} value={genre}>{genre === 'ALL' ? 'All Genres' : genre}</option>
              ))}
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="bg-[#242424] hover:bg-[#2a2a2a] border-none rounded-full px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-white transition-colors cursor-pointer"
            >
              <option value="NEWEST">Recently Added</option>
              <option value="RATING_DESC">Highest Rated</option>
              <option value="TITLE_ASC">Title (A-Z)</option>
            </select>
          </div>
        )}
      </div>

      <div className="px-6 relative z-10">
        {/* Content Section */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500" />
          </div>
        ) : error ? (
          <div className="p-6 rounded-lg bg-red-500/10 text-red-500 text-sm font-bold text-center">
            {error}
          </div>
        ) : library.length === 0 ? (
          <div className="py-32 text-center max-w-md mx-auto">
            <h3 className="text-2xl font-bold text-white mb-4">Your Library is Empty</h3>
            <p className="text-base text-[#b3b3b3] mb-8">
              Save your favorite albums from the catalog and they will appear here.
            </p>
            <Link
              to="/search"
              className="inline-flex items-center justify-center bg-white text-black font-bold text-base px-8 py-3.5 rounded-full hover:scale-105 transition-transform"
            >
              Back to Catalog
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6 mt-4">
            {filteredAndSortedLibrary.map((item) => {
              const artworkSrc = item.artworkUrl
                ? item.artworkUrl.replace('http://', 'https://').replace('100x100bb', '600x600bb')
                : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';

              return (
                <div key={item.id} className="bg-[#181818] p-4 rounded-md flex flex-col group relative hover:bg-[#282828] transition-all cursor-pointer">
                  {/* Artwork Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-md mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] bg-[#333]">
                    <img
                      src={artworkSrc}
                      alt={item.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        if (item.artworkUrl && e.target.src !== item.artworkUrl) {
                          e.target.src = item.artworkUrl;
                        } else {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                        }
                      }}
                    />

                    {/* Hover Controls Overlays */}
                    <div className="absolute right-2 bottom-2 w-12 h-12 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300 z-10 hover:scale-105 hover:from-purple-400 hover:to-pink-400" onClick={(e) => handleOpenEdit(e, item)} title="Edit Notes">
                      <Edit3 className="w-5 h-5 ml-0.5" />
                    </div>

                    <div className="absolute left-2 bottom-2 w-10 h-10 rounded-full bg-[#121212]/90 text-white shadow-xl flex items-center justify-center opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:bg-[#242424] transition-all duration-300 z-10 group/del" onClick={(e) => handleDeleteItem(e, item.id, item.title)} title="Delete Album">
                      <Trash2 className="w-4 h-4 text-[#b3b3b3] group-hover/del:text-rose-500" />
                    </div>
                  </div>

                  {/* Text Container */}
                  <div className="flex flex-col">
                    <h3 className="font-bold text-white text-base leading-tight truncate mb-1 bg-transparent" title={item.title}>
                      {item.title}
                    </h3>
                    <p className="text-sm font-medium text-[#b3b3b3] truncate" title={item.artistName}>
                      {item.artistName}
                    </p>

                    {/* Secondary meta info like Rating */}
                    <div className="flex items-center justify-between mt-3 text-xs text-[#b3b3b3]">
                      <span>{item.genre || 'Music'}</span>
                      {item.userRating && (
                        <span className="flex items-center gap-1 font-bold text-fuchsia-400">★ {item.userRating.toFixed(1)}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      <EditLibraryModal
        item={editingItem}
        isOpen={isEditModalOpen}
        onClose={(e) => { e?.stopPropagation(); setIsEditModalOpen(false) }}
        onUpdate={handleUpdateItem}
        loading={actionLoading}
      />
    </div>
  );
};
