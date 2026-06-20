const pptxgen = require('pptxgenjs');
const path = require('path');
const pptx = new pptxgen();

// Set slide size to 16:9 widescreen (13.33 x 7.5 inches)
pptx.defineLayout({ name: 'CUSTOM_16x9', width: 13.33, height: 7.5 });
pptx.layout = 'CUSTOM_16x9';
pptx.title = 'SmartVision X - Pitch Deck';
pptx.author = "Surjeet Yadav";

// Premium Theme Palette (Dark-Cyber Aesthetic)
const colors = {
    bg: '070C16',       // Deep space dark navy
    card: '0E1626',     // Translucent dark card background
    cardHeader: '152035',// Slightly lighter slate for card headers
    cyan: '00F0FF',     // Neon Cyber Cyan (Primary accent)
    blue: '2A82E6',     // Electric Blue (Secondary accent)
    green: '05D782',    // Neon Emerald Green (Success state)
    red: 'FF2A5F',      // Neon Crimson Red (Alert / Crisis state)
    purple: '8A5CF5',   // Cyber Lavender (System state)
    orange: 'FF9F1C',   // Warning Gold (Metrics / Status state)
    text: 'F5F9FC',     // Crisp off-white text
    textMuted: '8A9BB4',// Cool slate-gray for muted body text
    border: '1A2C46'    // Subtle grid/border line color
};

// Standard Typography
const fontHeading = 'Arial';
const fontBody = 'Calibri';
const fontMono = 'Courier New';

/**
 * Creates the base slide background, small category tags, title, and watermark
 */
function createBaseSlide(titleText, categoryText = 'GRIDLOCK HACKATHON 2.0') {
    const slide = pptx.addSlide();
    slide.background = { fill: colors.bg };
    
    // Top category small tag (HUD design)
    slide.addText(`SMARTVISION X  //  ${categoryText}`, {
        x: 0.8, y: 0.4, w: 10.0, h: 0.3,
        fontSize: 10, bold: true, color: colors.cyan, fontFace: fontHeading, tracking: 2
    });

    if (titleText) {
        // Slide title
        slide.addText(titleText, {
            x: 0.8, y: 0.8, w: 11.0, h: 0.6,
            fontSize: 28, bold: true, color: colors.text, fontFace: fontHeading
        });
        
        // Horizontal divider line under title
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: 0.8, y: 1.45, w: 11.73, h: 0.02, fill: { color: colors.border }
        });
        // Gradient HUD highlight on the left edge of the divider
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: 0.8, y: 1.45, w: 1.8, h: 0.03, fill: { color: colors.cyan }
        });
    }

    // Bottom Watermark showing the live URL on every slide for maximum visibility
    slide.addText('LIVE PLATFORM DEMO: smartvision-x-gridlock-c579.vercel.app', {
        x: 0.8, y: 7.0, w: 11.73, h: 0.3,
        fontSize: 9, bold: true, color: colors.cyan, fontFace: fontHeading, align: 'left', tracking: 1
    });

    return slide;
}

// =============================================================================
// SLIDE 1: Title / Cover Slide (Stunning Cyber HUD design)
// =============================================================================
const slide1 = pptx.addSlide();
slide1.background = { fill: colors.bg };

// Dynamic background shapes (circular radar HUD and tech accents)
slide1.addShape(pptx.shapes.OVAL, { x: 4.66, y: 1.75, w: 4.0, h: 4.0, fill: { color: '0A1224' }, line: { color: colors.cyan, width: 1 } });
slide1.addShape(pptx.shapes.OVAL, { x: 5.16, y: 2.25, w: 3.0, h: 3.0, fill: { color: '0F1B35' }, line: { color: colors.blue, width: 1, dashType: 'dash' } });

// Header tags
slide1.addText('FLIPKART GRIDLOCK HACKATHON 2.0  //  THEME 3 SUBMISSION', {
    x: 0.5, y: 1.7, w: 12.33, h: 0.4,
    fontSize: 12, bold: true, color: colors.cyan, fontFace: fontHeading, align: 'center', tracking: 4
});

// Primary brand title
slide1.addText('SMARTVISION X', {
    x: 0.5, y: 2.2, w: 12.33, h: 1.3,
    fontSize: 68, bold: true, color: colors.text, fontFace: fontHeading, align: 'center'
});

// Sub-branding
slide1.addText('Autonomous AI-Powered Traffic Enforcement & Safety Platform', {
    x: 0.5, y: 3.6, w: 12.33, h: 0.5,
    fontSize: 20, bold: true, color: colors.blue, fontFace: fontHeading, align: 'center'
});

// Footer Metadata Card
slide1.addShape(pptx.shapes.RECTANGLE, {
    x: 1.66, y: 4.8, w: 10.0, h: 1.8,
    fill: { color: colors.card }, line: { color: colors.border, width: 1 }
});

slide1.addText('PROJECT OVERVIEW', { x: 2.0, y: 4.95, w: 9.33, h: 0.3, fontSize: 11, bold: true, color: colors.cyan, fontFace: fontHeading, tracking: 2 });
slide1.addText('Presented by: Surjeet Yadav', { x: 2.0, y: 5.25, w: 4.5, h: 0.4, fontSize: 16, bold: true, color: colors.text, fontFace: fontHeading });
slide1.addText('Live Demo: smartvision-x-gridlock-c579.vercel.app', { x: 2.0, y: 5.75, w: 9.33, h: 0.3, fontSize: 12, bold: true, color: colors.green, fontFace: fontBody });
slide1.addText('Architecture: React / Vite + Express MVC + YOLOv8 + MongoDB Atlas Sync', { x: 2.0, y: 6.1, w: 9.33, h: 0.3, fontSize: 12, color: colors.textMuted, fontFace: fontBody });


