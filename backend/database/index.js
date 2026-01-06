const { Sequelize } = require('sequelize');

// Kreirajte novu Sequelize instancu, zamijenite vrijednosti sa svojim kredencijalima
const sequelize = new Sequelize('travel_db', 'postgres', '1234', {
  host: 'localhost', // ili gdje vam je hostana baza
  dialect: 'postgres'
});

// Testiranje konekcije
sequelize.authenticate()
  .then(() => {
    console.log('Uspješno povezan na PostgreSQL bazu!');
  })
  .catch((err) => {
    console.error('Greška pri povezivanju na bazu:', err);
  });

module.exports = sequelize;
