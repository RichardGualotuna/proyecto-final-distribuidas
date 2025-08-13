// encuentro-backend-main/ms-events/src/models/zone.model.js - VERIFICADO
const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Zone = sequelize.define('Zone', {
  zoneId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  zoneName: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  price: {
    type: DataTypes.FLOAT,
    allowNull: false,
    validate: {
      min: 0,
      isFloat: true
    }
  },
  zoneCapacity: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      min: 1,
      isInt: true
    }
  },
  eventId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    validate: {
      isInt: true
    }
  },
}, {
  tableName: 'zones',
  timestamps: true,
});

module.exports = Zone;