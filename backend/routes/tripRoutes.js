const express = require('express');
const tripController = require('../controllers/tripController');
const router = express.Router();

router.get('/', tripController.getAllTrips);
router.post('/', tripController.addTrip);
router.put('/:id', tripController.updateTrip);
router.delete('/:id', tripController.deleteTrip);

module.exports = router;

