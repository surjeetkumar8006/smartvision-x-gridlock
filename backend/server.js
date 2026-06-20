require('dotenv').config();
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
const cvRoutes = require('./routes/cvRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use('/assets', express.static(path.join(__dirname, 'assets')));

// Register Routes
app.use('/api/violations', violationRoutes);
app.use('/api/patrols', patrolRoutes);
app.use('/api', statsRoutes); // Contains /stats, /risk/:plate, /offenders
app.use('/api/cv', cvRoutes);

// Initialize App
connectDB().then((isConnected) => {
    violationService.setMongoStatus(isConnected);
    patrolService.setMongoStatus(isConnected);
    
    app.listen(PORT, () => {
        console.log(`🚀 SmartVision X Backend Engine (MVC) active on port ${PORT}`);
    });
});