// =============================================================================
// SLIDE 2: Our Vision & Core Mandate
// =============================================================================
const slide2 = createBaseSlide('Our Vision & Mission', 'EXECUTIVE SUMMARY');

// Vision Card (Cyan Accent)
slide2.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.2, w: 5.5, h: 4.2, fill: { color: colors.card }, line: { color: colors.cyan, width: 1.5 } });
slide2.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.2, w: 5.5, h: 0.6, fill: { color: colors.cardHeader } });
slide2.addText('THE VISION', { x: 1.2, y: 2.3, w: 4.7, h: 0.4, fontSize: 16, bold: true, color: colors.cyan, fontFace: fontHeading });
slide2.addText('To construct a fully autonomous urban mobility nervous system that eliminates human delays in traffic enforcement, instantly detects life-threatening safety violations, and secures Indian roads using real-time Edge Artificial Intelligence.', {
    x: 1.2, y: 3.1, w: 4.7, h: 3.0, fontSize: 15, color: colors.text, fontFace: fontBody, lineSpacing: 25
});

// Mission Card (Blue Accent)
slide2.addShape(pptx.shapes.RECTANGLE, { x: 7.0, y: 2.2, w: 5.5, h: 4.2, fill: { color: colors.card }, line: { color: colors.blue, width: 1.5 } });
slide2.addShape(pptx.shapes.RECTANGLE, { x: 7.0, y: 2.2, w: 5.5, h: 0.6, fill: { color: colors.cardHeader } });
slide2.addText('THE MISSION', { x: 7.4, y: 2.3, w: 4.7, h: 0.4, fontSize: 16, bold: true, color: colors.blue, fontFace: fontHeading });
slide2.addText('Deploy an end-to-end MERN stack + Python CV application that processes live CCTV streams to: \n\n• Detect Helmetless Riders & Triple Riding\n• Identify Sidewalk/Illegal Parking Blockages\n• Auto-generate legal evidence & PDF Challans\n• Dispatch patrol officers based on GPS proximity.', {
    x: 7.4, y: 3.1, w: 4.7, h: 3.0, fontSize: 14, color: colors.text, fontFace: fontBody, lineSpacing: 22
});


// =============================================================================
// SLIDE 3: The Urban Traffic Crisis (The Problem)
// =============================================================================
const slide3 = createBaseSlide('The Urban Traffic Crisis', 'PROBLEM STATEMENT');

const crisisData = [
    { title: 'Critical Safety Violations', desc: 'Riders ignoring helmet mandates and practicing dangerous triple-riding habits cause 60%+ of two-wheeler road casualties.', stat: '60% Fatalities', color: colors.red },
    { title: 'Junction Bottlenecks', desc: 'Illegal parking on major urban arterial roads blocks sidewalks and creates severe choke points (e.g., Silk Board Jn).', stat: 'Severe Congestion', color: colors.orange },
    { title: 'Enforcement Leakage', desc: 'Manual operators miss over 80% of transient parking and helmet violations due to sheer feed volume and visual fatigue.', stat: '80% Missed Tickets', color: colors.cyan }
];

crisisData.forEach((item, idx) => {
    let x = 0.8 + (idx * 4.0);
    slide3.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.2, w: 3.7, h: 4.2, fill: { color: colors.card }, line: { color: item.color, width: 1.5 } });
    slide3.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.2, w: 3.7, h: 0.1, fill: { color: item.color } });
    
    // Top tag
    slide3.addText(`METRIC 0${idx+1}`, { x: x + 0.3, y: 2.5, w: 3.1, h: 0.2, fontSize: 9, bold: true, color: colors.textMuted, fontFace: fontHeading });
    // Large Stat Highlight
    slide3.addText(item.stat, { x: x + 0.3, y: 2.7, w: 3.1, h: 0.6, fontSize: 24, bold: true, color: item.color, fontFace: fontHeading });
    // Title
    slide3.addText(item.title, { x: x + 0.3, y: 3.6, w: 3.1, h: 0.4, fontSize: 15, bold: true, color: colors.text, fontFace: fontHeading });
    // Description
    slide3.addText(item.desc, { x: x + 0.3, y: 4.1, w: 3.1, h: 2.0, fontSize: 13, color: colors.textMuted, fontFace: fontBody, lineSpacing: 18 });
});


// =============================================================================
// SLIDE 4: Limitations of Manual Enforcement
// =============================================================================
const slide4 = createBaseSlide('Limitations of Manual Enforcement', 'PROBLEM STATEMENT');

slide4.addText('Traditional traffic policing methods cannot scale with mega-city volumes due to: ', {
    x: 0.8, y: 2.0, w: 11.0, h: 0.4, fontSize: 16, color: colors.text, fontFace: fontHeading
});

const limits = [
    { label: 'HUMAN VISUAL FATIGUE', desc: 'Impossible for control room officers to monitor hundreds of CCTV streams concurrently 24×7 without missing violations.' },
    { label: 'HIGH PROCESSING LATENCY', desc: 'Manual e-challans take days to process and dispatch, losing the psychological impact of immediate traffic fine warnings.' },
    { label: 'OFF-LINE DISPATCH LOOP', desc: 'No active connection between cameras flagging violations and nearby patrol cars, leaving field units unrouted.' },
    { label: 'DISCONNECTED REPEAT HISTORIES', desc: 'No system queries registration numbers against history to identify high-risk drivers in real-time.' }
];

