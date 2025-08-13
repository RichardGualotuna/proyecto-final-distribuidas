const reservationService = require('../services/reservation.service');
const { validateReservation } = require('../dto/reservation.dto');

async function getAllReservations(req, res, next) {
  try {
    const reservations = await reservationService.findAll();
    res.json(reservations);
  } catch (err) {
    next(err);
  }
}

async function getReservationById(req, res, next) {
  try {
    const reservation = await reservationService.findById(req.params.id);
    if (!reservation) return res.status(404).json({ message: 'Reservation not found' });
    res.json(reservation);
  } catch (err) {
    next(err);
  }
}

async function createReservation(req, res, next) {
  try {
    const { error, value } = validateReservation(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const newReservation = await reservationService.create(value);
    res.status(201).json(newReservation);
  } catch (err) {
    next(err);
  }
}

async function updateReservation(req, res, next) {
  try {
    const { error, value } = validateReservation(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const updatedReservation = await reservationService.update(req.params.id, value);
    if (!updatedReservation) return res.status(404).json({ message: 'Reservation not found' });

    res.json(updatedReservation);
  } catch (err) {
    next(err);
  }
}

async function deleteReservation(req, res, next) {
  try {
    const deleted = await reservationService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Reservation not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllReservations,
  getReservationById,
  createReservation,
  updateReservation,
  deleteReservation
};
