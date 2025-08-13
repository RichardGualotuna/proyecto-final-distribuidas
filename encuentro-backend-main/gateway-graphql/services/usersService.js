const axios = require('axios');

const BASE_URL = 'http://localhost:3003/api/user';

module.exports = {
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (userData) => {
    const response = await axios.post(BASE_URL, userData);
    return response.data;
  },

  update: async (id, userData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, userData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
