import api from './api';

export const searchService = {
  searchAlbums: async (query) => {
    const response = await api.get('/search', {
      params: { query }
    });
    return response.data;
  }
};
