// models/trip.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true  // Auto-generisanje ID-a
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  image: {
    type: DataTypes.STRING,
    allowNull: true,
    comment: 'URL slike destinacije'
  },
  agencyId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    comment: 'ID agencije koja nudi putovanje'
  }
}, {
  tableName: 'trips',
  timestamps: false
});

module.exports = Trip;