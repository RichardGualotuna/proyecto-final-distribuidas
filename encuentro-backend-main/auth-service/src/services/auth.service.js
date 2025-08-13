const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user.model');

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '1h' 
  });
};

const generateRefreshToken = (payload) => {
  return jwt.sign(payload, process.env.JWT_SECRET, { 
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES_IN || '7d'
  });
};

const verifyToken = (token) => {
  return jwt.verify(token, process.env.JWT_SECRET);
};

const register = async (userData) => {
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email: userData.email } });
    if (existingUser) {
      throw new Error('El email ya está registrado');
    }

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(userData.password, 12);
    
    // Crear usuario
    const user = await User.create({
      ...userData,
      password: hashedPassword
    });
    
    return {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    };
  } catch (error) {
    throw error;
  }
};

const login = async (email, password) => {
  const user = await User.findOne({ where: { email } });
  if (!user) throw new Error('Usuario no encontrado');

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) throw new Error('Credenciales inválidas');

  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role
  };

  const token = generateToken(payload);
  const refreshToken = generateRefreshToken(payload);

  // Actualizar refresh token en la base de datos
  await User.update({ refreshToken }, { where: { userId: user.userId } });

  return {
    user: {
      userId: user.userId,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role
    },
    token,
    refreshToken
  };
};

const refreshAccessToken = async (refreshToken) => {
  const decoded = verifyToken(refreshToken);
  const user = await User.findOne({ 
    where: { userId: decoded.userId, refreshToken } 
  });
  
  if (!user) {
    throw new Error('Refresh token inválido');
  }

  const payload = {
    userId: user.userId,
    email: user.email,
    role: user.role
  };

  return generateToken(payload);
};

const validateToken = (token) => {
  return verifyToken(token);
};

module.exports = {
  register,
  login,
  refreshAccessToken,
  validateToken
};