limits.forEach((limit, idx) => {
    let y = 2.6 + (idx * 1.05);
    slide4.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.15, h: 0.9, fill: { color: colors.red } });
    slide4.addShape(pptx.shapes.RECTANGLE, { x: 0.95, y: y, w: 11.58, h: 0.9, fill: { color: colors.card }, line: { color: colors.border } });
    
    // Bold tag
    slide4.addText(limit.label, { x: 1.15, y: y + 0.15, w: 3.0, h: 0.6, fontSize: 13, bold: true, color: colors.red, fontFace: fontHeading });
    // Description
    slide4.addText(limit.desc, { x: 4.20, y: y + 0.15, w: 8.1, h: 0.6, fontSize: 13, color: colors.text, fontFace: fontBody });
});


// =============================================================================
// SLIDE 5: Introducing SmartVision X
// =============================================================================
const slide5 = createBaseSlide('Introducing SmartVision X', 'THE SOLUTION');

// Unified Architecture Header
slide5.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.0, w: 11.73, h: 1.3, fill: { color: '0D172A' }, line: { color: colors.cyan, width: 1.5 } });
slide5.addText('The Ultimate AI-Powered Traffic Nervous System', { x: 1.0, y: 2.15, w: 11.3, h: 0.5, fontSize: 24, bold: true, color: colors.cyan, fontFace: fontHeading, align: 'center' });
slide5.addText('An end-to-end platform that captures street streams, detects violations using custom-quantised YOLOv8 models, reads license plates with OCR, and dispatches responders via a real-time web portal.', { x: 1.0, y: 2.65, w: 11.3, h: 0.5, fontSize: 14, color: colors.text, fontFace: fontBody, align: 'center' });

// Horizontal Steps Layout (4 steps side-by-side)
const steps = [
    { num: '01', title: 'CCTV CAPTURE', desc: 'RTSP video feeds from high-density junctions stream directly to edge servers.' },
    { num: '02', title: 'EDGE AI INFERENCE', desc: 'Optimised YOLOv8 instantly locates riders, cars, helmets, and plates.' },
    { num: '03', title: 'PLATE OCR READ', desc: 'EasyOCR extracts alphanumeric text from HSRP plates on violation frames.' },
    { num: '04', title: 'CLOUD ENFORCEMENT', desc: 'MongoDB Atlas stores record. Dispatch triggers closest patrol car.' }
];

steps.forEach((step, idx) => {
    let x = 0.8 + (idx * 2.95);
    slide5.addShape(pptx.shapes.RECTANGLE, { x: x, y: 3.8, w: 2.8, h: 2.6, fill: { color: colors.card }, line: { color: colors.border } });
    
    // Step Number
    slide5.addText(step.num, { x: x + 0.2, y: 4.0, w: 2.4, h: 0.4, fontSize: 18, bold: true, color: colors.cyan, fontFace: fontHeading });
    // Title
    slide5.addText(step.title, { x: x + 0.2, y: 4.5, w: 2.4, h: 0.3, fontSize: 12, bold: true, color: colors.text, fontFace: fontHeading });
    // Description
    slide5.addText(step.desc, { x: x + 0.2, y: 4.9, w: 2.4, h: 1.3, fontSize: 11, color: colors.textMuted, fontFace: fontBody });
    
    // Add connector arrow between steps (except last)
    if (idx < 3) {
        slide5.addText('➔', { x: x + 2.75, y: 4.8, w: 0.3, h: 0.5, fontSize: 18, color: colors.blue });
    }
});


// =============================================================================
// SLIDE 6: Key Modules Overview (The 6 pillars of the code)
// =============================================================================
const slide6 = createBaseSlide('Key Modules Overview', 'PLATFORM CAPABILITIES');

const features = [
    { t: 'Live Violation Detection', d: 'Real-time camera feed analysis with bounding boxes for motorcycles, riders, helmet status, and illegal parking.' },
    { t: 'Automated Evidence Center', d: 'Frictionless dashboard showing violation snapshots, confidence rates, plate crop crops, and PDF download buttons.' },
    { t: 'Smart Patrol Dispatcher', d: 'GPS-tracked patrol dispatches. Calculates nearest active responder using coordinates and dispatches with route details.' },
    { t: 'Offenders Database (Risk)', d: 'Alphanumeric query interface retrieving history records from VAHAN database simulator to calculate recidivism risk scores.' },
    { t: 'AI Configuration Console', d: 'Interactive threshold tuners allowing operators to live-adjust YOLOv8 confidence rates, OCR sensitivity, and IR exposure.' },
    { t: 'Emergency Override Module', d: 'VIP Corridor simulator which triggers green lights sequentially across junctions to ensure gridlock clearance.' }
];

features.forEach((feat, idx) => {
    let row = Math.floor(idx / 3);
    let col = idx % 3;
    let x = 0.8 + (col * 3.9);
    let y = 2.1 + (row * 2.3);
    
    slide6.addShape(pptx.shapes.RECTANGLE, { x: x, y: y, w: 3.7, h: 2.0, fill: { color: colors.card }, line: { color: colors.border } });
    slide6.addShape(pptx.shapes.RECTANGLE, { x: x, y: y, w: 3.7, h: 0.4, fill: { color: colors.cardHeader } });
    
    // Module title
    slide6.addText(feat.t, { x: x + 0.2, y: y + 0.08, w: 3.3, h: 0.25, fontSize: 12, bold: true, color: colors.cyan, fontFace: fontHeading });
    // Module description
    slide6.addText(feat.d, { x: x + 0.2, y: y + 0.5, w: 3.3, h: 1.3, fontSize: 11, color: colors.text, fontFace: fontBody, lineSpacing: 16 });
});


// =============================================================================
// SLIDE 7: AI Vision Pipeline (Technical Deep Dive)
// =============================================================================
const slide7 = createBaseSlide('AI Vision Pipeline', 'TECHNOLOGY DEEP DIVE');

// Slide description
slide7.addText('How raw CCTV camera feeds are processed into legally binding traffic citations in milliseconds:', {
    x: 0.8, y: 1.9, w: 11.0, h: 0.4, fontSize: 14, color: colors.textMuted, fontFace: fontHeading
});

