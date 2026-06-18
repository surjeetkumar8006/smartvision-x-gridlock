require('dotenv').config();
const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Setup static files to serve mock violation images
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Setup local data directory for JSON Fallback mode
const DATA_DIR = path.join(__dirname, 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const VIOLATIONS_FILE = path.join(DATA_DIR, 'violations.json');
const DISPATCH_FILE = path.join(DATA_DIR, 'dispatch.json');

// Connect to MongoDB with Fallback
let isUsingMongoDB = false;
const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartvision_x';

// Initial Mock Datasets
const initialViolations = [
    {
        id: "VIO-8041",
        vehicleType: "Two-Wheeler",
        plateNumber: "KA-03-MX-8891",
        violationType: "Helmet Non Compliance",
        confidence: 0.98,
        timestamp: "2026-06-16T14:10:45Z",
        cameraId: "CAM-04",
        location: "Silk Board Junction, Outer Ring Rd",
        imagePath: "/assets/cam_helmet.png",
        status: "Pending",
        annotatedBox: { x: 120, y: 80, width: 90, height: 95 },
        explainability: "Rider head region detected without safety helmet. Bounding box maps motorcycle registration plate KA-03-MX-8891.",
        state: "Karnataka",
        owner: "Suresh Gowda",
        chassis: "ME3SKX9827B91",
        emergencyFlag: false
    },
    {
        id: "VIO-8042",
        vehicleType: "SUV",
        plateNumber: "KA-51-AB-1024",
        violationType: "Illegal Parking",
        confidence: 0.95,
        timestamp: "2026-06-16T14:09:12Z",
        cameraId: "CAM-12",
        location: "Indiranagar 100ft Rd",
        imagePath: "/assets/cam_parking.png",
        status: "Approved",
        annotatedBox: { x: 250, y: 180, width: 310, height: 160 },
        explainability: "Static white vehicle localized inside restricted polygon zone mask for over 180 seconds. Sidewalk blockage registered.",
        state: "Karnataka",
        owner: "Ankit Sharma",
        chassis: "MA1PLX8876G11",
        emergencyFlag: false
    },
    {
        id: "VIO-8043",
        vehicleType: "Two-Wheeler",
        plateNumber: "KA-01-EQ-9551",
        violationType: "Triple Riding",
        confidence: 0.96,
        timestamp: "2026-06-16T14:07:33Z",
        cameraId: "CAM-08",
        location: "Koramangala 80ft Rd",
        imagePath: "/assets/cam_triple.png",
        status: "Pending",
        annotatedBox: { x: 180, y: 110, width: 140, height: 180 },
        explainability: "Three distinct head regions localized on a single motorcycle chassis box. Exceeds load safety limit.",
        state: "Karnataka",
        owner: "Manpreet Singh",
        chassis: "MB3SKZ9281B20",
        emergencyFlag: false
    },
    {
        id: "VIO-8044",
        vehicleType: "Sedan",
        plateNumber: "KA-04-HA-2287",
        violationType: "Seatbelt Non Compliance",
        confidence: 0.94,
        timestamp: "2026-06-16T13:58:04Z",
        cameraId: "CAM-15",
        location: "MG Road, Near Metro Pillar 110",
        imagePath: "/assets/cam_parking.png",
        status: "Pending",
        annotatedBox: { x: 300, y: 150, width: 80, height: 110 },
        explainability: "Front cabin windshield crop parses rider torso without diagonal seatbelt strap placement.",
        state: "Karnataka",
        owner: "Divya Hegde",
        chassis: "MD4PAX7726H22",
        emergencyFlag: false
    },
    {
        id: "VIO-8045",
        vehicleType: "Two-Wheeler",
        plateNumber: "KA-03-MX-8891",
        violationType: "Wrong Side Driving",
        confidence: 0.91,
        timestamp: "2026-06-16T13:52:19Z",
        cameraId: "CAM-04",
        location: "Silk Board Junction, Outer Ring Rd",
        imagePath: "/assets/cam_helmet.png",
        status: "Approved",
        annotatedBox: { x: 140, y: 90, width: 100, height: 105 },
        explainability: "Directional vector flow tracking indicates vehicle moving opposite to road vector standard layout.",
        state: "Karnataka",
        owner: "Suresh Gowda",
        chassis: "ME3SKX9827B91",
        emergencyFlag: false
    },
    {
        id: "VIO-8046",
        vehicleType: "Ambulance",
        plateNumber: "KA-51-AM-9110",
        violationType: "Illegal Parking",
        confidence: 0.99,
        timestamp: "2026-06-16T13:45:00Z",
        cameraId: "CAM-21",
        location: "Majestic Crossing Corridor",
        imagePath: "/assets/cam_parking.png",
        status: "Approved",
        annotatedBox: { x: 190, y: 120, width: 120, height: 130 },
        explainability: "Emergency Vehicle (Ambulance) identified. Signal priority override issued. Alerting lanes ahead.",
        state: "Karnataka",
        owner: "BGS Global Hospital",
        chassis: "MH2EMX1102A11",
        emergencyFlag: true
    },
    {
        id: "VIO-8047",
        vehicleType: "Two-Wheeler",
        plateNumber: "KA-03-MX-8891",
        violationType: "Red Light Violation",
        confidence: 0.97,
        timestamp: "2026-06-16T13:30:10Z",
        cameraId: "CAM-04",
        location: "Silk Board Junction",
        imagePath: "/assets/cam_helmet.png",
        status: "Approved",
        annotatedBox: { x: 130, y: 85, width: 95, height: 100 },
        explainability: "Rider crossed stop line during red signal cycle. Camera sensor triggered visual capture.",
        state: "Karnataka",
        owner: "Suresh Gowda",
        chassis: "ME3SKX9827B91",
        emergencyFlag: false
    }
];

const initialPatrols = [
    { name: "Officer Ramesh Gowda", vehicleId: "KA-03-G-110", status: "Available", distance: "0.8 km" },
    { name: "Officer Sunita Sen", vehicleId: "KA-01-G-954", status: "On Duty", distance: "2.1 km" },
    { name: "Officer Christopher D'Souza", vehicleId: "KA-51-G-228", status: "Available", distance: "1.4 km" }
];

// Helper to Read/Write JSON Fallback Data
function readJSONData(filePath, initialData) {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify(initialData, null, 2));
        return initialData;
    }
    try {
        return JSON.parse(fs.readFileSync(filePath, 'utf8'));
    } catch (e) {
        return initialData;
    }
}

