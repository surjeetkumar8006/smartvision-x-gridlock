// ─── AI Auto-Violation Injection Templates ───────────────────────────────────
export const AI_VIOLATION_TEMPLATES = [
  { vehicleType: "Two-Wheeler", violationType: "Helmet Non Compliance",   imagePath: "/assets/cam_helmet.png",  cameraId: "CAM-04", location: "Silk Board Junction, Outer Ring Rd",   annotatedBox: { x: 120, y: 80,  width: 90,  height: 95  }, explainability: "AI auto-detected: Rider head region detected without safety helmet via YOLOv8 pose estimation.",   state: "Karnataka", owner: "Auto Detected", chassis: "AI-SCAN-AUTO", confidence: 0.97, emergencyFlag: false },
  { vehicleType: "Sedan",       violationType: "Seatbelt Non Compliance", imagePath: "/assets/cam_parking.png", cameraId: "CAM-15", location: "MG Road, Near Metro Pillar 110",          annotatedBox: { x: 300, y: 150, width: 80,  height: 110 }, explainability: "AI auto-detected: Front cabin analysis reveals absent seatbelt strap via ResNet50 driver-body crop.",      state: "Karnataka", owner: "Auto Detected", chassis: "AI-SCAN-AUTO", confidence: 0.93, emergencyFlag: false },
  { vehicleType: "Two-Wheeler", violationType: "Triple Riding",           imagePath: "/assets/cam_triple.png", cameraId: "CAM-08", location: "Koramangala 80ft Rd",                     annotatedBox: { x: 180, y: 110, width: 140, height: 180 }, explainability: "AI auto-detected: 3 distinct head bounding-box clusters on a single motorcycle chassis.",              state: "Karnataka", owner: "Auto Detected", chassis: "AI-SCAN-AUTO", confidence: 0.95, emergencyFlag: false },
  { vehicleType: "SUV",         violationType: "Illegal Parking",         imagePath: "/assets/cam_parking.png", cameraId: "CAM-12", location: "Indiranagar 100ft Rd",                   annotatedBox: { x: 250, y: 180, width: 310, height: 160 }, explainability: "AI auto-detected: Vehicle stationary >120s in restricted zone polygon mask. BTP No-Parking area.",   state: "Karnataka", owner: "Auto Detected", chassis: "AI-SCAN-AUTO", confidence: 0.96, emergencyFlag: false },
  { vehicleType: "Two-Wheeler", violationType: "Wrong Side Driving",      imagePath: "/assets/cam_helmet.png",  cameraId: "CAM-04", location: "Silk Board Junction, Outer Ring Rd",   annotatedBox: { x: 140, y: 90,  width: 100, height: 105 }, explainability: "AI auto-detected: Optical flow vector shows vehicle moving counter to lane direction.",               state: "Karnataka", owner: "Auto Detected", chassis: "AI-SCAN-AUTO", confidence: 0.91, emergencyFlag: false },
  { vehicleType: "Two-Wheeler", violationType: "Mobile Phone Usage While Driving", imagePath: "/assets/cam_helmet.png", cameraId: "CAM-04", location: "Silk Board Junction", annotatedBox: { x: 130, y: 85, width: 95, height: 100 }, explainability: "AI auto-detected: Rider arm region holds rectangular object matching phone dimensions — YOLO class_id=phone.", state: "Karnataka", owner: "Auto Detected", chassis: "AI-SCAN-AUTO", confidence: 0.88, emergencyFlag: false },
];

export const AI_PLATES = ["KA-05-HR-7742", "KA-09-FX-2281", "KA-01-BZ-9934", "MH-12-AB-3301", "KA-41-MM-7190", "TN-09-CC-5512", "KA-03-MX-8891"];

export const AI_INSIGHTS_POOL = [
  "🔴 Silk Board Junction: Helmet violation rate up 18% in last 30 minutes. Deploying CAM-04 high-zoom mode.",
  "🟡 KR Puram: Traffic density exceeds 340 vehicles/min. AI confidence dropped to 91% — switching to IR overlay.",
  "🟢 MG Road: Seatbelt compliance improved by 6.2% after automated challan deployment.",
  "🔴 Indiranagar: 3 repeat offenders detected. Auto-dispatch recommendation: send patrol unit.",
  "🤖 AutoChallan Bot processed 5 cases in last 60s. Total auto-revenue: ₹2,500.",
  "🟡 Heavy Rain alert at Hebbal Flyover — AI switching to Retinex IR pre-processing for clarity.",
  "🔴 CRITICAL: Vehicle KA-03-MX-8891 flagged 4× within 2 hours. Habitual Offender marked.",
  "🟢 Model accuracy self-test passed: YOLOv8 mAP@0.5 = 0.941. No recalibration needed.",
  "🟡 Night mode triggered: 62 cameras switched to IR-exposure boost. Plate read accuracy maintained at 93.4%.",
  "🔴 Ambulance corridor block at Majestic Crossing — Emergency override issued to clear 3-lane path.",
  "🟢 Koramangala enforcement zone cleared. Officer D'Souza confirmed visual check at 80ft Rd.",
  "🤖 AI Patrol Planner recommends: Deploy 2 officers near Indiranagar Metro between 5:30–8:30 PM.",
];

