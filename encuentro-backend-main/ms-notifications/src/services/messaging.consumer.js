const { getChannel } = require('../config/rabbitmq');
const { validateNotification } = require('../dto/notification.dto');
const Notification = require('../models/notification.model');

async function listener() {
  const channel = getChannel();
  const queue = 'notification';

  await channel.assertQueue(queue, { durable: true });

  console.log(`Listening for messages on queue "${queue}"`);

  channel.consume(queue, async (msg) => {
    if (msg !== null) {
      try {
        const content = JSON.parse(msg.content.toString());

        const { error, value } = validateNotification(content);
        if (error) {
          console.error('Invalid message received:', error.details);
          channel.nack(msg, false, false);
          return;
        }

        console.log('Nueva Notificación:', value)
        await Notification.create(value);

        channel.ack(msg);
      } catch (err) {
        console.error('Error in listener during processing message:', err);
        channel.nack(msg, false, false);
      }
    }
  });
}

module.exports = { listener };
