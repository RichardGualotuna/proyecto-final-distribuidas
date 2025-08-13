const axios = require('axios');

const USERS_BASE_URL = 'http://localhost:3003/api/user';
const EVENTS_BASE_URL = 'http://localhost:3000/api/event';
const ZONES_BASE_URL = 'http://localhost:3000/api/zone';
const TICKETS_BASE_URL = 'http://localhost:3002/api/ticket';
const RESERVATIONS_BASE_URL = 'http://localhost:3002/api/reservation';
const NOTIFICATIONS_BASE_URL = 'http://localhost:3001/notifications';

const resolvers = {
  Query: {
    getAllUsers: async () => {
      const { data } = await axios.get(USERS_BASE_URL);
      return data;
    },
    getUserById: async (_, { userId }) => {
      const { data } = await axios.get(`${USERS_BASE_URL}/${userId}`);
      return data;
    },

    getAllEvents: async () => {
      const { data } = await axios.get(EVENTS_BASE_URL);
      return data;
    },
    getEventById: async (_, { id }) => {
      const { data } = await axios.get(`${EVENTS_BASE_URL}/${id}`);
      return data;
    },

    getAllZones: async () => {
      const { data } = await axios.get(ZONES_BASE_URL);
      return data;
    },
    getZoneById: async (_, { id }) => {
      const { data } = await axios.get(`${ZONES_BASE_URL}/${id}`);
      return data;
    },

    getAllTickets: async () => {
      const { data } = await axios.get(TICKETS_BASE_URL);
      return data;
    },
    getTicketById: async (_, { id }) => {
      const { data } = await axios.get(`${TICKETS_BASE_URL}/${id}`);
      return data;
    },

    getAllReservations: async () => {
      const { data } = await axios.get(RESERVATIONS_BASE_URL);
      return data;
    },
    getReservationById: async (_, { id }) => {
      const { data } = await axios.get(`${RESERVATIONS_BASE_URL}/${id}`);
      return data;
    },

    getAllNotifications: async () => {
      const { data } = await axios.get(NOTIFICATIONS_BASE_URL);
      return data;
    },
    getNotificationById: async (_, { id }) => {
      const { data } = await axios.get(`${NOTIFICATIONS_BASE_URL}/${id}`);
      return data;
    },
  },

  Mutation: {
    // Users
    createUser: async (_, { input }) => {
      const { data } = await axios.post(USERS_BASE_URL, input);
      return data;
    },
    updateUser: async (_, { userId, input }) => {
      const { data } = await axios.put(`${USERS_BASE_URL}/${userId}`, input);
      return data;
    },
    deleteUser: async (_, { userId }) => {
      await axios.delete(`${USERS_BASE_URL}/${userId}`);
      return true;
    },

    // Events
    createEvent: async (_, { input }) => {
      const { data } = await axios.post(EVENTS_BASE_URL, input);
      return data;
    },
    updateEvent: async (_, { eventId, input }) => {
      const { data } = await axios.put(`${EVENTS_BASE_URL}/${eventId}`, input);
      return data;
    },
    deleteEvent: async (_, { eventId }) => {
      await axios.delete(`${EVENTS_BASE_URL}/${eventId}`);
      return true;
    },

    // Zones
    createZone: async (_, { input }) => {
      const { data } = await axios.post(ZONES_BASE_URL, input);
      return data;
    },
    updateZone: async (_, { zoneId, input }) => {
      const { data } = await axios.put(`${ZONES_BASE_URL}/${zoneId}`, input);
      return data;
    },
    deleteZone: async (_, { zoneId }) => {
      await axios.delete(`${ZONES_BASE_URL}/${zoneId}`);
      return true;
    },

    // Tickets
    createTicket: async (_, { input }) => {
      const { data } = await axios.post(TICKETS_BASE_URL, input);
      return data;
    },
    updateTicket: async (_, { ticketId, input }) => {
      const { data } = await axios.put(`${TICKETS_BASE_URL}/${ticketId}`, input);
      return data;
    },
    deleteTicket: async (_, { ticketId }) => {
      await axios.delete(`${TICKETS_BASE_URL}/${ticketId}`);
      return true;
    },

    // Reservations
    createReservation: async (_, { input }) => {
      const { data } = await axios.post(RESERVATIONS_BASE_URL, input);
      return data;
    },
    updateReservation: async (_, { reservationId, input }) => {
      const { data } = await axios.put(`${RESERVATIONS_BASE_URL}/${reservationId}`, input);
      return data;
    },
    deleteReservation: async (_, { reservationId }) => {
      await axios.delete(`${RESERVATIONS_BASE_URL}/${reservationId}`);
      return true;
    }
  }
};

module.exports = resolvers;
