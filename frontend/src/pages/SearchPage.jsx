import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';
import { libraryService } from '../services/libraryService';
import { useDebounce } from '../hooks/useDebounce';
import { SaveAlbumModal } from '../components/SaveAlbumModal';
import { Search, Music, Disc, Calendar, CheckCircle2, BookmarkPlus, Loader2, Sparkles, UserCheck } from 'lucide-react';

export const SearchPage = () => {
  const [searchTerm, setSearchTerm] = useState('Coldplay');
  const debouncedSearchTerm = useDebounce(searchTerm, 500);

  const [albums, setAlbums] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedCatalogIds, setSavedCatalogIds] = useState(new Set());

  // Modal State
  const [selectedAlbum, setSelectedAlbum] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Fetch saved catalog IDs on load
  useEffect(() => {
    fetchUserLibrary();
  }, []);

  const fetchUserLibrary = async () => {
    try {
      const items = await libraryService.getLibrary();
      const ids = new Set(items.map(item => item.appleCatalogId));
      setSavedCatalogIds(ids);
    } catch (err) {
      console.error('Failed to load user library ids', err);
    }
  };

  // Perform iTunes Artist Search
  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setAlbums([]);
      return;
    }

    const executeSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await searchService.searchAlbums(debouncedSearchTerm, 'artist');
        setAlbums(results || []);
      } catch (err) {
        if (err.response?.status === 401) {
          setError('Your session expired after server restart. Please click Logout and log in again.');
        } else {
          setError(err.response?.data?.message || 'Failed to fetch albums from iTunes API. Please try again.');
        }
      } finally {
        setLoading(false);
      }
    };

    executeSearch();
  }, [debouncedSearchTerm]);

  const handleOpenSaveModal = (album) => {
    setSelectedAlbum(album);
    setIsModalOpen(true);
  };

  const handleSaveAlbum = async (saveData) => {
    setSaveLoading(true);
    try {
      await libraryService.saveAlbum(saveData);
      setSavedCatalogIds(prev => new Set(prev).add(saveData.appleCatalogId));
      setIsModalOpen(false);
      showToast(`" ${saveData.title} " saved to your library!`);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to save album to library.';
      alert(msg);
    } finally {
      setSaveLoading(false);
    }
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(''), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-2xl bg-indigo-600 text-white shadow-2xl shadow-indigo-500/40 flex items-center gap-3 animate-slideUp">
          <CheckCircle2 className="w-5 h-5 text-emerald-300" />
          <span className="font-semibold text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Header Banner */}
      <div className="glass-panel p-8 rounded-3xl relative overflow-hidden border border-slate-800">
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Search Albums by Artist</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Search Albums by <span className="gradient-text">Artist</span>
          </h1>
          <p className="text-slate-400 text-sm sm:text-base mt-2">
            Type any musical artist to discover all their official albums, release dates, track counts, and high-res cover art from Apple Music.
          </p>
        </div>

        {/* Search Input */}
        <div className="mt-8 relative max-w-xl">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-indigo-400">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by artist name (e.g. Coldplay, Taylor Swift, Ed Sheeran, Drake, A.R. Rahman)..."
            className="w-full pl-12 pr-4 py-4 rounded-2xl bg-slate-900/90 border border-slate-700/80 text-white placeholder-slate-500 text-base focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-xl transition-all"
          />
        </div>
      </div>

      {/* Results Section */}
      {loading ? (
        <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
          <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
          <p className="text-slate-400 text-sm font-medium">Fetching discography for artist "{searchTerm}"...</p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-center flex flex-col items-center gap-3">
          <span>{error}</span>
        </div>
      ) : albums.length === 0 ? (
        <div className="py-20 text-center glass-panel rounded-3xl border border-slate-800 p-8">
          <Disc className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white">No Albums Found for "{searchTerm}"</h3>
          <p className="text-sm text-slate-400 mt-1">Try searching for a different artist name.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {albums.map((album) => {
            const isSaved = savedCatalogIds.has(album.appleCatalogId);

            return (
              <div key={album.appleCatalogId} className="glass-card rounded-2xl overflow-hidden flex flex-col group">
                {/* Artwork Container */}
                <div className="relative aspect-square overflow-hidden bg-slate-900">
                  <img
                    src={album.artworkUrl ? album.artworkUrl.replace('http://', 'https://').replace('100x100bb', '600x600bb') : 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80'}
                    alt={album.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    loading="lazy"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=600&auto=format&fit=crop&q=80';
                    }}
                  />
                  <div className="absolute top-3 right-3">
                    <span className="px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-md border border-slate-700/80 text-xs font-semibold text-purple-300">
                      {album.genre || 'Music'}
                    </span>
                  </div>
                </div>

                {/* Info Container */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <h3 className="font-bold text-white text-base leading-snug line-clamp-1 group-hover:text-indigo-400 transition-colors">
                      {album.title}
                    </h3>
                    <p className="text-sm text-indigo-400 font-medium line-clamp-1 mt-0.5">
                      {album.artistName}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-slate-400 mt-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5 text-slate-500" />
                        {album.releaseDate ? album.releaseDate.substring(0, 4) : 'N/A'}
                      </span>
                      {album.trackCount && (
                        <span className="flex items-center gap-1">
                          <Music className="w-3.5 h-3.5 text-slate-500" />
                          {album.trackCount} tracks
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Save Button */}
                  <button
                    onClick={() => !isSaved && handleOpenSaveModal(album)}
                    disabled={isSaved}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      isSaved
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 cursor-default'
                        : 'bg-indigo-600/20 text-indigo-300 border border-indigo-500/40 hover:bg-indigo-600 hover:text-white hover:border-indigo-600 shadow-md shadow-indigo-600/20 cursor-pointer'
                    }`}
                  >
                    {isSaved ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Saved to Library</span>
                      </>
                    ) : (
                      <>
                        <BookmarkPlus className="w-4 h-4" />
                        <span>Save Album</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Save Modal */}
      <SaveAlbumModal
        album={selectedAlbum}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveAlbum}
        loading={saveLoading}
      />
    </div>
  );
};
