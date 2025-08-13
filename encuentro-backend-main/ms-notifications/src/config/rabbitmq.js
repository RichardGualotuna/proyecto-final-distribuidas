const amqp = require('amqplib');

let channel;

async function connectRabbitMQ() {
  const connection = await amqp.connect('amqp://admin:admin@localhost');
  channel = await connection.createChannel();
}

function getChannel() {
  if (!channel) throw new Error('RabbitMQ not connected');
  return channel;
}

module.exports = { connectRabbitMQ, getChannel };