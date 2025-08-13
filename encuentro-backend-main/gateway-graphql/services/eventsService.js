const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/event';

module.exports = {
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (eventData) => {
    const response = await axios.post(BASE_URL, eventData);
    return response.data;
  },

  update: async (id, eventData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, eventData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
