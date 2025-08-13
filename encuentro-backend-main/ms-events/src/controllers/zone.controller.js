const zoneService = require('../services/zone.service');
const { validateZone } = require('../dto/zone.dto');

async function getAllZones(req, res, next) {
  try {
    const zones = await zoneService.findAll();
    res.json(zones);
  } catch (err) {
    next(err);
  }
}

async function getZoneById(req, res, next) {
  try {
    const zone = await zoneService.findById(req.params.id);
    if (!zone) return res.status(404).json({ message: 'Zone not found' });
    res.json(zone);
  } catch (err) {
    next(err);
  }
}

async function createZone(req, res, next) {
  try {
    const { error, value } = validateZone(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const newZone = await zoneService.create(value);
    res.status(201).json(newZone);
  } catch (err) {
    next(err);
  }
}

async function updateZone(req, res, next) {
  try {
    const { error, value } = validateZone(req.body);
    if (error) return res.status(400).json({ errors: error.details.map(e => e.message) });

    const updatedZone = await zoneService.update(req.params.id, value);
    if (!updatedZone) return res.status(404).json({ message: 'Zone not found' });

    res.json(updatedZone);
  } catch (err) {
    next(err);
  }
}

async function deleteZone(req, res, next) {
  try {
    const deleted = await zoneService.remove(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Zone not found' });
    res.status(204).send();
  } catch (err) {
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
