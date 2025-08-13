const Joi = require('joi');

const notificationSchema = Joi.object({
  userId: Joi.number().integer().required(),
  type: Joi.string().valid('info', 'reminder', 'alert').required(),
  message: Joi.string().required(),
  sentDate: Joi.date().iso().required(),
  read: Joi.boolean().default(false)
});

function validateNotification(data) {
  return notificationSchema.validate(data, { abortEarly: false });
}

module.exports = { validateNotification };
