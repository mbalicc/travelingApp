// models/associations.js
const Traveler = require('./traveler');
const Trip = require('./trip');
const Agency = require('./agency');

// Agency - Trip (One-to-Many): Jedna agencija nudi više putovanja
Agency.hasMany(Trip, { foreignKey: 'agencyId', as: 'trips' });
Trip.belongsTo(Agency, { foreignKey: 'agencyId', as: 'agency' });

// Trip - Traveler (Many-to-Many): Jedno putovanje može imati više putnika, putnik može biti na više putovanja
Trip.belongsToMany(Traveler, { 
  through: 'TripTravelers',  // Naziv join tabele
  foreignKey: 'tripId',
  otherKey: 'travelerId',
  as: 'travelers'
});

Traveler.belongsToMany(Trip, { 
  through: 'TripTravelers',
  foreignKey: 'travelerId',
  otherKey: 'tripId',
  as: 'trips'
});

module.exports = { Traveler, Trip, Agency };