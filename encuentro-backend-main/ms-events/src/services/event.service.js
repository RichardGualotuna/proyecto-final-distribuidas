const Event = require('../models/event.model');

async function findAll() {
  return await Event.findAll();
}

async function findById(id) {
  return await Event.findByPk(id);
}

async function create(data) {
  return await Event.create(data);
}

async function update(id, data) {
  const event = await Event.findByPk(id);
  if (!event) return null;
  return await event.update(data);
}

async function remove(id) {
  const event = await Event.findByPk(id);
  if (!event) return false;
  await event.destroy();
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
