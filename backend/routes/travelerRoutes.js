const express = require('express');
const travelerController = require('../controllers/travelerController');
const router = express.Router();

router.get('/', travelerController.getAllTravelers);
router.post('/', travelerController.addTraveler);
router.put('/:id', travelerController.updateTraveler);
router.delete('/:id', travelerController.deleteTraveler);

module.exports = router;


