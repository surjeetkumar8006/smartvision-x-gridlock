import React, { useState, useEffect, useRef, useCallback } from 'react';
import { 
  Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, 
  Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, 
  Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, 
  EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon,
  Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight
} from 'lucide-react';
import { 
  ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, 
  XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend,
  CartesianGrid
} from 'recharts';

import {
  AI_VIOLATION_TEMPLATES, AI_PLATES, AI_INSIGHTS_POOL, initialViolations,
  initialPatrols, CCTV_CAMERAS, STOLEN_PLATES, WEEKLY_REVENUE, COMPLIANCE_TREND,
  TICKER_ALERTS, HOURLY_VIOLATIONS, SIGNAL_JUNCTIONS
} from './data/mockData';

export default function App() {
  const [activeTab, setActiveTab] = useState('command');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [violations, setViolations] = useState(initialViolations);
  const [patrols, setPatrols] = useState(initialPatrols);
  const [stats, setStats] = useState({ totalToday: 3443, activeCams: 142, avgAccuracy: 98.6, pendingReviews: 3 });
  const [selectedViolation, setSelectedViolation] = useState(initialViolations[0]);
  const [roiPoints, setRoiPoints] = useState([]);
  
  // Weather / traffic sim modes
  const [simMode, setSimMode] = useState('clear');
  const [statsSpeedMultiplier, setStatsSpeedMultiplier] = useState(1);

  // E-Challan receipt preview modal
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  // Citizen Complaint
  const [complaintPlate, setComplaintPlate] = useState('');
  const [complaintType, setComplaintType] = useState('Helmet Non Compliance');
  const [complaintLocation, setComplaintLocation] = useState('Silk Board Junction');

  // Search & Filters state
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterRisk, setFilterRisk] = useState('all');

  // AI Config parameters
  const [yoloConfidence, setYoloConfidence] = useState(0.85);
  const [ocrSensitivity, setOcrSensitivity] = useState(0.90);
  const [irExposure, setIrExposure] = useState(true);

  // Repeat Offender Search
  const [offenderSearch, setOffenderSearch] = useState('');
  
  // Dynamic alerts
  const [alerts, setAlerts] = useState([
    { id: 1, text: "Critical: Multiple seatbelt violations flagged at CAM-15 (MG Road)", type: "warning" },
    { id: 2, text: "System Alert: CAM-22 re-connected to central cluster", type: "info" }
  ]);

  // Toast
  const [toast, setToast] = useState(null);

  // ─── AI AUTO-INTELLIGENCE STATE ───────────────────────────────────────────
  const [aiStreamActive, setAiStreamActive] = useState(true);       // auto violation stream on/off
  const [voiceEnabled, setVoiceEnabled] = useState(true);            // browser TTS — ON by default
  const [autoChallanEnabled, setAutoChallanEnabled] = useState(true); // auto-process bot
  const [autoChallanCount, setAutoChallanCount] = useState(0);        // total auto-processed
  const [autoChallanRevenue, setAutoChallanRevenue] = useState(0);    // total revenue
  const [liveInsightIdx, setLiveInsightIdx] = useState(0);            // rotating insight index
  const [newViolationBadge, setNewViolationBadge] = useState(null);   // flash badge for new violation
  const [aiLog, setAiLog] = useState([                                // AI Brain activity log
    { ts: new Date().toLocaleTimeString(), msg: "AI Engine initialised. YOLOv8 + EasyOCR pipeline online.",    type: "info"    },
    { ts: new Date().toLocaleTimeString(), msg: "Connected to 142 CCTV nodes across Bengaluru city grid.",      type: "success" },
    { ts: new Date().toLocaleTimeString(), msg: "Auto-Challan Bot armed. Monitoring confidence threshold ≥ 92%.", type: "bot"  },
  ]);
  const insightTickerRef = useRef(null);
  const violationIdCounterRef = useRef(8048);

  // Plate Checker
  const [plateCheckerInput, setPlateCheckerInput] = useState('');
  const [plateCheckerResult, setPlateCheckerResult] = useState(null);

  // Bottom Ticker
  const [tickerIdx, setTickerIdx] = useState(0);

  // CCTV selected cam
  const [selectedCam, setSelectedCam] = useState(CCTV_CAMERAS[0]);

  // Vehicle timeline plate
  const [timelinePlate, setTimelinePlate] = useState('KA-03-MX-8891');

  // ─── API SYNCHRONISATION LOOP (every 5s) ──────────────────────────────────
  useEffect(() => {
    const fetchApiData = async () => {
      try {
        const vioRes = await fetch('http://localhost:5000/api/violations');
        if (vioRes.ok) {
          const data = await vioRes.json();
          setViolations(data);
          
          setSelectedViolation(prev => {
            if (!prev) return data[0];
            const updated = data.find(v => v.id === prev.id);
            return updated || data[0];
          });
        }

        const patrolRes = await fetch('http://localhost:5000/api/patrols');
        if (patrolRes.ok) {
          const data = await patrolRes.json();
          setPatrols(data);
        }

        const statsRes = await fetch('http://localhost:5000/api/stats');
        if (statsRes.ok) {
          const data = await statsRes.json();
          setStats(data);
        }
      } catch (err) {
        console.warn('API Sync failed, running in local fallback mode.', err.message);
      }
    };

    fetchApiData();
    const interval = setInterval(fetchApiData, 5000);
    return () => clearInterval(interval);
  }, []);

  // System Health (animated values)
  const [sysHealth, setSysHealth] = useState({ cpu: 38, gpu: 71, ram: 54, disk: 29, temp: 62, net: 88 });

  // Signal Override
  const [signals, setSignals] = useState(SIGNAL_JUNCTIONS);
  const [emergencyVehicle, setEmergencyVehicle] = useState('');
  const [emergencyRoute, setEmergencyRoute] = useState('');

  // Court Notice
  const [showCourtNotice, setShowCourtNotice] = useState(false);
  const [courtNoticePlate, setCourtNoticePlate] = useState('');

  // WhatsApp Challan Preview
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [whatsAppChallan, setWhatsAppChallan] = useState(null);

  // FIR Generator
  const [showFIR, setShowFIR] = useState(false);
  const [firPlate, setFirPlate] = useState('');

  // City Compliance Score (animated)
  const [cityScore, setCityScore] = useState(73);

  // Speed Radar data
  const [speedData, setSpeedData] = useState([
    { cam: 'CAM-04', loc: 'Silk Board Jn',  speed: 58, limit: 50, veh: 'KA-03-MX-8891', violation: true  },
    { cam: 'CAM-08', loc: 'Koramangala',    speed: 42, limit: 50, veh: 'KA-09-FX-2281', violation: false },
    { cam: 'CAM-12', loc: 'Indiranagar',    speed: 67, limit: 50, veh: 'MH-12-AB-3301', violation: true  },
    { cam: 'CAM-15', loc: 'MG Road',        speed: 38, limit: 50, veh: 'KA-01-BZ-9934', violation: false },
    { cam: 'CAM-21', loc: 'Majestic',       speed: 71, limit: 50, veh: 'TN-09-CC-5512', violation: true  },
  ]);

  const triggerToast = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  // ─── SYSTEM HEALTH TICKER (every 3s) ─────────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setSysHealth({
        cpu:  Math.min(95, Math.max(15, 38 + (Math.random() - 0.5) * 20)),
        gpu:  Math.min(99, Math.max(55, 71 + (Math.random() - 0.5) * 18)),
        ram:  Math.min(90, Math.max(40, 54 + (Math.random() - 0.5) * 12)),
        disk: Math.min(60, Math.max(20, 29 + (Math.random() - 0.5) * 8)),
        temp: Math.min(85, Math.max(48, 62 + (Math.random() - 0.5) * 10)),
        net:  Math.min(100, Math.max(70, 88 + (Math.random() - 0.5) * 12)),
      });
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // ─── CITY SCORE + SPEED RADAR TICKER (every 5s) ─────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setCityScore(s => Math.min(85, Math.max(60, s + (Math.random() - 0.5) * 3)));
      setSpeedData(prev => prev.map(d => {
        const newSpeed = Math.min(95, Math.max(25, d.speed + (Math.random() - 0.5) * 15));
        return { ...d, speed: Math.round(newSpeed), violation: newSpeed > 50 };
      }));
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  // ─── AI VOICE ANNOUNCER ───────────────────────────────────────────────────
  const speakAlert = useCallback((text) => {
    if (!voiceEnabled || !window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utt = new SpeechSynthesisUtterance(text);
    utt.lang = 'en-IN';
    utt.rate = 0.95;
    utt.pitch = 1.05;
    utt.volume = 1;
    window.speechSynthesis.speak(utt);
  }, [voiceEnabled]);

  // ─── STARTUP VOICE GREETING + NOTIFICATION PERMISSION ────────────────────
  useEffect(() => {
    // Request browser desktop notification permission
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
    // Speak startup greeting after 1.5s (lets browser TTS load)
    const timer = setTimeout(() => {
      if (window.speechSynthesis) {
        const utt = new SpeechSynthesisUtterance(
          'SmartVision X AI engine online. Monitoring 142 cameras across Bengaluru. Auto-Challan bot is armed and ready.'
        );
        utt.lang = 'en-IN';
        utt.rate = 0.92;
        utt.pitch = 1.05;
        utt.volume = 1;
        window.speechSynthesis.speak(utt);
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, []); // runs once on mount

  // ─── BROWSER DESKTOP NOTIFICATION helper ─────────────────────────────────
  const sendDesktopNotification = useCallback((title, body) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, { body, icon: '/favicon.ico' });
    }
  }, []);

  // ─── AI AUTO VIOLATION STREAM (every 18s) ────────────────────────────────
  useEffect(() => {
    if (!aiStreamActive) return;
    const interval = setInterval(() => {
      const template = AI_VIOLATION_TEMPLATES[Math.floor(Math.random() * AI_VIOLATION_TEMPLATES.length)];
      const plate = AI_PLATES[Math.floor(Math.random() * AI_PLATES.length)];
      const now = new Date();
      const newVio = {
        ...template,
        id: `VIO-${violationIdCounterRef.current++}`,
        plateNumber: plate,
        timestamp: now.toISOString(),
        status: 'Pending',
        owner: 'Auto Detected',
        chassis: 'AI-SCAN-AUTO',
      };
      setViolations(prev => [newVio, ...prev.slice(0, 29)]);
      setSelectedViolation(newVio);
      setNewViolationBadge(newVio);
      
      // Save simulated violation to live database backend
      fetch('http://localhost:5000/api/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newVio)
      }).catch(err => console.warn('Live API auto violation submit failed:', err.message));

      setTimeout(() => setNewViolationBadge(null), 4000);
      const logMsg = `New violation detected: ${newVio.violationType} at ${newVio.location.split(',')[0]} — Plate: ${plate}`;
      setAiLog(prev => [{ ts: now.toLocaleTimeString(), msg: logMsg, type: 'detect' }, ...prev.slice(0, 49)]);
      speakAlert(`Alert! ${newVio.violationType} detected at ${newVio.location.split(',')[0]}. Plate number ${plate}.`);
      sendDesktopNotification(
        `🚨 AI Violation Detected: ${newVio.violationType}`,
        `Plate: ${plate} at ${newVio.location.split(',')[0]} — Confidence: ${(newVio.confidence * 100).toFixed(0)}%`
      );
      setStats(prev => ({ ...prev, totalToday: prev.totalToday + 1, pendingReviews: prev.pendingReviews + 1 }));
    }, 18000);
    return () => clearInterval(interval);
  }, [aiStreamActive, speakAlert]);

  // ─── AUTO-CHALLAN BOT (every 25s) ────────────────────────────────────────
  useEffect(() => {
    if (!autoChallanEnabled) return;
    const interval = setInterval(() => {
      setViolations(prev => {
        const pending = prev.filter(v => v.status === 'Pending' && v.confidence >= 0.92);
        if (pending.length === 0) return prev;
        const target = pending[0];
        const fineAmt = 500;
        setAutoChallanCount(c => c + 1);
        setAutoChallanRevenue(r => r + fineAmt);
        const now = new Date();
        setAiLog(log => [
          { ts: now.toLocaleTimeString(), msg: `✅ Auto-Challan issued for ${target.id} (${target.violationType}) — Plate: ${target.plateNumber} — ₹${fineAmt}`, type: 'bot' },
          ...log.slice(0, 49)
        ]);
        speakAlert(`Auto challan of rupees 500 issued for ${target.violationType} on vehicle ${target.plateNumber}. Notification sent to offender.`);
        sendDesktopNotification(
          `✅ AutoChallan Issued — ₹${fineAmt}`,
          `${target.violationType} | ${target.plateNumber} | ${target.location.split(',')[0]}`
        );
        return prev.map(v => v.id === target.id ? { ...v, status: 'Approved' } : v);
      });
    }, 25000);
    return () => clearInterval(interval);
  }, [autoChallanEnabled, speakAlert]);

  // ─── LIVE AI INSIGHT TICKER (every 7s) ───────────────────────────────────
  useEffect(() => {
    const interval = setInterval(() => {
      setLiveInsightIdx(i => (i + 1) % AI_INSIGHTS_POOL.length);
      setTickerIdx(i => (i + 1) % TICKER_ALERTS.length);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  // ─── STOLEN PLATE CHECKER LOGIC ───────────────────────────────────────────────
  const handlePlateCheck = () => {
    if (!plateCheckerInput.trim()) return;
    const normalized = plateCheckerInput.toUpperCase().replace(/\s/g, '-');
    const stolen = STOLEN_PLATES.find(s => s.plate === normalized);
    const violations = initialViolations.filter(v => v.plateNumber === normalized);
    if (stolen) {
      setPlateCheckerResult({ type: 'stolen', data: stolen, violations });
      speakAlert(`Warning! Plate ${normalized} is flagged. ${stolen.reason}`);
    } else if (violations.length > 0) {
      setPlateCheckerResult({ type: 'violations', violations });
      speakAlert(`Plate ${normalized} has ${violations.length} recorded violations in the system.`);
    } else {
      setPlateCheckerResult({ type: 'clean' });
      speakAlert(`Plate ${normalized} is clear. No violations or alerts found.`);
    }
  };

  // ─── PERIODIC AI LOG HEARTBEAT (every 30s) ───────────────────────────────
  useEffect(() => {
    const heartbeats = [
      "AI Engine heartbeat OK — 142 cameras responding normally.",
      "Precision-Recall check passed: mAP@0.5 = 0.941.",
      "OCR pipeline scanned 840 plates in last 30 seconds.",
      "City-wide helmet compliance rate: 73.4% (up 2.1% vs yesterday).",
      "GPU inference latency: 12ms avg across all edge nodes.",
    ];
    let idx = 0;
    const interval = setInterval(() => {
      const now = new Date();
      setAiLog(prev => [{ ts: now.toLocaleTimeString(), msg: heartbeats[idx % heartbeats.length], type: 'info' }, ...prev.slice(0, 49)]);
      idx++;
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  // Body theme
  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.remove('light-theme');
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
      document.body.classList.add('light-theme');
    }
  }, [isDarkMode]);

  // Ingestion speed logic
  useEffect(() => {
    const interval = setInterval(() => {
      setStats(prev => ({
        ...prev,
        totalToday: prev.totalToday + (Math.floor(Math.random() * 2) + 1) * statsSpeedMultiplier
      }));
    }, 6000);
    return () => clearInterval(interval);
  }, [statsSpeedMultiplier]);

  // Handle Simulation toggles
  const handleSimChange = (mode) => {
    setSimMode(mode);
    if (mode === 'monsoon') {
      setStats(prev => ({ ...prev, avgAccuracy: 84.1 }));
      setStatsSpeedMultiplier(1);
      setAlerts(prev => [{ id: Date.now(), text: "Monsoon Mode: Heavy rain lowering cam visibility at KR Puram flyover. Noise levels spiking.", type: "warning" }, ...prev]);
      triggerToast("Monsoon weather simulation active. Camera accuracy adjusted.");
    } else if (mode === 'night') {
      setStats(prev => ({ ...prev, avgAccuracy: 93.4 }));
      setStatsSpeedMultiplier(1);
      setAlerts(prev => [{ id: Date.now(), text: "Night Mode: IR pre-processors deployed. Exposure boosted at MG Road.", type: "info" }, ...prev]);
      triggerToast("Night lighting simulation active. Exposure filters engaged.");
    } else if (mode === 'rush') {
      setStats(prev => ({ ...prev, avgAccuracy: 98.6 }));
      setStatsSpeedMultiplier(3);
      setAlerts(prev => [{ id: Date.now(), text: "Rush Hour Alert: Flow count exceeding thresholds at Silk Board Junction.", type: "warning" }, ...prev]);
      triggerToast("Peak rush hour traffic simulated. Detection rates tripled!");
    } else {
      setStats(prev => ({ ...prev, avgAccuracy: 98.6 }));
      setStatsSpeedMultiplier(1);
      triggerToast("Weather & Traffic simulations reset to standard daytime settings.");
    }
  };

  const handleReview = async (id, status, updatedPlate, feedbackMsg) => {
    // Optimistic local update
    setViolations(prev => prev.map(v => v.id === id ? { 
      ...v, 
      status, 
      plateNumber: updatedPlate || v.plateNumber,
      explainability: feedbackMsg ? `${v.explainability} [Feedback: ${feedbackMsg}]` : v.explainability
    } : v));

    if (selectedViolation && selectedViolation.id === id) {
      setSelectedViolation(prev => ({ 
        ...prev, 
        status, 
        plateNumber: updatedPlate || prev.plateNumber,
        explainability: feedbackMsg ? `${prev.explainability} [Feedback: ${feedbackMsg}]` : prev.explainability
      }));
    }

    try {
      const response = await fetch('http://localhost:5000/api/review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status, updatedPlate, feedbackMsg })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          triggerToast(`Case ${id} reviewed live. Decision: ${status}`);
          return;
        }
      }
    } catch (err) {
      console.warn('Live API review update failed, fell back to local memory.', err.message);
    }
    triggerToast(`Case ${id} reviewed. Decision: ${status}`);
  };

  const handleDispatch = async (officerName, action) => {
    const nextStatus = action === 'dispatch' ? 'On Duty' : 'Available';
    
    // Optimistic local update
    setPatrols(prev => prev.map(p => p.name === officerName ? { ...p, status: nextStatus } : p));

    try {
      const response = await fetch('http://localhost:5000/api/dispatch', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ officerName, status: nextStatus })
      });
      if (response.ok) {
        const resData = await response.json();
        if (resData.success) {
          triggerToast(`${officerName} dispatched live.`);
          return;
        }
      }
    } catch (err) {
      console.warn('Live API dispatch failed, fell back to local memory.', err.message);
    }
    triggerToast(`${officerName} dispatched.`);
  };

  const getRiskScore = (plate) => {
    const offenderViolations = violations.filter(v => v.plateNumber === plate);
    const count = offenderViolations.length;
    let score = count * 23;
    if (score > 100) score = 100;

    let category = "Low Risk";
    let color = "text-green-400";
    if (score > 80) { category = "Critical"; color = "text-rose-500"; }
    else if (score > 50) { category = "High Risk"; color = "text-orange-500"; }
    else if (score > 20) { category = "Medium Risk"; color = "text-yellow-400"; }

    return { score, category, color, count };
  };

  const getAIRecommendation = (confidence, riskScore) => {
    if (confidence > 0.94 && riskScore < 50) return { action: "Auto Challan", detail: "High AI confidence, low offender risk. Auto processing dispatched." };
    if (riskScore >= 80) return { action: "Dispatch Patrol Unit", detail: "Critical offender alert. Local dispatch recommended." };
    if (confidence < 0.90) return { action: "Manual Review", detail: "Low confidence detection. Inspector verification required." };
    return { action: "Warning Notice", detail: "Moderate severity first-time offense warning issued." };
  };

  const handleCitizenComplaintSubmit = async (e) => {
    e.preventDefault();
    if (!complaintPlate) return;
    const newId = `VIO-${Math.floor(8000 + Math.random() * 1000)}`;
    const timestamp = new Date().toISOString();
    const newViolation = {
      id: newId,
      vehicleType: "Unknown",
      plateNumber: complaintPlate,
      violationType: complaintType,
      confidence: 0.92,
      timestamp,
      cameraId: "CITIZEN-UPLOADER",
      location: complaintLocation,
      imagePath: "/assets/cam_helmet.png",
      status: "Pending",
      annotatedBox: { x: 150, y: 150, width: 100, height: 100 },
      explainability: `Reported via BTP Citizen safety app portal. Plate detected ${complaintPlate}.`,
      state: "Karnataka",
      owner: "Citizen Complaint",
      chassis: "MC4PX29931D",
      emergencyFlag: false
    };

    // Optimistic local update
    setViolations(prev => [newViolation, ...prev]);
    setSelectedViolation(newViolation);
    setComplaintPlate('');

    try {
      const response = await fetch('http://localhost:5000/api/violations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newViolation)
      });
      if (response.ok) {
        triggerToast("Citizen complaint saved live to database.");
        return;
      }
    } catch (err) {
      console.warn('Live API submit violation failed, fell back to local memory.', err.message);
    }
    triggerToast("Citizen complaint parsed & verified by AI. Added to queue.");
  };

  // Recharts Datasets
  const dailyData = [
    { name: '08:00', violations: 120, revenue: 60000 },
    { name: '10:00', violations: 240, revenue: 120000 },
    { name: '12:00', violations: 180, revenue: 90000 },
    { name: '14:00', violations: 210, revenue: 105000 },
    { name: '16:00', violations: 310, revenue: 155000 },
    { name: '18:00', violations: 450, revenue: 225000 },
    { name: '20:00', violations: 280, revenue: 140000 },
  ];

  const distributionData = [
    { name: 'Helmet Non Compliance', value: 420 },
    { name: 'Seatbelt Non Compliance', value: 210 },
    { name: 'Triple Riding', value: 180 },
    { name: 'Wrong Side Driving', value: 150 },
    { name: 'Stop Line Violation', value: 90 },
    { name: 'Red Light Violation', value: 260 },
    { name: 'Illegal Parking', value: 310 },
  ];

  const prCurveData = [
    { recall: 0.1, precision: 0.99 },
    { recall: 0.3, precision: 0.97 },
    { recall: 0.5, precision: 0.95 },
    { recall: 0.7, precision: 0.92 },
    { recall: 0.9, precision: 0.88 },
    { recall: 1.0, precision: 0.81 }
  ];

  const COLORS = ['#00e5ff', '#ff9f1c', '#ff2a5f', '#7000ff', '#39ff14', '#00bccc', '#e02050'];

  const filteredViolations = violations.filter(v => {
    const matchesSearch = v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase()) || v.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || v.violationType === filterType;
    const riskData = getRiskScore(v.plateNumber);
    const matchesRisk = filterRisk === 'all' || riskData.category.toLowerCase() === filterRisk.toLowerCase();
    return matchesSearch && matchesType && matchesRisk;
  });

  return (
    <div className={`flex h-screen w-full overflow-hidden font-sans ${isDarkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Toast Notifier */}
      {toast && (
        <div className="fixed bottom-6 right-6 glass-panel z-50 py-3 px-5 rounded-lg text-sm flex items-center gap-3 animate-bounce shadow-2xl border-cyan-500/50">
          <Activity className="h-5 w-5 text-cyan-400 animate-pulse" />
          <span>{toast}</span>
        </div>
      )}

      {/* Official Challan Document modal */}
      {showReceiptModal && selectedViolation && (
        <div className="fixed inset-0 bg-black/85 flex items-center justify-center z-50 p-4 backdrop-blur-md">
          <div className="bg-white text-slate-900 max-w-xl w-full rounded-2xl p-8 shadow-2xl border border-slate-200 relative animate-fadeIn leading-relaxed">
            
            {/* Header / Seal */}
            <div className="flex justify-between items-start border-b-2 border-slate-900 pb-4 mb-6">
              <div>
                <span className="text-[10px] tracking-wider uppercase font-black text-slate-500">Official Notice of Infraction</span>
                <h3 className="text-xl font-heading font-extrabold text-slate-900 mt-1">BENGALURU TRAFFIC POLICE</h3>
                <span className="text-[10px] text-slate-500 block">Government of Karnataka — E-Challan portal</span>
              </div>
              <div className="p-3 bg-rose-100 rounded-xl text-rose-600 font-heading font-black text-sm border border-rose-300">
                FINE: ₹500
              </div>
            </div>

            {/* Notice facts */}
            <div className="grid grid-cols-2 gap-4 text-xs mb-6 border-b border-slate-200 pb-4">
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[9px]">Challan Number</span>
                <span className="font-bold text-slate-800">{selectedViolation.id}-ENF</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[9px]">Date & Time</span>
                <span className="font-bold text-slate-800">{new Date(selectedViolation.timestamp).toLocaleString()}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[9px]">Registration Plate</span>
                <span className="font-heading font-bold text-slate-900 text-sm bg-slate-100 border px-2 py-0.5 rounded">{selectedViolation.plateNumber}</span>
              </div>
              <div>
                <span className="text-slate-400 font-semibold block uppercase text-[9px]">Owner Name (Vahan)</span>
                <span className="font-bold text-slate-800">{selectedViolation.owner}</span>
              </div>
            </div>

            {/* Violation description */}
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6 text-xs">
              <span className="font-bold text-rose-600 uppercase tracking-wide">Infraction Type: {selectedViolation.violationType}</span>
              <p className="text-slate-600 mt-2">{selectedViolation.explainability}</p>
            </div>

            {/* QR Mock & Print */}
            <div className="flex justify-between items-center pt-4 border-t border-slate-200">
              <div className="flex gap-3">
                <div className="w-14 h-14 bg-slate-900 rounded flex items-center justify-center text-white font-black text-xs p-1">
                  [QR PAY]
                </div>
                <div>
                  <span className="text-[10px] text-slate-500 font-semibold block uppercase">Quick Payment</span>
                  <span className="text-xs font-bold text-slate-800">Scan to settle challan</span>
                </div>
              </div>
              
              <div className="flex gap-3">
                <button 
                  onClick={() => window.print()}
                  className="btn bg-slate-900 text-white hover:bg-slate-800 text-xs py-2 px-4 rounded-xl font-bold flex items-center gap-2"
                >
                  <Printer className="h-4 w-4" /> Print Ticket
                </button>
                <button 
                  onClick={() => setShowReceiptModal(false)}
                  className="btn bg-slate-100 border border-slate-200 hover:bg-slate-200 text-xs py-2 px-4 rounded-xl font-bold"
                >
                  Close Notice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WHATSAPP CHALLAN PREVIEW MODAL ── */}
      {showWhatsApp && whatsAppChallan && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setShowWhatsApp(false)}>
          <div className="w-96 bg-[#0a0a0a] rounded-3xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* WhatsApp Header */}
            <div className="bg-[#075e54] px-4 py-3 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#128c7e] flex items-center justify-center text-white font-bold text-sm">🚨</div>
              <div>
                <div className="font-bold text-white text-sm">BTP E-Challan Bot</div>
                <div className="text-[11px] text-green-200">Bengaluru Traffic Police · Official</div>
              </div>
              <button onClick={() => setShowWhatsApp(false)} className="ml-auto text-white/60 hover:text-white text-xl">×</button>
            </div>
            {/* Chat background */}
            <div className="bg-[#0d1117] min-h-64 p-4" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\"40\" height=\"40\" viewBox=\"0 0 40 40\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cg fill=\"%23ffffff\" fill-opacity=\"0.02\"%3E%3Cpath d=\"M0 40L40 0H20L0 20M40 40V20L20 40\"/%3E%3C/g%3E%3C/svg%3E")' }}>
              {/* Timestamp */}
              <div className="text-center mb-3">
                <span className="text-[10px] bg-black/40 text-slate-400 px-3 py-1 rounded-full">{new Date().toLocaleDateString('en-IN', { weekday:'short', day:'2-digit', month:'short' })}</span>
              </div>
              {/* Message bubble */}
              <div className="bg-[#1a2b22] rounded-2xl rounded-tl-sm p-4 max-w-[90%] shadow-md">
                <div className="text-green-400 font-black text-xs mb-2">🚨 E-CHALLAN NOTICE</div>
                <div className="text-white text-[11px] leading-relaxed space-y-1.5">
                  <div>Namaste,</div>
                  <div>Your vehicle <span className="font-black text-cyan-400">{whatsAppChallan.plateNumber}</span> has been caught committing a traffic violation.</div>
                  <div className="bg-black/30 rounded-lg p-2 mt-2 space-y-1">
                    <div>📄 <span className="text-slate-400">Challan No:</span> <span className="font-bold">{whatsAppChallan.id}</span></div>
                    <div>⚠️ <span className="text-slate-400">Violation:</span> <span className="font-bold text-rose-400">{whatsAppChallan.violationType}</span></div>
                    <div>📍 <span className="text-slate-400">Location:</span> {whatsAppChallan.location.split(',')[0]}</div>
                    <div>📅 <span className="text-slate-400">Date/Time:</span> {new Date(whatsAppChallan.timestamp).toLocaleString('en-IN')}</div>
                    <div>📸 <span className="text-slate-400">Camera:</span> {whatsAppChallan.cameraId}</div>
                    <div className="border-t border-white/10 pt-1 mt-1">💰 <span className="text-slate-400">Fine Amount:</span> <span className="font-black text-green-400">₹500</span></div>
                  </div>
                  <div className="text-amber-400 font-semibold">Pay within 60 days to avoid court summons.</div>
                  <div className="text-[10px] text-slate-500 mt-2">Pay at: parivahan.gov.in/echallan</div>
                </div>
                <div className="text-right text-[10px] text-slate-500 mt-2 flex items-center justify-end gap-1">
                  {new Date().toLocaleTimeString('en-IN', { hour:'2-digit', minute:'2-digit' })} ✔✔
                </div>
              </div>
            </div>
            {/* Footer */}
            <div className="bg-[#0a0a0a] px-4 py-3 flex items-center gap-3">
              <div className="flex-grow bg-[#1a1a1a] rounded-full px-4 py-2 text-xs text-slate-500">Type a message</div>
              <div className="w-9 h-9 bg-[#075e54] rounded-full flex items-center justify-center text-white">🎤</div>
            </div>
          </div>
        </div>
      )}

      {/* ── FIR GENERATOR MODAL ── */}
      {showFIR && (
        <div className="fixed inset-0 bg-black/70 z-50 flex items-center justify-center p-6 backdrop-blur-sm" onClick={() => setShowFIR(false)}>
          <div className="w-[560px] bg-white rounded-2xl overflow-hidden shadow-2xl" onClick={e => e.stopPropagation()}>
            {/* FIR Header */}
            <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
              <div className="font-heading font-black text-sm">AUTO-GENERATED COURT NOTICE / FIR DRAFT</div>
              <div className="flex gap-2">
                <button onClick={() => window.print()} className="bg-cyan-500 text-slate-900 font-bold text-xs px-3 py-1.5 rounded-lg">Print</button>
                <button onClick={() => setShowFIR(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
            </div>
            {/* FIR Body */}
            <div className="p-6 text-slate-900 font-serif text-sm leading-relaxed max-h-[70vh] overflow-y-auto">
              <div className="text-center mb-4">
                <div className="font-black text-base uppercase">IN THE COURT OF THE METROPOLITAN MAGISTRATE</div>
                <div className="font-bold">BENGALURU TRAFFIC POLICE — MOTOR VEHICLE ACT, 1988</div>
                <div className="text-xs text-slate-500 mt-1">FIR No: BTP/{new Date().getFullYear()}/{Math.floor(Math.random()*90000+10000)}</div>
              </div>
              <div className="border border-slate-300 rounded-lg p-4 space-y-3 text-xs">
                <div><span className="font-bold">Date of Offence:</span> {new Date().toLocaleDateString('en-IN')}</div>
                <div><span className="font-bold">Place of Offence:</span> {violations.find(v=>v.plateNumber===firPlate)?.location || 'Silk Board Junction, Outer Ring Road, Bengaluru'}</div>
                <div><span className="font-bold">Vehicle Registration No:</span> <span className="font-black">{firPlate || 'KA-03-MX-8891'}</span></div>
                <div><span className="font-bold">Nature of Violation:</span> {violations.filter(v=>v.plateNumber===firPlate).map(v=>v.violationType).join(', ') || 'Multiple Traffic Violations (Repeat Offender)'}</div>
                <div><span className="font-bold">No. of Offences:</span> {violations.filter(v=>v.plateNumber===firPlate).length || 4}</div>
                <div><span className="font-bold">Section Invoked:</span> Sections 177, 179, 184, 185 of Motor Vehicles Act, 1988</div>
                <div><span className="font-bold">Penalty Amount:</span> ₹{violations.filter(v=>v.plateNumber===firPlate).length * 500 || 2000} (per schedule)</div>
                <div><span className="font-bold">Evidence:</span> CCTV footage, AI-annotated images, OCR-confirmed plate number, GPS coordinates</div>
                <div><span className="font-bold">Detecting Officer:</span> SmartVision X AI System (Automated)</div>
                <div><span className="font-bold">Verification:</span> YOLOv8 + EasyOCR Pipeline — Confidence: 97%</div>
              </div>
              <div className="mt-4 text-[10px] text-slate-500 text-center">This is a computer-generated document. Digital signature verified by BTP Central Command.</div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-xs text-center">
                <div className="border-t border-slate-400 pt-2 text-slate-600">Complainant / AI System Officer</div>
                <div className="border-t border-slate-400 pt-2 text-slate-600">Traffic Court Seal</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Sidebar Navigation */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col flex-shrink-0 overflow-hidden" style={{ borderRight: '1px solid rgba(0,229,255,0.1)' }}>
        {/* Logo — always visible */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-slate-800/60 flex-shrink-0">
          <Radio className="h-7 w-7 text-cyan-400 animate-pulse" />
          <div>
            <h1 className="font-heading text-base font-bold tracking-tight text-white">SmartVision X</h1>
            <span className="text-[9px] text-slate-400 font-semibold tracking-wider uppercase">BTP Traffic Intelligence OS</span>
          </div>
        </div>

        {/* Scrollable Nav */}
        <nav className="flex-grow overflow-y-auto no-scrollbar py-3 px-3 space-y-1">
          {[
            { id: 'command',    label: 'Command Center',      icon: Activity },
            { id: 'aibrain',    label: 'AI Brain',            icon: Brain,      badge: 'AI'   },
            { id: 'cctv',       label: 'CCTV Live Grid',      icon: Video,      badge: 'LIVE' },
            { id: 'violations', label: 'Violations Center',   icon: AlertTriangle },
            { id: 'analytics',  label: 'Analytics',           icon: ChartIcon   },
            { id: 'heatmap',    label: 'City Heatmap',        icon: Map         },
            { id: 'offenders',  label: 'Offenders DB',        icon: Users       },
            { id: 'patrol',     label: 'Patrol Dispatch',     icon: Send        },
            { id: 'predictive', label: 'Predictive & Safety', icon: TrendingUp  },
            { id: 'emergency',  label: 'Emergency Override',  icon: Zap,        badge: 'SOS'  },
            { id: 'syshealth',  label: 'System Health',       icon: Cpu         },
            { id: 'config',     label: 'System Engine',       icon: Sliders     },
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-cyan-500/10 text-cyan-400 border-l-4 border-cyan-400 shadow-[inset_4px_0_0_rgba(6,182,212,0.15)]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 border-l-4 border-transparent'
                }`}
              >
                <Icon className="h-4 w-4 flex-shrink-0" />
                <span className="flex-grow text-left text-[13px]">{tab.label}</span>
                {tab.badge && (
                  <span className={`text-[8px] font-black px-1.5 py-0.5 rounded-full animate-pulse flex-shrink-0 ${
                    tab.badge === 'LIVE' ? 'bg-red-500 text-white' :
                    tab.badge === 'SOS'  ? 'bg-orange-500 text-white' :
                    'bg-purple-500 text-white'
                  }`}>{tab.badge}</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Engine Status — always visible at bottom */}
        <div className="flex-shrink-0 mx-3 mb-3">
          <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-xl flex items-center gap-3">
            <div className="relative">
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full animate-ping absolute" />
              <div className="w-2.5 h-2.5 bg-green-500 rounded-full relative" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-semibold uppercase">Engine Status</div>
              <div className="text-[11px] font-bold text-slate-200">Online & Processing</div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="flex-grow flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-slate-900/60 border-b border-slate-800 flex items-center justify-between px-8 backdrop-blur-md z-10 flex-shrink-0">
          <div className="flex items-center gap-6">
            <h2 className="text-xl font-heading font-bold text-white uppercase tracking-wider">
              {activeTab === 'command'    && "Command Operations Centre"}
              {activeTab === 'aibrain'    && "AI Brain — Live Autonomous Intelligence"}
              {activeTab === 'cctv'       && "Live CCTV Multi-Feed Grid"}
              {activeTab === 'violations' && "Live Violation Evidence Processing"}
              {activeTab === 'analytics'  && "Analytics & Revenue Intelligence"}
              {activeTab === 'heatmap'    && "City Intelligence & Hotspots"}
              {activeTab === 'offenders'  && "BTP Offenders Database & Plate Checker"}
              {activeTab === 'patrol'     && "Patrol Dispatch & Officer Leaderboard"}
              {activeTab === 'predictive' && "Predictive AI & Safety Index Metrics"}
              {activeTab === 'emergency'  && "Emergency Signal Override Console"}
              {activeTab === 'syshealth'  && "System Health Monitor — Edge AI Nodes"}
              {activeTab === 'config'     && "Model Performance Evaluation"}
            </h2>
          </div>

          <div className="flex items-center gap-6">
            {/* Condition Simulator pills */}
            <div className="flex bg-slate-800/50 border border-slate-700/60 p-1 rounded-lg gap-1">
              {[
                { id: 'clear', label: '☀️', text: 'Day' },
                { id: 'monsoon', label: '🌧️', text: 'Rain' },
                { id: 'night', label: '🌙', text: 'Night' },
                { id: 'rush', label: '🚨', text: 'Rush' }
              ].map(sim => (
                <button
                  key={sim.id}
                  onClick={() => handleSimChange(sim.id)}
                  title={`Simulate ${sim.text} condition`}
                  className={`px-2 py-1 rounded text-xs transition-all ${
                    simMode === sim.id ? 'bg-cyan-500 text-slate-900 font-bold' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {sim.label} <span className="text-[10px] hidden md:inline font-semibold">{sim.text}</span>
                </button>
              ))}
            </div>

            <div className="flex gap-4 items-center">
              {/* AI Stream toggle */}
              <button
                onClick={() => { setAiStreamActive(v => !v); triggerToast(aiStreamActive ? 'AI Stream paused.' : 'AI Stream resumed — live violations incoming!'); }}
                title={aiStreamActive ? 'Pause AI Stream' : 'Resume AI Stream'}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${
                  aiStreamActive ? 'bg-purple-500/10 border-purple-500/40 text-purple-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {aiStreamActive ? <Wifi className="h-3.5 w-3.5" /> : <WifiOff className="h-3.5 w-3.5" />}
                {aiStreamActive ? 'AI LIVE' : 'PAUSED'}
              </button>

              {/* Voice toggle */}
              <button
                onClick={() => { setVoiceEnabled(v => !v); triggerToast(!voiceEnabled ? '🔊 AI Voice alerts ON' : '🔇 AI Voice alerts OFF'); }}
                title="Toggle AI Voice Alerts"
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black border transition-all ${
                  voiceEnabled ? 'bg-cyan-500/10 border-cyan-500/40 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                }`}
              >
                {voiceEnabled ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}
                VOICE
              </button>

              <div className="text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">ENGINE LATENCY</span>
                <span className="text-xs font-bold text-green-400">12ms (Optimal)</span>
              </div>
              <div className="border-l border-slate-800 pl-4 text-right">
                <span className="text-[10px] text-slate-400 block font-semibold">DETECTION ACCURACY</span>
                <span className="text-xs font-bold text-cyan-400">{(stats.avgAccuracy * (yoloConfidence / 0.85)).toFixed(1)}%</span>
              </div>
            </div>
            <button 
              onClick={() => setIsDarkMode(!isDarkMode)} 
              className={`p-2.5 rounded-lg border transition-all ${
                isDarkMode 
                  ? 'bg-slate-800/60 border-slate-700 hover:bg-slate-800 text-yellow-400' 
                  : 'bg-slate-100 border-slate-200 hover:bg-slate-200 text-slate-700'
              }`}
              title="Toggle Theme"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </button>
            <div className="w-10 h-10 rounded-full bg-slate-800 border-2 border-cyan-400 overflow-hidden flex items-center justify-center font-heading font-bold text-cyan-400 text-sm">
              BY
            </div>
          </div>
        </header>

        {/* Dynamic Tab Body */}
        <div className="flex-grow overflow-y-auto p-8 no-scrollbar">
          
          {/* ── BOTTOM ALERT TICKER ── */}
          <div className="fixed bottom-0 left-72 right-0 z-40 bg-slate-950/95 border-t border-cyan-500/20 backdrop-blur-md py-2 px-4 flex items-center gap-4 overflow-hidden">
            <span className="text-[9px] font-black text-cyan-400 uppercase tracking-widest bg-cyan-500/10 border border-cyan-500/30 px-2 py-1 rounded flex-shrink-0">⚡ LIVE ALERTS</span>
            <div className="flex-grow overflow-hidden">
              <div className="text-[11px] text-slate-300 font-medium animate-fadeIn whitespace-nowrap overflow-hidden text-ellipsis" key={tickerIdx}>
                {TICKER_ALERTS[tickerIdx]}
              </div>
            </div>
            <div className="flex gap-3 flex-shrink-0">
              {TICKER_ALERTS.map((_, i) => (
                <span key={i} onClick={() => setTickerIdx(i)}
                  className={`w-1.5 h-1.5 rounded-full cursor-pointer transition-all ${ i === tickerIdx ? 'bg-cyan-400' : 'bg-slate-700 hover:bg-slate-500'}`}
                />
              ))}
            </div>
          </div>

          {/* ── NEW VIOLATION BADGE ── */}
          {newViolationBadge && (
            <div className="fixed top-24 right-6 z-50 max-w-sm w-80 animate-fadeIn">
              <div className="bg-slate-900 border-2 border-purple-500 rounded-2xl p-4 shadow-2xl shadow-purple-500/20">
                <div className="flex items-center gap-3 mb-2">
                  <span className="flex h-3 w-3 relative">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-purple-500"></span>
                  </span>
                  <span className="text-[10px] font-black text-purple-400 uppercase tracking-widest">🤖 AI Auto-Detected</span>
                </div>
                <div className="font-heading font-extrabold text-white text-sm">{newViolationBadge.violationType}</div>
                <div className="text-xs text-slate-400 mt-1">{newViolationBadge.location.split(',')[0]} · {newViolationBadge.cameraId}</div>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-[10px] font-heading font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{newViolationBadge.plateNumber}</span>
                  <span className="text-[10px] text-green-400 font-bold">{(newViolationBadge.confidence * 100).toFixed(0)}% confidence</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: CCTV LIVE GRID */}
          {activeTab === 'cctv' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Top mini-stats */}
              <div className="grid grid-cols-4 gap-4">
                {[
                  { label: 'Active Cameras',   val: '5 / 6',   color: 'text-green-400'  },
                  { label: 'Total Violations',  val: stats.totalToday.toLocaleString(), color: 'text-cyan-400' },
                  { label: 'Avg FPS',           val: '28.5 FPS', color: 'text-purple-400' },
                  { label: 'Camera Offline',    val: '1',       color: 'text-rose-500'   },
                ].map((s, i) => (
                  <div key={i} className="glass-panel p-4 rounded-2xl text-center">
                    <div className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</div>
                    <div className={`text-2xl font-heading font-extrabold mt-1 ${s.color}`}>{s.val}</div>
                  </div>
                ))}
              </div>

              {/* 2+1 layout: grid + selected cam detail */}
              <div className="grid grid-cols-3 gap-6">
                {/* Camera grid */}
                <div className="col-span-2 grid grid-cols-3 gap-4">
                  {CCTV_CAMERAS.map((cam) => (
                    <div
                      key={cam.id}
                      onClick={() => setSelectedCam(cam)}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all ${
                        selectedCam.id === cam.id ? 'border-cyan-400 shadow-lg shadow-cyan-500/20' :
                        cam.alert ? 'border-rose-500/60' : 'border-slate-800/60 hover:border-slate-600'
                      }`}
                    >
                      <img src={cam.img} alt={cam.name} className={`w-full aspect-video object-cover ${ cam.status === 'OFFLINE' ? 'grayscale opacity-30' : 'brightness-75'}`} />
                      {/* Overlay */}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                      {/* Status dot */}
                      <div className="absolute top-2 right-2 flex items-center gap-1.5">
                        <span className={`flex h-2 w-2 relative`}>
                          {cam.status === 'ACTIVE' && <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />}
                          <span className={`relative inline-flex rounded-full h-2 w-2 ${cam.status === 'ACTIVE' ? 'bg-green-400' : 'bg-slate-600'}`} />
                        </span>
                        <span className={`text-[9px] font-black uppercase ${ cam.status === 'ACTIVE' ? 'text-green-400' : 'text-slate-500'}`}>{cam.status}</span>
                      </div>
                      {/* Alert badge */}
                      {cam.alert && (
                        <div className="absolute top-2 left-2">
                          <span className="text-[9px] font-black bg-rose-500 text-white px-1.5 py-0.5 rounded uppercase animate-pulse">⚠ ALERT</span>
                        </div>
                      )}
                      {/* Scanning line animation */}
                      {cam.status === 'ACTIVE' && (
                        <div className="absolute inset-x-0 top-0 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse opacity-60" />
                      )}
                      {/* Bottom label */}
                      <div className="absolute bottom-0 inset-x-0 p-2">
                        <div className="text-[10px] font-black text-white">{cam.id}</div>
                        <div className="text-[9px] text-slate-300 truncate">{cam.name}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Selected cam detail */}
                <div className="col-span-1 glass-panel rounded-2xl p-5 flex flex-col gap-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">Selected Feed</div>
                      <div className="font-heading font-extrabold text-white text-lg">{selectedCam.id}</div>
                    </div>
                    <span className={`text-[10px] font-black px-2 py-1 rounded-full border uppercase ${
                      selectedCam.status === 'ACTIVE' ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-500'
                    }`}>{selectedCam.status}</span>
                  </div>
                  <img src={selectedCam.img} className="w-full rounded-xl object-cover aspect-video" alt={selectedCam.name} />
                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl">
                      <span className="text-slate-400">Location</span>
                      <span className="font-bold text-white">{selectedCam.name}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl">
                      <span className="text-slate-400">Violations Today</span>
                      <span className="font-extrabold text-rose-400">{selectedCam.violations.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center bg-slate-900/60 p-3 rounded-xl">
                      <span className="text-slate-400">Frame Rate</span>
                      <span className="font-bold text-cyan-400">{selectedCam.fps} FPS</span>
                    </div>
                    {selectedCam.alert && (
                      <div className="bg-rose-500/10 border border-rose-500/30 p-3 rounded-xl text-rose-400 font-bold flex items-center gap-2">
                        <AlertOctagon className="h-4 w-4" /> Active Violation Alert
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => { triggerToast(`Snapshot saved for ${selectedCam.id}`); speakAlert(`Snapshot taken from camera ${selectedCam.id} at ${selectedCam.name}.`); }}
                    className="btn bg-cyan-500 text-slate-900 font-bold rounded-xl py-2.5 text-xs hover:bg-cyan-400 flex items-center justify-center gap-2"
                  >
                    <Download className="h-4 w-4" /> Save Snapshot
                  </button>
                </div>
              </div>

              {/* ⚡ Live Speed Radar */}
              <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-bold text-white flex items-center gap-2">
                    <Zap className="h-5 w-5 text-amber-400" /> Live Speed Radar — AI Vehicle Detection
                  </h3>
                  <span className="text-[9px] bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black px-2.5 py-1 rounded uppercase animate-pulse">REAL-TIME</span>
                </div>
                <div className="space-y-3">
                  {speedData.map((s, i) => (
                    <div key={i} className={`flex items-center gap-4 p-3 rounded-xl border transition-all ${s.violation ? 'bg-rose-500/5 border-rose-500/20' : 'bg-slate-900/40 border-slate-800/60'}`}>
                      <div className="w-16 text-center flex-shrink-0">
                        <div className="text-[9px] text-slate-400 font-semibold">{s.cam}</div>
                        <div className="text-[10px] font-bold text-white">{s.loc}</div>
                      </div>
                      {/* Speed bar */}
                      <div className="flex-grow">
                        <div className="flex justify-between text-[10px] mb-1.5">
                          <span className="text-slate-400">{s.veh}</span>
                          <span className={`font-black ${s.violation ? 'text-rose-400' : 'text-green-400'}`}>{s.speed} km/h</span>
                        </div>
                        <div className="h-2.5 bg-slate-900 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-1000 ${s.violation ? 'bg-rose-500' : s.speed > 40 ? 'bg-amber-500' : 'bg-green-500'}`}
                            style={{ width: `${Math.min((s.speed / 100) * 100, 100)}%` }}
                          />
                        </div>
                        <div className="flex justify-between text-[9px] text-slate-600 mt-0.5">
                          <span>0</span><span>Speed Limit: {s.limit} km/h</span><span>100</span>
                        </div>
                      </div>
                      {/* Status */}
                      <div className="flex-shrink-0">
                        {s.violation ? (
                          <span className="text-[9px] bg-rose-500 text-white font-black px-2 py-1 rounded animate-pulse">OVERSPEED</span>
                        ) : (
                          <span className="text-[9px] bg-green-500/10 border border-green-500/20 text-green-400 font-black px-2 py-1 rounded">OK</span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB: ANALYTICS & REVENUE */}
          {activeTab === 'analytics' && (
            <div className="space-y-8 animate-fadeIn">
              {/* KPI row */}
              <div className="grid grid-cols-4 gap-5">
                {[
                  { label: 'Total Revenue (Week)',  val: '₹15,02,000', sub: '+18% vs last week',   color: 'text-green-400',  icon: TrendingUp  },
                  { label: 'Challans Issued',       val: '2,370',      sub: 'Auto + Manual',        color: 'text-cyan-400',   icon: FileText    },
                  { label: 'Compliance Rate',       val: '73.4%',      sub: '+4.2% this month',     color: 'text-purple-400', icon: ShieldAlert  },
                  { label: 'Avg Fine per Case',     val: '₹634',       sub: 'Weighted average',      color: 'text-amber-400',  icon: Award       },
                ].map((s, i) => { const Icon = s.icon; return (
                  <div key={i} className="glass-panel p-5 rounded-2xl flex items-center gap-4">
                    <div className={`p-3 bg-slate-900/60 rounded-xl ${s.color}`}><Icon className="h-6 w-6" /></div>
                    <div>
                      <div className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</div>
                      <div className={`text-xl font-heading font-extrabold mt-0.5 ${s.color}`}>{s.val}</div>
                      <div className="text-[10px] text-slate-500">{s.sub}</div>
                    </div>
                  </div>
                ); })}
              </div>

              {/* Charts row */}
              <div className="grid grid-cols-2 gap-8">
                {/* Weekly Revenue Bar */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="font-heading font-bold text-white mb-4">Weekly Revenue & Challan Trend</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={WEEKLY_REVENUE}>
                        <XAxis dataKey="day" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={10} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                        <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155' }} formatter={(val, name) => [name === 'revenue' ? `₹${val.toLocaleString()}` : val, name]} />
                        <Bar dataKey="revenue" fill="#00e5ff" radius={[4,4,0,0]} opacity={0.85} />
                        <Bar dataKey="challans" fill="#7000ff" radius={[4,4,0,0]} opacity={0.7} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Compliance Trend Line */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="font-heading font-bold text-white mb-4">6-Month Compliance Improvement</h3>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={COMPLIANCE_TREND}>
                        <XAxis dataKey="month" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={10} unit="%" />
                        <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155' }} />
                        <Legend />
                        <Line type="monotone" dataKey="helmet"   stroke="#00e5ff" strokeWidth={2} dot={{ r:3 }} />
                        <Line type="monotone" dataKey="seatbelt" stroke="#39ff14" strokeWidth={2} dot={{ r:3 }} />
                        <Line type="monotone" dataKey="parking"  stroke="#ff9f1c" strokeWidth={2} dot={{ r:3 }} />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Violation category breakdown */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-white mb-5">Fine Category Breakdown</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { type: 'Helmet Non Compliance',        count: 420, fine: 500,  total: '₹2,10,000', color: 'bg-cyan-500'    },
                    { type: 'Seatbelt Non Compliance',      count: 210, fine: 500,  total: '₹1,05,000', color: 'bg-purple-500'  },
                    { type: 'Triple Riding',                count: 180, fine: 500,  total: '₹90,000',   color: 'bg-rose-500'    },
                    { type: 'Illegal Parking',              count: 310, fine: 500,  total: '₹1,55,000', color: 'bg-amber-500'   },
                    { type: 'Wrong Side Driving',           count: 150, fine: 1000, total: '₹1,50,000', color: 'bg-orange-500'  },
                    { type: 'Red Light Violation',          count: 260, fine: 1000, total: '₹2,60,000', color: 'bg-red-500'     },
                    { type: 'Mobile Phone While Driving',   count: 98,  fine: 500,  total: '₹49,000',   color: 'bg-green-500'   },
                    { type: 'Stop Line Violation',          count: 90,  fine: 500,  total: '₹45,000',   color: 'bg-teal-500'    },
                  ].map((item, i) => (
                    <div key={i} className="bg-slate-900/60 border border-slate-800/80 p-4 rounded-xl">
                      <div className={`h-1 w-12 rounded-full mb-3 ${item.color}`} />
                      <div className="text-[10px] text-slate-400 font-semibold mb-1 leading-tight">{item.type}</div>
                      <div className="text-lg font-heading font-black text-white">{item.count}</div>
                      <div className="text-xs text-green-400 font-bold">{item.total}</div>
                      <div className="text-[9px] text-slate-500">@ ₹{item.fine}/case</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* 24-Hour Violation Heatmap */}
              <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-5">
                  <h3 className="font-heading font-bold text-white">24-Hour Violation Heatmap</h3>
                  <span className="text-[10px] bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black px-2.5 py-1 rounded">PEAK: 6–7 PM · 387 violations</span>
                </div>
                <div className="flex items-end gap-1 h-32">
                  {HOURLY_VIOLATIONS.map((h, i) => {
                    const pct = (h.count / 387) * 100;
                    const isHigh = h.count > 200;
                    const isMed  = h.count > 80 && !isHigh;
                    return (
                      <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
                        <div
                          className={`w-full rounded-t-sm transition-all duration-500 ${
                            isHigh ? 'bg-rose-500' : isMed ? 'bg-amber-500' : 'bg-cyan-500/60'
                          } group-hover:opacity-80`}
                          style={{ height: `${Math.max(pct, 3)}%` }}
                        />
                        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-slate-900 border border-slate-700 text-[9px] font-bold text-white px-1.5 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-all whitespace-nowrap z-10">{h.count}</div>
                        <span className="text-[8px] text-slate-500">{h.hour}</span>
                      </div>
                    );
                  })}
                </div>
                <div className="flex gap-4 mt-3">
                  <span className="flex items-center gap-1.5 text-[10px] text-rose-400"><span className="w-3 h-3 bg-rose-500 rounded-sm inline-block" />High (200+)</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-amber-400"><span className="w-3 h-3 bg-amber-500 rounded-sm inline-block" />Medium (80–200)</span>
                  <span className="flex items-center gap-1.5 text-[10px] text-cyan-400"><span className="w-3 h-3 bg-cyan-500/60 rounded-sm inline-block" />Low (&lt;80)</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 1: COMMAND CENTER */}
          {activeTab === 'command' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Stat Cards */}
              <div className="grid grid-cols-4 gap-6">
                {[
                  { label: "Total Violations Today", val: stats.totalToday.toLocaleString(), sub: "+12.4% vs Yesterday", icon: Activity, color: "text-cyan-400" },
                  { label: "Active Traffic Cameras", val: stats.activeCams, sub: "100% operational", icon: Video, color: "text-green-400" },
                  { label: "Accuracy Target", val: `${stats.avgAccuracy}%`, sub: "YOLOv8 & ResNet50 Pipeline", icon: ShieldAlert, color: "text-purple-400" },
                  { label: "Pending Reviews", val: violations.filter(v => v.status === "Pending").length, sub: "Requires BTP confirmation", icon: AlertTriangle, color: "text-amber-400" }
                ].map((stat, i) => {
                  const Icon = stat.icon;
                  return (
                    <div key={i} className="glass-panel p-6 rounded-2xl flex items-center justify-between shadow-xl">
                      <div>
                        <span className="text-xs text-slate-400 font-semibold uppercase">{stat.label}</span>
                        <h3 className="text-3xl font-heading font-extrabold text-white mt-2">{stat.val}</h3>
                        <span className="text-[10px] text-slate-500 mt-1 block">{stat.sub}</span>
                      </div>
                      <div className={`p-4 bg-slate-800/60 rounded-xl ${stat.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* City Compliance Score Gauge */}
              <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-heading font-bold text-white text-lg">City Traffic Compliance Score</h3>
                    <p className="text-[11px] text-slate-400 mt-0.5">AI-computed from 142 cameras · Updated every 5s</p>
                  </div>
                  <span className={`text-xs font-black px-3 py-1.5 rounded-full border ${
                    cityScore >= 80 ? 'bg-green-500/10 border-green-500/30 text-green-400' :
                    cityScore >= 65 ? 'bg-amber-500/10 border-amber-500/30 text-amber-400' :
                                     'bg-rose-500/10 border-rose-500/30 text-rose-400'
                  }`}>{cityScore >= 80 ? 'GOOD' : cityScore >= 65 ? 'MODERATE' : 'CRITICAL'}</span>
                </div>
                <div className="flex items-center gap-8">
                  {/* Circular SVG Radar Dial Gauge */}
                  <div className="relative flex-shrink-0 flex items-center justify-center" style={{ width: 140, height: 140 }}>
                    {/* Glowing background radial blur */}
                    <div className={`absolute w-28 h-28 rounded-full filter blur-xl opacity-20 transition-all duration-1000 ${
                      cityScore >= 80 ? 'bg-green-500' : cityScore >= 65 ? 'bg-amber-500' : 'bg-rose-500'
                    }`} />
                    
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                      {/* Background Track Circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke="#111827"
                        strokeWidth="5"
                      />
                      {/* Dashed outer scanner circle */}
                      <circle
                        cx="50"
                        cy="50"
                        r="45"
                        fill="transparent"
                        stroke="rgba(0, 229, 255, 0.15)"
                        strokeWidth="1.5"
                        strokeDasharray="5 3"
                        className="radar-sweep"
                        style={{ transformOrigin: 'center', animation: 'radarSweep 6s linear infinite' }}
                      />
                      {/* Main dynamic value arc with neon shadow filter */}
                      <circle
                        cx="50"
                        cy="50"
                        r="40"
                        fill="transparent"
                        stroke={cityScore >= 80 ? '#10b981' : cityScore >= 65 ? '#f59e0b' : '#f43f5e'}
                        strokeWidth="6"
                        strokeDasharray="251.2"
                        strokeDashoffset={251.2 - (251.2 * cityScore) / 100}
                        strokeLinecap="round"
                        style={{
                          transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1), stroke 0.5s ease',
                          filter: 'drop-shadow(0px 0px 4px currentColor)'
                        }}
                        className={cityScore >= 80 ? 'text-green-500' : cityScore >= 65 ? 'text-amber-500' : 'text-rose-500'}
                      />
                    </svg>
                    {/* Centered Stats text */}
                    <div className="absolute flex flex-col items-center justify-center">
                      <span className={`text-4xl font-heading font-black stat-glow tracking-tighter ${
                        cityScore >= 80 ? 'text-green-400' : cityScore >= 65 ? 'text-amber-400' : 'text-rose-400'
                      }`}>
                        {Math.round(cityScore)}
                      </span>
                      <span className="text-[7.5px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">SCORE / 100</span>
                    </div>
                  </div>

                  {/* Score breakdown segmented progress indicators */}
                  <div className="flex-grow grid grid-cols-2 gap-x-6 gap-y-4">
                    {[
                      { label: 'Helmet Compliance',   val: 73, color: 'cyan' },
                      { label: 'Seatbelt Compliance', val: 84, color: 'green' },
                      { label: 'No Parking Respect',  val: 62, color: 'amber' },
                      { label: 'Signal Adherence',    val: 71, color: 'purple' },
                      { label: 'Speed Compliance',    val: 68, color: 'blue' },
                      { label: 'Lane Discipline',     val: 79, color: 'teal' },
                    ].map((item, i) => (
                      <div key={i} className="flex flex-col justify-center">
                        <div className="flex justify-between text-[10px] mb-1">
                          <span className="text-slate-400 font-medium">{item.label}</span>
                          <span className="font-bold text-white">{item.val}%</span>
                        </div>
                        {/* Segmented sci-fi block gauge (10 blocks) */}
                        <div className="flex gap-1 mt-1">
                          {Array.from({ length: 10 }).map((_, blockIdx) => {
                            const isLit = item.val >= (blockIdx + 1) * 10;
                            const colorHex = item.color === 'cyan' ? '#00e5ff' :
                                             item.color === 'green' ? '#39ff14' :
                                             item.color === 'amber' ? '#ff9f1c' :
                                             item.color === 'purple' ? '#a78bfa' :
                                             item.color === 'blue' ? '#3b82f6' : '#14b8a6';
                            return (
                              <div
                                key={blockIdx}
                                className="h-2 flex-grow rounded-[1px] transition-all duration-500"
                                style={{
                                  backgroundColor: isLit ? colorHex : 'rgba(30, 41, 59, 0.4)',
                                  boxShadow: isLit ? `0 0 6px ${colorHex}` : 'none',
                                  opacity: isLit ? 1 : 0.25
                                }}
                              />
                            );
                          })}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Grid 2 Columns */}
              <div className="grid grid-cols-3 gap-8">
                {/* Weekly Trend Chart */}
                <div className="glass-panel p-6 rounded-2xl col-span-2">
                  <h3 className="font-heading text-lg font-bold text-white mb-4">Traffic Violations & Revenue Trend</h3>
                  <div className="h-72">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={dailyData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorViolations" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#00e5ff" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#00e5ff" stopOpacity={0}/>
                          </linearGradient>
                          <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.25}/>
                            <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="left" stroke="#00e5ff" fontSize={10} tickLine={false} axisLine={false} />
                        <YAxis yAxisId="right" orientation="right" stroke="#8b5cf6" fontSize={10} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" opacity={0.25} />
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(15, 23, 42, 0.95)', 
                            borderColor: 'rgba(0, 229, 255, 0.4)', 
                            borderWidth: '1px',
                            borderRadius: '12px',
                            boxShadow: '0 8px 32px rgba(0, 229, 255, 0.15)',
                            backdropFilter: 'blur(8px)'
                          }}
                          labelClassName="text-cyan-400 font-heading font-bold text-xs"
                          itemStyle={{ color: '#fff', fontSize: '11px' }}
                        />
                        <Legend verticalAlign="top" height={36} iconType="circle" wrapperStyle={{ fontSize: '10px', color: '#fff' }} />
                        <Area yAxisId="left" type="monotone" name="Violations" dataKey="violations" stroke="#00e5ff" strokeWidth={3} fillOpacity={1} fill="url(#colorViolations)" dot={{ r: 2, strokeWidth: 1 }} activeDot={{ r: 5 }} />
                        <Area yAxisId="right" type="monotone" name="Revenue (₹)" dataKey="revenue" stroke="#8b5cf6" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" dot={{ r: 2, strokeWidth: 1 }} activeDot={{ r: 5 }} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Pie Chart Distribution */}
                <div className="glass-panel p-6 rounded-2xl col-span-1">
                  <h3 className="font-heading text-lg font-bold text-white mb-4">Violation Type Distribution</h3>
                  <div className="h-72 flex items-center justify-center relative">
                    {/* Centered stat badge overlay inside donut */}
                    <div className="absolute flex flex-col items-center justify-center pointer-events-none" style={{ zIndex: 10 }}>
                      <span className="text-2xl font-heading font-black text-white stat-glow">
                        {violations.filter(v => v.status !== 'Rejected').length}
                      </span>
                      <span className="text-[8px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">VALID INCIDENTS</span>
                    </div>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={distributionData}
                          cx="50%"
                          cy="50%"
                          innerRadius={62}
                          outerRadius={82}
                          paddingAngle={4}
                          dataKey="value"
                        >
                          {distributionData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} style={{ filter: 'drop-shadow(0px 0px 3px rgba(0,0,0,0.5))' }} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            background: 'rgba(15, 23, 42, 0.95)', 
                            borderColor: '#334155', 
                            borderWidth: '1px',
                            borderRadius: '10px',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                            backdropFilter: 'blur(8px)'
                          }}
                          itemStyle={{ color: '#fff', fontSize: '11px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Peak Hour Heatmap simulation & dangerous junctions */}
              <div className="grid grid-cols-2 gap-8">
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="font-heading text-lg font-bold text-white mb-4">Top Dangerous Junctions & Intersections</h3>
                  <div className="space-y-4">
                    {[
                      { junction: "Silk Board Junction", violations: "1,421 Today", trend: "+8.2% spike", speed: "14 km/h avg speed" },
                      { junction: "KR Puram Intersection", violations: "1,104 Today", trend: "+12.1% spike", speed: "11 km/h avg speed" },
                      { junction: "MG Road Crossing", violations: "921 Today", trend: "-2.1% dip", speed: "22 km/h avg speed" },
                      { junction: "Hebbal Flyover", violations: "891 Today", trend: "+6.4% spike", speed: "29 km/h avg speed" }
                    ].map((jun, idx) => (
                      <div key={idx} className="flex justify-between items-center bg-slate-800/40 p-4 rounded-xl border border-slate-700/40">
                        <div>
                          <div className="font-bold text-sm text-slate-200">{jun.junction}</div>
                          <div className="text-[11px] text-slate-400 mt-1">{jun.speed}</div>
                        </div>
                        <div className="text-right">
                          <span className="text-sm font-extrabold text-cyan-400 block">{jun.violations}</span>
                          <span className="text-[10px] text-rose-500 font-semibold">{jun.trend}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-heading text-lg font-bold text-white">🤖 AI Live Insight Feed</h3>
                      <span className={`text-[9px] font-black px-2 py-0.5 rounded uppercase tracking-wider ${ aiStreamActive ? 'bg-purple-500/20 text-purple-400 border border-purple-500/30 animate-pulse' : 'bg-slate-800 text-slate-500 border border-slate-700'}`}>
                        {aiStreamActive ? '● LIVE' : '⏸ PAUSED'}
                      </span>
                    </div>
                    {/* Rotating AI Insight Ticker */}
                    <div className="bg-slate-900/60 border border-slate-700/60 rounded-xl p-4 min-h-[80px] flex items-center gap-3 mb-4 transition-all">
                      <Sparkles className="h-5 w-5 text-purple-400 flex-shrink-0" />
                      <p className="text-xs text-slate-200 leading-relaxed animate-fadeIn" key={liveInsightIdx}>{AI_INSIGHTS_POOL[liveInsightIdx]}</p>
                    </div>
                    {/* AutoChallan stats */}
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-green-500/5 border border-green-500/20 p-3 rounded-xl">
                        <span className="text-[9px] text-green-400 uppercase font-bold block">Auto-Challans Today</span>
                        <span className="text-xl font-heading font-black text-green-400">{autoChallanCount}</span>
                      </div>
                      <div className="bg-cyan-500/5 border border-cyan-500/20 p-3 rounded-xl">
                        <span className="text-[9px] text-cyan-400 uppercase font-bold block">Auto Revenue</span>
                        <span className="text-xl font-heading font-black text-cyan-400">₹{(autoChallanRevenue).toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-3 mt-6">
                    <button onClick={() => setActiveTab('aibrain')} className="flex-grow btn bg-purple-600 text-white py-3 font-bold rounded-xl hover:bg-purple-500 flex items-center justify-center gap-2">
                      <Brain className="h-4 w-4" /> AI Brain Console
                    </button>
                    <button onClick={() => setActiveTab('violations')} className="flex-grow btn bg-cyan-500 text-slate-900 py-3 font-bold rounded-xl hover:bg-cyan-400">
                      Violations Log
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────── */}
          {/* TAB: AI BRAIN */}
          {activeTab === 'aibrain' && (
            <div className="space-y-6 animate-fadeIn">
              {/* Control Banner */}
              <div className="glass-panel p-5 rounded-2xl flex flex-wrap gap-4 items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/20 border border-purple-500/40 flex items-center justify-center">
                    <Brain className="h-6 w-6 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-heading font-extrabold text-white text-base">SmartVision X — AI Brain Console</div>
                    <div className="text-[11px] text-slate-400">Fully autonomous traffic intelligence engine running 24×7</div>
                  </div>
                </div>
                <div className="flex gap-3 flex-wrap">
                  {/* Stream toggle */}
                  <button
                    onClick={() => { setAiStreamActive(v => !v); triggerToast(aiStreamActive ? 'AI Stream paused.' : 'AI Stream resumed!'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      aiStreamActive ? 'bg-purple-500/10 border-purple-500/50 text-purple-300' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {aiStreamActive ? <><Pause className="h-4 w-4" /> Pause Stream</> : <><Play className="h-4 w-4" /> Resume Stream</>}
                  </button>
                  {/* AutoChallan toggle */}
                  <button
                    onClick={() => { setAutoChallanEnabled(v => !v); triggerToast(!autoChallanEnabled ? '🤖 AutoChallan Bot ENABLED' : '⛔ AutoChallan Bot DISABLED'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      autoChallanEnabled ? 'bg-green-500/10 border-green-500/50 text-green-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    <Bot className="h-4 w-4" />
                    {autoChallanEnabled ? 'AutoChallan: ON' : 'AutoChallan: OFF'}
                  </button>
                  {/* Voice toggle */}
                  <button
                    onClick={() => { setVoiceEnabled(v => !v); triggerToast(!voiceEnabled ? '🔊 AI Voice ON' : '🔇 AI Voice OFF'); }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      voiceEnabled ? 'bg-cyan-500/10 border-cyan-500/50 text-cyan-400' : 'bg-slate-800 border-slate-700 text-slate-400'
                    }`}
                  >
                    {voiceEnabled ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                    Voice Alerts
                  </button>
                </div>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-4 gap-5">
                {[
                  { label: 'Total Auto Detections', value: violations.length,        icon: Cpu,        color: 'text-purple-400', bg: 'bg-purple-500/10 border-purple-500/30' },
                  { label: 'Auto-Challans Issued',  value: autoChallanCount,         icon: Bot,        color: 'text-green-400',  bg: 'bg-green-500/10  border-green-500/30'  },
                  { label: 'Auto Revenue Generated',value: `₹${autoChallanRevenue.toLocaleString()}`, icon: Zap, color: 'text-cyan-400', bg: 'bg-cyan-500/10 border-cyan-500/30' },
                  { label: 'AI Insights Generated', value: aiLog.length,             icon: Sparkles,   color: 'text-amber-400',  bg: 'bg-amber-500/10  border-amber-500/30'  },
                ].map((s, i) => {
                  const Icon = s.icon;
                  return (
                    <div key={i} className={`glass-panel p-5 rounded-2xl border flex items-center gap-4 ${s.bg}`}>
                      <div className={`p-3 bg-slate-900/60 rounded-xl ${s.color}`}><Icon className="h-6 w-6" /></div>
                      <div>
                        <div className="text-[10px] text-slate-400 uppercase font-semibold">{s.label}</div>
                        <div className={`text-2xl font-heading font-extrabold mt-1 ${s.color}`}>{s.value}</div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Main Grid: Live Activity Log + Insight Ticker */}
              <div className="grid grid-cols-3 gap-6">
                {/* Activity Log — col 2 */}
                <div className="col-span-2 glass-panel rounded-2xl p-6 flex flex-col h-[520px]">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="font-heading font-bold text-white flex items-center gap-2">
                      <Activity className="h-5 w-5 text-purple-400" /> AI Activity Log
                    </h3>
                    <span className="text-[9px] bg-purple-500/20 text-purple-400 border border-purple-500/30 py-0.5 px-2.5 rounded font-black uppercase">REAL-TIME</span>
                  </div>
                  <div className="flex-grow overflow-y-auto space-y-2 no-scrollbar pr-1">
                    {aiLog.map((entry, i) => (
                      <div key={i} className={`flex gap-3 p-3 rounded-xl border text-xs transition-all ${
                        entry.type === 'detect' ? 'bg-rose-500/5   border-rose-500/20   text-rose-300'   :
                        entry.type === 'bot'    ? 'bg-green-500/5  border-green-500/20  text-green-300'  :
                        entry.type === 'success'? 'bg-cyan-500/5   border-cyan-500/20   text-cyan-300'   :
                                                  'bg-slate-900/50 border-slate-800/60  text-slate-300'
                      }`}>
                        <span className="text-slate-500 font-mono flex-shrink-0">{entry.ts}</span>
                        <span className="leading-relaxed">{entry.msg}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right col: rotating insights + controls */}
                <div className="col-span-1 flex flex-col gap-5">
                  {/* Live Insight Panel */}
                  <div className="glass-panel p-5 rounded-2xl flex flex-col gap-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="h-5 w-5 text-amber-400" />
                      <h4 className="font-heading font-bold text-white text-sm">Live AI Insight</h4>
                    </div>
                    <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 text-xs text-slate-200 leading-relaxed min-h-[80px] animate-fadeIn" key={liveInsightIdx}>
                      {AI_INSIGHTS_POOL[liveInsightIdx]}
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {AI_INSIGHTS_POOL.map((_, idx) => (
                        <span key={idx} className={`w-2 h-2 rounded-full transition-all ${ idx === liveInsightIdx ? 'bg-amber-400 scale-125' : 'bg-slate-700'}`} />
                      ))}
                    </div>
                  </div>

                  {/* Most Recent Auto-Detection */}
                  {violations.length > 0 && (
                    <div className="glass-panel p-5 rounded-2xl">
                      <div className="flex items-center gap-2 mb-3">
                        <Eye className="h-4 w-4 text-cyan-400" />
                        <h4 className="font-heading font-bold text-white text-sm">Latest Detection</h4>
                      </div>
                      <div className="text-xs space-y-2">
                        <div className="font-bold text-rose-400">{violations[0].violationType}</div>
                        <div className="text-slate-400">{violations[0].location.split(',')[0]}</div>
                        <div className="flex justify-between">
                          <span className="font-heading text-white bg-slate-800 px-2 py-0.5 rounded border border-slate-700">{violations[0].plateNumber}</span>
                          <span className="text-green-400 font-bold">{(violations[0].confidence * 100).toFixed(0)}%</span>
                        </div>
                        <button
                          onClick={() => { setSelectedViolation(violations[0]); setActiveTab('violations'); }}
                          className="w-full mt-2 btn bg-cyan-500 text-slate-900 font-bold rounded-lg py-2 text-xs hover:bg-cyan-400 flex items-center justify-center gap-2"
                        >
                          <ChevronRight className="h-4 w-4" /> View Evidence
                        </button>
                      </div>
                    </div>
                  )}

                  {/* AutoChallan Bot Status */}
                  <div className={`glass-panel p-5 rounded-2xl border-2 ${ autoChallanEnabled ? 'border-green-500/30' : 'border-slate-700/50' }`}>
                    <div className="flex items-center gap-2 mb-3">
                      <Bot className={`h-5 w-5 ${autoChallanEnabled ? 'text-green-400' : 'text-slate-500'}`} />
                      <h4 className="font-heading font-bold text-white text-sm">AutoChallan Bot</h4>
                      <span className={`ml-auto text-[9px] font-black px-2 py-0.5 rounded-full uppercase ${ autoChallanEnabled ? 'bg-green-500/20 text-green-400' : 'bg-slate-800 text-slate-500'}`}>
                        {autoChallanEnabled ? 'ARMED' : 'OFFLINE'}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 mb-3 leading-relaxed">
                      Automatically issues challans for violations with confidence ≥ 92% every 25 seconds. No human intervention needed.
                    </p>
                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="bg-slate-900/60 p-2 rounded-lg">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Issued</div>
                        <div className="text-lg font-heading font-black text-green-400">{autoChallanCount}</div>
                      </div>
                      <div className="bg-slate-900/60 p-2 rounded-lg">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Revenue</div>
                        <div className="text-lg font-heading font-black text-cyan-400">₹{autoChallanRevenue.toLocaleString()}</div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* All Insights Grid */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-amber-400" /> All AI Observations
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  {AI_INSIGHTS_POOL.map((ins, i) => (
                    <div key={i} className="bg-slate-900/50 border border-slate-800/80 p-3 rounded-xl text-xs text-slate-300 leading-relaxed flex gap-2">
                      <ChevronRight className="h-4 w-4 text-purple-400 flex-shrink-0 mt-0.5" />
                      <span>{ins}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ─────────────────────────────────────────────────── */}
          {/* TAB 2: VIOLATIONS & EVIDENCE */}
          {activeTab === 'violations' && (
            <div className="grid grid-cols-3 gap-8 animate-fadeIn">
              {/* Left Column: Log */}
              <div className="glass-panel rounded-2xl p-6 col-span-1 flex flex-col h-[800px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading text-lg font-bold text-white">Incident Stream Queue</h3>
                  <span className="text-[9px] bg-slate-800 border border-slate-700/60 py-0.5 px-2.5 rounded font-black text-cyan-400">AUTO-REFRESHING</span>
                </div>
                <div className="overflow-y-auto space-y-3 flex-grow no-scrollbar">
                  {violations.map(v => {
                    const isDanger = ["Wrong Side Driving", "Red Light Violation", "Triple Riding", "Mobile Phone Usage While Driving"].includes(v.violationType);
                    return (
                      <div 
                        key={v.id}
                        onClick={() => setSelectedViolation(v)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedViolation?.id === v.id 
                            ? 'bg-cyan-500/10 border-cyan-400 shadow-md' 
                            : 'bg-slate-800/35 border-slate-700/60 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>{v.id}</span>
                          <span>{new Date(v.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-sm ${isDanger ? 'text-rose-500' : 'text-amber-400'}`}>{v.violationType}</span>
                          <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-heading">{v.plateNumber}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                          <span>{v.location.split(',')[0]}</span>
                          <span className={`font-bold ${v.status === 'Approved' ? 'text-green-400' : v.status === 'Pending' ? 'text-amber-400' : 'text-rose-500'}`}>{v.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Citizen complaint portal simulation */}
                <form onSubmit={handleCitizenComplaintSubmit} className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <PlusCircle className="h-3.5 w-3.5" /> Integrate Citizen Complaint
                  </span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="License Plate" 
                      value={complaintPlate}
                      onChange={(e) => setComplaintPlate(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-heading font-bold text-white flex-grow focus:outline-none focus:border-cyan-400"
                    />
                    <button type="submit" className="bg-cyan-500 text-slate-900 font-bold rounded text-xs py-1 px-2.5">
                      Upload
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Evidence Details */}
              <div className="col-span-2 space-y-6">
                {selectedViolation ? (
                  <>
                    <div className="glass-panel rounded-2xl p-6 space-y-6">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            {selectedViolation.emergencyFlag && (
                              <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 border border-cyan-400/35 py-1 px-3 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                <AlertOctagon className="h-3.5 w-3.5" /> Emergency Vehicle
                              </span>
                            )}
                            <span className="text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/35 py-1 px-3 rounded-full uppercase tracking-wider">VIOLATION CAPTURE</span>
                            <span className="text-sm text-slate-400">ID: {selectedViolation.id}</span>
                          </div>
                          <h2 className="text-2xl font-heading font-extrabold mt-2 text-white">{selectedViolation.violationType}</h2>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <button 
                            onClick={() => setShowReceiptModal(true)}
                            className="btn bg-cyan-500 text-slate-900 hover:bg-cyan-400 py-2.5 text-xs rounded-xl font-bold flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" /> View Official Challan
                          </button>
                          <button 
                            onClick={() => { setWhatsAppChallan(selectedViolation); setShowWhatsApp(true); speakAlert('WhatsApp challan preview loaded.'); }}
                            className="btn py-2.5 text-xs rounded-xl font-bold flex items-center gap-2 border"
                            style={{ background: '#075e54', color: '#fff', borderColor: '#075e54' }}
                          >
                            📱 WhatsApp Preview
                          </button>
                          <button 
                            onClick={() => triggerToast(`Evidence report PDF generated for ${selectedViolation.id}`)}
                            className="btn btn-outline border-slate-700 hover:border-cyan-400 py-2.5 text-xs rounded-xl text-slate-200"
                          >
                            <Download className="h-4 w-5 text-cyan-400" /> Export PDF Evidence
                          </button>
                        </div>
                      </div>

                      {/* Side-by-Side Images */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-xs text-slate-400 mb-2 block font-semibold">Original CCTV Camera Feed</span>
                          <div className="relative aspect-video rounded overflow-hidden bg-slate-900 border border-slate-800">
                            <img src={selectedViolation.imagePath} className="w-full h-full object-cover" alt="Original CCTV" />
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-cyan-400 mb-2 block font-semibold flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-cyan-400" /> YOLOv8 Annotated Bounding Boxes</span>
                          <div className="relative aspect-video rounded overflow-hidden bg-slate-900 border border-slate-800">
                            <img src={selectedViolation.imagePath} className="w-full h-full object-cover filter brightness-90" alt="Annotated CCTV" />
                            {/* Bounding box simulation overlay */}
                            <div className="absolute border-2 border-red-500 animate-pulse bg-red-500/10" style={{
                              left: `${(selectedViolation.annotatedBox.x / 640) * 100}%`,
                              top: `${(selectedViolation.annotatedBox.y / 360) * 100}%`,
                              width: `${(selectedViolation.annotatedBox.width / 640) * 100}%`,
                              height: `${(selectedViolation.annotatedBox.height / 360) * 100}%`,
                            }}>
                              <span className="absolute -top-5 left-0 text-[9px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 uppercase tracking-wider">
                                {selectedViolation.violationType}: {(selectedViolation.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detail Metrics */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                          <span className="text-xs text-slate-400 uppercase font-semibold">Location & Camera</span>
                          <div className="mt-2 text-sm font-bold text-white flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                            <span>{selectedViolation.location} ({selectedViolation.cameraId})</span>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                          <span className="text-xs text-slate-400 uppercase font-semibold">AI Prediction Confidence</span>
                          <div className="mt-2 text-sm font-bold text-white flex items-center gap-2">
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-cyan-400 h-full" style={{ width: `${selectedViolation.confidence * 100}%` }}></div>
                            </div>
                            <span className="text-cyan-400">{(selectedViolation.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                          <span className="text-xs text-slate-400 uppercase font-semibold">Vehicle details (Vahan)</span>
                          <div className="mt-2 text-xs font-bold text-white flex flex-col gap-1">
                            <div>Type: <strong className="text-cyan-400">{selectedViolation.vehicleType}</strong></div>
                            <div>State: <strong className="text-cyan-400">{selectedViolation.state}</strong></div>
                          </div>
                        </div>
                      </div>

                      {/* AI Explainability block */}
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                        <span className="text-xs text-cyan-400 uppercase font-bold flex items-center gap-1">
                          <Zap className="h-4 w-4 text-cyan-400" /> AI Explainability Log
                        </span>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedViolation.explainability}</p>
                      </div>

                      {/* Risk Scoring & Enforcement Decision */}
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                        {/* Risk Gauge */}
                        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/80 flex items-center gap-5">
                          <div className="w-20 h-20 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                            <span className={`text-xl font-heading font-black ${getRiskScore(selectedViolation.plateNumber).color}`}>
                              {getRiskScore(selectedViolation.plateNumber).score}
                            </span>
                            {/* Gauge title */}
                            <span className="absolute -bottom-3 text-[10px] uppercase tracking-wider font-bold bg-slate-950 px-2 border border-slate-800 text-slate-400 rounded">
                              RISK
                            </span>
                          </div>
                          <div>
                            <div className="font-heading text-lg font-extrabold text-white flex items-center gap-2">
                              <span>{getRiskScore(selectedViolation.plateNumber).category}</span>
                              {getRiskScore(selectedViolation.plateNumber).count > 1 && (
                                <span className="bg-rose-500/10 border border-rose-500/35 text-[9px] font-black text-rose-500 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                  <Award className="h-3 w-3" /> HABITUAL OFFENDER
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Calculated via incident frequencies, violation categories, and local intersection risks.</p>
                          </div>
                        </div>

                        {/* Decision Engine Recommendations */}
                        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">AI ENFORCEMENT RECOMMENDATION</span>
                            <div className="font-heading text-lg font-black text-slate-200 mt-1">
                              {getAIRecommendation(selectedViolation.confidence, getRiskScore(selectedViolation.plateNumber).score).action}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {getAIRecommendation(selectedViolation.confidence, getRiskScore(selectedViolation.plateNumber).score).detail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Human-in-the-loop actions */}
                      <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manual OCR Edit:</span>
                            <input 
                              type="text" 
                              defaultValue={selectedViolation.plateNumber} 
                              id="input-plate-edit"
                              className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-sm font-heading font-bold text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          
                          {selectedViolation.status === 'Pending' && (
                            <div className="flex gap-3">
                              <button 
                                onClick={() => {
                                  const plateVal = document.getElementById('input-plate-edit')?.value;
                                  const fbVal = document.getElementById('input-review-feedback')?.value;
                                  handleReview(selectedViolation.id, 'Approved', plateVal, fbVal);
                                }}
                                className="btn bg-green-500 text-slate-900 font-bold rounded-lg text-xs py-2.5 px-4"
                              >
                                Approve Challan
                              </button>
                              <button 
                                onClick={() => {
                                  const fbVal = document.getElementById('input-review-feedback')?.value;
                                  handleReview(selectedViolation.id, 'Rejected', null, fbVal);
                                }}
                                className="btn bg-rose-500 text-white font-bold rounded-lg text-xs py-2.5 px-4"
                              >
                                Reject Frame
                              </button>
                            </div>
                          )}
                        </div>

                        {selectedViolation.status === 'Pending' && (
                          <div className="flex items-center gap-3 border-t border-slate-800/60 pt-3">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Feedback Loop:</span>
                            <input 
                              type="text" 
                              placeholder="Optional false-positive review comments..."
                              id="input-review-feedback"
                              className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-xs text-slate-300 w-full focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        )}
                      </div>

                      {/* WhatsApp Dispatch simulator */}
                      {selectedViolation.status === 'Approved' && (
                        <div className="bg-green-500/5 border border-green-500/20 p-5 rounded-xl flex items-center justify-between animate-fadeIn">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-green-400 uppercase tracking-wider block">Automated Dispatch Complete</span>
                              <p className="text-xs text-slate-400 mt-1">E-Challan SMS & WhatsApp notification pushed to offender's Vahan linked mobile number (+91 99****8891).</p>
                            </div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 w-72 text-left shadow-lg">
                            <span className="text-[9px] text-green-400 font-bold tracking-wider block uppercase">💬 WhatsApp Notification Preview</span>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] text-slate-300 mt-1.5 leading-relaxed font-sans">
                              <strong>BTP Traffic Alert:</strong> A violation challan of <strong>₹500</strong> has been issued to vehicle <strong>{selectedViolation.plateNumber}</strong> for <strong>{selectedViolation.violationType}</strong> at <strong>{selectedViolation.location.split(',')[0]}</strong>.<br />
                              <span className="text-blue-400 underline cursor-pointer mt-1 block">View evidence: btp.gov.in/v/{selectedViolation.id}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="glass-panel rounded-2xl p-10 text-center text-slate-400">
                    No violations currently indexed.
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: CITY HEATMAP */}
          {activeTab === 'heatmap' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="glass-panel p-6 rounded-2xl">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white mb-2">City Intelligence Intersection Overlays</h3>
                    <p className="text-xs text-slate-400">Real-time GPS heatmap overlay representing high-risk corridors, Metro Stations, and Event zone parking bottlenecks.</p>
                  </div>
                  <div className="flex gap-4">
                    <div className="bg-slate-800/40 border border-slate-700/60 p-3 rounded-lg text-right">
                      <span className="text-[9px] text-slate-400 block font-semibold">HIGH-RISK CORRIDORS</span>
                      <span className="text-xs font-bold text-rose-500">3 Active Alert Zones</span>
                    </div>
                  </div>
                </div>

                {/* SVG Map simulation */}
                <div className="relative w-full aspect-[21/9] bg-slate-950 rounded-2xl border border-slate-800/80 overflow-hidden flex items-center justify-center">
                  <svg className="absolute inset-0 w-full h-full opacity-40" viewBox="0 0 1000 400" fill="none">
                    {/* Simulated city grid roads */}
                    <path d="M 0,100 L 1000,100 M 0,200 L 1000,200 M 0,300 L 1000,300 M 150,0 L 150,400 M 450,0 L 450,400 M 750,0 L 750,400" stroke={isDarkMode ? "#00e5ff" : "#475569"} strokeWidth="1.5" strokeDasharray="6 6" />
                    <circle cx="150" cy="100" r="80" stroke="#ff2a5f" strokeWidth="2" fill="rgba(255, 42, 95, 0.03)" />
                    <circle cx="450" cy="200" r="120" stroke="#ff2a5f" strokeWidth="2" fill="rgba(255, 42, 95, 0.03)" />
                    <circle cx="750" cy="300" r="60" stroke="#ff9f1c" strokeWidth="2" fill="rgba(255, 159, 28, 0.03)" />
                  </svg>

                  {/* Hotspots pulser */}
                  <div className="absolute top-[25%] left-[15%] text-center">
                    <span className="flex h-6 w-6 relative justify-center mx-auto mb-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-500"></span>
                    </span>
                    <span className="text-[10px] font-bold bg-slate-900/90 border border-slate-700/80 rounded px-2 py-0.5">SILK BOARD (CRITICAL)</span>
                  </div>

                  <div className="absolute top-[50%] left-[45%] text-center">
                    <span className="flex h-6 w-6 relative justify-center mx-auto mb-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-rose-500"></span>
                    </span>
                    <span className="text-[10px] font-bold bg-slate-900/90 border border-slate-700/80 rounded px-2 py-0.5">INDIRANAGAR METRO (HIGH)</span>
                  </div>

                  <div className="absolute top-[75%] left-[75%] text-center">
                    <span className="flex h-6 w-6 relative justify-center mx-auto mb-1">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-6 w-6 bg-amber-500"></span>
                    </span>
                    <span className="text-[10px] font-bold bg-slate-900/90 border border-slate-700/80 rounded px-2 py-0.5">KORAMANGALA MARKET (MODERATE)</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: OFFENDERS DB */}
          {activeTab === 'offenders' && (
            <div className="space-y-6 animate-fadeIn">

              {/* 🔍 Stolen Vehicle Plate Checker */}
              <div className="glass-panel p-6 rounded-2xl border border-rose-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-rose-500/10 rounded-xl"><ShieldAlert className="h-5 w-5 text-rose-400" /></div>
                  <div>
                    <h3 className="font-heading font-bold text-white">AI Instant Plate Intelligence Check</h3>
                    <p className="text-[11px] text-slate-400">Cross-references Vahan DB, stolen vehicle registry, and BTP challan database.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter plate number (e.g. KA-03-MX-8891)"
                    value={plateCheckerInput}
                    onChange={e => setPlateCheckerInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePlateCheck()}
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-heading font-bold focus:outline-none focus:border-rose-400 uppercase"
                  />
                  <button
                    onClick={handlePlateCheck}
                    className="btn bg-rose-500 text-white font-bold rounded-xl px-6 py-2.5 text-sm hover:bg-rose-400 flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" /> Check Plate
                  </button>
                  <button
                    onClick={() => { setPlateCheckerInput('KA-03-MX-8891'); }}
                    className="btn bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-xl px-4 py-2.5 text-xs hover:border-rose-500"
                  >Try Stolen Plate</button>
                </div>
                {/* Result */}
                {plateCheckerResult && (
                  <div className={`mt-4 p-4 rounded-xl border animate-fadeIn ${
                    plateCheckerResult.type === 'stolen'     ? 'bg-rose-500/10 border-rose-500/30' :
                    plateCheckerResult.type === 'violations' ? 'bg-amber-500/10 border-amber-500/30' :
                                                               'bg-green-500/10 border-green-500/30'
                  }`}>
                    {plateCheckerResult.type === 'stolen' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <AlertOctagon className="h-6 w-6 text-rose-400 flex-shrink-0 animate-pulse" />
                          <div>
                            <div className="font-heading font-extrabold text-rose-400 text-base">🚨 STOLEN / FLAGGED VEHICLE</div>
                            <div className="text-xs text-rose-300 mt-0.5">{plateCheckerResult.data.reason}</div>
                          </div>
                          <span className={`ml-auto text-[10px] font-black px-2 py-1 rounded uppercase ${
                            plateCheckerResult.data.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
                            plateCheckerResult.data.severity === 'HIGH'     ? 'bg-orange-500 text-white' :
                                                                               'bg-amber-500 text-slate-900'
                          }`}>{plateCheckerResult.data.severity}</span>
                        </div>
                        {plateCheckerResult.violations?.length > 0 && (
                          <div className="text-xs text-slate-400">Also found {plateCheckerResult.violations.length} recorded BTP violation(s) for this vehicle.</div>
                        )}
                        <button onClick={() => triggerToast('Alert broadcast sent to all active patrol units!')} className="btn bg-rose-500 text-white font-bold rounded-lg py-2 px-4 text-xs hover:bg-rose-400">📢 Broadcast Alert to All Units</button>
                      </div>
                    )}
                    {plateCheckerResult.type === 'violations' && (
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        <div>
                          <div className="font-bold text-amber-400">⚠️ {plateCheckerResult.violations.length} Violation(s) Found</div>
                          <div className="text-xs text-slate-400 mt-1">{plateCheckerResult.violations.map(v => v.violationType).join(' · ')}</div>
                        </div>
                      </div>
                    )}
                    {plateCheckerResult.type === 'clean' && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <div className="font-bold text-green-400">✅ Plate is CLEAN — No alerts or violations found.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-heading text-lg font-bold text-white mb-4">Search Offenders Database</h3>
                <div className="flex gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by License Plate (e.g. KA-03-MX-8891)..."
                      value={offenderSearch}
                      onChange={(e) => setOffenderSearch(e.target.value)}
                      className="bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 w-full text-slate-200 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">All Violation Types</option>
                    <option value="Helmet Non Compliance">Helmet Non Compliance</option>
                    <option value="Illegal Parking">Illegal Parking</option>
                    <option value="Triple Riding">Triple Riding</option>
                  </select>
                </div>
              </div>

              {/* Log Table results */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/85">
                <div className="table-responsive">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-heading">
                        <th className="p-4 font-semibold uppercase">Incident ID</th>
                        <th className="p-4 font-semibold uppercase">Plate Number</th>
                        <th className="p-4 font-semibold uppercase">Violation Type</th>
                        <th className="p-4 font-semibold uppercase">Location</th>
                        <th className="p-4 font-semibold uppercase">Confidence</th>
                        <th className="p-4 font-semibold uppercase">Risk Score</th>
                        <th className="p-4 font-semibold uppercase">Review Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredViolations
                        .filter(v => offenderSearch === '' || v.plateNumber.toLowerCase().includes(offenderSearch.toLowerCase()))
                        .map(v => {
                          const risk = getRiskScore(v.plateNumber);
                          return (
                            <tr key={v.id} className="border-b border-slate-800/60 hover:bg-slate-900/20">
                              <td className="p-4 font-bold text-slate-300">{v.id}</td>
                              <td className="p-4 font-heading font-semibold text-white">{v.plateNumber}</td>
                              <td className="p-4 text-cyan-400 font-bold">{v.violationType}</td>
                              <td className="p-4 text-slate-400">{v.location.split(',')[0]}</td>
                              <td className="p-4 font-bold">{(v.confidence * 100).toFixed(1)}%</td>
                              <td className="p-4"><span className={`font-black ${risk.color}`}>{risk.score} ({risk.category})</span></td>
                              <td className="p-4"><span className={`text-[10px] font-bold py-0.5 px-2.5 rounded-full ${
                                v.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : v.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              }`}>{v.status}</span></td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: PATROL DISPATCH */}
          {activeTab === 'patrol' && (
            <div className="space-y-6 animate-fadeIn">
              <div className="grid grid-cols-3 gap-8">
                {patrols.map((patrol, idx) => (
                  <div key={idx} className="glass-panel p-6 rounded-2xl flex flex-col justify-between h-72">
                    <div>
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-heading text-lg font-bold text-white">{patrol.name}</h4>
                          <span className="text-[11px] text-slate-400">Vehicle ID: {patrol.vehicleId}</span>
                        </div>
                        <span className={`text-[10px] font-extrabold uppercase py-0.5 px-2.5 rounded-full ${
                          patrol.status === 'Available' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                        }`}>
                          {patrol.status}
                        </span>
                      </div>
                      
                      {/* Officer metrics */}
                      <div className="mt-4 grid grid-cols-3 gap-2 border-b border-slate-800/80 pb-3 mb-3 text-center">
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase">HANDLED</span>
                          <strong className="text-xs text-white">{patrol.casesHandled} cases</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase">RESPONSE</span>
                          <strong className="text-xs text-white">{patrol.responseTime}</strong>
                        </div>
                        <div>
                          <span className="text-[9px] text-slate-400 block font-semibold uppercase">CLEARED</span>
                          <strong className="text-xs text-green-400">{patrol.cleared}</strong>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <MapPin className="h-4 w-4 text-cyan-400" />
                        <span>Distance: {patrol.distance} away from current active hotspot</span>
                      </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                      {patrol.status === 'Available' ? (
                        <button 
                          onClick={() => handleDispatch(patrol.name, 'dispatch')}
                          className="w-full btn bg-cyan-500 text-slate-900 font-bold rounded-lg py-2.5 text-xs hover:bg-cyan-400"
                        >
                          Dispatch Patrol Unit
                        </button>
                      ) : (
                        <button 
                          onClick={() => handleDispatch(patrol.name, 'recall')}
                          className="w-full btn bg-slate-800 text-slate-300 font-bold rounded-lg py-2.5 text-xs border border-slate-700 hover:border-rose-500 hover:text-rose-500"
                        >
                          Recall Unit
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* 🏆 Officer Leaderboard */}
              <div className="glass-panel p-6 rounded-2xl">
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white flex items-center gap-2">
                      <Award className="h-5 w-5 text-amber-400" /> Officer Performance Leaderboard
                    </h3>
                    <p className="text-xs text-slate-400 mt-1">Gamified ranking based on cases handled, response time, and clearance rate.</p>
                  </div>
                  <span className="text-[9px] bg-amber-500/10 border border-amber-500/30 text-amber-400 font-black px-2.5 py-1 rounded uppercase tracking-wider">SEASON 2026</span>
                </div>
                <div className="space-y-3">
                  {[...patrols].sort((a,b) => b.points - a.points).map((p, rank) => (
                    <div key={p.name} className={`flex items-center gap-4 p-4 rounded-xl border transition-all ${
                      rank === 0 ? 'bg-amber-500/5 border-amber-500/20' :
                      rank === 1 ? 'bg-slate-400/5 border-slate-400/20' :
                      rank === 2 ? 'bg-orange-500/5 border-orange-500/20' :
                      'bg-slate-900/40 border-slate-800/60'
                    }`}>
                      {/* Rank badge */}
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-heading font-black text-sm flex-shrink-0 ${
                        rank === 0 ? 'bg-amber-500 text-slate-900' :
                        rank === 1 ? 'bg-slate-400 text-slate-900' :
                        rank === 2 ? 'bg-orange-600 text-white' :
                        'bg-slate-800 text-slate-400'
                      }`}>{rank + 1}</div>
                      {/* Avatar */}
                      <div className="w-9 h-9 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center font-bold text-cyan-400 text-xs flex-shrink-0">
                        {p.name.split(' ').map(w => w[0]).slice(1,3).join('')}
                      </div>
                      {/* Name & badge */}
                      <div className="flex-grow">
                        <div className="font-bold text-white text-sm">{p.name}</div>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={`text-[9px] font-black px-1.5 py-0.5 rounded uppercase ${
                            p.badge === 'Elite'  ? 'bg-amber-500/20 text-amber-400' :
                            p.badge === 'Expert' ? 'bg-purple-500/20 text-purple-400' :
                            'bg-slate-800 text-slate-400'
                          }`}>{p.badge}</span>
                          <span className="text-[10px] text-amber-400">
                            {'★'.repeat(p.stars)}{'☆'.repeat(5 - p.stars)}
                          </span>
                        </div>
                      </div>
                      {/* Stats */}
                      <div className="text-center">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Handled</div>
                        <div className="font-bold text-white text-sm">{p.casesHandled}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Response</div>
                        <div className="font-bold text-cyan-400 text-sm">{p.responseTime}</div>
                      </div>
                      <div className="text-center min-w-[70px]">
                        <div className="text-[9px] text-slate-400 uppercase font-semibold">Points</div>
                        <div className={`font-heading font-black text-lg ${
                          rank === 0 ? 'text-amber-400' : rank === 1 ? 'text-slate-300' : rank === 2 ? 'text-orange-400' : 'text-slate-400'
                        }`}>{p.points.toLocaleString()}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 7: PREDICTIVE & SAFETY */}
          {activeTab === 'predictive' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Traffic Safety Index */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-heading text-lg font-bold text-white mb-2">BTP City Traffic Safety Index</h3>
                <p className="text-xs text-slate-400 mb-6">Traffic Safety scores calculated by combining driver helmet adherence rates, illegal double-parking indices, and accident data logs.</p>
                <div className="grid grid-cols-3 gap-6">
                  {[
                    { location: "MG Road Corridor", score: "84/100", category: "Optimal Safety", color: "text-green-400", bg: "bg-green-500/10" },
                    { location: "Silk Board Intersection", score: "41/100", category: "Critical Risk Area", color: "text-rose-500", bg: "bg-rose-500/10" },
                    { location: "Koramangala 80ft Road", score: "72/100", category: "Moderate Risk", color: "text-yellow-400", bg: "bg-yellow-500/10" }
                  ].map((idxObj, idx) => (
                    <div key={idx} className={`p-4 rounded-xl border border-slate-800/80 ${idxObj.bg} flex items-center justify-between`}>
                      <div>
                        <span className="text-[10px] text-slate-400 block font-semibold uppercase">{idxObj.location}</span>
                        <span className={`text-2xl font-heading font-black block mt-1 ${idxObj.color}`}>{idxObj.score}</span>
                      </div>
                      <span className="text-xs text-slate-300 font-bold">{idxObj.category}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Grid Layout: Forecast & Camera Effectiveness */}
              <div className="grid grid-cols-2 gap-8">
                {/* Predictive Forecasting */}
                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white mb-2">AI Predictive Violation Forecasting</h3>
                    <p className="text-xs text-slate-400 mb-6">Deep Learning time-series models forecasting high violation periods for tactical patrol deployments.</p>
                    
                    <div className="space-y-4">
                      {[
                        { time: "Tomorrow (6 PM - 8 PM)", location: "Indiranagar Metro Station", change: "+28% Parking Violations predicted", color: "text-rose-400" },
                        { time: "Friday (8 AM - 10 AM)", location: "Hebbal Flyover Corridor", change: "+15% Speed / Helmet infractions forecasted", color: "text-amber-400" }
                      ].map((item, idx) => (
                        <div key={idx} className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/85">
                          <span className="text-xs text-cyan-400 font-bold block">{item.time}</span>
                          <div className="text-sm font-bold text-white mt-1">{item.location}</div>
                          <span className={`text-xs mt-1 block font-semibold ${item.color}`}>{item.change}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-850 p-4 rounded-xl border border-slate-800 mt-6">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">AI PATROL DEPLOYMENT RECOMMENDATION</span>
                    <p className="text-xs text-slate-200 mt-1"><strong>Action:</strong> Deploy 3 officers and 2 tow vehicles near Indiranagar Metro Station between 5:30 PM and 8:30 PM tomorrow.</p>
                  </div>
                </div>

                {/* Camera Effectiveness */}
                <div className="glass-panel p-6 rounded-2xl">
                  <h3 className="font-heading text-lg font-bold text-white mb-4">Traffic Camera Effectiveness Score</h3>
                  <div className="h-64 flex items-center justify-center">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={[
                        { name: 'CAM-04', violations: 1200 },
                        { name: 'CAM-12', violations: 950 },
                        { name: 'CAM-08', violations: 820 },
                        { name: 'CAM-15', violations: 610 },
                        { name: 'CAM-21', violations: 410 }
                      ]}>
                        <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                        <YAxis stroke="#64748b" fontSize={11} />
                        <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155' }} />
                        <Bar dataKey="violations" fill="#00e5ff" radius={[4, 4, 0, 0]}>
                          <Cell fill="#ff2a5f" />
                          <Cell fill="#00e5ff" />
                          <Cell fill="#00e5ff" />
                          <Cell fill="#00e5ff" />
                          <Cell fill="#00e5ff" />
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: SYSTEM CONFIG & PERFORMANCE EVALUATION */}
          {activeTab === 'config' && (
            <>
              {/* Sliders & Configuration */}
              <div className="grid grid-cols-2 gap-8 animate-fadeIn">
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                  <h3 className="font-heading text-lg font-bold text-white mb-4">Edge AI Model Parameters</h3>
                  
                  {/* Sliders */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 font-semibold mb-2">
                        <span>YOLOv8 Detection Confidence Threshold</span>
                        <span className="text-cyan-400 font-bold">{(yoloConfidence * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="0.99" 
                        step="0.05"
                        value={yoloConfidence} 
                        onChange={(e) => setYoloConfidence(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 font-semibold mb-2">
                        <span>EasyOCR Character Recurrent Matching threshold</span>
                        <span className="text-cyan-400 font-bold">{(ocrSensitivity * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.6" 
                        max="0.99" 
                        step="0.05"
                        value={ocrSensitivity} 
                        onChange={(e) => setOcrSensitivity(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div>
                      <div className="text-sm font-bold text-white">Retinex IR Night Exposure Booster</div>
                      <p className="text-[11px] text-slate-400 mt-1">Pre-processing filters designed to maximize plate contrast in low exposure night feeds.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={irExposure}
                      onChange={(e) => setIrExposure(e.target.checked)}
                      className="w-5 h-5 accent-cyan-400"
                    />
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white mb-4">System Predictions & Throughput</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Edge CPU Throughput</span>
                        <span className="text-sm font-bold text-white">{(60 * (1 - (yoloConfidence - 0.5))).toFixed(0)} FPS</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Projected AI False Positive Rate</span>
                        <span className="text-sm font-bold text-emerald-400">{(5 * (1 - (yoloConfidence - 0.5))).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerToast("AI model weights redeployed across all edge junctions")}
                    className="w-full btn bg-cyan-500 text-slate-900 font-bold rounded-xl py-3 mt-6 hover:bg-cyan-400"
                  >
                    Deploy Model Weights
                  </button>
                </div>
              </div>

              {/* Performance Evaluation (mAP, Precision, Recall, F1 curves) */}
              <div className="grid grid-cols-3 gap-8 mt-8 animate-fadeIn">
                {/* Precision-Recall Curve */}
                <div className="glass-panel p-6 rounded-2xl col-span-2">
                  <h3 className="font-heading text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ChartIcon className="h-5 w-5 text-cyan-400" /> Precision-Recall Validation Curve
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Validating model classification quality. Current mAP@0.5 score: <strong>0.941</strong></p>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={prCurveData}>
                        <XAxis dataKey="recall" label={{ value: 'Recall', position: 'insideBottom', offset: -5, fill: '#64748b' }} stroke="#64748b" fontSize={10} />
                        <YAxis label={{ value: 'Precision', angle: -90, position: 'insideLeft', fill: '#64748b' }} stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155' }} />
                        <Area type="monotone" dataKey="precision" stroke="#39ff14" fill="rgba(57, 255, 20, 0.05)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Device Scalability Matrix */}
                <div className="glass-panel p-6 rounded-2xl col-span-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white mb-2">Computational Scalability</h3>
                    <p className="text-xs text-slate-400 mb-4">Edge deployment benchmarks tested across hardware devices.</p>
                    
                    <div className="space-y-3 text-xs">
                      {[
                        { device: "NVIDIA Jetson Nano", fps: "15 FPS", watt: "8W power", status: "Compatible" },
                        { device: "NVIDIA Jetson Xavier", fps: "45 FPS", watt: "15W power", status: "Optimal" },
                        { device: "Intel NUC i7 Core", fps: "30 FPS", watt: "25W power", status: "Compatible" },
                        { device: "AI Edge Rack Server", fps: "120 FPS", watt: "150W power", status: "Enterprise" }
                      ].map((dev, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                          <div>
                            <span className="font-bold text-white block">{dev.device}</span>
                            <span className="text-[10px] text-slate-400">{dev.watt}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-cyan-400 font-extrabold block">{dev.fps}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-black">{dev.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI Configurator */}
              <div className="glass-panel p-6 rounded-2xl mt-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white">Interactive Edge Region of Interest (ROI) Configurator</h3>
                    <p className="text-xs text-slate-400 mt-1">Click on the feed image below to draw the neon boundary points for AI No Parking zone masks dynamically.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setRoiPoints([]); triggerToast("ROI Boundary mask cleared.") }}
                      className="btn btn-outline border-slate-750 hover:border-rose-500 hover:text-rose-500 rounded-xl text-xs py-2 px-4"
                    >
                      Clear Coordinates
                    </button>
                    <button 
                      onClick={() => { triggerToast(`Deployed ROI polygon with ${roiPoints.length} points to CAM-12!`); setRoiPoints([]) }}
                      className="btn bg-cyan-500 text-slate-900 font-bold rounded-xl text-xs py-2 px-4"
                      disabled={roiPoints.length < 3}
                    >
                      Deploy Mask to Cam
                    </button>
                  </div>
                </div>

                <div className="relative max-w-2xl mx-auto aspect-video rounded-xl border border-slate-800 overflow-hidden bg-slate-950 cursor-crosshair group">
                  <img 
                    src="/assets/cam_parking.png" 
                    alt="ROI Config Feed" 
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  
                  {/* Clicking Canvas */}
                  <div 
                    className="absolute inset-0"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setRoiPoints(prev => [...prev, { x, y }]);
                    }}
                  />

                  {/* SVG Drawing Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {roiPoints.map((pt, i) => (
                      <circle key={i} cx={`${pt.x}%`} cy={`${pt.y}%`} r="6" fill="#00e5ff" className="animate-pulse shadow-glow" />
                    ))}
                    {roiPoints.length > 1 && (
                      <polyline
                        points={roiPoints.map(pt => `${pt.x}%,${pt.y}%`).join(' ')}
                        fill="rgba(0, 229, 255, 0.15)"
                        stroke="#00e5ff"
                        strokeWidth="2.5"
                        className="dash-draw-line"
                        style={{ strokeDasharray: '4 4' }}
                      />
                    )}
                    {/* Connect last to first for closed loop */}
                    {roiPoints.length > 2 && (
                      <line
                        x1={`${roiPoints[roiPoints.length - 1].x}%`}
                        y1={`${roiPoints[roiPoints.length - 1].y}%`}
                        x2={`${roiPoints[0].x}%`}
                        y2={`${roiPoints[0].y}%`}
                        stroke="#00e5ff"
                        strokeWidth="2.5"
                        style={{ strokeDasharray: '4 4' }}
                      />
                    )}
                  </svg>

                  {/* Help guide tip */}
                  {roiPoints.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none group-hover:bg-black/45 transition-all">
                      <span className="text-xs text-cyan-400 font-bold bg-slate-900 border border-slate-700/60 px-4 py-2 rounded-lg tracking-wider uppercase">
                        🖱️ Click anywhere on feed to draw custom region
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}

          {/* TAB: EMERGENCY SIGNAL OVERRIDE */}
          {activeTab === 'emergency' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Emergency Alert Banner */}
              <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 flex items-center gap-4">
                <div className="p-3 bg-rose-500/20 rounded-xl"><Zap className="h-7 w-7 text-rose-400 animate-pulse" /></div>
                <div className="flex-grow">
                  <div className="font-heading font-black text-rose-400 text-lg">Emergency Vehicle Corridor Management</div>
                  <div className="text-xs text-slate-400 mt-1">Override traffic signals to create a clear corridor for ambulances, fire brigades, and VIP convoys. AI auto-calculates optimal green-wave path.</div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-slate-400 uppercase font-semibold">Override Active</div>
                  <div className="text-2xl font-heading font-black text-rose-400">{signals.filter(s=>s.override).length}</div>
                </div>
              </div>

              {/* Dispatch Input */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-white mb-4 flex items-center gap-2"><Radio className="h-5 w-5 text-cyan-400" /> Emergency Vehicle Dispatch</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">Vehicle Type</label>
                    <select value={emergencyVehicle} onChange={e => setEmergencyVehicle(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400">
                      <option value="">Select Type...</option>
                      <option value="ambulance">🚑 Ambulance</option>
                      <option value="fire">🚒 Fire Brigade</option>
                      <option value="police">🚓 Police Emergency</option>
                      <option value="vip">🚗 VIP Convoy</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-[10px] text-slate-400 uppercase font-semibold block mb-1.5">Route / Destination</label>
                    <input type="text" placeholder="e.g. Bowring Hospital" value={emergencyRoute} onChange={e => setEmergencyRoute(e.target.value)}
                      className="w-full bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-rose-400" />
                  </div>
                  <div className="flex items-end">
                    <button
                      onClick={() => {
                        if (!emergencyVehicle) return;
                        setSignals(prev => prev.map(s => ({ ...s, override: true, phase: 'GREEN', timer: 120 })));
                        speakAlert(`Emergency corridor activated for ${emergencyVehicle}. All 6 signals switched to green wave mode.`);
                        triggerToast(`🚨 Green wave activated for ${emergencyVehicle} — all signals cleared!`);
                      }}
                      className="w-full btn bg-rose-500 hover:bg-rose-400 text-white font-black rounded-xl py-2.5 text-sm flex items-center justify-center gap-2">
                      <Zap className="h-4 w-4" /> Activate Green Wave
                    </button>
                  </div>
                </div>
              </div>

              {/* Signal Grid */}
              <div className="grid grid-cols-3 gap-5">
                {signals.map((sig, i) => (
                  <div key={sig.id} className={`glass-panel p-5 rounded-2xl border-2 transition-all ${
                    sig.override ? 'border-green-500/60 shadow-lg shadow-green-500/10' :
                    sig.phase === 'RED' ? 'border-rose-500/30' :
                    sig.phase === 'GREEN' ? 'border-green-500/30' : 'border-amber-500/30'
                  }`}>
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <div className="text-[10px] text-slate-400 font-semibold uppercase">{sig.id}</div>
                        <div className="font-heading font-bold text-white text-sm mt-0.5">{sig.name}</div>
                      </div>
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center text-lg shadow-lg ${
                        sig.phase === 'RED'   ? 'bg-rose-500 shadow-rose-500/40' :
                        sig.phase === 'GREEN' ? 'bg-green-500 shadow-green-500/40' :
                                               'bg-amber-500 shadow-amber-500/40'
                      } ${sig.override ? 'animate-pulse' : ''}`}>
                        {sig.phase === 'RED' ? '🔴' : sig.phase === 'GREEN' ? '🟢' : '🟡'}
                      </div>
                    </div>
                    <div className="space-y-2 text-xs">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Phase</span>
                        <span className={`font-black ${ sig.phase === 'RED' ? 'text-rose-400' : sig.phase === 'GREEN' ? 'text-green-400' : 'text-amber-400'}`}>{sig.phase}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Timer</span>
                        <span className="font-bold text-white">{sig.timer}s</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Density</span>
                        <span className={`font-bold ${ sig.density === 'CRITICAL' ? 'text-rose-400' : sig.density === 'HIGH' ? 'text-orange-400' : sig.density === 'MODERATE' ? 'text-amber-400' : 'text-green-400'}`}>{sig.density}</span>
                      </div>
                      {sig.override && <div className="text-green-400 font-black text-[10px] flex items-center gap-1"><span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-ping" />OVERRIDE ACTIVE</div>}
                    </div>
                    <div className="flex gap-2 mt-4">
                      <button onClick={() => {
                        setSignals(prev => prev.map((s,j) => j===i ? {...s, phase: 'GREEN', timer: 120, override: true} : s));
                        speakAlert(`Signal ${sig.id} at ${sig.name} forced to green.`);
                        triggerToast(`${sig.id} forced GREEN`);
                      }} className="flex-1 btn bg-green-500/20 border border-green-500/30 text-green-400 font-bold rounded-lg py-1.5 text-[10px] hover:bg-green-500/30">Force GREEN</button>
                      <button onClick={() => {
                        setSignals(prev => prev.map((s,j) => j===i ? {...s, override: false, phase: sig.phase} : s));
                        triggerToast(`${sig.id} override cleared`);
                      }} className="flex-1 btn bg-slate-800 border border-slate-700 text-slate-400 font-bold rounded-lg py-1.5 text-[10px] hover:border-slate-500">Reset</button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Reset all */}
              <button onClick={() => {
                setSignals(SIGNAL_JUNCTIONS.map(s => ({...s, override: false})));
                triggerToast('All signal overrides cleared. Returning to normal timing.');
                speakAlert('All signal overrides cleared. Normal traffic flow resumed.');
              }} className="w-full btn bg-slate-800 border border-rose-500/30 text-rose-400 font-bold rounded-xl py-3 text-sm hover:bg-rose-500/10">
                🔁 Clear All Overrides — Resume Normal Signal Timing
              </button>
            </div>
          )}

          {/* TAB: SYSTEM HEALTH MONITOR */}
          {activeTab === 'syshealth' && (
            <div className="space-y-8 animate-fadeIn">
              {/* Live status bar */}
              <div className="flex items-center gap-3 bg-green-500/10 border border-green-500/20 rounded-2xl px-6 py-3">
                <span className="flex h-3 w-3 relative">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-green-400" />
                </span>
                <span className="text-green-400 font-black text-sm">All Systems Operational</span>
                <span className="text-slate-400 text-xs ml-2">— YOLOv8 + EasyOCR + PostgreSQL cluster running normally · Uptime: 99.91%</span>
                <span className="ml-auto text-[10px] text-slate-400 font-semibold">{new Date().toLocaleString('en-IN')}</span>
              </div>

              {/* Main metrics */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'CPU Utilization',    key: 'cpu',  unit: '%',  icon: Cpu,       color: sysHealth.cpu  > 80 ? 'text-rose-400'   : sysHealth.cpu  > 60 ? 'text-amber-400' : 'text-green-400',  bar: sysHealth.cpu  > 80 ? 'bg-rose-500'   : sysHealth.cpu  > 60 ? 'bg-amber-500' : 'bg-green-500',  note: 'YOLOv8 inference active' },
                  { label: 'GPU Load (NVIDIA)',  key: 'gpu',  unit: '%',  icon: Sparkles,  color: sysHealth.gpu  > 85 ? 'text-rose-400'   : sysHealth.gpu  > 70 ? 'text-amber-400' : 'text-green-400',  bar: sysHealth.gpu  > 85 ? 'bg-rose-500'   : sysHealth.gpu  > 70 ? 'bg-amber-500' : 'bg-cyan-500',   note: 'CUDA cores processing' },
                  { label: 'RAM Usage',          key: 'ram',  unit: '%',  icon: Activity,  color: sysHealth.ram  > 80 ? 'text-rose-400'   : sysHealth.ram  > 60 ? 'text-amber-400' : 'text-purple-400', bar: sysHealth.ram  > 80 ? 'bg-rose-500'   : sysHealth.ram  > 60 ? 'bg-amber-500' : 'bg-purple-500',  note: '6.2 / 16 GB active' },
                  { label: 'Disk I/O',           key: 'disk', unit: '%',  icon: FileText,  color: 'text-teal-400',   bar: 'bg-teal-500',   note: 'Evidence archive write' },
                  { label: 'GPU Temp',           key: 'temp', unit: '°C', icon: Zap,       color: sysHealth.temp > 75 ? 'text-rose-400'   : sysHealth.temp > 65 ? 'text-amber-400' : 'text-cyan-400',   bar: sysHealth.temp > 75 ? 'bg-rose-500'   : sysHealth.temp > 65 ? 'bg-amber-500' : 'bg-cyan-500',   note: 'Thermal within limits' },
                  { label: 'Network I/O',        key: 'net',  unit: '%',  icon: Wifi,      color: 'text-blue-400',   bar: 'bg-blue-500',   note: 'Camera feed bandwidth' },
                ].map((m, i) => {
                  const Icon = m.icon;
                  const val = Math.round(sysHealth[m.key]);
                  return (
                    <div key={i} className="glass-panel p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <Icon className={`h-5 w-5 ${m.color}`} />
                          <span className="text-[11px] text-slate-400 font-semibold uppercase">{m.label}</span>
                        </div>
                        <span className={`font-heading font-black text-2xl ${m.color}`}>{val}{m.unit}</span>
                      </div>
                      {/* Animated bar */}
                      <div className="h-3 bg-slate-900 rounded-full overflow-hidden">
                        <div
                          className={`h-full rounded-full transition-all duration-1000 ease-in-out ${m.bar}`}
                          style={{ width: `${Math.min(val, 100)}%` }}
                        />
                      </div>
                      <div className="text-[10px] text-slate-500 mt-2">{m.note}</div>
                    </div>
                  );
                })}
              </div>

              {/* Edge Node Status Table */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-white mb-5 flex items-center gap-2"><Wifi className="h-5 w-5 text-cyan-400" /> Edge AI Node Status</h3>
                <div className="overflow-hidden rounded-xl border border-slate-800">
                  <table className="w-full text-xs text-left">
                    <thead>
                      <tr className="bg-slate-900 text-slate-400 font-semibold uppercase border-b border-slate-800">
                        <th className="p-3">Node ID</th>
                        <th className="p-3">Location</th>
                        <th className="p-3">Model</th>
                        <th className="p-3">FPS</th>
                        <th className="p-3">Latency</th>
                        <th className="p-3">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { node: 'NODE-01', loc: 'Silk Board Junction',    model: 'YOLOv8n',  fps: 30, lat: '11ms', status: 'ONLINE'  },
                        { node: 'NODE-02', loc: 'Koramangala 80ft Rd',    model: 'YOLOv8s',  fps: 30, lat: '13ms', status: 'ONLINE'  },
                        { node: 'NODE-03', loc: 'Indiranagar 100ft Rd',   model: 'YOLOv8n',  fps: 25, lat: '15ms', status: 'ONLINE'  },
                        { node: 'NODE-04', loc: 'MG Road Metro Pillar',   model: 'YOLOv8m',  fps: 30, lat: '9ms',  status: 'ONLINE'  },
                        { node: 'NODE-05', loc: 'Majestic Crossing',      model: 'YOLOv8s',  fps: 25, lat: '14ms', status: 'ONLINE'  },
                        { node: 'NODE-06', loc: 'Hebbal Flyover',         model: 'YOLOv8n',  fps: 0,  lat: '—',   status: 'OFFLINE' },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-slate-800/60 hover:bg-slate-800/20 transition-all">
                          <td className="p-3 font-heading font-bold text-cyan-400">{row.node}</td>
                          <td className="p-3 text-slate-300">{row.loc}</td>
                          <td className="p-3 text-purple-400 font-semibold">{row.model}</td>
                          <td className="p-3 text-white font-bold">{row.fps > 0 ? `${row.fps} FPS` : '—'}</td>
                          <td className="p-3 text-green-400 font-bold">{row.lat}</td>
                          <td className="p-3">
                            <span className={`text-[10px] font-black px-2 py-0.5 rounded uppercase ${
                              row.status === 'ONLINE' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}>{row.status}</span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Services Health */}
              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-heading font-bold text-white mb-5">Microservice Health</h3>
                <div className="grid grid-cols-4 gap-4">
                  {[
                    { name: 'YOLOv8 Detector',    status: 'Running', uptime: '99.91%', color: 'green' },
                    { name: 'EasyOCR Engine',      status: 'Running', uptime: '99.88%', color: 'green' },
                    { name: 'PostrgreSQL DB',      status: 'Running', uptime: '100%',   color: 'green' },
                    { name: 'Redis Cache',         status: 'Running', uptime: '100%',   color: 'green' },
                    { name: 'FastAPI Backend',     status: 'Running', uptime: '99.97%', color: 'green' },
                    { name: 'React Dashboard',     status: 'Running', uptime: '100%',   color: 'green' },
                    { name: 'AutoChallan Bot',     status: 'Armed',   uptime: '100%',   color: 'cyan'  },
                    { name: 'CAM-22 Node',         status: 'Offline', uptime: '0%',     color: 'rose'  },
                  ].map((svc, i) => (
                    <div key={i} className={`bg-slate-900/60 border rounded-xl p-4 border-${
                      svc.color === 'green' ? 'green' : svc.color === 'cyan' ? 'cyan' : 'rose'
                    }-500/20`}>
                      <div className={`text-[9px] font-black uppercase mb-1 text-${
                        svc.color === 'green' ? 'green' : svc.color === 'cyan' ? 'cyan' : 'rose'
                      }-400`}>{svc.status}</div>
                      <div className="font-bold text-white text-xs">{svc.name}</div>
                      <div className="text-[10px] text-slate-400 mt-1">Uptime: {svc.uptime}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