export const initialViolations = [
  {
      id: "VIO-8041",
      vehicleType: "Two-Wheeler",
      plateNumber: "KA-03-MX-8891",
      violationType: "Helmet Non Compliance",
      confidence: 0.98,
      timestamp: "2026-06-16T14:10:45Z",
      cameraId: "CAM-04",
      location: "Silk Board Junction, Outer Ring Rd",
      imagePath: "/assets/cam_helmet.png",
      status: "Pending",
      annotatedBox: { x: 120, y: 80, width: 90, height: 95 },
      explainability: "Rider head region detected without safety helmet. Bounding box maps motorcycle registration plate KA-03-MX-8891.",
      state: "Karnataka",
      owner: "Suresh Gowda",
      chassis: "ME3SKX9827B91",
      emergencyFlag: false
  },
  {
      id: "VIO-8042",
      vehicleType: "SUV",
      plateNumber: "KA-51-AB-1024",
      violationType: "Illegal Parking",
      confidence: 0.95,
      timestamp: "2026-06-16T14:09:12Z",
      cameraId: "CAM-12",
      location: "Indiranagar 100ft Rd",
      imagePath: "/assets/cam_parking.png",
      status: "Approved",
      annotatedBox: { x: 250, y: 180, width: 310, height: 160 },
      explainability: "Static white vehicle localized inside restricted polygon zone mask for over 180 seconds. Sidewalk blockage registered.",
      state: "Karnataka",
      owner: "Ankit Sharma",
      chassis: "MA1PLX8876G11",
      emergencyFlag: false
  },
  {
      id: "VIO-8043",
      vehicleType: "Two-Wheeler",
      plateNumber: "KA-01-EQ-9551",
      violationType: "Triple Riding",
      confidence: 0.96,
      timestamp: "2026-06-16T14:07:33Z",
      cameraId: "CAM-08",
      location: "Koramangala 80ft Rd",
      imagePath: "/assets/cam_triple.png",
      status: "Pending",
      annotatedBox: { x: 180, y: 110, width: 140, height: 180 },
      explainability: "Three distinct head regions localized on a single motorcycle chassis box. Exceeds load safety limit.",
      state: "Karnataka",
      owner: "Manpreet Singh",
      chassis: "MB3SKZ9281B20",
      emergencyFlag: false
  },
  {
      id: "VIO-8044",
      vehicleType: "Sedan",
      plateNumber: "KA-04-HA-2287",
      violationType: "Seatbelt Non Compliance",
      confidence: 0.94,
      timestamp: "2026-06-16T13:58:04Z",
      cameraId: "CAM-15",
      location: "MG Road, Near Metro Pillar 110",
      imagePath: "/assets/cam_parking.png",
      status: "Pending",
      annotatedBox: { x: 300, y: 150, width: 80, height: 110 },
      explainability: "Front cabin windshield crop parses rider torso without diagonal seatbelt strap placement.",
      state: "Karnataka",
      owner: "Divya Hegde",
      chassis: "MD4PAX7726H22",
      emergencyFlag: false
  },
  {
      id: "VIO-8045",
      vehicleType: "Two-Wheeler",
      plateNumber: "KA-03-MX-8891",
      violationType: "Wrong Side Driving",
      confidence: 0.91,
      timestamp: "2026-06-16T13:52:19Z",
      cameraId: "CAM-04",
      location: "Silk Board Junction, Outer Ring Rd",
      imagePath: "/assets/cam_helmet.png",
      status: "Approved",
      annotatedBox: { x: 140, y: 90, width: 100, height: 105 },
      explainability: "Directional vector flow tracking indicates vehicle moving opposite to road vector standard layout.",
      state: "Karnataka",
      owner: "Suresh Gowda",
      chassis: "ME3SKX9827B91",
      emergencyFlag: false
  },
  {
      id: "VIO-8046",
      vehicleType: "Ambulance",
      plateNumber: "KA-51-AM-9110",
      violationType: "Illegal Parking",
      confidence: 0.99,
      timestamp: "2026-06-16T13:45:00Z",
      cameraId: "CAM-21",
      location: "Majestic Crossing Corridor",
      imagePath: "/assets/cam_parking.png",
      status: "Approved",
      annotatedBox: { x: 190, y: 120, width: 120, height: 130 },
      explainability: "Emergency Vehicle (Ambulance) identified. Signal priority override issued. Alerting lanes ahead.",
      state: "Karnataka",
      owner: "BGS Global Hospital",
      chassis: "MH2EMX1102A11",
      emergencyFlag: true
  },
  {
      id: "VIO-8047",
      vehicleType: "Two-Wheeler",
      plateNumber: "KA-03-MX-8891",
      violationType: "Mobile Phone Usage While Driving",
      confidence: 0.89,
      timestamp: "2026-06-16T13:30:10Z",
      cameraId: "CAM-04",
      location: "Silk Board Junction",
      imagePath: "/assets/cam_helmet.png",
      status: "Approved",
      annotatedBox: { x: 130, y: 85, width: 95, height: 100 },
      explainability: "Rider right arm region localized next to head with phone dimensions crop identified.",
      state: "Karnataka",
      owner: "Suresh Gowda",
      chassis: "ME3SKX9827B91",
      emergencyFlag: false
  }
];

