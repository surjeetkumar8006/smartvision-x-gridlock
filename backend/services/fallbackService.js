const fs = require('fs');
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
