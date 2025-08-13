import api from './api';
import { Ticket, Reservation, CreateTicketData, CreateReservationData } from '../types';

export const paymentService = {
  // TICKETS
  getAllTickets: async (): Promise<Ticket[]> => {
    const response = await api.get('/ticket');
    return response.data;
  },

  getTicketById: async (id: number): Promise<Ticket> => {
    const response = await api.get(`/ticket/${id}`);
    return response.data;
  },

  getMyTickets: async (): Promise<Ticket[]> => {
    try {
      const response = await api.get('/ticket/my-tickets');
      return response.data;
    } catch (error) {
      // Si el endpoint no existe, obtener todos y filtrar por clientId
      const allTickets = await paymentService.getAllTickets();
      const authStorage = localStorage.getItem('auth-storage');
      if (authStorage) {
        const { state } = JSON.parse(authStorage);
        if (state?.user?.userId) {
          return allTickets.filter(ticket => ticket.clientId === state.user.userId);
        }
      }
      return [];
    }
  },

  createTicket: async (ticketData: CreateTicketData): Promise<Ticket> => {
    // Generar QR code único
    const qrCode = `TICKET-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    
    const payload = {
      ...ticketData,
      qrCode,
      status: ticketData.paymentMethod === 'none' ? 'pending' : 'paid',
      purchaseDate: new Date().toISOString()
    };
    
    const response = await api.post('/ticket', payload);
    return response.data;
  },

  updateTicket: async (id: number, ticketData: Partial<Ticket>): Promise<Ticket> => {
    const response = await api.put(`/ticket/${id}`, ticketData);
    return response.data;
  },

  cancelTicket: async (id: number): Promise<void> => {
    await api.put(`/ticket/${id}`, { status: 'cancelled' });
  },

  // RESERVATIONS
  getAllReservations: async (): Promise<Reservation[]> => {
    const response = await api.get('/reservation');
    return response.data;
  },

  getReservationById: async (id: number): Promise<Reservation> => {
    const response = await api.get(`/reservation/${id}`);
    return response.data;
  },

  getMyReservations: async (): Promise<Reservation[]> => {
    try {
      const response = await api.get('/reservation/my-reservations');
      return response.data;
    } catch (error) {
      // Obtener todas las reservaciones y filtrar por tickets del usuario
      const myTickets = await paymentService.getMyTickets();
      const ticketIds = myTickets.map(t => t.ticketId);
      const allReservations = await paymentService.getAllReservations();
      return allReservations.filter(r => ticketIds.includes(r.ticketId));
    }
  },

  createReservation: async (reservationData: CreateReservationData): Promise<Reservation> => {
    const expirationDate = reservationData.expirationDate || 
      new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(); // 24 horas por defecto
    
    const payload = {
      ...reservationData,
      reservationDate: new Date().toISOString(),
      expirationDate,
      status: 'reserved'
    };
    
    const response = await api.post('/reservation', payload);
    return response.data;
  },

  confirmReservation: async (id: number): Promise<Reservation> => {
    const response = await api.put(`/reservation/${id}`, { status: 'confirmed' });
    return response.data;
  },

  cancelReservation: async (id: number): Promise<void> => {
    await api.delete(`/reservation/${id}`);
  },

  // PROCESO DE COMPRA COMPLETO
  purchaseTicket: async (zoneId: number, paymentMethod: 'card' | 'cash' | 'transfer') => {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) throw new Error('Usuario no autenticado');
    
    const { state } = JSON.parse(authStorage);
    if (!state?.user?.userId) throw new Error('Usuario no válido');
    
    // Crear el ticket
    const ticket = await paymentService.createTicket({
      zoneId,
      clientId: state.user.userId,
      paymentMethod
    });
    
    return ticket;
  },

  reserveTicket: async (zoneId: number) => {
    const authStorage = localStorage.getItem('auth-storage');
    if (!authStorage) throw new Error('Usuario no autenticado');
    
    const { state } = JSON.parse(authStorage);
    if (!state?.user?.userId) throw new Error('Usuario no válido');
    
    // Crear ticket con estado pendiente
    const ticket = await paymentService.createTicket({
      zoneId,
      clientId: state.user.userId,
      paymentMethod: 'none'
    });
    
    // Crear reservación
    const reservation = await paymentService.createReservation({
      ticketId: ticket.ticketId
    });
    
    return { ticket, reservation };
  }
};