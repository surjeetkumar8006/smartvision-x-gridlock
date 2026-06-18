const express = require('express');
const router = express.Router();
const violationController = require('../controllers/violationController');
const patrolController = require('../controllers/patrolController');
const statsController = require('../controllers/statsController');

router.get('/stats', statsController.getStats);
router.get('/risk/:plate', violationController.getRiskScore);
router.get('/offenders', violationController.getOffenders);

module.exports = router;