const pipelineNodes = [
    { step: 'CCTV CAPTURE', model: 'RTSP Stream', info: '1080p stream at 30 FPS. Weather filters simulation (Rain/Night) adjust exposure.', color: colors.blue },
    { step: 'YOLOv8 DETECT', model: 'YOLOv8-nano', info: 'Localises class boxes: car, motorcycle, rider, helmet, plate.', color: colors.cyan },
    { step: 'EASYOCR ENGINE', model: 'CRNN OCR', info: 'Processes cropped plate image. Applies perspective warp and Otsu thresholding.', color: colors.purple },
    { step: 'DECISION RULES', model: 'Rule Compiler', info: 'Triple riding check (>2 rider boxes in vehicle box). No-helmet threshold logic.', color: colors.orange },
    { step: 'REST ENGINE', model: 'Express Controller', info: 'Persists violation to MongoDB. Auto-sends challan notice.', color: colors.green }
];

pipelineNodes.forEach((node, idx) => {
    let x = 0.8 + (idx * 2.38);
    slide7.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.6, w: 2.15, h: 3.8, fill: { color: colors.card }, line: { color: node.color, width: 1 } });
    
    // Top colored pill
    slide7.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: x + 0.15, y: 2.8, w: 1.85, h: 0.5, fill: { color: node.color } });
    slide7.addText(node.step, { x: x + 0.15, y: 2.9, w: 1.85, h: 0.3, fontSize: 10, bold: true, color: '000000', align: 'center', fontFace: fontHeading });
    
    // Model/Tech header
    slide7.addText(node.model, { x: x + 0.15, y: 3.45, w: 1.85, h: 0.3, fontSize: 11, bold: true, color: colors.text, fontFace: fontHeading, align: 'center' });
    // Line separator
    slide7.addShape(pptx.shapes.RECTANGLE, { x: x + 0.15, y: 3.8, w: 1.85, h: 0.01, fill: { color: colors.border } });
    // Info details
    slide7.addText(node.info, { x: x + 0.15, y: 3.9, w: 1.85, h: 2.3, fontSize: 10.5, color: colors.textMuted, fontFace: fontBody, align: 'left', lineSpacing: 15 });
    
    // Connector arrow (except last)
    if (idx < 4) {
        slide7.addText('➔', { x: x + 2.2, y: 4.2, w: 0.2, h: 0.4, fontSize: 16, color: colors.cyan });
    }
});


// =============================================================================
// SLIDE 8: AI Vision Demo (Helmet Violation Live Capture)
// =============================================================================
const slide8 = createBaseSlide('AI Vision Demo: Helmet Violation', 'LIVE DETECTION CORE');

// Left Column: Explanation of the crop capture
slide8.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 4.5, h: 4.4, fill: { color: colors.card }, line: { color: colors.border } });
slide8.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 4.5, h: 0.5, fill: { color: colors.cardHeader } });
slide8.addText('YOLOv8 + OCR PIPELINE IN ACTION', { x: 1.1, y: 2.2, w: 3.9, h: 0.3, fontSize: 12, bold: true, color: colors.cyan, fontFace: fontHeading });

const explainPoints = [
    '• Vehicle Bounding Box: YOLOv8 locates the motorcycle and crops the regional coordinates.',
    '• Helmet Status Classifier: Specifically isolates the rider head box to run binary prediction (Helmet/No Helmet).',
    '• Automatic Plate Localization: Identifies HSRP plate location and applies OCR perspective warping.',
    '• Real-time Confidence Rating: The AI engine returns a 94.6% prediction confidence.'
];
slide8.addText(explainPoints.join('\n\n'), { x: 1.1, y: 2.8, w: 3.9, h: 3.4, fontSize: 12, color: colors.text, fontFace: fontBody, lineSpacing: 20 });

// Right Column: Image Frame with Cyber HUD outline
const imgPath1 = path.join(__dirname, '..', 'docs', 'assets', 'helmet_violation.png');
slide8.addShape(pptx.shapes.RECTANGLE, { x: 5.7, y: 2.1, w: 6.83, h: 4.4, fill: { color: '030811' }, line: { color: colors.cyan, width: 2 } });
// HUD corners
slide8.addShape(pptx.shapes.RECTANGLE, { x: 5.6, y: 2.0, w: 0.3, h: 0.05, fill: { color: colors.cyan } });
slide8.addShape(pptx.shapes.RECTANGLE, { x: 5.6, y: 2.0, w: 0.05, h: 0.3, fill: { color: colors.cyan } });
slide8.addShape(pptx.shapes.RECTANGLE, { x: 12.43, y: 2.0, w: 0.3, h: 0.05, fill: { color: colors.cyan } });
slide8.addShape(pptx.shapes.RECTANGLE, { x: 12.68, y: 2.0, w: 0.05, h: 0.3, fill: { color: colors.cyan } });

slide8.addShape(pptx.shapes.RECTANGLE, { x: 5.6, y: 6.45, w: 0.3, h: 0.05, fill: { color: colors.cyan } });
slide8.addShape(pptx.shapes.RECTANGLE, { x: 5.6, y: 6.2, w: 0.05, h: 0.3, fill: { color: colors.cyan } });
slide8.addShape(pptx.shapes.RECTANGLE, { x: 12.43, y: 6.45, w: 0.3, h: 0.05, fill: { color: colors.cyan } });
slide8.addShape(pptx.shapes.RECTANGLE, { x: 12.68, y: 6.2, w: 0.05, h: 0.3, fill: { color: colors.cyan } });

