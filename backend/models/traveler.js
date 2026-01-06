// models/traveler.js
const { DataTypes } = require('sequelize');
const sequelize = require('../database'); // putanja do vašeg database/index.js

const Traveler = sequelize.define('Traveler', {
  id: {
    type: DataTypes.STRING,   // ili DataTypes.INTEGER ako preferirate
    primaryKey: true,
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
  tableName: 'travelers',  // Naziv tabele u bazi
  timestamps: false        // Isključiti ako ne trebate createdAt, updatedAt
});

module.exports = Traveler;
