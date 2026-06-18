const fs = require('fs');
const path = require('path');

const baseDir = path.join(__dirname, 'backend');

// Helper to write files
function writeFile(subPath, content) {
    fs.writeFileSync(path.join(baseDir, subPath), content, 'utf8');
}

// 1. config/db.js
writeFile('config/db.js', `const mongoose = require('mongoose');

const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/smartvision_x';

const connectDB = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('⚡ Connected to MongoDB Atlas successfully.');
        return true;
    } catch (err) {
        console.warn('⚠️ MongoDB not accessible. Switching to local JSON fallback mode. Error:', err.message);
        return false;
    }
};

module.exports = connectDB;
`);

// 2. models/Violation.js
writeFile('models/Violation.js', `const mongoose = require('mongoose');

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
`);

// 3. models/Patrol.js
writeFile('models/Patrol.js', `const mongoose = require('mongoose');

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
`);

// 4. services/fallbackService.js
writeFile('services/fallbackService.js', `const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');
if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR);
}

const VIOLATIONS_FILE = path.join(DATA_DIR, 'violations.json');
const DISPATCH_FILE = path.join(DATA_DIR, 'dispatch.json');

function readJSONData(filePath, defaultData) {
    if (fs.existsSync(filePath)) {
        try {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        } catch (err) {
            console.error('Error reading JSON file:', filePath);
        }
    }
    fs.writeFileSync(filePath, JSON.stringify(defaultData, null, 2));
    return defaultData;
}

function writeJSONData(filePath, data) {
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

let localViolations = [];
let localPatrols = [];

// Fallback logic requires initializing with default mock data if missing, we assume app will seed it or just use empty arrays
// For simplicity, we just export getters and setters
module.exports = {
    getViolations: () => readJSONData(VIOLATIONS_FILE, []),
    saveViolations: (data) => writeJSONData(VIOLATIONS_FILE, data),
    getPatrols: () => readJSONData(DISPATCH_FILE, []),
    savePatrols: (data) => writeJSONData(DISPATCH_FILE, data)
};
`);

// 5. services/violationService.js
writeFile('services/violationService.js', `const Violation = require('../models/Violation');
const fallback = require('./fallbackService');

let isUsingMongoDB = false;

module.exports = {
    setMongoStatus: (status) => { isUsingMongoDB = status; },
    
    getAll: async () => {
        if (isUsingMongoDB) {
            try { return await Violation.find().sort({ timestamp: -1 }); } 
            catch (e) { console.error('MongoDB fallback:', e); }
        }
        return fallback.getViolations();
    },

    getById: async (id) => {
        if (isUsingMongoDB) {
            try { return await Violation.findOne({ id }); } 
            catch (e) { console.error('MongoDB fallback:', e); }
        }
        return fallback.getViolations().find(v => v.id === id);
    },

    create: async (data) => {
        if (isUsingMongoDB) {
            try {
                const newVio = new Violation(data);
                await newVio.save();
                return newVio;
            } catch (e) { console.error('MongoDB fallback:', e); }
        }
        const list = fallback.getViolations();
        list.unshift(data);
        fallback.saveViolations(list);
        return data;
    },

    updateReview: async (id, status, updatedPlate) => {
        if (isUsingMongoDB) {
            try {
                const fields = { status };
                if (updatedPlate) fields.plateNumber = updatedPlate;
                return await Violation.findOneAndUpdate({ id }, { $set: fields }, { new: true });
            } catch (e) { console.error('MongoDB fallback:', e); }
        }
        const list = fallback.getViolations();
        const v = list.find(v => v.id === id);
        if (v) {
            v.status = status;
            if (updatedPlate) v.plateNumber = updatedPlate;
            fallback.saveViolations(list);
        }
        return v;
    },

    calculateRiskScore: async (plateNumber) => {
        let offenderViolations = [];
        if (isUsingMongoDB) {
            try { offenderViolations = await Violation.find({ plateNumber }); } 
            catch (e) { offenderViolations = fallback.getViolations().filter(v => v.plateNumber === plateNumber); }
        } else {
            offenderViolations = fallback.getViolations().filter(v => v.plateNumber === plateNumber);
        }

        const count = offenderViolations.length;
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

        return { score, category, totalViolations: count, isRepeatOffender: count > 1 };
    }
};
`);

// 6. services/patrolService.js
writeFile('services/patrolService.js', `const Patrol = require('../models/Patrol');
const fallback = require('./fallbackService');

let isUsingMongoDB = false;

module.exports = {
    setMongoStatus: (status) => { isUsingMongoDB = status; },
    
    getAll: async () => {
        if (isUsingMongoDB) {
            try { return await Patrol.find(); } 
            catch (e) { console.error('MongoDB fallback:', e); }
        }
        return fallback.getPatrols();
    },

    updateStatus: async (name, status) => {
        if (isUsingMongoDB) {
            try {
                return await Patrol.findOneAndUpdate({ name }, { $set: { status } }, { new: true });
            } catch (e) { console.error('MongoDB fallback:', e); }
        }
        const list = fallback.getPatrols();
        const p = list.find(p => p.name === name);
        if (p) {
            p.status = status;
            fallback.savePatrols(list);
        }
        return p;
    }
};
`);