function writeJSONData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// Initialize Fallback DB files if necessary
let localViolations = readJSONData(VIOLATIONS_FILE, initialViolations);
let localPatrols = readJSONData(DISPATCH_FILE, initialPatrols);

// Mongoose Schemas Definition
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
        x: Number,
        y: Number,
        width: Number,
        height: Number
    },
    explainability: String,
    state: String,
    owner: String,
    chassis: String,
    emergencyFlag: { type: Boolean, default: false }
});

const patrolSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true },
    vehicleId: { type: String, required: true },
    status: { type: String, required: true },
    distance: { type: String, required: true }
});

const Violation = mongoose.model('Violation', violationSchema);
const Patrol = mongoose.model('Patrol', patrolSchema);

// Connect to MongoDB Atlas with auto-seeding
mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('⚡ Connected to MongoDB successfully.');
        isUsingMongoDB = true;
        
        // Seed database if empty
        try {
            const violationCount = await Violation.countDocuments();
            if (violationCount === 0) {
                await Violation.insertMany(initialViolations);
                console.log('🌱 Seeded initial violations into MongoDB Atlas.');
            }
            const patrolCount = await Patrol.countDocuments();
            if (patrolCount === 0) {
                await Patrol.insertMany(initialPatrols);
                console.log('🌱 Seeded initial patrols into MongoDB Atlas.');
            }
        } catch (seedErr) {
            console.error('❌ Database seeding failed:', seedErr.message);
        }
    })
    .catch((err) => {
        console.warn('⚠️ MongoDB not accessible. Switching to local JSON fallback mode. Error:', err.message);
    });

// API 1: List all violations
app.get('/api/violations', async (req, res) => {
    if (isUsingMongoDB) {
        try {
            const dbViolations = await Violation.find().sort({ timestamp: -1 });
            return res.json(dbViolations);
        } catch (err) {
            console.error('MongoDB fetch error, falling back:', err.message);
        }
    }
    res.json(localViolations);
});

// API 2: Get specific violation detailed evidence
app.get('/api/violations/:id', async (req, res) => {
    if (isUsingMongoDB) {
        try {
            const dbViolation = await Violation.findOne({ id: req.params.id });
            if (dbViolation) {
                return res.json(dbViolation);
            }
        } catch (err) {
            console.error('MongoDB fetch detail error:', err.message);
        }
    }
    const violation = localViolations.find(v => v.id === req.params.id);
    if (!violation) {
        return res.status(404).json({ error: "Violation evidence not found" });
    }
    res.json(violation);
});

// API 3: Command Center Dashboard stats
app.get('/api/stats', async (req, res) => {
    let violationsList = localViolations;
    if (isUsingMongoDB) {
        try {
            violationsList = await Violation.find();
        } catch (err) {
            console.error('MongoDB stats fetch error:', err.message);
        }
    }

    const totalToday = violationsList.length + 3120; // Simulated offset
    const activeCams = 142;
    const avgAccuracy = 98.6;
    const pendingReviews = violationsList.filter(v => v.status === "Pending").length;
    
    // Violation distribution calculations
    const distribution = {};
    violationsList.forEach(v => {
        distribution[v.violationType] = (distribution[v.violationType] || 0) + 1;
    });

    res.json({
        totalToday,
        activeCams,
        avgAccuracy,
        pendingReviews,
        distribution
    });
});

