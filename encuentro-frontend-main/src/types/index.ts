export interface User {
  userId: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface Event {
  eventId: number;
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  totalCapacity: number;
  status: string;
  visibility: string;
  organizerId: number;
  createdAt?: string;
  updatedAt?: string;
  zones?: Zone[];
}

export interface Zone {
  zoneId: number;
  zoneName: string;
  price: number;
  zoneCapacity: number;
  eventId: number;
  createdAt?: string;
  updatedAt?: string;
}

// NUEVOS TIPOS PARA PAYMENTS
export interface Ticket {
  ticketId: number;
  qrCode: string;
  status: 'paid' | 'pending' | 'cancelled';
  zoneId: number;
  clientId: number;
  purchaseDate: string;
  paymentMethod: 'card' | 'cash' | 'transfer' | 'none';
  createdAt?: string;
  updatedAt?: string;
  zone?: Zone;
  event?: Event;
}

export interface Reservation {
  reservationId: number;
  ticketId: number;
  reservationDate: string;
  expirationDate: string;
  status: 'reserved' | 'expired' | 'confirmed';
  createdAt?: string;
  updatedAt?: string;
  ticket?: Ticket;
}

export interface CreateTicketData {
  zoneId: number;
  clientId: number;
  paymentMethod: 'card' | 'cash' | 'transfer' | 'none';
}

export interface CreateReservationData {
  ticketId: number;
  expirationDate?: string; // Si no se envía, el backend puede calcular 24h
}

export interface PaymentSummary {
  eventTitle: string;
  zoneName: string;
  price: number;
  quantity: number;
  subtotal: number;
  taxes: number;
  total: number;
}

// Tipos existentes...
export interface Alert {
  alertId: number;
  message: string;
  type: string;
  eventId: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  role: string;
}

export interface CreateEventData {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  category: string;
  totalCapacity: number;
  visibility: string;
  organizerId?: number;
  zones?: CreateZoneData[];
}

export interface CreateZoneData {
  zoneName: string;
  price: number;
  zoneCapacity: number;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface EventWithZones extends Event {
  zones: Zone[];
}