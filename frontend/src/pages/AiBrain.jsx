import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function AiBrain(props) {
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
    </>
  );
}
