const Joi = require('joi');

const reservationSchema = Joi.object({
  ticketId: Joi.number().integer().required(),
  reservationDate: Joi.date().iso().required(),
  expirationDate: Joi.date().iso().required(),
  status: Joi.string().valid('reserved', 'expired', 'confirmed').required()
});

function validateReservation(data) {
  return reservationSchema.validate(data, { abortEarly: false });
}

module.exports = { validateReservation };
