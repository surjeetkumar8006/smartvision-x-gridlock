const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'frontend', 'src');
const appPath = path.join(srcDir, 'App.jsx');
const pagesDir = path.join(srcDir, 'pages');
if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir);

const content = fs.readFileSync(appPath, 'utf8');
const lines = content.split('\n');

const tabs = [
  { id: 'command', name: 'CommandCenter' },
  { id: 'aibrain', name: 'AiBrain' },
  { id: 'cctv', name: 'CctvLiveGrid' },
  { id: 'violations', name: 'ViolationsCenter' },
  { id: 'analytics', name: 'Analytics' },
  { id: 'heatmap', name: 'CityHeatmap' },
  { id: 'offenders', name: 'OffendersDB' },
  { id: 'patrol', name: 'PatrolDispatch' },
  { id: 'predictive', name: 'PredictiveSafety' },
  { id: 'emergency', name: 'EmergencyOverride' },
  { id: 'syshealth', name: 'SystemHealth' },
  { id: 'config', name: 'SystemEngine' }
];

// All possible states and hooks that pages might need
const propsDestructure = `const {
  activeTab, setActiveTab, isDarkMode, setIsDarkMode, violations, setViolations,
  patrols, setPatrols, stats, setStats, selectedViolation, setSelectedViolation,
  roiPoints, setRoiPoints, simMode, setSimMode, statsSpeedMultiplier, setStatsSpeedMultiplier,
  showReceiptModal, setShowReceiptModal, complaintPlate, setComplaintPlate, complaintType, setComplaintType,
  complaintLocation, setComplaintLocation, searchTerm, setSearchTerm, filterType, setFilterType, filterRisk, setFilterRisk,
  yoloConfidence, setYoloConfidence, ocrSensitivity, setOcrSensitivity, irExposure, setIrExposure,
  offenderSearch, setOffenderSearch, alerts, setAlerts, toast, setToast, aiStreamActive, setAiStreamActive,
  voiceEnabled, setVoiceEnabled, autoChallanEnabled, setAutoChallanEnabled, autoChallanCount, setAutoChallanCount,
  autoChallanRevenue, setAutoChallanRevenue, liveInsightIdx, setLiveInsightIdx, newViolationBadge, setNewViolationBadge,
  aiLog, setAiLog, plateCheckerInput, setPlateCheckerInput, plateCheckerResult, setPlateCheckerResult,
  tickerIdx, setTickerIdx, selectedCam, setSelectedCam, timelinePlate, setTimelinePlate, insightTickerRef, violationIdCounterRef,
  CCTV_CAMERAS, SIGNAL_JUNCTIONS, WEEKLY_REVENUE, COMPLIANCE_TREND, HOURLY_VIOLATIONS, TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES
} = props;`;

const imports = `import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';
`;

let newAppLines = [];
let i = 0;
let insideTab = null;
let tabContentLines = [];
let braceCount = 0;

while (i < lines.length) {
    let line = lines[i];

    if (!insideTab) {
        // Check if a tab starts
        let foundTab = null;
        for (const tab of tabs) {
            if (line.includes(`{activeTab === '${tab.id}' && (`)) {
                foundTab = tab;
                break;
            }
        }

        if (foundTab) {
            insideTab = foundTab;
            braceCount = 1; // Count the opening (
            tabContentLines = [];
            // We replace this line with the Route tag in App.jsx
            newAppLines.push(`          <Route path="/${foundTab.id}" element={<${foundTab.name} {...sharedProps} />} />`);
        } else {
            newAppLines.push(line);
        }
    } else {
        // We are inside a tab block, extract its content
        // Count braces
        for (let char of line) {
            if (char === '(') braceCount++;
            else if (char === ')') braceCount--;
        }

        if (braceCount === 0 && line.trim() === ')}') {
            // End of tab
            const fileContent = `${imports}

export default function ${insideTab.name}(props) {
  ${propsDestructure}
  
  return (
    <>
${tabContentLines.join('\n')}
    </>
  );
}
`;
            fs.writeFileSync(path.join(pagesDir, `${insideTab.name}.jsx`), fileContent, 'utf8');
            insideTab = null;
        } else {
            tabContentLines.push(line);
        }
    }
    i++;
}

