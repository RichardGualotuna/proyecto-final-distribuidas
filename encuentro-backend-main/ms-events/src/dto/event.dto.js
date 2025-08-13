const Joi = require('joi');

const eventSchema = Joi.object({
  title: Joi.string().min(3).required(),
  description: Joi.string().allow('', null),
  date: Joi.date().iso().required(),
  time: Joi.string().pattern(/^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/).required(),
  location: Joi.string().required(),
  category: Joi.string().required(),
  totalCapacity: Joi.number().integer().min(1).required(),
  status: Joi.string().valid('active', 'cancelled', 'completed').required(),
  visibility: Joi.string().valid('public', 'private').required(),
  organizerId: Joi.number().integer().required()
});

function validateEvent(data) {
  return eventSchema.validate(data, { abortEarly: false });
}

module.exports = { validateEvent };