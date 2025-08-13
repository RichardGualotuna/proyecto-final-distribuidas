const axios = require('axios');
const services = require('../config/services');


const proxy = (serviceName) => {
  return async (req, res) => {
    try {
      const service = services[serviceName];
      if (!service) {
        return res.status(404).json({ error: 'Service not found' });
      }

      const servicePath = serviceName.replace('Service', '').toLowerCase();
      const url = `${service.baseUrl}${req.originalUrl.replace(`/api/${servicePath}`, '')}`;
      
      const config = {
        method: req.method,
        url,
        headers: { 
          ...req.headers,
          // Propagamos información del usuario
          'x-user-id': req.user?.userId || '',
          'x-user-role': req.user?.role || '',
          'x-user-email': req.user?.email || '',
          host: new URL(service.baseUrl).host
        },
        data: req.body,
        params: req.query
      };

      // Headers que no deben propagarse
      delete config.headers.host;
      delete config.headers['content-length'];

      const response = await axios(config);
      res.status(response.status).json(response.data);
    } catch (error) {
      if (error.response) {
        res.status(error.response.status).json(error.response.data);
      } else if (error.request) {
        res.status(503).json({ error: 'Service unavailable', details: 'The microservice did not respond' });
      } else {
        res.status(500).json({ error: 'Internal Server Error', details: error.message });
      }
    }
  };
};

module.exports = proxy;