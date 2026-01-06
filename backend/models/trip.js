// models/trip.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
  },
  destination: {
    type: DataTypes.STRING,
    allowNull: false
  },
  duration: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  travelerId: {
    type: DataTypes.STRING, // ili DataTypes.INTEGER
    allowNull: false
  }
}, {
  tableName: 'trips',
  timestamps: false
});

module.exports = Trip;
