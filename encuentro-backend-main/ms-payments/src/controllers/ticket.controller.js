const ticketService = require('../services/ticket.service');
const { validateTicket } = require('../dto/ticket.dto');

async function getAllTickets(req, res, next) {
  try {
    const tickets = await ticketService.findAll();
    res.json(tickets);
  } catch (err) {
    next(err);
  }
}

async function getTicketById(req, res, next) {
  try {
    const ticket = await ticketService.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: 'Ticket not found' });
    res.json(ticket);
  } catch (err) {
    next(err);
  }
}

async function createTicket(req, res, next) {
  try {
    const { error, value } = validateTicket(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const newTicket = await ticketService.create(value);
    res.status(201).json(newTicket);
  } catch (err) {
    next(err);
  }
}

async function updateTicket(req, res, next) {
  try {
    const { error, value } = validateTicket(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const updatedTicket = await ticketService.update(req.params.id, value);
    if (!updatedTicket) return res.status(404).json({ message: 'Ticket not found' });

    res.json(updatedTicket);
  } catch (err) {
    next(err);
  }
}

async function deleteTicket(req, res, next) {
  try {
    const deleted = await ticketService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Ticket not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllTickets,
  getTicketById,
  createTicket,
  updateTicket,
  deleteTicket
};
