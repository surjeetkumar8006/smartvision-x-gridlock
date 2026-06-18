import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function SystemHealth(props) {
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
    </>
  );
}
