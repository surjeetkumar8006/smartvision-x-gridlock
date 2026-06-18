import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function ViolationsCenter(props) {
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
            <div className="grid grid-cols-3 gap-8 animate-fadeIn">
              {/* Left Column: Log */}
              <div className="glass-panel rounded-2xl p-6 col-span-1 flex flex-col h-[800px]">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-heading text-lg font-bold text-white">Incident Stream Queue</h3>
                  <span className="text-[9px] bg-slate-800 border border-slate-700/60 py-0.5 px-2.5 rounded font-black text-cyan-400">AUTO-REFRESHING</span>
                </div>
                <div className="overflow-y-auto space-y-3 flex-grow no-scrollbar">
                  {violations.map(v => {
                    const isDanger = ["Wrong Side Driving", "Red Light Violation", "Triple Riding", "Mobile Phone Usage While Driving"].includes(v.violationType);
                    return (
                      <div 
                        key={v.id}
                        onClick={() => setSelectedViolation(v)}
                        className={`p-4 rounded-xl border cursor-pointer transition-all ${
                          selectedViolation?.id === v.id 
                            ? 'bg-cyan-500/10 border-cyan-400 shadow-md' 
                            : 'bg-slate-800/35 border-slate-700/60 hover:bg-slate-800/60'
                        }`}
                      >
                        <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                          <span>{v.id}</span>
                          <span>{new Date(v.timestamp).toLocaleTimeString()}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className={`font-bold text-sm ${isDanger ? 'text-rose-500' : 'text-amber-400'}`}>{v.violationType}</span>
                          <span className="text-xs bg-slate-800 border border-slate-700 px-2 py-0.5 rounded font-heading">{v.plateNumber}</span>
                        </div>
                        <div className="flex justify-between items-center mt-3 text-[10px] text-slate-500">
                          <span>{v.location.split(',')[0]}</span>
                          <span className={`font-bold ${v.status === 'Approved' ? 'text-green-400' : v.status === 'Pending' ? 'text-amber-400' : 'text-rose-500'}`}>{v.status}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {/* Citizen complaint portal simulation */}
                <form onSubmit={handleCitizenComplaintSubmit} className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                  <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block flex items-center gap-1">
                    <PlusCircle className="h-3.5 w-3.5" /> Integrate Citizen Complaint
                  </span>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="License Plate" 
                      value={complaintPlate}
                      onChange={(e) => setComplaintPlate(e.target.value)}
                      className="bg-slate-950 border border-slate-800 rounded px-2.5 py-1 text-xs font-heading font-bold text-white flex-grow focus:outline-none focus:border-cyan-400"
                    />
                    <button type="submit" className="bg-cyan-500 text-slate-900 font-bold rounded text-xs py-1 px-2.5">
                      Upload
                    </button>
                  </div>
                </form>
              </div>

              {/* Right Column: Evidence Details */}
              <div className="col-span-2 space-y-6">
                {selectedViolation ? (
                  <>
                    <div className="glass-panel rounded-2xl p-6 space-y-6">
                      <div className="flex justify-between items-start border-b border-slate-800 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            {selectedViolation.emergencyFlag && (
                              <span className="text-xs font-black text-cyan-400 bg-cyan-400/10 border border-cyan-400/35 py-1 px-3 rounded-full uppercase tracking-wider flex items-center gap-1 animate-pulse">
                                <AlertOctagon className="h-3.5 w-3.5" /> Emergency Vehicle
                              </span>
                            )}
                            <span className="text-xs font-bold text-rose-500 bg-rose-500/10 border border-rose-500/35 py-1 px-3 rounded-full uppercase tracking-wider">VIOLATION CAPTURE</span>
                            <span className="text-sm text-slate-400">ID: {selectedViolation.id}</span>
                          </div>
                          <h2 className="text-2xl font-heading font-extrabold mt-2 text-white">{selectedViolation.violationType}</h2>
                        </div>
                        <div className="flex gap-3 flex-wrap">
                          <button 
                            onClick={() => setShowReceiptModal(true)}
                            className="btn bg-cyan-500 text-slate-900 hover:bg-cyan-400 py-2.5 text-xs rounded-xl font-bold flex items-center gap-2"
                          >
                            <FileText className="h-4 w-4" /> View Official Challan
                          </button>
                          <button 
                            onClick={() => { setWhatsAppChallan(selectedViolation); setShowWhatsApp(true); speakAlert('WhatsApp challan preview loaded.'); }}
                            className="btn py-2.5 text-xs rounded-xl font-bold flex items-center gap-2 border"
                            style={{ background: '#075e54', color: '#fff', borderColor: '#075e54' }}
                          >
                            📱 WhatsApp Preview
                          </button>
                          <button 
                            onClick={() => triggerToast(`Evidence report PDF generated for ${selectedViolation.id}`)}
                            className="btn btn-outline border-slate-700 hover:border-cyan-400 py-2.5 text-xs rounded-xl text-slate-200"
                          >
                            <Download className="h-4 w-5 text-cyan-400" /> Export PDF Evidence
                          </button>
                        </div>
                      </div>

                      {/* Side-by-Side Images */}
                      <div className="grid grid-cols-2 gap-4 bg-slate-950 p-4 rounded-xl border border-slate-800">
                        <div>
                          <span className="text-xs text-slate-400 mb-2 block font-semibold">Original CCTV Camera Feed</span>
                          <div className="relative aspect-video rounded overflow-hidden bg-slate-900 border border-slate-800">
                            <img src={selectedViolation.imagePath} className="w-full h-full object-cover" alt="Original CCTV" />
                          </div>
                        </div>
                        <div>
                          <span className="text-xs text-cyan-400 mb-2 block font-semibold flex items-center gap-1"><Activity className="h-3.5 w-3.5 text-cyan-400" /> YOLOv8 Annotated Bounding Boxes</span>
                          <div className="relative aspect-video rounded overflow-hidden bg-slate-900 border border-slate-800">
                            <img src={selectedViolation.imagePath} className="w-full h-full object-cover filter brightness-90" alt="Annotated CCTV" />
                            {/* Bounding box simulation overlay */}
                            <div className="absolute border-2 border-red-500 animate-pulse bg-red-500/10" style={{
                              left: `${(selectedViolation.annotatedBox.x / 640) * 100}%`,
                              top: `${(selectedViolation.annotatedBox.y / 360) * 100}%`,
                              width: `${(selectedViolation.annotatedBox.width / 640) * 100}%`,
                              height: `${(selectedViolation.annotatedBox.height / 360) * 100}%`,
                            }}>
                              <span className="absolute -top-5 left-0 text-[9px] bg-red-500 text-white font-extrabold px-1.5 py-0.5 uppercase tracking-wider">
                                {selectedViolation.violationType}: {(selectedViolation.confidence * 100).toFixed(0)}%
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Detail Metrics */}
                      <div className="grid grid-cols-3 gap-6">
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                          <span className="text-xs text-slate-400 uppercase font-semibold">Location & Camera</span>
                          <div className="mt-2 text-sm font-bold text-white flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-cyan-400 flex-shrink-0" />
                            <span>{selectedViolation.location} ({selectedViolation.cameraId})</span>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                          <span className="text-xs text-slate-400 uppercase font-semibold">AI Prediction Confidence</span>
                          <div className="mt-2 text-sm font-bold text-white flex items-center gap-2">
                            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                              <div className="bg-cyan-400 h-full" style={{ width: `${selectedViolation.confidence * 100}%` }}></div>
                            </div>
                            <span className="text-cyan-400">{(selectedViolation.confidence * 100).toFixed(1)}%</span>
                          </div>
                        </div>
                        <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                          <span className="text-xs text-slate-400 uppercase font-semibold">Vehicle details (Vahan)</span>
                          <div className="mt-2 text-xs font-bold text-white flex flex-col gap-1">
                            <div>Type: <strong className="text-cyan-400">{selectedViolation.vehicleType}</strong></div>
                            <div>State: <strong className="text-cyan-400">{selectedViolation.state}</strong></div>
                          </div>
                        </div>
                      </div>

                      {/* AI Explainability block */}
                      <div className="bg-slate-900/50 p-4 rounded-xl border border-slate-800/80">
                        <span className="text-xs text-cyan-400 uppercase font-bold flex items-center gap-1">
                          <Zap className="h-4 w-4 text-cyan-400" /> AI Explainability Log
                        </span>
                        <p className="text-xs text-slate-300 mt-2 leading-relaxed">{selectedViolation.explainability}</p>
                      </div>

                      {/* Risk Scoring & Enforcement Decision */}
                      <div className="grid grid-cols-2 gap-6 pt-4 border-t border-slate-800">
                        {/* Risk Gauge */}
                        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/80 flex items-center gap-5">
                          <div className="w-20 h-20 rounded-full border-4 border-slate-800 flex items-center justify-center relative">
                            <span className={`text-xl font-heading font-black ${getRiskScore(selectedViolation.plateNumber).color}`}>
                              {getRiskScore(selectedViolation.plateNumber).score}
                            </span>
                            {/* Gauge title */}
                            <span className="absolute -bottom-3 text-[10px] uppercase tracking-wider font-bold bg-slate-950 px-2 border border-slate-800 text-slate-400 rounded">
                              RISK
                            </span>
                          </div>
                          <div>
                            <div className="font-heading text-lg font-extrabold text-white flex items-center gap-2">
                              <span>{getRiskScore(selectedViolation.plateNumber).category}</span>
                              {getRiskScore(selectedViolation.plateNumber).count > 1 && (
                                <span className="bg-rose-500/10 border border-rose-500/35 text-[9px] font-black text-rose-500 px-2 py-0.5 rounded uppercase tracking-wider flex items-center gap-1">
                                  <Award className="h-3 w-3" /> HABITUAL OFFENDER
                                </span>
                              )}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">Calculated via incident frequencies, violation categories, and local intersection risks.</p>
                          </div>
                        </div>

                        {/* Decision Engine Recommendations */}
                        <div className="bg-slate-900/50 p-5 rounded-xl border border-slate-800/80 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] text-cyan-400 font-bold uppercase tracking-wider block">AI ENFORCEMENT RECOMMENDATION</span>
                            <div className="font-heading text-lg font-black text-slate-200 mt-1">
                              {getAIRecommendation(selectedViolation.confidence, getRiskScore(selectedViolation.plateNumber).score).action}
                            </div>
                            <p className="text-xs text-slate-400 mt-1">
                              {getAIRecommendation(selectedViolation.confidence, getRiskScore(selectedViolation.plateNumber).score).detail}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Human-in-the-loop actions */}
                      <div className="bg-amber-500/5 border border-amber-500/20 p-5 rounded-xl flex flex-col gap-4">
                        <div className="flex justify-between items-center">
                          <div className="flex gap-4 items-center">
                            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Manual OCR Edit:</span>
                            <input 
                              type="text" 
                              defaultValue={selectedViolation.plateNumber} 
                              id="input-plate-edit"
                              className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-sm font-heading font-bold text-white focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                          
                          {selectedViolation.status === 'Pending' && (
                            <div className="flex gap-3">
                              <button 
                                onClick={() => {
                                  const plateVal = document.getElementById('input-plate-edit')?.value;
                                  const fbVal = document.getElementById('input-review-feedback')?.value;
                                  handleReview(selectedViolation.id, 'Approved', plateVal, fbVal);
                                }}
                                className="btn bg-green-500 text-slate-900 font-bold rounded-lg text-xs py-2.5 px-4"
                              >
                                Approve Challan
                              </button>
                              <button 
                                onClick={() => {
                                  const fbVal = document.getElementById('input-review-feedback')?.value;
                                  handleReview(selectedViolation.id, 'Rejected', null, fbVal);
                                }}
                                className="btn bg-rose-500 text-white font-bold rounded-lg text-xs py-2.5 px-4"
                              >
                                Reject Frame
                              </button>
                            </div>
                          )}
                        </div>

                        {selectedViolation.status === 'Pending' && (
                          <div className="flex items-center gap-3 border-t border-slate-800/60 pt-3">
                            <span className="text-[10px] text-slate-400 uppercase font-bold">Feedback Loop:</span>
                            <input 
                              type="text" 
                              placeholder="Optional false-positive review comments..."
                              id="input-review-feedback"
                              className="bg-slate-950 border border-slate-800 rounded px-3 py-1 text-xs text-slate-300 w-full focus:outline-none focus:border-cyan-400"
                            />
                          </div>
                        )}
                      </div>

                      {/* WhatsApp Dispatch simulator */}
                      {selectedViolation.status === 'Approved' && (
                        <div className="bg-green-500/5 border border-green-500/20 p-5 rounded-xl flex items-center justify-between animate-fadeIn">
                          <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center text-green-400">
                              <CheckCircle className="h-6 w-6" />
                            </div>
                            <div>
                              <span className="text-xs font-bold text-green-400 uppercase tracking-wider block">Automated Dispatch Complete</span>
                              <p className="text-xs text-slate-400 mt-1">E-Challan SMS & WhatsApp notification pushed to offender's Vahan linked mobile number (+91 99****8891).</p>
                            </div>
                          </div>
                          <div className="bg-slate-900 border border-slate-800 rounded-lg p-3 w-72 text-left shadow-lg">
                            <span className="text-[9px] text-green-400 font-bold tracking-wider block uppercase">💬 WhatsApp Notification Preview</span>
                            <div className="bg-slate-950 p-2 rounded border border-slate-800 text-[11px] text-slate-300 mt-1.5 leading-relaxed font-sans">
                              <strong>BTP Traffic Alert:</strong> A violation challan of <strong>₹500</strong> has been issued to vehicle <strong>{selectedViolation.plateNumber}</strong> for <strong>{selectedViolation.violationType}</strong> at <strong>{selectedViolation.location.split(',')[0]}</strong>.<br />
                              <span className="text-blue-400 underline cursor-pointer mt-1 block">View evidence: btp.gov.in/v/{selectedViolation.id}</span>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="glass-panel rounded-2xl p-10 text-center text-slate-400">
                    No violations currently indexed.
                  </div>
                )}
              </div>
            </div>
    </>
  );
}
