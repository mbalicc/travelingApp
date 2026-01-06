const Trip = require('../models/trip');
const Traveler = require('../models/traveler');
const Agency = require('../models/agency');

// GET /trips - sa related agencijama
exports.getAllTrips = async (req, res) => {
  try {
    const trips = await Trip.findAll({
      include: [
        { model: Agency, as: 'agency' },
        { model: Traveler, as: 'travelers' }
      ]
    });
    res.json(trips);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trips', error: err.message });
  }
};

// GET /trips/:id - Jedno putovanje sa putnicima
exports.getTripById = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByPk(id, {
      include: [
        { model: Agency, as: 'agency' },
        { model: Traveler, as: 'travelers' }
      ]
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    
    res.json(trip);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip', error: err.message });
  }
};

// POST /trips - NE TREBA VIŠE ID!
exports.addTrip = async (req, res) => {
  try {
    const { destination, duration, image, agencyId } = req.body;
    const newTrip = await Trip.create({ destination, duration, image, agencyId });
    res.status(201).json({ message: 'Trip added successfully.', trip: newTrip });
  } catch (err) {
    res.status(500).json({ message: 'Error adding trip', error: err.message });
  }
};

// PUT /trips/:id
exports.updateTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const { destination, duration, image, agencyId } = req.body;

    const trip = await Trip.findByPk(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    trip.destination = destination;
    trip.duration = duration;
    trip.image = image;
    trip.agencyId = agencyId;
    await trip.save();

    res.json({ message: 'Trip updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating trip', error: err.message });
  }
};

// DELETE /trips/:id
exports.deleteTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const trip = await Trip.findByPk(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    await trip.destroy();
    res.json({ message: 'Trip deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting trip', error: err.message });
  }
};

// POST /trips/:id/travelers - Dodaj putnika na putovanje
exports.addTravelerToTrip = async (req, res) => {
  try {
    const { id } = req.params;  // ID putovanja
    const { travelerId } = req.body;  // ID putnika

    const trip = await Trip.findByPk(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const traveler = await Traveler.findByPk(travelerId);
    if (!traveler) {
      return res.status(404).json({ message: 'Traveler not found.' });
    }

    // Dodaj putnika na putovanje (kreira zapis u TripTravelers tabeli)
    await trip.addTraveler(traveler);

    res.json({ message: 'Traveler added to trip successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding traveler to trip', error: err.message });
  }
};

// DELETE /trips/:id/travelers/:travelerId - Ukloni putnika sa putovanja
exports.removeTravelerFromTrip = async (req, res) => {
  try {
    const { id, travelerId } = req.params;

    const trip = await Trip.findByPk(id);
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }

    const traveler = await Traveler.findByPk(travelerId);
    if (!traveler) {
      return res.status(404).json({ message: 'Traveler not found.' });
    }

    // Ukloni putnika sa putovanja
    await trip.removeTraveler(traveler);

    res.json({ message: 'Traveler removed from trip successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error removing traveler from trip', error: err.message });
  }
};

// GET /trips/:id/travelers - Svi putnici na putovanju
exports.getTripTravelers = async (req, res) => {
  try {
    const { id } = req.params;
    
    const trip = await Trip.findByPk(id, {
      include: [{ model: Traveler, as: 'travelers' }]
    });
    
    if (!trip) {
      return res.status(404).json({ message: 'Trip not found.' });
    }
    
    res.json(trip.travelers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching trip travelers', error: err.message });
  }
};