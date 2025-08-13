const Joi = require('joi');

const userSchema = Joi.object({
  firstName: Joi.string().min(2).max(100).required(),
  lastName: Joi.string().min(2).max(100).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).max(128).required(),
  role: Joi.string().valid('admin', 'user', 'organizer').required()
});

function validateUser(data) {
  return userSchema.validate(data, { abortEarly: false });
}

module.exports = { validateUser };
