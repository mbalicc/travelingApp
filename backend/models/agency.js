// models/agency.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database');

const Agency = sequelize.define('Agency', {
  id: {
    type: DataTypes.STRING,
    primaryKey: true,
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
