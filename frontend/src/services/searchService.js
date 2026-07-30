import api from './api';

export const searchService = {
  searchAlbums: async (query, type = 'artist') => {
    const response = await api.get('/search', {
      params: { query, type }
    });
    return response.data;
  }
};
