const fs = require('fs');
const path = require('path');

const missingProps = [
  "sysHealth", "setSysHealth", "signals", "setSignals", "emergencyVehicle", "setEmergencyVehicle",
  "emergencyRoute", "setEmergencyRoute", "showCourtNotice", "setShowCourtNotice", "courtNoticePlate", "setCourtNoticePlate",
  "showWhatsApp", "setShowWhatsApp", "whatsAppChallan", "setWhatsAppChallan", "showFIR", "setShowFIR",
  "firPlate", "setFirPlate", "cityScore", "setCityScore", "speedData", "setSpeedData",
  "triggerToast", "speakAlert", "sendDesktopNotification", "handlePlateCheck", "handleSimChange",
  "handleReview", "handleDispatch", "getRiskScore", "getAIRecommendation", "handleCitizenComplaintSubmit",
  "dailyData", "distributionData", "prCurveData", "COLORS", "filteredViolations"
].join(', ');

// 1. Fix App.jsx
const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let appContent = fs.readFileSync(appPath, 'utf8');

// The sharedProps declaration ends with STOLEN_PLATES
appContent = appContent.replace(
  'TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES',
  `TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES,\n    ${missingProps}`
);
fs.writeFileSync(appPath, appContent, 'utf8');

// 2. Fix all pages
const pagesDir = path.join(__dirname, 'frontend', 'src', 'pages');
const files = fs.readdirSync(pagesDir);

for (const file of files) {
  if (!file.endsWith('.jsx')) continue;
  const filePath = path.join(pagesDir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(
    'TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES',
    `TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES,\n  ${missingProps}`
  );
  
  fs.writeFileSync(filePath, content, 'utf8');
}

console.log('Props fixed!');
