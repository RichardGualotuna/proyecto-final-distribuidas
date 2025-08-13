require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const { testConnection } = require('./src/utils/db');
const authRoutes = require('./src/routes/auth.routes');
const errorHandler = require('./src/middlewares/error.middleware');

const app = express();
const PORT = process.env.PORT || 3004;

app.disable('x-powered-by');
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(',') || '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE']
}));
app.use(morgan('dev'));

// IMPORTANTE: Agregar body-parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

testConnection()
  .then(() => console.log('DB connection verified'))
  .catch(err => {
    console.error('DB connection failed:', err.message);
    process.exit(1);
  });

// Rutas de autenticación
app.use('/', authRoutes);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'Auth service is running' });
});

app.use(errorHandler);

const server = app.listen(PORT, () => {
  console.log(`Auth service running on port ${PORT}`);
  console.log(`Started at: ${new Date().toISOString()}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});

process.on('SIGTERM', () => {
  console.log('SIGTERM received. Shutting down gracefully...');
  server.close(() => {
    console.log('Process terminated');
    process.exit(0);
  });
});