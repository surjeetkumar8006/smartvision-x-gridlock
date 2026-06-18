import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function Analytics(props) {
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
    </>
  );
}
