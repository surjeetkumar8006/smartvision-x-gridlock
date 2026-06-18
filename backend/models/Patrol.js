const mongoose = require('mongoose');

const patrolSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    vehicleId: { type: String, required: true },
    status: { type: String, required: true },
    distance: { type: String, required: true },
    casesHandled: Number,
    responseTime: String,
    cleared: Number,
    points: Number,
    badge: String,
    stars: Number
});

module.exports = mongoose.model('Patrol', patrolSchema);
