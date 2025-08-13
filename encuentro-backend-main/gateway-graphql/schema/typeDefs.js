const { gql } = require('graphql-tag');

const typeDefs = gql`
  # User
  type User {
    userId: ID!
    firstName: String!
    lastName: String!
    email: String!
    role: String!
  }

  input CreateUserInput {
    firstName: String!
    lastName: String!
    email: String!
    role: String!
    password: String!
  }

  input UpdateUserInput {
    firstName: String
    lastName: String
    email: String
    role: String
    password: String
  }

  # Event
  type Event {
    eventId: ID!
    title: String!
    description: String
    date: String!
    time: String!
    location: String!
    category: String!
    totalCapacity: Int!
    status: String
    visibility: String
    organizerId: ID!
  }

  input CreateEventInput {
    title: String!
    description: String
    date: String!
    time: String!
    location: String!
    category: String!
    totalCapacity: Int!
    status: String
    visibility: String
    organizerId: ID!
  }

  input UpdateEventInput {
    title: String
    description: String
    date: String
    time: String
    location: String
    category: String
    totalCapacity: Int
    status: String
    visibility: String
    organizerId: ID
  }

  # Zone
  type Zone {
    zoneId: ID!
    zoneName: String!
    price: Float!
    zoneCapacity: Int!
    eventId: ID!
  }

  input CreateZoneInput {
    zoneName: String!
    price: Float!
    zoneCapacity: Int!
    eventId: ID!
  }

  input UpdateZoneInput {
    zoneName: String
    price: Float
    zoneCapacity: Int
    eventId: ID
  }

  # Ticket
  type Ticket {
    ticketId: ID!
    qrCode: String!
    status: String!
    zoneId: ID!
    clientId: ID!
    purchaseDate: String!
    paymentMethod: String!
  }

  input CreateTicketInput {
    qrCode: String!
    status: String!
    zoneId: ID!
    clientId: ID!
    purchaseDate: String!
    paymentMethod: String!
  }

  input UpdateTicketInput {
    qrCode: String
    status: String
    zoneId: ID
    clientId: ID
    purchaseDate: String
    paymentMethod: String
  }

  # Reservation
  type Reservation {
    reservationId: ID!
    ticketId: ID!
    reservationDate: String!
    expirationDate: String!
    status: String!
  }

  input CreateReservationInput {
    ticketId: ID!
    reservationDate: String!
    expirationDate: String!
    status: String!
  }

  input UpdateReservationInput {
    ticketId: ID
    reservationDate: String
    expirationDate: String
    status: String
  }

  # Notification
  type Notification {
    id: ID!
    userId: ID!
    type: String!
    message: String!
    sentDate: String!
    read: Boolean!
  }

  # Queries
  type Query {
    getAllUsers: [User]
    getUserById(id: ID!): User

    getAllEvents: [Event]
    getEventById(id: ID!): Event

    getAllZones: [Zone]
    getZoneById(id: ID!): Zone

    getAllTickets: [Ticket]
    getTicketById(id: ID!): Ticket

    getAllReservations: [Reservation]
    getReservationById(id: ID!): Reservation

    getAllNotifications: [Notification]
    getNotificationById(id: ID!): Notification
  }

  # Mutations
  type Mutation {
    # Users
    createUser(input: CreateUserInput!): User
    updateUser(userId: ID!, input: UpdateUserInput!): User
    deleteUser(userId: ID!): Boolean

    # Events
    createEvent(input: CreateEventInput!): Event
    updateEvent(eventId: ID!, input: UpdateEventInput!): Event
    deleteEvent(eventId: ID!): Boolean

    # Zones
    createZone(input: CreateZoneInput!): Zone
    updateZone(zoneId: ID!, input: UpdateZoneInput!): Zone
    deleteZone(zoneId: ID!): Boolean

    # Tickets
    createTicket(input: CreateTicketInput!): Ticket
    updateTicket(ticketId: ID!, input: UpdateTicketInput!): Ticket
    deleteTicket(ticketId: ID!): Boolean

    # Reservations
    createReservation(input: CreateReservationInput!): Reservation
    updateReservation(reservationId: ID!, input: UpdateReservationInput!): Reservation
    deleteReservation(reservationId: ID!): Boolean
  }
`;

module.exports = typeDefs;
