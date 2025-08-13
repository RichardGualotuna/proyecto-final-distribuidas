// encuentro-backend-main/ms-events/src/dto/zone.dto.js - CORREGIDO
const Joi = require('joi');

const zoneSchema = Joi.object({
  zoneName: Joi.string().min(1).max(100).required().messages({
    'string.empty': 'El nombre de la zona es requerido',
    'string.min': 'El nombre de la zona debe tener al menos 1 caracter',
    'string.max': 'El nombre de la zona no puede tener más de 100 caracteres',
    'any.required': 'El nombre de la zona es requerido'
  }),
  price: Joi.number().min(0).required().messages({
    'number.base': 'El precio debe ser un número',
    'number.min': 'El precio no puede ser negativo',
    'any.required': 'El precio es requerido'
  }),
  zoneCapacity: Joi.number().integer().min(1).required().messages({
    'number.base': 'La capacidad debe ser un número',
    'number.integer': 'La capacidad debe ser un número entero',
    'number.min': 'La capacidad debe ser mayor a 0',
    'any.required': 'La capacidad es requerida'
  }),
  eventId: Joi.number().integer().required().messages({
    'number.base': 'El ID del evento debe ser un número',
    'number.integer': 'El ID del evento debe ser un número entero',
    'any.required': 'El ID del evento es requerido'
  })
});

function validateZone(data) {
  console.log('🔍 Validando datos de zona:', data);
  const result = zoneSchema.validate(data, { abortEarly: false });
  console.log('📋 Resultado de validación:', result.error ? 'ERROR' : 'VÁLIDO');
  if (result.error) {
    console.log('❌ Errores de validación:', result.error.details.map(e => e.message));
  }
  return result;
}

module.exports = { validateZone };