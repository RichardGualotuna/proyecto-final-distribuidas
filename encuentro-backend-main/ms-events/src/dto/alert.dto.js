const Joi = require('joi');

const alertSchema = Joi.object({
  eventId: Joi.number().integer().required(),
  type: Joi.string().valid('info', 'warning', 'critical').required(),
  message: Joi.string().required(),
  alertDate: Joi.date().iso().required()
});

function validateAlert(data) {
  return alertSchema.validate(data, { abortEarly: false });
}

module.exports = { validateAlert };
