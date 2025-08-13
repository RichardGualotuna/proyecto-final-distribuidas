// encuentro-backend-main/ms-events/index.js - CORREGIDO
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');
const eventRoutes = require('./src/routes/event.routes');
const zoneRoutes = require('./src/routes/zone.routes');
const { connectRabbitMQ } = require('./src/config/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3000;

// MIDDLEWARES - ORDEN IMPORTANTE
app.use(cors());
app.use(express.json({ limit: '10mb' }));                          
app.use(express.urlencoded({ extended: true, limit: '10mb' })); 

// LOGGING MIDDLEWARE
app.use((req, res, next) => {
  console.log(`📡 ${req.method} ${req.path}`, req.body ? ['- Body:', req.body] : '');
  next();
});

// RUTAS
app.use('/api/event', eventRoutes);  
app.use('/api/zone', zoneRoutes);    

// PARA EL PROXY del API Gateway, las rutas deben ser:
app.use('/', eventRoutes);  // ✅ Correcto para el proxy
app.use('/zone', zoneRoutes);  // ✅ Correcto para el proxy

app.get('/', (req, res) => {
  res.status(200).send('Event microservice is running');
});

// Health check específico
app.get('/health', (req, res) => {
  res.status(200).json({ 
    service: 'events-service',
    status: 'running', 
    timestamp: new Date().toISOString(),
    database: 'connected'
  });
});

app.use((err, req, res, next) => {
  console.error('❌ ERROR:', err);
  res.status(500).json({ 
    error: 'Internal Server Error', 
    details: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
  });
});

sequelize.sync({ force: false, alter: true })
  .then(() => {
    console.log('✅ Database connected and models synchronized');
    return connectRabbitMQ();
  })
  .then(() => {
    console.log('✅ Connected to RabbitMQ');
    app.listen(PORT, () => {
      console.log(`✅ Event Service listening on port ${PORT}`);
      console.log('📋 Available routes:');
      console.log('   - GET  /api/event - Get all events');
      console.log('   - POST /api/event - Create event');
      console.log('   - GET  /api/zone  - Get all zones');
      console.log('   - POST /api/zone  - Create zone');
    });
  })
  .catch((err) => {
    console.error('❌ Startup failed:', err);
    process.exit(1);
  });