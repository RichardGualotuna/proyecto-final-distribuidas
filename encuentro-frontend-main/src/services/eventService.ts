import api from './api';
import { Event, CreateEventData, Zone } from '../types';

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
    try {
      // Estructura los datos según lo que espera el backend actual
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
        organizerId: eventData.organizerId
      };

      console.log('Creando evento:', eventPayload);
      
      // Crear el evento
      const eventResponse = await api.post('/event', eventPayload);
      const createdEvent = eventResponse.data;
      
      console.log('Evento creado:', createdEvent);

      // Si hay zonas configuradas, crearlas después del evento
      if (eventData.zones && eventData.zones.length > 0) {
        console.log('Creando zonas para el evento:', createdEvent.eventId);
        
        const createdZones = [];
        
        // Crear zonas una por una para mejor control de errores
        for (const zone of eventData.zones) {
          try {
            const zonePayload = {
              zoneName: zone.zoneName,
              price: Number(zone.price),
              zoneCapacity: Number(zone.zoneCapacity),
              eventId: createdEvent.eventId
            };
            
            console.log('Enviando zona al backend:', zonePayload);
            const zoneResponse = await api.post('/zone', zonePayload);
            console.log('Zona creada exitosamente:', zoneResponse.data);
            createdZones.push(zoneResponse.data);
          } catch (zoneError: any) {
            console.error('Error detallado al crear zona:', zone.zoneName);
            console.error('Error response:', zoneError.response?.data);
            console.error('Error status:', zoneError.response?.status);
            console.error('Error completo:', zoneError);
            // Continuar con las demás zonas pero mostrar el error
          }
        }
        
        console.log(`${createdZones.length} de ${eventData.zones.length} zonas creadas exitosamente`);
        
        if (createdZones.length < eventData.zones.length) {
          console.warn('Algunas zonas no se pudieron crear');
        }
        
        // Agregar las zonas creadas al evento para la respuesta
        createdEvent.zones = createdZones;
      }

      return createdEvent;
    } catch (error) {
      console.error('Error en createEvent:', error);
      throw error;
    }
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

  // Métodos para gestión de zonas
  getEventZones: async (eventId: number): Promise<Zone[]> => {
    try {
      console.log('Obteniendo zonas para evento:', eventId);
      
      // Intentar obtener todas las zonas y filtrar por eventId
      const response = await api.get('/zone');
      console.log('Respuesta completa de zonas:', response.data);
      
      if (!Array.isArray(response.data)) {
        console.warn('La respuesta no es un array:', response.data);
        return [];
      }
      
      // Filtrar las zonas por eventId y validar estructura
      const filteredZones = response.data.filter((zone: any) => {
        if (!zone || typeof zone !== 'object') {
          console.warn('Zona inválida encontrada:', zone);
          return false;
        }
        
        const hasRequiredFields = zone.eventId && zone.zoneId && zone.zoneName;
        if (!hasRequiredFields) {
          console.warn('Zona sin campos requeridos:', zone);
          return false;
        }
        
        return zone.eventId === eventId;
      });
      
      console.log('Zonas filtradas para evento', eventId, ':', filteredZones);
      
      // Asegurar que los campos numéricos sean números
      const validatedZones = filteredZones.map((zone: any) => ({
        ...zone,
        price: Number(zone.price) || 0,
        zoneCapacity: Number(zone.zoneCapacity) || 0,
      }));
      
      return validatedZones;
    } catch (error: any) {
      console.error('Error obteniendo zonas del evento:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      return [];
    }
  },

  createZone: async (zoneData: Omit<Zone, 'zoneId' | 'createdAt' | 'updatedAt'>): Promise<Zone> => {
    const response = await api.post('/zone', zoneData);
    return response.data;
  },

  updateZone: async (id: number, zoneData: Partial<Zone>): Promise<Zone> => {
    const response = await api.put(`/zone/${id}`, zoneData);
    return response.data;
  },

  deleteZone: async (id: number): Promise<void> => {
    await api.delete(`/zone/${id}`);
  },
};