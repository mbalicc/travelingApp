// app.js
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Uvoz našeg sequelize objekta
const sequelize = require('./database');

// Uvoz modela (da se definicije "učitaju") - PRVO!
const Traveler = require('./models/traveler');
const Trip = require('./models/trip');
const Agency = require('./models/agency');

// Definisanje asocijacija NAKON što su svi modeli učitani
Agency.hasMany(Trip, { foreignKey: 'agencyId', as: 'trips' });
Trip.belongsTo(Agency, { foreignKey: 'agencyId', as: 'agency' });

Trip.belongsToMany(Traveler, { 
  through: 'TripTravelers',
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

// Uvoz ruta
const travelerRoutes = require('./routes/travelerRoutes');
const tripRoutes = require('./routes/tripRoutes');
const agencyRoutes = require('./routes/agencyRoutes');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Rute
app.use('/travelers', travelerRoutes);
app.use('/trips', tripRoutes);
app.use('/agencies', agencyRoutes);

// Sinhronizacija modela sa bazom (ovo kreira tabele ako ne postoje)
// { force: true } će OBRISATI sve postojeće podatke i kreirati nove tabele!
// Za produkciju koristiti { alter: true } ili bez opcija
sequelize.sync({ force: false })  // Promijeni na true ako trebaš resetovati bazu
  .then(() => {
    console.log('Modeli sinhronizirani sa bazom podataka.');
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Greška pri sinhronizaciji modela:', err);
  });