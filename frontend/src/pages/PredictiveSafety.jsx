import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function PredictiveSafety(props) {
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
    </>
  );
}
