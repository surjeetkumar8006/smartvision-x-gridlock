import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function CommandCenter(props) {
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
    </>
  );
}
