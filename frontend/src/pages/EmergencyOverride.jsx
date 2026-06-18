import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function EmergencyOverride(props) {
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
    </>
  );
}
