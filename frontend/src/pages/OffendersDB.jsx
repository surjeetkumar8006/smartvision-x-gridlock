import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function OffendersDB(props) {
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

              {/* 🔍 Stolen Vehicle Plate Checker */}
              <div className="glass-panel p-6 rounded-2xl border border-rose-500/20">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2.5 bg-rose-500/10 rounded-xl"><ShieldAlert className="h-5 w-5 text-rose-400" /></div>
                  <div>
                    <h3 className="font-heading font-bold text-white">AI Instant Plate Intelligence Check</h3>
                    <p className="text-[11px] text-slate-400">Cross-references Vahan DB, stolen vehicle registry, and BTP challan database.</p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <input
                    type="text"
                    placeholder="Enter plate number (e.g. KA-03-MX-8891)"
                    value={plateCheckerInput}
                    onChange={e => setPlateCheckerInput(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handlePlateCheck()}
                    className="flex-grow bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-white font-heading font-bold focus:outline-none focus:border-rose-400 uppercase"
                  />
                  <button
                    onClick={handlePlateCheck}
                    className="btn bg-rose-500 text-white font-bold rounded-xl px-6 py-2.5 text-sm hover:bg-rose-400 flex items-center gap-2"
                  >
                    <Search className="h-4 w-4" /> Check Plate
                  </button>
                  <button
                    onClick={() => { setPlateCheckerInput('KA-03-MX-8891'); }}
                    className="btn bg-slate-800 border border-slate-700 text-slate-300 font-bold rounded-xl px-4 py-2.5 text-xs hover:border-rose-500"
                  >Try Stolen Plate</button>
                </div>
                {/* Result */}
                {plateCheckerResult && (
                  <div className={`mt-4 p-4 rounded-xl border animate-fadeIn ${
                    plateCheckerResult.type === 'stolen'     ? 'bg-rose-500/10 border-rose-500/30' :
                    plateCheckerResult.type === 'violations' ? 'bg-amber-500/10 border-amber-500/30' :
                                                               'bg-green-500/10 border-green-500/30'
                  }`}>
                    {plateCheckerResult.type === 'stolen' && (
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <AlertOctagon className="h-6 w-6 text-rose-400 flex-shrink-0 animate-pulse" />
                          <div>
                            <div className="font-heading font-extrabold text-rose-400 text-base">🚨 STOLEN / FLAGGED VEHICLE</div>
                            <div className="text-xs text-rose-300 mt-0.5">{plateCheckerResult.data.reason}</div>
                          </div>
                          <span className={`ml-auto text-[10px] font-black px-2 py-1 rounded uppercase ${
                            plateCheckerResult.data.severity === 'CRITICAL' ? 'bg-rose-500 text-white' :
                            plateCheckerResult.data.severity === 'HIGH'     ? 'bg-orange-500 text-white' :
                                                                               'bg-amber-500 text-slate-900'
                          }`}>{plateCheckerResult.data.severity}</span>
                        </div>
                        {plateCheckerResult.violations?.length > 0 && (
                          <div className="text-xs text-slate-400">Also found {plateCheckerResult.violations.length} recorded BTP violation(s) for this vehicle.</div>
                        )}
                        <button onClick={() => triggerToast('Alert broadcast sent to all active patrol units!')} className="btn bg-rose-500 text-white font-bold rounded-lg py-2 px-4 text-xs hover:bg-rose-400">📢 Broadcast Alert to All Units</button>
                      </div>
                    )}
                    {plateCheckerResult.type === 'violations' && (
                      <div className="flex items-center gap-3">
                        <AlertTriangle className="h-5 w-5 text-amber-400" />
                        <div>
                          <div className="font-bold text-amber-400">⚠️ {plateCheckerResult.violations.length} Violation(s) Found</div>
                          <div className="text-xs text-slate-400 mt-1">{plateCheckerResult.violations.map(v => v.violationType).join(' · ')}</div>
                        </div>
                      </div>
                    )}
                    {plateCheckerResult.type === 'clean' && (
                      <div className="flex items-center gap-3">
                        <CheckCircle className="h-5 w-5 text-green-400" />
                        <div className="font-bold text-green-400">✅ Plate is CLEAN — No alerts or violations found.</div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              <div className="glass-panel p-6 rounded-2xl">
                <h3 className="font-heading text-lg font-bold text-white mb-4">Search Offenders Database</h3>
                <div className="flex gap-4">
                  <div className="relative flex-grow">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search by License Plate (e.g. KA-03-MX-8891)..."
                      value={offenderSearch}
                      onChange={(e) => setOffenderSearch(e.target.value)}
                      className="bg-slate-900/60 border border-slate-800 rounded-xl py-2.5 pl-11 pr-4 w-full text-slate-200 focus:outline-none focus:border-cyan-400 text-sm"
                    />
                  </div>
                  <select 
                    value={filterType} 
                    onChange={(e) => setFilterType(e.target.value)}
                    className="bg-slate-900/60 border border-slate-800 rounded-xl px-4 py-2.5 text-sm text-slate-200 focus:outline-none focus:border-cyan-400"
                  >
                    <option value="all">All Violation Types</option>
                    <option value="Helmet Non Compliance">Helmet Non Compliance</option>
                    <option value="Illegal Parking">Illegal Parking</option>
                    <option value="Triple Riding">Triple Riding</option>
                  </select>
                </div>
              </div>

              {/* Log Table results */}
              <div className="glass-panel rounded-2xl overflow-hidden border border-slate-800/85">
                <div className="table-responsive">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-heading">
                        <th className="p-4 font-semibold uppercase">Incident ID</th>
                        <th className="p-4 font-semibold uppercase">Plate Number</th>
                        <th className="p-4 font-semibold uppercase">Violation Type</th>
                        <th className="p-4 font-semibold uppercase">Location</th>
                        <th className="p-4 font-semibold uppercase">Confidence</th>
                        <th className="p-4 font-semibold uppercase">Risk Score</th>
                        <th className="p-4 font-semibold uppercase">Review Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredViolations
                        .filter(v => offenderSearch === '' || v.plateNumber.toLowerCase().includes(offenderSearch.toLowerCase()))
                        .map(v => {
                          const risk = getRiskScore(v.plateNumber);
                          return (
                            <tr key={v.id} className="border-b border-slate-800/60 hover:bg-slate-900/20">
                              <td className="p-4 font-bold text-slate-300">{v.id}</td>
                              <td className="p-4 font-heading font-semibold text-white">{v.plateNumber}</td>
                              <td className="p-4 text-cyan-400 font-bold">{v.violationType}</td>
                              <td className="p-4 text-slate-400">{v.location.split(',')[0]}</td>
                              <td className="p-4 font-bold">{(v.confidence * 100).toFixed(1)}%</td>
                              <td className="p-4"><span className={`font-black ${risk.color}`}>{risk.score} ({risk.category})</span></td>
                              <td className="p-4"><span className={`text-[10px] font-bold py-0.5 px-2.5 rounded-full ${
                                v.status === 'Approved' ? 'bg-green-500/10 text-green-400 border border-green-500/20' : v.status === 'Pending' ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-rose-500/10 text-rose-500 border border-rose-500/20'
                              }`}>{v.status}</span></td>
                            </tr>
                          );
                        })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
    </>
  );
}
