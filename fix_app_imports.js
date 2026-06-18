const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

const injectedString = ',\n    sysHealth, setSysHealth, signals, setSignals, emergencyVehicle, setEmergencyVehicle, emergencyRoute, setEmergencyRoute, showCourtNotice, setShowCourtNotice, courtNoticePlate, setCourtNoticePlate, showWhatsApp, setShowWhatsApp, whatsAppChallan, setWhatsAppChallan, showFIR, setShowFIR, firPlate, setFirPlate, cityScore, setCityScore, speedData, setSpeedData, triggerToast, speakAlert, sendDesktopNotification, handlePlateCheck, handleSimChange, handleReview, handleDispatch, getRiskScore, getAIRecommendation, handleCitizenComplaintSubmit, dailyData, distributionData, prCurveData, COLORS, filteredViolations';

// It was injected right after STOLEN_PLATES
content = content.replace(injectedString, '');

fs.writeFileSync(appPath, content, 'utf8');
console.log('Fixed imports in App.jsx');
