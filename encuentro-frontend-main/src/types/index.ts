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
  zones?: Omit<Zone, 'zoneId' | 'eventId' | 'createdAt' | 'updatedAt'>[];
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}