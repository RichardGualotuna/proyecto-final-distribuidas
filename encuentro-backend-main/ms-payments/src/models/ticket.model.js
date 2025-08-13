const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Ticket = sequelize.define('Ticket', {
  ticketId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  qrCode: DataTypes.STRING,
  status: DataTypes.STRING,
  zoneId: DataTypes.INTEGER,
  clientId: DataTypes.INTEGER,
  purchaseDate: DataTypes.DATE,
  paymentMethod: DataTypes.STRING,
}, {
  tableName: 'tickets',
  timestamps: true,
});

module.exports = Ticket;
