import api from './api';
import { LoginCredentials, RegisterData, User } from '../types';

export const authService = {
  login: async (credentials: LoginCredentials) => {
    const response = await api.post('/auth/login', credentials);
    return response.data;
  },

  register: async (userData: RegisterData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  getProfile: async (): Promise<User> => {
    const response = await api.get('/auth/validate');
    return response.data.user;
  },

  updateProfile: async (userData: Partial<User>) => {
    const response = await api.put('/user/profile', userData);
    return response.data;
  },
};