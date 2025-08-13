require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = process.env.PORT || 8080;

app.disable('x-powered-by');
app.use(require('cors')());
app.use(require('morgan')('dev'));

// Proxy para auth service
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
  target: process.env.EVENT_SERVICE_URL || 'http://localhost:3000',
  changeOrigin: true,
  pathRewrite: {
    '^/api/zone': '/zone'
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

// Proxy para reservation service - CORREGIDO
app.use('/api/reservation', createProxyMiddleware({
  target: process.env.RESERVATION_SERVICE_URL || 'http://localhost:3002',
  changeOrigin: true,
  pathRewrite: {
    '^/api/reservation': '/api/reservation'  // Mantener la ruta completa
  },
  logLevel: 'debug'
}));

// Proxy para ticket service - CORREGIDO
app.use('/api/ticket', createProxyMiddleware({
  target: process.env.TICKET_SERVICE_URL || 'http://localhost:3002',  // Puerto correcto
  changeOrigin: true,
  pathRewrite: {
    '^/api/ticket': '/api/ticket'  // Mantener la ruta completa
  },
  logLevel: 'debug'
}));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'running', timestamp: new Date().toISOString() });
});

// Ruta de prueba
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
  console.log('- /api/auth -> Auth Service (3004)');
  console.log('- /api/event -> Event Service (3000)');
  console.log('- /api/zone -> Zone Service (3000)');
  console.log('- /api/user -> User Service (3003)');
  console.log('- /api/reservation -> Payment Service (3002)');
  console.log('- /api/ticket -> Payment Service (3002)');
});