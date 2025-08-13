const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Alert = sequelize.define('Alert', {
  alertId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  eventId: DataTypes.INTEGER,
  type: DataTypes.STRING,
  message: DataTypes.TEXT,
  alertDate: DataTypes.DATE,
}, {
  tableName: 'alerts',
  timestamps: true,
});

module.exports = Alert;
