require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');
const reservationRoutes = require('./src/routes/reservation.routes');
const ticketRoutes = require('./src/routes/ticket.routes');
const { connectRabbitMQ, listenToQueues } = require('./src/config/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3002;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Logging middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// Rutas - configuradas para funcionar con el API Gateway
app.use('/api/reservation', reservationRoutes);
app.use('/api/ticket', ticketRoutes);

// Ruta de salud
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'payments',
    timestamp: new Date().toISOString() 
  });
});

// Ruta raíz
app.get('/', (req, res) => {
  res.json({
    message: 'Payment microservice is running',
    version: '1.0.0',
    endpoints: [
      '/api/reservation',
      '/api/ticket',
      '/health'
    ]
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({ 
    error: err.message || 'Internal Server Error',
    path: req.path,
    timestamp: new Date().toISOString()
  });
});

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Inicialización
async function startServer() {
  try {
    // Conectar a la base de datos
    await sequelize.authenticate();
    console.log('✅ Database connection established');
    
    // Sincronizar modelos
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');
    
    // Conectar a RabbitMQ
    try {
      await connectRabbitMQ();
      console.log('✅ Connected to RabbitMQ');
      
      // Iniciar listeners de colas
      await listenToQueues();
      console.log('✅ RabbitMQ listeners started');
    } catch (rabbitError) {
      console.warn('⚠️ RabbitMQ connection failed:', rabbitError.message);
      console.warn('⚠️ Service will continue without message queue functionality');
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`✅ Payment Service running on port ${PORT}`);
      console.log(`📍 URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

startServer();