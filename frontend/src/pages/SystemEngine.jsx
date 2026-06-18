import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Activity, ShieldAlert, Video, AlertTriangle, Search, FileText, Sliders, MapPin, Users, CheckCircle, XCircle, Send, Radio, Eye, Download, RefreshCw, TrendingUp, Map, Award, Car, Sun, Moon, EyeOff, PlusCircle, AlertOctagon, HeartHandshake, Zap, CloudRain, Clock, AlertCircle, Printer, LineChart as ChartIcon, Brain, Volume2, VolumeX, Bot, Cpu, Sparkles, Bell, BellOff, Wifi, WifiOff, Play, Pause, ChevronRight } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, AreaChart, Area, BarChart, Bar, Legend, CartesianGrid } from 'recharts';
import { Link, useNavigate, useLocation } from 'react-router-dom';


export default function SystemEngine(props) {
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
            <>
              {/* Sliders & Configuration */}
              <div className="grid grid-cols-2 gap-8 animate-fadeIn">
                <div className="glass-panel p-6 rounded-2xl space-y-6">
                  <h3 className="font-heading text-lg font-bold text-white mb-4">Edge AI Model Parameters</h3>
                  
                  {/* Sliders */}
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between text-xs text-slate-400 font-semibold mb-2">
                        <span>YOLOv8 Detection Confidence Threshold</span>
                        <span className="text-cyan-400 font-bold">{(yoloConfidence * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.5" 
                        max="0.99" 
                        step="0.05"
                        value={yoloConfidence} 
                        onChange={(e) => setYoloConfidence(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-xs text-slate-400 font-semibold mb-2">
                        <span>EasyOCR Character Recurrent Matching threshold</span>
                        <span className="text-cyan-400 font-bold">{(ocrSensitivity * 100).toFixed(0)}%</span>
                      </div>
                      <input 
                        type="range" 
                        min="0.6" 
                        max="0.99" 
                        step="0.05"
                        value={ocrSensitivity} 
                        onChange={(e) => setOcrSensitivity(parseFloat(e.target.value))}
                        className="w-full accent-cyan-400"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-800/80">
                    <div>
                      <div className="text-sm font-bold text-white">Retinex IR Night Exposure Booster</div>
                      <p className="text-[11px] text-slate-400 mt-1">Pre-processing filters designed to maximize plate contrast in low exposure night feeds.</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={irExposure}
                      onChange={(e) => setIrExposure(e.target.checked)}
                      className="w-5 h-5 accent-cyan-400"
                    />
                  </div>
                </div>

                <div className="glass-panel p-6 rounded-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white mb-4">System Predictions & Throughput</h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Estimated Edge CPU Throughput</span>
                        <span className="text-sm font-bold text-white">{(60 * (1 - (yoloConfidence - 0.5))).toFixed(0)} FPS</span>
                      </div>
                      <div className="flex justify-between items-center bg-slate-900/40 p-4 rounded-xl">
                        <span className="text-xs text-slate-400 uppercase font-semibold">Projected AI False Positive Rate</span>
                        <span className="text-sm font-bold text-emerald-400">{(5 * (1 - (yoloConfidence - 0.5))).toFixed(2)}%</span>
                      </div>
                    </div>
                  </div>
                  <button 
                    onClick={() => triggerToast("AI model weights redeployed across all edge junctions")}
                    className="w-full btn bg-cyan-500 text-slate-900 font-bold rounded-xl py-3 mt-6 hover:bg-cyan-400"
                  >
                    Deploy Model Weights
                  </button>
                </div>
              </div>

              {/* Performance Evaluation (mAP, Precision, Recall, F1 curves) */}
              <div className="grid grid-cols-3 gap-8 mt-8 animate-fadeIn">
                {/* Precision-Recall Curve */}
                <div className="glass-panel p-6 rounded-2xl col-span-2">
                  <h3 className="font-heading text-lg font-bold text-white mb-2 flex items-center gap-2">
                    <ChartIcon className="h-5 w-5 text-cyan-400" /> Precision-Recall Validation Curve
                  </h3>
                  <p className="text-xs text-slate-400 mb-4">Validating model classification quality. Current mAP@0.5 score: <strong>0.941</strong></p>
                  <div className="h-60">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={prCurveData}>
                        <XAxis dataKey="recall" label={{ value: 'Recall', position: 'insideBottom', offset: -5, fill: '#64748b' }} stroke="#64748b" fontSize={10} />
                        <YAxis label={{ value: 'Precision', angle: -90, position: 'insideLeft', fill: '#64748b' }} stroke="#64748b" fontSize={10} />
                        <Tooltip contentStyle={{ background: '#0f172a', borderColor: '#334155' }} />
                        <Area type="monotone" dataKey="precision" stroke="#39ff14" fill="rgba(57, 255, 20, 0.05)" strokeWidth={2.5} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Device Scalability Matrix */}
                <div className="glass-panel p-6 rounded-2xl col-span-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white mb-2">Computational Scalability</h3>
                    <p className="text-xs text-slate-400 mb-4">Edge deployment benchmarks tested across hardware devices.</p>
                    
                    <div className="space-y-3 text-xs">
                      {[
                        { device: "NVIDIA Jetson Nano", fps: "15 FPS", watt: "8W power", status: "Compatible" },
                        { device: "NVIDIA Jetson Xavier", fps: "45 FPS", watt: "15W power", status: "Optimal" },
                        { device: "Intel NUC i7 Core", fps: "30 FPS", watt: "25W power", status: "Compatible" },
                        { device: "AI Edge Rack Server", fps: "120 FPS", watt: "150W power", status: "Enterprise" }
                      ].map((dev, idx) => (
                        <div key={idx} className="flex justify-between items-center bg-slate-900/40 p-2.5 rounded-lg border border-slate-800/80">
                          <div>
                            <span className="font-bold text-white block">{dev.device}</span>
                            <span className="text-[10px] text-slate-400">{dev.watt}</span>
                          </div>
                          <div className="text-right">
                            <span className="text-cyan-400 font-extrabold block">{dev.fps}</span>
                            <span className="text-[9px] text-slate-500 uppercase font-black">{dev.status}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* ROI Configurator */}
              <div className="glass-panel p-6 rounded-2xl mt-8 animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <div>
                    <h3 className="font-heading text-lg font-bold text-white">Interactive Edge Region of Interest (ROI) Configurator</h3>
                    <p className="text-xs text-slate-400 mt-1">Click on the feed image below to draw the neon boundary points for AI No Parking zone masks dynamically.</p>
                  </div>
                  <div className="flex gap-3">
                    <button 
                      onClick={() => { setRoiPoints([]); triggerToast("ROI Boundary mask cleared.") }}
                      className="btn btn-outline border-slate-750 hover:border-rose-500 hover:text-rose-500 rounded-xl text-xs py-2 px-4"
                    >
                      Clear Coordinates
                    </button>
                    <button 
                      onClick={() => { triggerToast(`Deployed ROI polygon with ${roiPoints.length} points to CAM-12!`); setRoiPoints([]) }}
                      className="btn bg-cyan-500 text-slate-900 font-bold rounded-xl text-xs py-2 px-4"
                      disabled={roiPoints.length < 3}
                    >
                      Deploy Mask to Cam
                    </button>
                  </div>
                </div>

                <div className="relative max-w-2xl mx-auto aspect-video rounded-xl border border-slate-800 overflow-hidden bg-slate-950 cursor-crosshair group">
                  <img 
                    src="/assets/cam_parking.png" 
                    alt="ROI Config Feed" 
                    className="w-full h-full object-cover select-none pointer-events-none"
                  />
                  
                  {/* Clicking Canvas */}
                  <div 
                    className="absolute inset-0"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = ((e.clientX - rect.left) / rect.width) * 100;
                      const y = ((e.clientY - rect.top) / rect.height) * 100;
                      setRoiPoints(prev => [...prev, { x, y }]);
                    }}
                  />

                  {/* SVG Drawing Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    {roiPoints.map((pt, i) => (
                      <circle key={i} cx={`${pt.x}%`} cy={`${pt.y}%`} r="6" fill="#00e5ff" className="animate-pulse shadow-glow" />
                    ))}
                    {roiPoints.length > 1 && (
                      <polyline
                        points={roiPoints.map(pt => `${pt.x}%,${pt.y}%`).join(' ')}
                        fill="rgba(0, 229, 255, 0.15)"
                        stroke="#00e5ff"
                        strokeWidth="2.5"
                        className="dash-draw-line"
                        style={{ strokeDasharray: '4 4' }}
                      />
                    )}
                    {/* Connect last to first for closed loop */}
                    {roiPoints.length > 2 && (
                      <line
                        x1={`${roiPoints[roiPoints.length - 1].x}%`}
                        y1={`${roiPoints[roiPoints.length - 1].y}%`}
                        x2={`${roiPoints[0].x}%`}
                        y2={`${roiPoints[0].y}%`}
                        stroke="#00e5ff"
                        strokeWidth="2.5"
                        style={{ strokeDasharray: '4 4' }}
                      />
                    )}
                  </svg>

                  {/* Help guide tip */}
                  {roiPoints.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/60 pointer-events-none group-hover:bg-black/45 transition-all">
                      <span className="text-xs text-cyan-400 font-bold bg-slate-900 border border-slate-700/60 px-4 py-2 rounded-lg tracking-wider uppercase">
                        🖱️ Click anywhere on feed to draw custom region
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </>
    </>
  );
}
