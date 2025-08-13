const Ticket = require('../models/ticket.model');

async function findAll() {
  return await Ticket.findAll();
}

async function findById(id) {
  return await Ticket.findByPk(id);
}

async function create(data) {
  return await Ticket.create(data);
}

async function update(id, data) {
  const ticket = await Ticket.findByPk(id);
  if (!ticket) return null;
  return await ticket.update(data);
}

async function remove(id) {
  const ticket = await Ticket.findByPk(id);
  if (!ticket) return false;
  await ticket.destroy();
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
