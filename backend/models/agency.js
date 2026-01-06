// models/agency.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Agency = sequelize.define('Agency', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true  // Auto-generisanje ID-a
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  location: {
    type: DataTypes.STRING,
    allowNull: false
  }
}, {
  tableName: 'agencies',
  timestamps: false
});

module.exports = Agency;