let finalAppContent = newAppLines.join('\n');

// 1. Add page imports to App.jsx
const pageImports = tabs.map(t => `import ${t.name} from './pages/${t.name}';`).join('\n');
finalAppContent = finalAppContent.replace("export default function App() {", `${pageImports}\nimport { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';\n\nexport default function App() {`);

// 2. Setup sharedProps
const sharedPropsDecl = `
  const sharedProps = {
    activeTab, setActiveTab, isDarkMode, setIsDarkMode, violations, setViolations,
    patrols, setPatrols, stats, setStats, selectedViolation, setSelectedViolation,
    roiPoints, setRoiPoints, simMode, setSimMode, statsSpeedMultiplier, setStatsSpeedMultiplier,
    showReceiptModal, setShowReceiptModal, complaintPlate, setComplaintPlate, complaintType, setComplaintType,
    complaintLocation, setComplaintLocation, searchTerm, setSearchTerm, filterType, setFilterType, filterRisk, setFilterRisk,
    yoloConfidence, setYoloConfidence, ocrSensitivity, setOcrSensitivity, irExposure, setIrExposure,
    offenderSearch, setOffenderSearch, alerts, setAlerts, toast, setToast, aiStreamActive, setAiStreamActive,
    voiceEnabled, setVoiceEnabled, autoChallanEnabled, setAutoChallanEnabled, autoChallanCount, setAutoChallanCount,
    autoChallanRevenue, setAutoChallanRevenue, liveInsightIdx, setLiveInsightIdx, newViolationBadge, setNewViolationBadge,
    aiLog, setAiLog, plateCheckerInput, setPlateCheckerInput, plateCheckerResult, setPlateCheckerResult,
    tickerIdx, setTickerIdx, selectedCam, setSelectedCam, timelinePlate, setTimelinePlate, insightTickerRef, violationIdCounterRef,
    CCTV_CAMERAS, SIGNAL_JUNCTIONS, WEEKLY_REVENUE, COMPLIANCE_TREND, HOURLY_VIOLATIONS, TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES
  };
`;
finalAppContent = finalAppContent.replace("const [timelinePlate, setTimelinePlate] = useState('KA-03-MX-8891');", `const [timelinePlate, setTimelinePlate] = useState('KA-03-MX-8891');\n${sharedPropsDecl}`);

// 3. Setup Routes container
finalAppContent = finalAppContent.replace(`<main className="flex-1 bg-[#0a0d14] p-6 overflow-y-auto no-scrollbar relative z-10">`, `<main className="flex-1 bg-[#0a0d14] p-6 overflow-y-auto no-scrollbar relative z-10">\n        <Routes>\n          <Route path="/" element={<Navigate to="/command" replace />} />`);
finalAppContent = finalAppContent.replace(`</main>`, `        </Routes>\n      </main>`);

// 4. Update setActiveTab to use navigate
finalAppContent = finalAppContent.replace(/const \[activeTab, setActiveTab\] = useState\('command'\);/g, `const navigate = useNavigate();\n  const location = useLocation();\n  const activeTab = location.pathname.length > 1 ? location.pathname.substring(1) : 'command';\n  const setActiveTab = (id) => navigate('/' + id);`);

// 5. Provide missing mock data imports to App.jsx since we passed them in sharedProps
finalAppContent = finalAppContent.replace("import {\n  AI_VIOLATION_TEMPLATES", "import {\n  CCTV_CAMERAS, SIGNAL_JUNCTIONS, WEEKLY_REVENUE, COMPLIANCE_TREND, HOURLY_VIOLATIONS, TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES,\n  AI_VIOLATION_TEMPLATES");

fs.writeFileSync(appPath, finalAppContent, 'utf8');
console.log("App split into pages successfully!");
