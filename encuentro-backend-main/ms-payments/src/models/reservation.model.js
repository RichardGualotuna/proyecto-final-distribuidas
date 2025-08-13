const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Reservation = sequelize.define('Reservation', {
  reservationId: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  ticketId: DataTypes.INTEGER,
  reservationDate: DataTypes.DATE,
  expirationDate: DataTypes.DATE,
  status: DataTypes.STRING,
}, {
  tableName: 'reservations',
  timestamps: true,
});

module.exports = Reservation;
