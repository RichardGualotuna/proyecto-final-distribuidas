require('dotenv').config();
const express = require('express');
const cors = require('cors');
const sequelize = require('./src/config/db');
const { connectRabbitMQ } = require('./src/config/rabbitmq');
const { listener } = require('./src/services/messaging.consumer');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.status(200).send('Notification microservice is running');
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Internal Server Error' });
});

sequelize.sync()
  .then(async () => {
    console.log('Database connected and models synchronized');

    await connectRabbitMQ();
    listener();

    app.listen(PORT, () => {
      console.log(`Server listening on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to database:', err);
  });