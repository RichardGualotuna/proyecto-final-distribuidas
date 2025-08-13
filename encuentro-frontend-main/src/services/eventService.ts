import api from './api';
import { Event, CreateEventData } from '../types';

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events');
    return response.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await api.get(`/events/${id}`);
    return response.data;
  },

  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    const response = await api.post('/events', eventData);
    return response.data;
  },

  updateEvent: async (id: number, eventData: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/events/${id}`);
  },

  getEventsByCategory: async (category: string): Promise<Event[]> => {
    const response = await api.get(`/events?category=${category}`);
    return response.data;
  },

  getMyEvents: async (): Promise<Event[]> => {
    const response = await api.get('/events/my-events');
    return response.data;
  },
};

