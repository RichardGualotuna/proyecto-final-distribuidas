const axios = require('axios');
const services = require('../config/services');

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ error: 'Authorization header missing' });
    }

    // Validar token con el auth-service
    console.log('Validating with:', `${services.authService.baseUrl}/validate`); // ✅ Debug
    
    const { data } = await axios.get(`${services.authService.baseUrl}/validate`, {
      headers: { Authorization: authHeader },
      timeout: 5000 // Agregar timeout
    });

    // Adjuntar usuario al request
    req.user = data.user;
    next();
  } catch (error) {
    console.error('Authentication Error:', error.message);
    
    if (error.response) {
      return res.status(error.response.status).json(error.response.data);
    }
    res.status(401).json({ error: 'Invalid or expired token' });
  }
};

module.exports = authenticate;