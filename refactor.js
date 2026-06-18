const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
const dataPath = path.join(__dirname, 'frontend', 'src', 'data', 'mockData.js');

const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

const dataLines = lines.slice(14, 248);

const processedDataLines = dataLines.map(line => {
    if (line.startsWith('const ') && line.includes(' = ')) {
        return 'export ' + line;
    }
    return line;
});

fs.writeFileSync(dataPath, processedDataLines.join('\n'), 'utf8');

const importStatement = `import {
  AI_VIOLATION_TEMPLATES, AI_PLATES, AI_INSIGHTS_POOL, initialViolations,
  initialPatrols, CCTV_CAMERAS, STOLEN_PLATES, WEEKLY_REVENUE, COMPLIANCE_TREND,
  TICKER_ALERTS, HOURLY_VIOLATIONS, SIGNAL_JUNCTIONS
} from './data/mockData';\n`;

const newAppLines = [...lines.slice(0, 14), importStatement, ...lines.slice(248)];

fs.writeFileSync(appPath, newAppLines.join('\n'), 'utf8');

console.log('Data successfully extracted to mockData.js and imported in App.jsx using Node.js!');
