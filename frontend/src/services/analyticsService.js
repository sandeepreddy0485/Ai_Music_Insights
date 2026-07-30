import api from './api';

export const analyticsService = {
  getAnalytics: async () => {
    const response = await api.get('/analytics');
    return response.data;
  },

  getAiSummary: async () => {
    const response = await api.get('/ai/summary');
    return response.data;
  }
};
