import api from './api';

const quizService = {
  getAllQuizzes: async () => {
    const response = await api.get('/quizzes');
    return response.data;
  },

  getQuizById: async (id) => {
    const response = await api.get(`/quizzes/${id}`);
    return response.data;
  },

  createQuiz: async (payload) => {
    const response = await api.post('/quizzes', payload);
    return response.data;
  },

  updateQuiz: async (id, payload) => {
    const response = await api.put(`/quizzes/${id}`, payload);
    return response.data;
  },

  deleteQuiz: async (id) => {
    const response = await api.delete(`/quizzes/${id}`);
    return response.data;
  }
};

export default quizService;
