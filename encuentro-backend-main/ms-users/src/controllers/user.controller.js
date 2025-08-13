const userService = require('../services/user.service');
const { validateUser } = require('../dto/user.dto');

async function getAllUsers(req, res, next) {
  try {
    const users = await userService.findAll();
    res.json(users);
  } catch (err) {
    next(err);
  }
}

async function getUserById(req, res, next) {
  try {
    const user = await userService.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json(user);
  } catch (err) {
    next(err);
  }
}

async function createUser(req, res, next) {
  try {
    const { error, value } = validateUser(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const newUser = await userService.create(value);
    res.status(201).json(newUser);
  } catch (err) {
    next(err);
  }
}

async function updateUser(req, res, next) {
  try {
    const { error, value } = validateUser(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const updatedUser = await userService.update(req.params.id, value);
    if (!updatedUser) return res.status(404).json({ message: 'User not found' });

    res.json(updatedUser);
  } catch (err) {
    next(err);
  }
}

async function deleteUser(req, res, next) {
  try {
    const deleted = await userService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'User not found' });
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser
};
