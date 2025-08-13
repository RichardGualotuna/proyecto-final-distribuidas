const Joi = require('joi');

const zoneSchema = Joi.object({
  zoneName: Joi.string().required(),
  price: Joi.number().min(0).required(),
  zoneCapacity: Joi.number().integer().min(1).required(),
  eventId: Joi.number().integer().required()
});

function validateZone(data) {
  return zoneSchema.validate(data, { abortEarly: false });
}

module.exports = { validateZone };
