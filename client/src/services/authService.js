import api from './api';

const authService = {
  register: async (payload) => {
    const response = await api.post('/auth/register', payload);
    return response.data;
  },

  login: async (payload) => {
    const response = await api.post('/auth/login', payload);
    return response.data;
  },

  googleLogin: async (credential) => {
    const response = await api.post('/auth/google-login', {
      token: credential
    });
    return response.data;
  }
};

export default authService;
