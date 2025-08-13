const axios = require('axios');

const BASE_URL = 'http://localhost:3002/api/reservation';

module.exports = {
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (reservationData) => {
    const response = await axios.post(BASE_URL, reservationData);
    return response.data;
  },

  update: async (id, reservationData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, reservationData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
