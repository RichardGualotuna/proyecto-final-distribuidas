import api from './api';
import { Event, CreateEventData } from '../types';

export const eventService = {
  getAllEvents: async (): Promise<Event[]> => {
    const response = await api.get('/event');
    return response.data;
  },

  getEventById: async (id: number): Promise<Event> => {
    const response = await api.get(`/event/${id}`);
    return response.data;
  },

  createEvent: async (eventData: CreateEventData): Promise<Event> => {
    // Estructura los datos según lo que espera el backend
    const eventPayload = {
      title: eventData.title,
      description: eventData.description,
      date: eventData.date,
      time: eventData.time,
      location: eventData.location,
      category: eventData.category,
      totalCapacity: Number(eventData.totalCapacity),
      status: 'active',
      visibility: eventData.visibility === 'público' ? 'public' : 'private',
      organizerId: eventData.organizerId // Viene del usuario autenticado
    };

    const response = await api.post('/event', eventPayload);
    return response.data;
  },

  updateEvent: async (id: number, eventData: Partial<Event>): Promise<Event> => {
    const response = await api.put(`/event/${id}`, eventData);
    return response.data;
  },

  deleteEvent: async (id: number): Promise<void> => {
    await api.delete(`/event/${id}`);
  },

  getEventsByCategory: async (category: string): Promise<Event[]> => {
    const response = await api.get(`/event?category=${category}`);
    return response.data;
  },

  getMyEvents: async (): Promise<Event[]> => {
    const response = await api.get('/event/my-events');
    return response.data;
  },
};