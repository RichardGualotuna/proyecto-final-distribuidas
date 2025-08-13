// encuentro-backend-main/ms-events/src/controllers/zone.controller.js - CORREGIDO
const zoneService = require('../services/zone.service');
const { validateZone } = require('../dto/zone.dto');

async function getAllZones(req, res, next) {
  try {
    console.log('🔍 Obteniendo todas las zonas...');
    const zones = await zoneService.findAll();
    console.log('✅ Zonas encontradas:', zones.length);
    res.json(zones);
  } catch (err) {
    console.error('❌ Error al obtener zonas:', err);
    next(err);
  }
}

async function getZoneById(req, res, next) {
  try {
    console.log('🔍 Obteniendo zona por ID:', req.params.id);
    const zone = await zoneService.findById(req.params.id);
    if (!zone) {
      console.log('⚠️ Zona no encontrada:', req.params.id);
      return res.status(404).json({ message: 'Zone not found' });
    }
    console.log('✅ Zona encontrada:', zone);
    res.json(zone);
  } catch (err) {
    console.error('❌ Error al obtener zona:', err);
    next(err);
  }
}

async function createZone(req, res, next) {
  try {
    console.log('🔨 Creando nueva zona...');
    console.log('📋 Datos recibidos:', req.body);
    
    const { error, value } = validateZone(req.body);
    if (error) {
      console.log('❌ Error de validación:', error.details.map(e => e.message));
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details.map(e => e.message) 
      });
    }

    console.log('✅ Datos validados:', value);
    const newZone = await zoneService.create(value);
    console.log('✅ Zona creada exitosamente:', newZone);
    
    res.status(201).json(newZone);
  } catch (err) {
    console.error('❌ Error al crear zona:', err);
    console.error('❌ Stack trace:', err.stack);
    next(err);
  }
}

async function updateZone(req, res, next) {
  try {
    console.log('🔄 Actualizando zona:', req.params.id);
    console.log('📋 Nuevos datos:', req.body);
    
    const { error, value } = validateZone(req.body);
    if (error) {
      console.log('❌ Error de validación:', error.details.map(e => e.message));
      return res.status(400).json({ 
        error: 'Validation error',
        details: error.details.map(e => e.message) 
      });
    }

    const updatedZone = await zoneService.update(req.params.id, value);
    if (!updatedZone) {
      console.log('⚠️ Zona no encontrada para actualizar:', req.params.id);
      return res.status(404).json({ message: 'Zone not found' });
    }

    console.log('✅ Zona actualizada:', updatedZone);
    res.json(updatedZone);
  } catch (err) {
    console.error('❌ Error al actualizar zona:', err);
    next(err);
  }
}

async function deleteZone(req, res, next) {
  try {
    console.log('🗑️ Eliminando zona:', req.params.id);
    const deleted = await zoneService.remove(req.params.id);
    if (!deleted) {
      console.log('⚠️ Zona no encontrada para eliminar:', req.params.id);
      return res.status(404).json({ message: 'Zone not found' });
    }
    console.log('✅ Zona eliminada exitosamente');
    res.status(204).send();
  } catch (err) {
    console.error('❌ Error al eliminar zona:', err);
    next(err);
  }
}

module.exports = {
  getAllZones,
  getZoneById,
  createZone,
  updateZone,
  deleteZone
};