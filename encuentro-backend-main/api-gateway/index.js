require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const services = require('./src/config/services');

const app = express();
const PORT = process.env.PORT || 8080;

app.disable('x-powered-by');
app.use(require('cors')());
app.use(require('morgan')('dev'));

// Proxy para auth service (rutas públicas)
app.use('/api/auth', createProxyMiddleware({
  target: process.env.AUTH_SERVICE_URL || 'http://localhost:3004',
  changeOrigin: true,
  pathRewrite: {
    '^/api/auth': ''
  },
  logLevel: 'debug'
}));

// Proxy para event service
app.use('/api/event', createProxyMiddleware({
  target: process.env.EVENT_SERVICE_URL || 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/event': ''
  },
  logLevel: 'debug'
}));

// Proxy para zone service
app.use('/api/zone', createProxyMiddleware({
  target: process.env.ZONE_SERVICE_URL || 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/zone': ''
  },
  logLevel: 'debug'
}));

// Proxy para user service
app.use('/api/user', createProxyMiddleware({
  target: process.env.USER_SERVICE_URL || 'http://localhost:3003',
  changeOrigin: true,
  pathRewrite: {
    '^/api/user': ''
  },
  logLevel: 'debug'
}));

// Proxy para reservation service
app.use('/api/reservation', createProxyMiddleware({
  target: process.env.RESERVATION_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/reservation': ''
  },
  logLevel: 'debug'
}));

// Proxy para ticket service
app.use('/api/ticket', createProxyMiddleware({
  target: process.env.TICKET_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/ticket': ''
  },
  logLevel: 'debug'
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'running', timestamp: new Date().toISOString() });
});

// Ruta de prueba para verificar que el API Gateway está funcionando
app.get('/', (req, res) => {
  res.json({ 
    message: 'API Gateway is running',
    availableRoutes: [
      '/api/auth',
      '/api/event', 
      '/api/zone',
      '/api/user',
      '/api/reservation',
      '/api/ticket'
    ]
  });
});

app.listen(PORT, () => {
  console.log(`API Gateway running on port ${PORT}`);
  console.log('Available routes:');
  console.log('- /api/auth -> Auth Service');
  console.log('- /api/event -> Event Service');
  console.log('- /api/zone -> Zone Service');
  console.log('- /api/user -> User Service');
  console.log('- /api/reservation -> Reservation Service');
  console.log('- /api/ticket -> Ticket Service');
});