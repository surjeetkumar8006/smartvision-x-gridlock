const mongoose = require('mongoose');

const violationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    vehicleType: { type: String, required: true },
    plateNumber: { type: String, required: true },
    violationType: { type: String, required: true },
    confidence: { type: Number, required: true },
    timestamp: { type: String, required: true },
    cameraId: { type: String, required: true },
    location: { type: String, required: true },
    imagePath: { type: String, required: true },
    status: { type: String, required: true, default: 'Pending' },
    annotatedBox: {
        x: Number, y: Number, width: Number, height: Number
    },
    explainability: String,
    state: String,
    owner: String,
    chassis: String,
    emergencyFlag: { type: Boolean, default: false }
});

module.exports = mongoose.model('Violation', violationSchema);
