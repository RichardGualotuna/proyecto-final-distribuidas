const eventService = require('../services/event.service');
const { validateEvent } = require('../dto/event.dto');
const { getChannel } = require('../config/rabbitmq');
const { validateNotification } = require('../dto/notification.dto');

async function getAllEvents(req, res, next) {
  try {
    const events = await eventService.findAll();
    res.json(events);
  } catch (err) {
    next(err);
  }
}

async function getEventById(req, res, next) {
  try {
    const event = await eventService.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });
    res.json(event);
  } catch (err) {
    next(err);
  }
}

async function createEvent(req, res, next) {
  try {
    const { error, value } = validateEvent(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const newEvent = await eventService.create(value);

    const notification = {
      userId: newEvent.organizerId,
      type: 'info',
      message: `Se creó el evento: ${newEvent.title}`,
      sentDate: new Date().toISOString(),
      read: false
    };

    const { error: notifError, value: validNotification } = validateNotification(notification);
    if (notifError) {
      console.error('Invalid notification DTO:', notifError.details.map(e => e.message));
    } else {
      const channel = getChannel();
      channel.assertQueue('notification');
      channel.sendToQueue('notification', Buffer.from(JSON.stringify(validNotification)));
    }

    res.status(201).json(newEvent);
  } catch (err) {
    next(err);
  }
}

async function updateEvent(req, res, next) {
  try {
    const { error, value } = validateEvent(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const updatedEvent = await eventService.update(req.params.id, value);
    if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

    res.json(updatedEvent);
  } catch (err) {
    next(err);
  }
}

async function deleteEvent(req, res, next) {
  try {
    const event = await eventService.findById(req.params.id);
    if (!event) return res.status(404).json({ message: 'Event not found' });

    await eventService.remove(req.params.id);

    // Crear y validar notificación
    const notification = {
      userId: event.organizerId,
      type: 'Evento Eliminado',
      message: `El evento "${event.title}" se eliminó.`,
      sentDate: new Date().toISOString(),
      read: false
    };

    const { error: notifError, value: validNotification } = validateNotification(notification);
    if (notifError) {
      console.error('Invalid notification DTO:', notifError.details.map(e => e.message));
    } else {
      const channel = getChannel();
      channel.assertQueue('notification');
      channel.sendToQueue('notification', Buffer.from(JSON.stringify(validNotification)));
    }

    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllEvents,
  getEventById,
  createEvent,
  updateEvent,
  deleteEvent
};
