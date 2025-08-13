const User = require('../models/user.model');

async function findAll() {
  return await User.findAll();
}

async function findById(id) {
  return await User.findByPk(id);
}

async function create(data) {
  return await User.create(data);
}

async function update(id, data) {
  const user = await User.findByPk(id);
  if (!user) return null;
  return await user.update(data);
}

async function remove(id) {
  const user = await User.findByPk(id);
  if (!user) return false;
  await user.destroy();
  return true;
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove
};