try {
    slide8.addImage({
        path: imgPath1,
        x: 5.8, y: 2.2, w: 6.63, h: 4.2, sizing: { type: 'contain' }
    });
} catch(e) {
    slide8.addText('[Image: helmet_violation.png not found - please run start-all.ps1]', {
        x: 6.2, y: 3.8, w: 5.8, h: 1.0, fontSize: 14, color: colors.red, align: 'center'
    });
}


// =============================================================================
// SLIDE 9: Command Center Live Web Interface
// =============================================================================
const slide9 = createBaseSlide('SmartVision X Dashboard', 'LIVE WEB INTERFACE');

// Image Frame (Left Column)
const imgPath2 = path.join(__dirname, '..', 'docs', 'assets', 'smartvision_dashboard.png');
slide9.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 7.2, h: 4.4, fill: { color: '030811' }, line: { color: colors.blue, width: 2 } });
// HUD corners
slide9.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 2.0, w: 0.3, h: 0.05, fill: { color: colors.blue } });
slide9.addShape(pptx.shapes.RECTANGLE, { x: 0.7, y: 2.0, w: 0.05, h: 0.3, fill: { color: colors.blue } });
slide9.addShape(pptx.shapes.RECTANGLE, { x: 7.9, y: 6.45, w: 0.3, h: 0.05, fill: { color: colors.blue } });
slide9.addShape(pptx.shapes.RECTANGLE, { x: 7.9, y: 6.2, w: 0.05, h: 0.3, fill: { color: colors.blue } });

try {
    slide9.addImage({
        path: imgPath2,
        x: 0.9, y: 2.2, w: 7.0, h: 4.2, sizing: { type: 'contain' }
    });
} catch(e) {
    slide9.addText('[Image: smartvision_dashboard.png not found]', {
        x: 1.2, y: 3.8, w: 6.2, h: 1.0, fontSize: 14, color: colors.red, align: 'center'
    });
}

// Right Column: Dashboard key widgets explanation
slide9.addShape(pptx.shapes.RECTANGLE, { x: 8.4, y: 2.1, w: 4.13, h: 4.4, fill: { color: colors.card }, line: { color: colors.border } });
slide9.addShape(pptx.shapes.RECTANGLE, { x: 8.4, y: 2.1, w: 4.13, h: 0.5, fill: { color: colors.cardHeader } });
slide9.addText('INTEGRATED CONTROL ROOM', { x: 8.7, y: 2.2, w: 3.5, h: 0.3, fontSize: 12, bold: true, color: colors.cyan, fontFace: fontHeading });

const widgets = [
    '• Live CCTV Grid: Stream switcher simulating camera junctions across Silk Board and Majestic.',
    '• AI Brain Panel: Audio/visual alerts switch with live CPU/GPU tracking.',
    '• Violations Center: Instant table rendering with OCR read outs and pdf generation.',
    '• Weather Toggles: Simulates clear, rain, or night exposure conditions.'
];
slide9.addText(widgets.join('\n\n'), { x: 8.7, y: 2.8, w: 3.5, h: 2.3, fontSize: 11, color: colors.text, fontFace: fontBody, lineSpacing: 16 });

// Live Link Button shape
slide9.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: 8.7, y: 5.3, w: 3.5, h: 0.9, fill: { color: '0A1E3A' }, line: { color: colors.green, width: 2 } });
slide9.addText('LIVE PLATFORM URL', { x: 8.7, y: 5.4, w: 3.5, h: 0.25, fontSize: 10, bold: true, color: colors.green, align: 'center', fontFace: fontHeading });
slide9.addText('smartvision-x-gridlock-c579.vercel.app/command', { x: 8.7, y: 5.65, w: 3.5, h: 0.4, fontSize: 9.5, bold: true, color: colors.text, align: 'center', fontFace: fontMono });


// =============================================================================
// SLIDE 10: Automated Evidence & E-Challan Generation
// =============================================================================
const slide10 = createBaseSlide('Automated E-Challan Generation', 'CORE MODULE');

// Left Column: Details about evidence generator
slide10.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 5.5, h: 4.4, fill: { color: colors.card }, line: { color: colors.border } });
slide10.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 5.5, h: 0.5, fill: { color: colors.cardHeader } });
slide10.addText('E-CHALLAN GENERATION ENGINE', { x: 1.1, y: 2.2, w: 4.9, h: 0.3, fontSize: 13, bold: true, color: colors.cyan, fontFace: fontHeading });

const challanPoints = [
    '• Operator Verification: The platform keeps a human in the loop. The control officer reviews the auto-cropped plate frame before confirming.',
    '• Automated Fine Calculation: System auto-assigns fine amounts (₹1,000 for helmet violations, ₹2,000 for triple riding).',
    '• RTO Vahan Sync: Connects license plates to registered owner mobile data for automated SMS alert simulations.',
    '• High-fidelity PDF Receipt: Exports clean legal tickets complete with plate crops, maps, and barcode elements.'
];
slide10.addText(challanPoints.join('\n\n'), { x: 1.1, y: 2.7, w: 4.9, h: 3.6, fontSize: 11, color: colors.text, fontFace: fontBody, lineSpacing: 18 });

// Right Column: Mock Visual E-Challan Receipt card
const ticketX = 7.3;
slide10.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: ticketX, y: 2.1, w: 5.2, h: 4.4, fill: { color: 'FFFFFF' }, line: { color: 'CCCCCC', width: 1.5 } });

// Ticket Header
slide10.addText('BENGALURU TRAFFIC POLICE', { x: ticketX + 0.3, y: 2.3, w: 4.6, h: 0.3, fontSize: 13, bold: true, color: '0A192F', fontFace: fontHeading, align: 'center' });
slide10.addText('OFFICIAL E-CHALLAN RECEIPT', { x: ticketX + 0.3, y: 2.55, w: 4.6, h: 0.2, fontSize: 9, color: '666666', fontFace: fontHeading, align: 'center' });
slide10.addShape(pptx.shapes.RECTANGLE, { x: ticketX + 0.3, y: 2.85, w: 4.6, h: 0.01, fill: { color: 'CCCCCC' } });

