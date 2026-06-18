const express = require('express');
const router = express.Router();
const controller = require('../controllers/violationController');

router.get('/', controller.getViolations);
router.post('/', controller.createViolation);
router.get('/:id', controller.getViolationById);
router.post('/review', controller.reviewViolation); // Technically should be on /:id but matching previous API

module.exports = router;
