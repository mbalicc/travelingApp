// routes/tripRoutes.js
const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');

router.get('/', tripController.getAllTrips);
router.get('/:id', tripController.getTripById);
router.post('/', tripController.addTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

// NOVO - Rute za upravljanje putnicima na putovanju
router.get('/:id/travelers', tripController.getTripTravelers);
router.post('/:id/travelers', tripController.addTravelerToTrip);
router.delete('/:id/travelers/:travelerId', tripController.removeTravelerFromTrip);

module.exports = router;