// Ticket Details
const ticketDetails = [
    ['Challan Number:', 'BTP-9082-2026-X'],
    ['Date & Time:', '20-June-2026 | 10:00 AM'],
    ['Junction Area:', 'Silk Board Junction (CAM-04)'],
    ['Vehicle Plate:', 'KA-03-MX-8891'],
    ['Violation Class:', 'Helmet Non-Compliance'],
    ['Fine Amount:', '₹ 1,000.00']
];

ticketDetails.forEach((row, idx) => {
    let y = 3.0 + (idx * 0.35);
    slide10.addText(row[0], { x: ticketX + 0.4, y: y, w: 1.8, h: 0.3, fontSize: 10.5, bold: true, color: '444444', fontFace: fontBody });
    slide10.addText(row[1], { x: ticketX + 2.2, y: y, w: 2.6, h: 0.3, fontSize: 10.5, color: row[1].startsWith('₹') ? 'FF0000' : '111111', bold: row[1].startsWith('₹') ? true : false, fontFace: fontBody });
});

// Green verified stamp box
slide10.addShape(pptx.shapes.RECTANGLE, { x: ticketX + 3.2, y: 5.2, w: 1.6, h: 0.5, fill: { color: 'E6FBF3' }, line: { color: '05D782', width: 2 } });
slide10.addText('VERIFIED & PAID', { x: ticketX + 3.2, y: 5.3, w: 1.6, h: 0.3, fontSize: 9.5, bold: true, color: '05B36C', fontFace: fontHeading, align: 'center' });

// Simulated barcode lines (using multiple thin rectangles)
const barcodeX = ticketX + 0.4;
const barcodeY = 5.3;
const barWidths = [0.03, 0.08, 0.04, 0.02, 0.09, 0.03, 0.05, 0.02, 0.08, 0.04, 0.02, 0.09, 0.03, 0.05, 0.02, 0.08];
let currentX = barcodeX;
barWidths.forEach((w) => {
    slide10.addShape(pptx.shapes.RECTANGLE, { x: currentX, y: barcodeY, w: w, h: 0.4, fill: { color: '000000' } });
    currentX += w + 0.03;
});


// =============================================================================
// SLIDE 11: MongoDB Atlas Live Cloud Sync
// =============================================================================
const slide11 = createBaseSlide('MongoDB Atlas Live Cloud Sync', 'DATABASE ARCHITECTURE');

// Left Column: Database capabilities description
slide11.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 5.5, h: 4.4, fill: { color: colors.card }, line: { color: colors.border } });
slide11.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 5.5, h: 0.5, fill: { color: colors.cardHeader } });
slide11.addText('ENTERPRISE DATA PERSISTENCE', { x: 1.1, y: 2.2, w: 4.9, h: 0.3, fontSize: 13, bold: true, color: colors.green, fontFace: fontHeading });

const dbPoints = [
    '• Hybrid Mode: Connects to live MongoDB Atlas Cloud cluster. Automatically falls back to local JSON persistence if internet drops.',
    '• Real-time Schema Validation: Mongoose models enforce validation rules, timestamp audits, and geospatial coordinates.',
    '• Query Optimization: Indexes on vehicle license plates and violation timestamps allow instant search queries.',
    '• Global Accessibility: Command Center dashboard queries sync instantly, giving city inspectors access to active logs.'
];
slide11.addText(dbPoints.join('\n\n'), { x: 1.1, y: 2.7, w: 4.9, h: 3.6, fontSize: 11, color: colors.text, fontFace: fontBody, lineSpacing: 18 });

// Right Column: Mock Code Schema Block (JSON syntax)
const codeX = 7.3;
slide11.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: codeX, y: 2.1, w: 5.2, h: 4.4, fill: { color: '020712' }, line: { color: colors.green, width: 1.5 } });
slide11.addShape(pptx.shapes.RECTANGLE, { x: codeX, y: 2.1, w: 5.2, h: 0.4, fill: { color: '0B1528' } });
slide11.addText('mongoose.model("Violation")', { x: codeX + 0.3, y: 2.2, w: 4.6, h: 0.3, fontSize: 10, bold: true, color: colors.textMuted, fontFace: fontMono });

// Syntax highlighted fake JSON
const jsonLines = [
    '{',
    '  "_id": ObjectId("66741b21efb34"),',
    '  "plate_number": "KA03MX8891",',
    '  "violation_type": "No Helmet",',
    '  "location": "Silk Board Junction",',
    '  "confidence": 0.946,',
    '  "evidence_image": "uploads/ KA03MX.jpg",',
    '  "challan_amount": 1000,',
    '  "status": "pending_operator_review",',
    '  "timestamp": ISODate("2026-06-20T10:00:00Z")',
    '}'
];

jsonLines.forEach((line, idx) => {
    let y = 2.7 + (idx * 0.32);
    let color = colors.text;
    if (line.includes('"_id"') || line.includes('"plate_number"') || line.includes('"violation_type"') || line.includes('"location"') || line.includes('"confidence"') || line.includes('"evidence_image"') || line.includes('"challan_amount"') || line.includes('"status"') || line.includes('"timestamp"')) {
        // Draw key in green
        color = colors.green;
    } else if (line.includes('ObjectId') || line.includes('ISODate') || line.includes('0.946') || line.includes('1000')) {
        // Draw types/numbers in orange
        color = colors.orange;
    } else if (line.includes('KA03MX8891') || line.includes('No Helmet') || line.includes('Silk Board') || line.includes('uploads/') || line.includes('pending')) {
        // Draw values in cyan
        color = colors.cyan;
    }
    slide11.addText(line, { x: codeX + 0.4, y: y, w: 4.6, h: 0.3, fontSize: 9.5, color: color, fontFace: fontMono });
});