export const initialPatrols = [
  { name: "Officer Ramesh Gowda",        vehicleId: "KA-03-G-110", status: "Available", distance: "0.8 km", casesHandled: 142, responseTime: "8 mins",  cleared: 138, points: 2840, badge: "Elite",   stars: 5 },
  { name: "Officer Sunita Sen",           vehicleId: "KA-01-G-954", status: "On Duty",   distance: "2.1 km", casesHandled: 156, responseTime: "11 mins", cleared: 151, points: 2410, badge: "Expert",  stars: 4 },
  { name: "Officer Christopher D'Souza",  vehicleId: "KA-51-G-228", status: "Available", distance: "1.4 km", casesHandled: 131, responseTime: "9 mins",  cleared: 129, points: 1980, badge: "Senior",  stars: 4 },
  { name: "Officer Priya Nair",           vehicleId: "KA-09-G-881", status: "Available", distance: "3.2 km", casesHandled: 98,  responseTime: "14 mins", cleared: 92,  points: 1540, badge: "Active",   stars: 3 },
  { name: "Officer Vikram Kulkarni",      vehicleId: "KA-04-G-221", status: "On Duty",   distance: "0.6 km", casesHandled: 74,  responseTime: "10 mins", cleared: 70,  points: 1120, badge: "Active",   stars: 3 },
];

// ─── CCTV Camera Feed Data ──────────────────────────────────────────────────
export const CCTV_CAMERAS = [
  { id: "CAM-04", name: "Silk Board Junction",     img: "/assets/cam_helmet.png",  status: "ACTIVE",  violations: 1421, alert: true,  fps: 30 },
  { id: "CAM-08", name: "Koramangala 80ft Rd",     img: "/assets/cam_triple.png",  status: "ACTIVE",  violations: 820,  alert: false, fps: 30 },
  { id: "CAM-12", name: "Indiranagar 100ft Rd",    img: "/assets/cam_parking.png", status: "ACTIVE",  violations: 950,  alert: false, fps: 25 },
  { id: "CAM-15", name: "MG Road Metro Pillar",    img: "/assets/cam_helmet.png",  status: "ACTIVE",  violations: 610,  alert: true,  fps: 30 },
  { id: "CAM-21", name: "Majestic Crossing",       img: "/assets/cam_parking.png", status: "ACTIVE",  violations: 410,  alert: false, fps: 25 },
  { id: "CAM-22", name: "Hebbal Flyover",          img: "/assets/cam_triple.png",  status: "OFFLINE", violations: 0,    alert: false, fps: 0  },
];

// ─── Stolen / Wanted Plates Database ─────────────────────────────────────────────
export const STOLEN_PLATES = [
  { plate: "KA-03-MX-8891", reason: "Reported Stolen — Bengaluru South PS (FIR #2024/5511)",        severity: "CRITICAL" },
  { plate: "MH-12-AB-3301", reason: "Wanted Vehicle — Hit & Run Case (FIR #MH/2025/8812)",         severity: "HIGH"     },
  { plate: "TN-09-CC-5512", reason: "Overdue Challan Defaulter (14 unpaid challans — ₹7,000 due)",  severity: "MEDIUM"   },
];

