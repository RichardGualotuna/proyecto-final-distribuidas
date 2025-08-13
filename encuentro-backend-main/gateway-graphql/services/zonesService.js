const axios = require('axios');

const BASE_URL = 'http://localhost:3000/api/zone';

module.exports = {
  getAll: async () => {
    const response = await axios.get(BASE_URL);
    return response.data;
  },

  getById: async (id) => {
    const response = await axios.get(`${BASE_URL}/${id}`);
    return response.data;
  },

  create: async (zoneData) => {
    const response = await axios.post(BASE_URL, zoneData);
    return response.data;
  },

  update: async (id, zoneData) => {
    const response = await axios.put(`${BASE_URL}/${id}`, zoneData);
    return response.data;
  },

  delete: async (id) => {
    const response = await axios.delete(`${BASE_URL}/${id}`);
    return response.data;
  }
};