// =============================================================================
// SLIDE 12: Smart Dispatch & Haversine Proximity Routing
// =============================================================================
const slide12 = createBaseSlide('Smart Dispatch System', 'OPERATIONS');

// Left Column: Explanation of Haversine formula
slide12.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 5.5, h: 4.4, fill: { color: colors.card }, line: { color: colors.border } });
slide12.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.1, w: 5.5, h: 0.5, fill: { color: colors.cardHeader } });
slide12.addText('HAVERSINE NEAREST OFFICER ROUTING', { x: 1.1, y: 2.2, w: 4.9, h: 0.3, fontSize: 13, bold: true, color: colors.purple, fontFace: fontHeading });

const dispatchPoints = [
    '• Real-time GPS Tracking: Field officers update their live coordinate pairs back to the dashboard.',
    '• Haversine Metric: When an operator verifies a critical block or triple-riding event, the backend runs the Haversine formula: \n  d = 2R × arcsin( √[ sin²(Δlat/2) + cos(lat1)cos(lat2)sin²(Δlon/2) ] )',
    '• Dynamic dispatch: Instantly orders patrol vehicles closest to the target coordinate (e.g. Officer Surjeet located 1.2km away).',
    '• Interactive Route Map: Highlights target coordinates on the CommandCenter dispatch console.'
];
slide12.addText(dispatchPoints.join('\n\n'), { x: 1.1, y: 2.7, w: 4.9, h: 3.6, fontSize: 11, color: colors.text, fontFace: fontBody, lineSpacing: 14 });

// Right Column: Visual Routing Flowchart
const flowX = 7.3;
slide12.addShape(pptx.shapes.ROUNDED_RECTANGLE, { x: flowX, y: 2.1, w: 5.2, h: 4.4, fill: { color: colors.card }, line: { color: colors.purple, width: 1.5 } });

// Flowchart nodes
const flowNodes = [
    { title: '1. CRITICAL INCIDENT FLAGGED', desc: 'CAM-04 identifies illegal parking gridlock.', col: colors.red },
    { title: '2. PROXIMITY ENGINE COMPUTES', desc: 'Backend filters active patrol coordinate arrays.', col: colors.cyan },
    { title: '3. CLOSEST CO-ORDINATE ROUTE', desc: 'Officer dispatch instructions pushed automatically.', col: colors.green }
];

flowNodes.forEach((node, idx) => {
    let y = 2.4 + (idx * 1.3);
    
    // Draw circle bullet
    slide12.addShape(pptx.shapes.OVAL, { x: flowX + 0.3, y: y, w: 0.6, h: 0.6, fill: { color: node.col } });
    slide12.addText((idx+1).toString(), { x: flowX + 0.3, y: y + 0.1, w: 0.6, h: 0.4, fontSize: 18, bold: true, color: '000000', align: 'center', fontFace: fontHeading });
    
    // Node details
    slide12.addText(node.title, { x: flowX + 1.1, y: y, w: 3.8, h: 0.25, fontSize: 11.5, bold: true, color: colors.text, fontFace: fontHeading });
    slide12.addText(node.desc, { x: flowX + 1.1, y: y + 0.25, w: 3.8, h: 0.5, fontSize: 10.5, color: colors.textMuted, fontFace: fontBody });
    
    // Connective lines
    if (idx < 2) {
        slide12.addShape(pptx.shapes.RECTANGLE, { x: flowX + 0.58, y: y + 0.6, w: 0.04, h: 0.7, fill: { color: colors.border } });
    }
});


// =============================================================================
// SLIDE 13: Technology Stack (Complete Grid)
// =============================================================================
const slide13 = createBaseSlide('Technology Stack', 'ENGINEERING');

const techList = [
    { name: 'FRONTEND MODULES', list: 'React.js, Vite Builder, Tailwind CSS, Lucide Icons, React Router DOM v6', spec: 'Dynamic route-based views, theme controllers, responsive dashboards.', color: colors.cyan },
    { name: 'BACKEND SYSTEM', list: 'Node.js, Express Framework, Multer File Uploads, REST controllers', spec: 'MVC structure: split models, controllers, and JSON local mock storage fallbacks.', color: colors.blue },
    { name: 'CLOUD PERSISTENCE', list: 'MongoDB Atlas, Mongoose ORM, Connection Status Flags', spec: 'Auto-sync loop triggers collection upserts, online dashboard flag updates.', color: colors.green },
    { name: 'COMPUTER VISION ENGINE', list: 'Python 3.13, Flask API, YOLOv8 (Ultralytics), EasyOCR, OpenCV', spec: 'Flask server runs YOLO inference and EasyOCR reader inside isolated venv.', color: colors.purple }
];

techList.forEach((t, idx) => {
    let y = 2.1 + (idx * 1.15);
    slide13.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y, w: 11.73, h: 1.0, fill: { color: colors.card }, line: { color: colors.border } });
    slide13.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y, w: 0.1, h: 1.0, fill: { color: t.color } });
    
    // Tech Category
    slide13.addText(t.name, { x: 1.1, y: y + 0.15, w: 3.2, h: 0.3, fontSize: 12, bold: true, color: t.color, fontFace: fontHeading });
    // Details
    slide13.addText('Stack: ' + t.list, { x: 4.4, y: y + 0.15, w: 7.8, h: 0.3, fontSize: 12, bold: true, color: colors.text, fontFace: fontBody });
    slide13.addText('Usage: ' + t.spec, { x: 4.4, y: y + 0.5, w: 7.8, h: 0.3, fontSize: 11, color: colors.textMuted, fontFace: fontBody });
});


