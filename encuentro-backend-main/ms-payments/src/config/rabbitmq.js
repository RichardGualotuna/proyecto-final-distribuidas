const amqp = require('amqplib');

let channel = null;
let connection = null;

async function connectRabbitMQ() {
  try {
    const rabbitUrl = process.env.RABBITMQ_URL || 'amqp://admin:admin@localhost';
    connection = await amqp.connect(rabbitUrl);
    channel = await connection.createChannel();
    
    // Configurar las colas necesarias
    await channel.assertQueue('payment_notifications');
    await channel.assertQueue('reservation_events');
    await channel.assertQueue('ticket_events');
    
    // Manejo de desconexión
    connection.on('error', (err) => {
      console.error('RabbitMQ connection error:', err);
      setTimeout(connectRabbitMQ, 5000);
    });
    
    connection.on('close', () => {
      console.log('RabbitMQ connection closed, reconnecting...');
      setTimeout(connectRabbitMQ, 5000);
    });
    
    return channel;
  } catch (error) {
    console.error('Failed to connect to RabbitMQ:', error);
    throw error;
  }
}

function getChannel() {
  if (!channel) throw new Error('RabbitMQ not connected');
  return channel;
}

async function publishMessage(queue, message) {
  try {
    const channel = getChannel();
    await channel.assertQueue(queue);
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)));
    console.log(`Message sent to queue ${queue}:`, message);
  } catch (error) {
    console.error('Error publishing message:', error);
  }
}

async function listenToQueues() {
  try {
    const channel = getChannel();
    
    // Escuchar eventos de reservaciones
    await channel.consume('reservation_events', (msg) => {
      if (msg) {
        const content = JSON.parse(msg.content.toString());
        console.log('Received reservation event:', content);
        // Procesar el evento aquí
        channel.ack(msg);
      }
    });
    
    console.log('Listening to RabbitMQ queues...');
  } catch (error) {
    console.error('Error setting up queue listeners:', error);
  }
}

module.exports = { 
  connectRabbitMQ, 
  getChannel, 
  publishMessage,
  listenToQueues 
};