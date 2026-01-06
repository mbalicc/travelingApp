const express = require('express');
const agencyController = require('../controllers/agencyController');
const router = express.Router();

router.get('/', agencyController.getAllAgencies);
router.get('/:id/trips', agencyController.getAgencyTrips);
router.post('/', agencyController.addAgency);
router.put('/:id', agencyController.updateAgency);
router.delete('/:id', agencyController.deleteAgency);

module.exports = router;