// 7. controllers/violationController.js
writeFile('controllers/violationController.js', `const violationService = require('../services/violationService');

exports.getViolations = async (req, res) => {
    const data = await violationService.getAll();
    res.json(data);
};

exports.getViolationById = async (req, res) => {
    const data = await violationService.getById(req.params.id);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json(data);
};

exports.createViolation = async (req, res) => {
    const data = await violationService.create(req.body);
    res.json({ success: true, violation: data });
};

exports.reviewViolation = async (req, res) => {
    const { id, status, updatedPlate } = req.body;
    const data = await violationService.updateReview(id, status, updatedPlate);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, violation: data });
};

exports.getRiskScore = async (req, res) => {
    const data = await violationService.calculateRiskScore(req.params.plate);
    res.json(data);
};

exports.getOffenders = async (req, res) => {
    const violationsList = await violationService.getAll();
    const offenderMap = {};
    violationsList.forEach(v => {
        if (!offenderMap[v.plateNumber]) offenderMap[v.plateNumber] = [];
        offenderMap[v.plateNumber].push(v);
    });

    const list = await Promise.all(Object.keys(offenderMap).map(async (plate) => {
        const riskData = await violationService.calculateRiskScore(plate);
        return { plateNumber: plate, violations: offenderMap[plate], ...riskData };
    }));

    list.sort((a, b) => b.score - a.score);
    res.json(list);
};
`);

// 8. controllers/patrolController.js
writeFile('controllers/patrolController.js', `const patrolService = require('../services/patrolService');

exports.getPatrols = async (req, res) => {
    const data = await patrolService.getAll();
    res.json(data);
};

exports.dispatchPatrol = async (req, res) => {
    const { officerName, status } = req.body;
    const data = await patrolService.updateStatus(officerName, status);
    if (!data) return res.status(404).json({ error: 'Not found' });
    res.json({ success: true, patrol: data });
};
`);

// 9. controllers/statsController.js
writeFile('controllers/statsController.js', `const violationService = require('../services/violationService');

exports.getStats = async (req, res) => {
    const violationsList = await violationService.getAll();
    const totalToday = violationsList.length + 3120; 
    const activeCams = 142;
    const avgAccuracy = 98.6;
    const pendingReviews = violationsList.filter(v => v.status === "Pending").length;
    
    const distribution = {};
    violationsList.forEach(v => {
        distribution[v.violationType] = (distribution[v.violationType] || 0) + 1;
    });

    res.json({ totalToday, activeCams, avgAccuracy, pendingReviews, distribution });
};
`);

// 10. routes/violationRoutes.js
writeFile('routes/violationRoutes.js', `const express = require('express');
const router = express.Router();
const controller = require('../controllers/violationController');

router.get('/', controller.getViolations);
router.post('/', controller.createViolation);
router.get('/:id', controller.getViolationById);
router.post('/review', controller.reviewViolation); // Technically should be on /:id but matching previous API

module.exports = router;
`);

// 11. routes/patrolRoutes.js
writeFile('routes/patrolRoutes.js', `const express = require('express');
const router = express.Router();
const controller = require('../controllers/patrolController');

router.get('/', controller.getPatrols);
router.post('/dispatch', controller.dispatchPatrol);

module.exports = router;
`);

// 12. routes/statsRoutes.js
writeFile('routes/statsRoutes.js', `const express = require('express');
const router = express.Router();
const violationController = require('../controllers/violationController');
const patrolController = require('../controllers/patrolController');
const statsController = require('../controllers/statsController');

router.get('/stats', statsController.getStats);
router.get('/risk/:plate', violationController.getRiskScore);
router.get('/offenders', violationController.getOffenders);

module.exports = router;
`);

// 13. server.js (Main Entry)
writeFile('server.js', `require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');

// Import services to set MongoDB status flag globally
const violationService = require('./services/violationService');
const patrolService = require('./services/patrolService');

// Import routes
const violationRoutes = require('./routes/violationRoutes');
const patrolRoutes = require('./routes/patrolRoutes');
const statsRoutes = require('./routes/statsRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Register Routes
app.use('/api/violations', violationRoutes);
app.use('/api/patrols', patrolRoutes);
app.use('/api', statsRoutes); // Contains /stats, /risk/:plate, /offenders

// Initialize App
connectDB().then((isConnected) => {
    violationService.setMongoStatus(isConnected);
    patrolService.setMongoStatus(isConnected);
    
    app.listen(PORT, () => {
        console.log(\`🚀 SmartVision X Backend Engine (MVC) active on port \${PORT}\`);
    });
});
`);

console.log("MVC Refactoring complete.");