// ─── Analytics / Revenue Constants ──────────────────────────────────────────────
export const WEEKLY_REVENUE = [
  { day: 'Mon', revenue: 142000, violations: 284, challans: 210 },
  { day: 'Tue', revenue: 186000, violations: 372, challans: 290 },
  { day: 'Wed', revenue: 221000, violations: 442, challans: 348 },
  { day: 'Thu', revenue: 198000, violations: 396, challans: 312 },
  { day: 'Fri', revenue: 265000, violations: 530, challans: 420 },
  { day: 'Sat', revenue: 312000, violations: 624, challans: 510 },
  { day: 'Sun', revenue: 178000, violations: 356, challans: 280 },
];
export const COMPLIANCE_TREND = [
  { month: 'Jan', helmet: 58, seatbelt: 72, parking: 61 },
  { month: 'Feb', helmet: 61, seatbelt: 74, parking: 63 },
  { month: 'Mar', helmet: 64, seatbelt: 76, parking: 67 },
  { month: 'Apr', helmet: 67, seatbelt: 79, parking: 70 },
  { month: 'May', helmet: 70, seatbelt: 81, parking: 72 },
  { month: 'Jun', helmet: 73, seatbelt: 84, parking: 75 },
];
export const TICKER_ALERTS = [
  "🚨 CRITICAL: Vehicle KA-03-MX-8891 flagged as STOLEN — Last seen Silk Board Junction",
  "✅ Auto-Challan Issued — KA-09-FX-2281 — Helmet Non Compliance — ₹500",
  "📡 CAM-04 Live Feed: 14 violations detected in last 5 minutes",
  "⚠️ Repeat Offender Alert: KA-03-MX-8891 has 4 violations today",
  "👮 Officer Ramesh Gowda dispatched to Silk Board Junction",
  "🟢 Seatbelt compliance up 4.2% this week on MG Road corridor",
  "🤖 AI Patrol Planner: Deploy 3 officers near Indiranagar Metro by 5 PM",
  "🚨 Red Light Violation detected — MH-12-AB-3301 at Koramangala Signal",
  "💡 YOLOv8 Engine: 99.1% uptime. Processing 30 FPS across 141 active cameras",
  "💰 Today's Auto-Revenue: ₹2,54,000 and counting",
];

// ─── Hourly Violation Data ─────────────────────────────────────────────────
export const HOURLY_VIOLATIONS = [
  { hour: '00',  count: 12  }, { hour: '01',  count: 8   }, { hour: '02',  count: 5   },
  { hour: '03',  count: 4   }, { hour: '04',  count: 7   }, { hour: '05',  count: 18  },
  { hour: '06',  count: 45  }, { hour: '07',  count: 112 }, { hour: '08',  count: 198 },
  { hour: '09',  count: 224 }, { hour: '10',  count: 187 }, { hour: '11',  count: 165 },
  { hour: '12',  count: 142 }, { hour: '13',  count: 158 }, { hour: '14',  count: 176 },
  { hour: '15',  count: 210 }, { hour: '16',  count: 243 }, { hour: '17',  count: 312 },
  { hour: '18',  count: 387 }, { hour: '19',  count: 290 }, { hour: '20',  count: 201 },
  { hour: '21',  count: 134 }, { hour: '22',  count: 78  }, { hour: '23',  count: 35  },
];

// ─── Signal Junction Data ─────────────────────────────────────────────────
export const SIGNAL_JUNCTIONS = [
  { id: 'SIG-01', name: 'Silk Board Junction',       phase: 'RED',   timer: 42, density: 'CRITICAL', override: false },
  { id: 'SIG-02', name: 'Koramangala Signal',         phase: 'GREEN', timer: 18, density: 'HIGH',     override: false },
  { id: 'SIG-03', name: 'MG Road Metro Crossing',     phase: 'AMBER', timer: 5,  density: 'MODERATE', override: false },
  { id: 'SIG-04', name: 'Indiranagar 100ft Rd',       phase: 'GREEN', timer: 31, density: 'HIGH',     override: false },
  { id: 'SIG-05', name: 'Majestic Crossing',          phase: 'RED',   timer: 67, density: 'CRITICAL', override: false },
  { id: 'SIG-06', name: 'Hebbal Flyover Entry',       phase: 'GREEN', timer: 22, density: 'LOW',      override: false },
];
