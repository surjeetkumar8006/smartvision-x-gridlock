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
  CCTV_CAMERAS, SIGNAL_JUNCTIONS, WEEKLY_REVENUE, COMPLIANCE_TREND, HOURLY_VIOLATIONS, TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES,
  AI_VIOLATION_TEMPLATES, AI_PLATES, initialViolations,
  initialPatrols
} from './data/mockData';

import CommandCenter from './pages/CommandCenter';
import AiBrain from './pages/AiBrain';
import CctvLiveGrid from './pages/CctvLiveGrid';
import ViolationsCenter from './pages/ViolationsCenter';
import Analytics from './pages/Analytics';
import CityHeatmap from './pages/CityHeatmap';
import OffendersDB from './pages/OffendersDB';
import PatrolDispatch from './pages/PatrolDispatch';
import PredictiveSafety from './pages/PredictiveSafety';
import EmergencyOverride from './pages/EmergencyOverride';
import SystemHealth from './pages/SystemHealth';
import SystemEngine from './pages/SystemEngine';
import { Routes, Route, Navigate, useLocation, useNavigate, Link } from 'react-router-dom';

export default function App() {
  const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.length > 1 ? location.pathname.substring(1) : 'command';
  const setActiveTab = (id) => navigate('/' + id);
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
    CCTV_CAMERAS, SIGNAL_JUNCTIONS, WEEKLY_REVENUE, COMPLIANCE_TREND, HOURLY_VIOLATIONS, TICKER_ALERTS, AI_INSIGHTS_POOL, STOLEN_PLATES,
    sysHealth, setSysHealth, signals, setSignals, emergencyVehicle, setEmergencyVehicle, emergencyRoute, setEmergencyRoute, showCourtNotice, setShowCourtNotice, courtNoticePlate, setCourtNoticePlate, showWhatsApp, setShowWhatsApp, whatsAppChallan, setWhatsAppChallan, showFIR, setShowFIR, firPlate, setFirPlate, cityScore, setCityScore, speedData, setSpeedData, triggerToast, speakAlert, sendDesktopNotification, handlePlateCheck, handleSimChange, handleReview, handleDispatch, getRiskScore, getAIRecommendation, handleCitizenComplaintSubmit, dailyData, distributionData, prCurveData, COLORS, filteredViolations
  };

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

          <Routes>
            <Route path="/" element={<Navigate to="/command" replace />} />
          {/* TAB: CCTV LIVE GRID */}
          <Route path="/cctv" element={<CctvLiveGrid {...sharedProps} />} />

          {/* TAB: ANALYTICS & REVENUE */}
          <Route path="/analytics" element={<Analytics {...sharedProps} />} />

          {/* TAB 1: COMMAND CENTER */}
          <Route path="/command" element={<CommandCenter {...sharedProps} />} />

          {/* ─────────────────────────────────────────────────── */}
          {/* TAB: AI BRAIN */}
          <Route path="/aibrain" element={<AiBrain {...sharedProps} />} />

          {/* ─────────────────────────────────────────────────── */}
          {/* TAB 2: VIOLATIONS & EVIDENCE */}
          <Route path="/violations" element={<ViolationsCenter {...sharedProps} />} />

          {/* TAB 3: CITY HEATMAP */}
          <Route path="/heatmap" element={<CityHeatmap {...sharedProps} />} />

          {/* TAB 4: OFFENDERS DB */}
          <Route path="/offenders" element={<OffendersDB {...sharedProps} />} />

          {/* TAB 5: PATROL DISPATCH */}
          <Route path="/patrol" element={<PatrolDispatch {...sharedProps} />} />

          {/* TAB 7: PREDICTIVE & SAFETY */}
          <Route path="/predictive" element={<PredictiveSafety {...sharedProps} />} />

          {/* TAB 6: SYSTEM CONFIG & PERFORMANCE EVALUATION */}
          <Route path="/config" element={<SystemEngine {...sharedProps} />} />

          {/* TAB: EMERGENCY SIGNAL OVERRIDE */}
          <Route path="/emergency" element={<EmergencyOverride {...sharedProps} />} />

          {/* TAB: SYSTEM HEALTH MONITOR */}
          <Route path="/syshealth" element={<SystemHealth {...sharedProps} />} />

          </Routes>
        </div>
      </main>
    </div>
  );
}
