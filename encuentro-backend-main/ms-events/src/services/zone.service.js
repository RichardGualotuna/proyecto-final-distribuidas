const Zone = require('../models/zone.model');

async function findAll() {
  return await Zone.findAll();
}

async function findById(id) {
  return await Zone.findByPk(id);
}

async function create(data) {
  return await Zone.create(data);
}

async function update(id, data) {
  const zone = await Zone.findByPk(id);
  if (!zone) return null;
  return await zone.update(data);
}

async function remove(id) {
  const zone = await Zone.findByPk(id);
  if (!zone) return false;
  await zone.destroy();
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
