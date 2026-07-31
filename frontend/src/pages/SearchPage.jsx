import React, { useState, useEffect } from 'react';
import { searchService } from '../services/searchService';
import { libraryService } from '../services/libraryService';
import { useDebounce } from '../hooks/useDebounce';
import { SaveAlbumModal } from '../components/SaveAlbumModal';
import { Search, Loader2, BookmarkPlus, CheckCircle2 } from 'lucide-react';

const DEFAULT_PLACEHOLDER = 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&auto=format&fit=crop&q=80';

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

  useEffect(() => {
    if (!debouncedSearchTerm.trim()) {
      setAlbums([]);
      return;
    }

    const executeSearch = async () => {
      setLoading(true);
      setError('');
      try {
        const results = await searchService.searchAlbums(debouncedSearchTerm);
        setAlbums(results || []);
      } catch (err) {
        if (err.response?.status === 401 || err.response?.status === 403) {
          setError('Your session expired after server restart. Please log out and log in again.');
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
      showToast(`Added to Your Library`);
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
    <div className="relative min-h-full pb-10">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 p-4 rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 text-white shadow-xl flex items-center gap-3 animate-slideUp font-bold">
          <CheckCircle2 className="w-5 h-5 text-white" />
          <span className="text-sm">{toastMessage}</span>
        </div>
      )}

      {/* Sticky Header */}
      <div className="px-6 py-4 sticky top-0 z-40 flex items-center bg-[#121212]/95 backdrop-blur-md mb-2">
        {/* Search Input Spotify Style */}
        <div className="relative w-full max-w-[360px]">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-[#b3b3b3]">
            <Search className="w-5 h-5" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="What do you want to listen to?"
            className="w-full pl-11 pr-4 py-3 rounded-full bg-[#242424] hover:bg-[#2a2a2a] hover:border-[#333] border border-transparent text-white placeholder-[#b3b3b3] text-sm font-medium focus:outline-none focus:ring-2 focus:ring-white transition-all shadow-sm"
          />
        </div>
      </div>

      <div className="px-6 relative z-10">
        <h2 className="text-2xl font-bold text-white mb-6 tracking-tight">Recent top results</h2>

        {/* Results Section */}
        {loading ? (
          <div className="py-20 text-center flex flex-col items-center justify-center gap-4">
            <Loader2 className="w-10 h-10 animate-spin text-fuchsia-500" />
          </div>
        ) : error ? (
          <div className="p-6 rounded-lg bg-red-500/10 text-red-500 text-sm font-bold text-center">
            <span>{error}</span>
          </div>
        ) : albums.length === 0 ? (
          <div className="py-20 text-center">
            <h3 className="text-lg font-bold text-white">No results found for "{searchTerm}"</h3>
            <p className="text-sm text-[#b3b3b3] mt-2">Please make sure your words are spelled correctly or use less or different keywords.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 2xl:grid-cols-7 gap-6">
            {albums.map((album) => {
              const isSaved = savedCatalogIds.has(album.appleCatalogId);
              const artworkSrc = album.artworkUrl ? album.artworkUrl.replace('http://', 'https://').replace('100x100bb', '600x600bb') : DEFAULT_PLACEHOLDER;

              return (
                <div key={album.appleCatalogId} onClick={() => !isSaved && handleOpenSaveModal(album)} className="bg-[#181818] p-4 rounded-md flex flex-col group relative hover:bg-[#282828] transition-colors cursor-pointer outline-none focus:outline-none">
                  {/* Artwork Image Container */}
                  <div className="relative aspect-square overflow-hidden rounded-md mb-4 shadow-[0_8px_24px_rgba(0,0,0,0.5)] bg-[#333]">
                    <img
                      src={artworkSrc}
                      alt={album.title}
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        if (album.artworkUrl && e.target.src !== album.artworkUrl) {
                          e.target.src = album.artworkUrl;
                        } else {
                          e.target.onerror = null;
                          e.target.src = DEFAULT_PLACEHOLDER;
                        }
                      }}
                    />

                    {/* Hover Appending Save Button / Play Button styling */}
                    <div className={`absolute right-2 bottom-2 w-12 h-12 rounded-full shadow-xl flex items-center justify-center transition-all duration-300 z-10
                        ${isSaved ? 'bg-transparent text-fuchsia-500 opacity-100 translate-y-0' : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white opacity-0 translate-y-2 group-hover:opacity-100 group-hover:translate-y-0 hover:scale-105 hover:from-purple-400 hover:to-pink-400'}`}>
                      {isSaved ? <CheckCircle2 className="w-10 h-10 bg-[#181818] rounded-full" /> : <BookmarkPlus className="w-6 h-6 ml-0.5" />}
                    </div>
                  </div>

                  {/* Text Container */}
                  <div className="flex flex-col">
                    <h3 className="font-bold text-white text-base leading-tight truncate mb-1" title={album.title}>
                      {album.title}
                    </h3>
                    <p className="text-sm font-medium text-[#b3b3b3] truncate" title={album.artistName}>
                      {album.artistName}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <SaveAlbumModal
        album={selectedAlbum}
        isOpen={isModalOpen}
        onClose={(e) => { e?.stopPropagation(); setIsModalOpen(false) }}
        onSave={handleSaveAlbum}
        loading={saveLoading}
      />
    </div>
  );
};
