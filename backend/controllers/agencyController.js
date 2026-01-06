const Agency = require('../models/agency');
const Trip = require('../models/trip');

// GET /agencies
exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.findAll();
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agencies', error: err.message });
  }
};

// POST /agencies - NE TREBA VIŠE ID!
exports.addAgency = async (req, res) => {
  try {
    const { name, location } = req.body;
    const newAgency = await Agency.create({ name, location });
    res.status(201).json({ message: 'Agency added successfully.', agency: newAgency });
  } catch (err) {
    res.status(500).json({ message: 'Error adding agency', error: err.message });
  }
};

// PUT /agencies/:id
exports.updateAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, location } = req.body;

    const agency = await Agency.findByPk(id);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found.' });
    }

    agency.name = name;
    agency.location = location;
    await agency.save();

    res.json({ message: 'Agency updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating agency', error: err.message });
  }
};

// DELETE /agencies/:id
exports.deleteAgency = async (req, res) => {
  try {
    const { id } = req.params;
    const agency = await Agency.findByPk(id);
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found.' });
    }
    await agency.destroy();
    res.json({ message: 'Agency deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting agency', error: err.message });
  }
};

// GET /agencies/:id/trips - Sva putovanja jedne agencije
exports.getAgencyTrips = async (req, res) => {
  try {
    const { id } = req.params;
    const agency = await Agency.findByPk(id, {
      include: [{ model: Trip, as: 'trips' }]
    });
    
    if (!agency) {
      return res.status(404).json({ message: 'Agency not found.' });
    }
    
    res.json(agency.trips);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agency trips', error: err.message });
  }
};