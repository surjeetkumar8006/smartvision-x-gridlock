import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function PatrolDispatch(props) {
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
    </>
  );
}
