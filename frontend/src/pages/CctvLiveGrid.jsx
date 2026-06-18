import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function CctvLiveGrid(props) {
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
    </>
  );
}
