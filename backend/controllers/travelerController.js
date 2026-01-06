// controllers/travelerController.js
const Traveler = require('../models/traveler');

// GET /travelers
exports.getAllTravelers = async (req, res) => {
  try {
    const travelers = await Traveler.findAll();
    res.json(travelers);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching travelers', error: err.message });
  }
};

// POST /travelers
exports.addTraveler = async (req, res) => {
  try {
    const { id, name, age } = req.body;
    // ili: Traveler.create(req.body) ako objekat direktno mapira
    await Traveler.create({ id, name, age });
    res.status(201).json({ message: 'Traveler added successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error adding traveler', error: err.message });
  }
};

// PUT /travelers/:id
exports.updateTraveler = async (req, res) => {
  try {
    const { name, age } = req.body;
    const { id } = req.params;

    const traveler = await Traveler.findByPk(id);
    if (!traveler) {
      return res.status(404).json({ message: 'Traveler not found.' });
    }

    traveler.name = name;
    traveler.age = age;
    await traveler.save(); // ili traveler.update({ name, age })

    res.json({ message: 'Traveler updated successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error updating traveler', error: err.message });
  }
};

// DELETE /travelers/:id
exports.deleteTraveler = async (req, res) => {
  try {
    const { id } = req.params;

    const traveler = await Traveler.findByPk(id);
    if (!traveler) {
      return res.status(404).json({ message: 'Traveler not found.' });
    }

    await traveler.destroy();
    res.json({ message: 'Traveler deleted successfully.' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting traveler', error: err.message });
  }
};
