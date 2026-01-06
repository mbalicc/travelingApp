// models/traveler.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Traveler = sequelize.define('Traveler', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true  // Auto-generisanje ID-a
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  age: {
    type: DataTypes.INTEGER,
    allowNull: false
  }
}, {
  tableName: 'travelers',
  timestamps: false
});

module.exports = Traveler;