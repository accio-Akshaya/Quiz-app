import api from './api';

const resultService = {
  submitResult: async (payload) => {
    const response = await api.post('/results', payload);
    return response.data;
  },

  getUserResults: async (userId) => {
    const response = await api.get(`/results/${userId}`);
    return response.data;
  }
};

export default resultService;
