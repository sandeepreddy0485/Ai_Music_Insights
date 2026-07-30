import api from './api';

export const libraryService = {
  getLibrary: async () => {
    const response = await api.get('/library');
    return response.data;
  },

  saveAlbum: async (albumData) => {
    const response = await api.post('/library', albumData);
    return response.data;
  },

  updateLibraryItem: async (id, updateData) => {
    const response = await api.put(`/library/${id}`, updateData);
    return response.data;
  },

  deleteLibraryItem: async (id) => {
    const response = await api.delete(`/library/${id}`);
    return response.data;
  }
};
