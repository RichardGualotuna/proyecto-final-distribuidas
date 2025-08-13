module.exports = {
  eventService: {
    baseUrl: process.env.EVENT_SERVICE_URL || 'http://localhost:3000'
  },
  zoneService: {
    baseUrl: process.env.ZONE_SERVICE_URL || 'http://localhost:3001'
  },
  reservationService: {
    baseUrl: process.env.RESERVATION_SERVICE_URL || 'http://localhost:3002'
  },
  ticketService: {
    baseUrl: process.env.TICKET_SERVICE_URL || 'http://localhost:3003'
  },
  userService: {
    baseUrl: process.env.USER_SERVICE_URL || 'http://localhost:3003'
  },
  authService: {
    baseUrl: process.env.AUTH_SERVICE_URL || 'http://localhost:3004'
  }
};