// =============================================================================
// SLIDE 14: Business Impact & ROI
// =============================================================================
const slide14 = createBaseSlide('Business Impact & ROI', 'VALUE PROPOSITION');

const impacts = [
    { t: '90% Processing Efficiency', d: 'Automated YOLO/OCR identification reduces time-to-issue for challans from 3 days to under 5 seconds.', val: '90%', sub: 'Time Reduced', color: colors.cyan },
    { t: '40% Congestion Relief', d: 'Proximity dispatch clears illegal street parking blockers from sidewalk junctions before gridlocks expand.', val: '40%', sub: 'Junction Clearance', color: colors.green },
    { t: '3.5x Fine Collection', d: 'Eliminates human observation leakage. Multiple cameras stream 24/7 without fatigue, checking every vehicle registration.', val: '3.5x', sub: 'Enforcement Yield', color: colors.blue }
];

impacts.forEach((imp, idx) => {
    let x = 0.8 + (idx * 4.0);
    slide14.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.2, w: 3.7, h: 4.2, fill: { color: colors.card }, line: { color: colors.border } });
    slide14.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.2, w: 3.7, h: 1.5, fill: { color: colors.cardHeader } });
    
    // Massive Number
    slide14.addText(imp.val, { x: x + 0.2, y: 2.3, w: 3.3, h: 0.8, fontSize: 48, bold: true, color: imp.color, fontFace: fontHeading, align: 'center' });
    slide14.addText(imp.sub, { x: x + 0.2, y: 3.1, w: 3.3, h: 0.3, fontSize: 11, bold: true, color: colors.textMuted, fontFace: fontHeading, align: 'center', tracking: 2 });
    
    // Divider
    slide14.addShape(pptx.shapes.RECTANGLE, { x: x + 0.5, y: 3.8, w: 2.7, h: 0.01, fill: { color: colors.border } });
    
    // Labels and texts
    slide14.addText(imp.t, { x: x + 0.3, y: 4.1, w: 3.1, h: 0.4, fontSize: 14, bold: true, color: colors.text, fontFace: fontHeading, align: 'center' });
    slide14.addText(imp.d, { x: x + 0.3, y: 4.6, w: 3.1, h: 1.6, fontSize: 11.5, color: colors.textMuted, fontFace: fontBody, align: 'left', lineSpacing: 16 });
});


// =============================================================================
// SLIDE 15: Future Roadmap & Milestones (Timeline layout)
// =============================================================================
const slide15 = createBaseSlide('Future Roadmap & Milestones', 'ROADMAP');

slide15.addText('Strategic roadmap for scaling SmartVision X across regional state grids:', {
    x: 0.8, y: 2.0, w: 10.0, h: 0.4, fontSize: 15, color: colors.text, fontFace: fontHeading
});

// Horizontal Line representing timeline path
slide15.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 11.73, h: 0.04, fill: { color: colors.border } });
slide15.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 4.2, w: 3.0, h: 0.05, fill: { color: colors.cyan } });

const roadmap = [
    { date: 'Q3 2026', title: 'Edge Hardware Port', desc: 'Deploy YOLOv8-nano onto NVIDIA Jetson Orin Nano modules for physical CCTV cam placement.' },
    { date: 'Q4 2026', title: 'NIC Vahan Integration', desc: 'Establish direct API handshakes with NIC Vahan/Sarathi databases for real-time owner registry search.' },
    { date: 'H1 2027', title: 'Citizen Complaint App', desc: 'Launch crowdsourced reporting app. Citizens upload pictures which run auto YOLO checks.' },
    { date: 'H2 2027', title: 'AI-Predictive Signals', desc: 'Direct intersection overrides to green corridor routing based on neural traffic forecasts.' }
];

roadmap.forEach((item, idx) => {
    let x = 0.8 + (idx * 2.95);
    
    // Draw timeline node box
    slide15.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.6, w: 2.8, h: 1.3, fill: { color: colors.card }, line: { color: colors.border } });
    slide15.addText(item.date, { x: x + 0.15, y: 2.7, w: 2.5, h: 0.3, fontSize: 13, bold: true, color: colors.cyan, fontFace: fontHeading });
    slide15.addText(item.title, { x: x + 0.15, y: 3.05, w: 2.5, h: 0.8, fontSize: 12, bold: true, color: colors.text, fontFace: fontHeading });
    
    // Draw timeline circle node directly on the line
    slide15.addShape(pptx.shapes.OVAL, { x: x + 1.25, y: 4.08, w: 0.3, h: 0.3, fill: { color: colors.bg }, line: { color: colors.cyan, width: 2 } });
    slide15.addShape(pptx.shapes.OVAL, { x: x + 1.35, y: 4.18, w: 0.1, h: 0.1, fill: { color: colors.cyan } });
    
    // Draw description text under the timeline line
    slide15.addText(item.desc, { x: x, y: 4.6, w: 2.8, h: 1.8, fontSize: 11, color: colors.textMuted, fontFace: fontBody, align: 'left', lineSpacing: 15 });
});

// Final Thank you tagline
slide15.addText('Autonomous Urban Safety Platform — Ready to Scale.', {
    x: 0.8, y: 6.3, w: 11.73, h: 0.5,
    fontSize: 16, bold: true, color: colors.cyan, fontFace: fontHeading, align: 'center', tracking: 1
});


// Save the presentation
const outputPath = path.join(__dirname, '..', 'SmartVision_X_Pitch_Deck.pptx');
pptx.writeFile({ fileName: outputPath })
    .then(fileName => {
        console.log(`🎉 PowerPoint presentation successfully generated and saved to: ${fileName}`);
    })
    .catch(err => {
        console.error('❌ Error generating PowerPoint:', err);
    });
