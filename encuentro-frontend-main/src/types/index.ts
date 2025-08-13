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
  zones?: Zone[]; // Agregar zonas opcionales al evento
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
  zones?: CreateZoneData[]; // Cambiar a un tipo más específico
}

// Nuevo tipo para crear zonas
export interface CreateZoneData {
  zoneName: string;
  price: number;
  zoneCapacity: number;
}

// Tipo para las respuestas de la API
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Tipos para eventos con zonas incluidas
export interface EventWithZones extends Event {
  zones: Zone[];
}