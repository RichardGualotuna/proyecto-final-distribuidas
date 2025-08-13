const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/ticket';

module.exports = {
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (ticketData) => {
    const response = await axios.post(BASE_URL, ticketData);
    return response.data;
  },

  update: async (id, ticketData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, ticketData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