// API 4: Risk scoring helper & API
async function calculateRiskScore(plateNumber) {
    let offenderViolations = [];
    if (isUsingMongoDB) {
        try {
            offenderViolations = await Violation.find({ plateNumber });
        } catch (err) {
            console.error('MongoDB offender risk query error:', err.message);
            offenderViolations = localViolations.filter(v => v.plateNumber === plateNumber);
        }
    } else {
        offenderViolations = localViolations.filter(v => v.plateNumber === plateNumber);
    }

    const count = offenderViolations.length;
    
    // Severity logic
    let severityScore = 0;
    offenderViolations.forEach(v => {
        if (["Wrong Side Driving", "Red Light Violation", "Triple Riding"].includes(v.violationType)) {
            severityScore += 25;
        } else {
            severityScore += 10;
        }
    });

    const score = Math.min(100, (count * 15) + severityScore);
    let category = "Low Risk";
    if (score > 80) category = "Critical";
    else if (score > 50) category = "High Risk";
    else if (score > 20) category = "Medium Risk";

    return {
        score,
        category,
        totalViolations: count,
        isRepeatOffender: count > 1
    };
}

app.get('/api/risk/:plate', async (req, res) => {
    const risk = await calculateRiskScore(req.params.plate);
    res.json(risk);
});

// API 5: Repeat offenders search and history
app.get('/api/offenders', async (req, res) => {
    let violationsList = localViolations;
    if (isUsingMongoDB) {
        try {
            violationsList = await Violation.find();
        } catch (err) {
            console.error('MongoDB offenders list query error:', err.message);
        }
    }

    const offenderMap = {};
    violationsList.forEach(v => {
        if (!offenderMap[v.plateNumber]) {
            offenderMap[v.plateNumber] = [];
        }
        offenderMap[v.plateNumber].push(v);
    });

    const list = await Promise.all(Object.keys(offenderMap).map(async (plate) => {
        const riskData = await calculateRiskScore(plate);
        return {
            plateNumber: plate,
            violations: offenderMap[plate],
            ...riskData
        };
    }));

    list.sort((a, b) => b.score - a.score);
    res.json(list);
});

// API 6: Review submission
app.post('/api/review', async (req, res) => {
    const { id, status, updatedPlate } = req.body;

    if (isUsingMongoDB) {
        try {
            const updateFields = { status };
            if (updatedPlate) {
                updateFields.plateNumber = updatedPlate;
            }
            const updatedViolation = await Violation.findOneAndUpdate(
                { id },
                { $set: updateFields },
                { new: true }
            );
            if (updatedViolation) {
                return res.json({ success: true, violation: updatedViolation });
            }
        } catch (err) {
            console.error('MongoDB update review error:', err.message);
        }
    }

    // Local JSON fallback
    const violation = localViolations.find(v => v.id === id);
    if (!violation) {
        return res.status(404).json({ error: "Violation not found" });
    }

    violation.status = status;
    if (updatedPlate) {
        violation.plateNumber = updatedPlate;
    }

    writeJSONData(VIOLATIONS_FILE, localViolations);
    res.json({ success: true, violation });
});

// API 7: Patrol Dispatch
app.post('/api/dispatch', async (req, res) => {
    const { officerName, status } = req.body;

    if (isUsingMongoDB) {
        try {
            const updatedPatrol = await Patrol.findOneAndUpdate(
                { name: officerName },
                { $set: { status } },
                { new: true }
            );
            if (updatedPatrol) {
                return res.json({ success: true, patrol: updatedPatrol });
            }
        } catch (err) {
            console.error('MongoDB patrol dispatch update error:', err.message);
        }
    }

    // Local JSON fallback
    const patrol = localPatrols.find(p => p.name === officerName);
    if (!patrol) {
        return res.status(404).json({ error: "Patrol officer not found" });
    }

    patrol.status = status;
    writeJSONData(DISPATCH_FILE, localPatrols);
    res.json({ success: true, patrol });
});

app.get('/api/patrols', async (req, res) => {
    if (isUsingMongoDB) {
        try {
            const dbPatrols = await Patrol.find();
            return res.json(dbPatrols);
        } catch (err) {
            console.error('MongoDB patrols query error:', err.message);
        }
    }
    res.json(localPatrols);
});

// API 8: Create / Submit violation (e.g. Citizen Complaint or AI detection)
app.post('/api/violations', async (req, res) => {
    const newVioData = req.body;
    if (isUsingMongoDB) {
        try {
            const dbViolation = new Violation(newVioData);
            await dbViolation.save();
            return res.json({ success: true, violation: dbViolation });
        } catch (err) {
            console.error('MongoDB save violation error:', err.message);
        }
    }

    // Local JSON fallback
    localViolations.unshift(newVioData);
    writeJSONData(VIOLATIONS_FILE, localViolations);
    res.json({ success: true, violation: newVioData });
});

app.listen(PORT, () => {
    console.log(`🚀 SmartVision X Backend Engine active on port ${PORT}`);
});

