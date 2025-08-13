const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Zone = sequelize.define('Zone', {
  zoneId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  zoneName: DataTypes.STRING,
  price: DataTypes.FLOAT,
  zoneCapacity: DataTypes.INTEGER,
  eventId: DataTypes.INTEGER,
}, {
  tableName: 'zones',
  timestamps: true,
});

module.exports = Zone;
