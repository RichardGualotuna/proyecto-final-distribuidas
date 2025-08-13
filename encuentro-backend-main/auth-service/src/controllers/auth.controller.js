const authService = require('../services/auth.service');

const register = async (req, res, next) => {
  try {
    const { firstName, lastName, email, password, role } = req.body;
    const user = await authService.register({ firstName, lastName, email, password, role });
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const refreshToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.body;
    const token = await authService.refreshAccessToken(refreshToken);
    res.json({ token });
  } catch (err) {
    next(err);
  }
};

const validate = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) throw new Error('Token no proporcionado');
    
    const payload = authService.validateToken(token);
    res.json({ valid: true, user: payload });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  validate
};