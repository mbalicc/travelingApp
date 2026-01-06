const Agency = require('../models/agency');

// GET /agencies
exports.getAllAgencies = async (req, res) => {
  try {
    const agencies = await Agency.findAll();
    res.json(agencies);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching agencies', error: err.message });
  }
};

// POST /agencies
exports.addAgency = async (req, res) => {
  try {
    const { id, name, location } = req.body;
    await Agency.create({ id, name, location });
    res.status(201).json({ message: 'Agency added successfully.' });
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
