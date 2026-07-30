import api from './api';

export const searchService = {
  searchAlbums: async (query) => {
    const response = await api.get('/search', {
      params: { query, type: 'album' }
    });
    return response.data;
  }
};
