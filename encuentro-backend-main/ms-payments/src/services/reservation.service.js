const Reservation = require('../models/reservation.model');

async function findAll() {
  return await Reservation.findAll();
}

async function findById(id) {
  return await Reservation.findByPk(id);
}

async function create(data) {
  return await Reservation.create(data);
}

async function update(id, data) {
  const reservation = await Reservation.findByPk(id);
  if (!reservation) return null;
  return await reservation.update(data);
}

async function remove(id) {
  const reservation = await Reservation.findByPk(id);
  if (!reservation) return false;
  await reservation.destroy();
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
