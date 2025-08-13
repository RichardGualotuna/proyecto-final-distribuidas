const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Event = sequelize.define('Event', {
  eventId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  date: DataTypes.DATEONLY,
  time: DataTypes.TIME,
  location: DataTypes.STRING,
  category: DataTypes.STRING,
  totalCapacity: DataTypes.INTEGER,
  status: DataTypes.STRING,
  visibility: DataTypes.STRING,
  organizerId: DataTypes.INTEGER,
}, {
  tableName: 'events',
  timestamps: true,
});

module.exports = Event;
