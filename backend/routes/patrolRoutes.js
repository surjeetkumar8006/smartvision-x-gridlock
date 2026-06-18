const express = require('express');
const router = express.Router();
const controller = require('../controllers/patrolController');

router.get('/', controller.getPatrols);
router.post('/dispatch', controller.dispatchPatrol);

module.exports = router;
