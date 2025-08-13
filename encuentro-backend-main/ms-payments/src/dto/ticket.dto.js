const Joi = require('joi');

const ticketSchema = Joi.object({
  qrCode: Joi.string().required(),
  status: Joi.string().valid('paid', 'pending', 'cancelled').required(),
  zoneId: Joi.number().integer().required(),
  clientId: Joi.number().integer().required(),
  purchaseDate: Joi.date().iso().required(),
  paymentMethod: Joi.string().valid('card', 'cash', 'transfer', 'none').required()
});

function validateTicket(data) {
  return ticketSchema.validate(data, { abortEarly: false });
}

module.exports = { validateTicket };
