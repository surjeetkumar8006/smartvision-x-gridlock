import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function CityHeatmap(props) {
  const {
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
} = props;
  
  return (
    <>
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
    </>
  );
}
