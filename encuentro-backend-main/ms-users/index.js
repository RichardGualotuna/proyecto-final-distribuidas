require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');
const userRoutes = require('./src/routes/user.routes');
const { connectRabbitMQ } = require('./src/config/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3003;

app.use(cors());
app.use(express.json());

app.use('/api/user', userRoutes);

app.get('/', (req, res) => {
  res.status(200).send('User microservice is running');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

sequelize.sync()
  .then(() => {
    console.log('Database connected and models synchronized');
    return connectRabbitMQ();
  })
  .then(() => {
    console.log('Connected to RabbitMQ');
    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Startup failed:', err);
  });