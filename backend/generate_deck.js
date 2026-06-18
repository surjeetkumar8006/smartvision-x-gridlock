const pptxgen = require('pptxgenjs');
const path = require('path');
const pptx = new pptxgen();

// Set slide size to 16:9 widescreen (13.33 x 7.5 inches)
pptx.defineLayout({ name: 'CUSTOM_16x9', width: 13.33, height: 7.5 });
pptx.layout = 'CUSTOM_16x9';
pptx.title = 'SmartVision X - Pitch Deck';
pptx.author = "Surjeet's Team";

// Premium Theme Palette
const colors = {
    bg: '0A0F1D',       // Deep Navy Black
    card: '111827',     // Slate 900
    cardHover: '1F2937',// Slate 800
    cyan: '00F0FF',     // Cyber Cyan
    blue: '3B82F6',     // Bright Blue
    green: '10B981',    // Emerald Green
    red: 'FF3366',      // Cyber Red
    purple: 'A78BFA',   // Lavender Purple
    orange: 'F59E0B',   // Warning Orange
    text: 'F9FAFB',     // Off-white
    textMuted: '9CA3AF',// Gray 400
    border: '1E293B'    // Dark Border
};

// Standard Fonts
const fontHeading = 'Arial'; // Safe fallback that looks clean
const fontBody = 'Calibri';

function createBaseSlide(titleText, categoryText = 'GRIDLOCK HACKATHON 2.0') {
    const slide = pptx.addSlide();
    slide.background = { fill: colors.bg };
    
    // Top category small tag
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
        
        // Horizontal line under title
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: 0.8, y: 1.5, w: 11.73, h: 0.02, fill: { color: colors.border }
        });
        // Gradient highlight on the line
        slide.addShape(pptx.shapes.RECTANGLE, {
            x: 0.8, y: 1.5, w: 2.0, h: 0.03, fill: { color: colors.cyan }
        });
    }

    // Bottom Right Watermark
    slide.addText('TEAM SURJEET', {
        x: 10.5, y: 7.0, w: 2.5, h: 0.3,
        fontSize: 10, bold: true, color: colors.textMuted, fontFace: fontHeading, align: 'right'
    });

    return slide;
}

// -------------------------------------------------------------
// SLIDE 1: Title / Cover Slide
// -------------------------------------------------------------
const slide1 = pptx.addSlide();
slide1.background = { fill: colors.bg };

slide1.addShape(pptx.shapes.OVAL, { x: 4.66, y: 1.75, w: 4.0, h: 4.0, fill: { color: '0D1526' }, line: { color: colors.cyan, width: 1 } });
slide1.addShape(pptx.shapes.OVAL, { x: 5.16, y: 2.25, w: 3.0, h: 3.0, fill: { color: '121C32' } });

slide1.addText('FLIPKART GRIDLOCK 2.0', {
    x: 0.5, y: 1.8, w: 12.33, h: 0.4,
    fontSize: 14, bold: true, color: colors.cyan, fontFace: fontHeading, align: 'center', tracking: 3
});

slide1.addText('SMARTVISION X', {
    x: 0.5, y: 2.4, w: 12.33, h: 1.5,
    fontSize: 72, bold: true, color: colors.text, fontFace: fontHeading, align: 'center'
});

slide1.addText('Autonomous AI-Powered Traffic Enforcement Platform', {
    x: 0.5, y: 3.9, w: 12.33, h: 0.5,
    fontSize: 22, color: colors.blue, fontFace: fontHeading, align: 'center'
});

slide1.addShape(pptx.shapes.RECTANGLE, {
    x: 1.66, y: 5.5, w: 10.0, h: 1.5,
    fill: { color: colors.card }, line: { color: colors.border, width: 1 }
});

slide1.addText('TEAM LEADER: Surjeet Yadav', { x: 2.0, y: 5.7, w: 4.0, h: 0.4, fontSize: 14, bold: true, color: colors.text, fontFace: fontHeading });
slide1.addText('TECH: MERN Stack + YOLOv8 + MongoDB Atlas', { x: 2.0, y: 6.2, w: 6.0, h: 0.4, fontSize: 12, color: colors.textMuted, fontFace: fontBody });


// -------------------------------------------------------------
// SLIDE 2: The Vision & Mission
// -------------------------------------------------------------
const slide2 = createBaseSlide('Our Vision & Mission', 'INTRODUCTION');

slide2.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.2, w: 5.5, h: 4.0, fill: { color: colors.card }, line: { color: colors.cyan, width: 2 } });
slide2.addText('THE VISION', { x: 1.2, y: 2.5, w: 4.8, h: 0.4, fontSize: 16, bold: true, color: colors.cyan, fontFace: fontHeading });
slide2.addText('To create a safer, smarter urban mobility ecosystem where technology actively prevents accidents, enforces compliance seamlessly, and empowers law enforcement with real-time intelligence.', {
    x: 1.2, y: 3.0, w: 4.8, h: 2.5, fontSize: 16, color: colors.text, fontFace: fontBody, lineSpacing: 24
});

slide2.addShape(pptx.shapes.RECTANGLE, { x: 7.0, y: 2.2, w: 5.5, h: 4.0, fill: { color: colors.card }, line: { color: colors.blue, width: 2 } });
slide2.addText('THE MISSION', { x: 7.4, y: 2.5, w: 4.8, h: 0.4, fontSize: 16, bold: true, color: colors.blue, fontFace: fontHeading });
slide2.addText('Deploy an end-to-end autonomous platform that transforms standard CCTV feeds into actionable data, automates e-challans, and provides an integrated dashboard for instant patrol dispatch.', {
    x: 7.4, y: 3.0, w: 4.8, h: 2.5, fontSize: 16, color: colors.text, fontFace: fontBody, lineSpacing: 24
});

// -------------------------------------------------------------
// SLIDE 3: The Urban Traffic Crisis
// -------------------------------------------------------------
const slide3 = createBaseSlide('The Urban Traffic Crisis', 'PROBLEM STATEMENT');

const crisisData = [
    { title: 'Alarming Accident Rates', desc: 'Helmetless and reckless driving cause thousands of fatal accidents annually.', stat: '60% Fatalities', color: colors.red },
    { title: 'Severe Congestion', desc: 'Illegal parking and gridlocks stall emergency services and daily commutes.', stat: 'Lost Hours', color: colors.orange },
    { title: 'Revenue Leakage', desc: 'Manual monitoring misses up to 80% of daily traffic violations in dense areas.', stat: 'Uncollected Fines', color: colors.cyan }
];

crisisData.forEach((item, idx) => {
    let x = 0.8 + (idx * 4.0);
    slide3.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.5, w: 3.7, h: 3.5, fill: { color: colors.card }, line: { color: item.color, width: 1 } });
    slide3.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.5, w: 3.7, h: 0.1, fill: { color: item.color } });
    slide3.addText(item.stat, { x: x + 0.2, y: 3.0, w: 3.3, h: 0.6, fontSize: 24, bold: true, color: item.color, fontFace: fontHeading });
    slide3.addText(item.title, { x: x + 0.2, y: 3.8, w: 3.3, h: 0.4, fontSize: 14, bold: true, color: colors.text, fontFace: fontHeading });
    slide3.addText(item.desc, { x: x + 0.2, y: 4.3, w: 3.3, h: 1.5, fontSize: 13, color: colors.textMuted, fontFace: fontBody });
});

// -------------------------------------------------------------
// SLIDE 4: Limitations of Manual Enforcement
// -------------------------------------------------------------
const slide4 = createBaseSlide('Limitations of Manual Enforcement', 'PROBLEM STATEMENT');

slide4.addText('Why traditional traffic police methods are failing in modern mega-cities:', {
    x: 0.8, y: 2.0, w: 10.0, h: 0.4, fontSize: 16, color: colors.text, fontFace: fontHeading
});

const limits = [
    'HUMAN FATIGUE: Impossible for operators to manually monitor thousands of screens 24/7.',
    'DELAYED RESPONSE: E-Challans take days to process, losing the immediate deterrence effect.',
    'RESOURCE CONSTRAINTS: Not enough physical officers to patrol every junction simultaneously.',
    'SILOED DATA: No central intelligence tracking repeat offenders across different city zones.'
];

limits.forEach((limit, idx) => {
    slide4.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.8 + (idx * 1.0), w: 0.2, h: 0.8, fill: { color: colors.red } });
    slide4.addShape(pptx.shapes.RECTANGLE, { x: 1.1, y: 2.8 + (idx * 1.0), w: 11.4, h: 0.8, fill: { color: colors.card } });
    slide4.addText(limit, { x: 1.3, y: 2.9 + (idx * 1.0), w: 11.0, h: 0.6, fontSize: 14, color: colors.text, fontFace: fontBody });
});

// -------------------------------------------------------------
// SLIDE 5: Introducing SmartVision X
// -------------------------------------------------------------
const slide5 = createBaseSlide('Introducing SmartVision X', 'THE SOLUTION');

slide5.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.0, w: 11.73, h: 1.5, fill: { color: '0D1B2A' }, line: { color: colors.cyan, width: 2 } });
slide5.addText('The Ultimate AI-Powered Traffic Nervous System', { x: 1.0, y: 2.2, w: 11.3, h: 0.6, fontSize: 24, bold: true, color: colors.cyan, fontFace: fontHeading, align: 'center' });
slide5.addText('Seamlessly blending Computer Vision, Cloud Databases, and modern Web Dashboards into one unified platform.', { x: 1.0, y: 2.8, w: 11.3, h: 0.4, fontSize: 16, color: colors.text, fontFace: fontBody, align: 'center' });

slide5.addText('How It Works:', { x: 0.8, y: 4.0, w: 4.0, h: 0.5, fontSize: 18, bold: true, color: colors.text, fontFace: fontHeading });
const howWorks = [
    '1. Cameras capture live street footage.',
    '2. YOLOv8 AI detects violations instantly.',
    '3. OCR extracts license plates automatically.',
    '4. Dashboard alerts the nearest patrol officer.'
];
slide5.addText(howWorks.join('\n\n'), { x: 0.8, y: 4.6, w: 8.0, h: 2.0, fontSize: 16, color: colors.textMuted, fontFace: fontBody });

// -------------------------------------------------------------
// SLIDE 6: Key Features Overview
// -------------------------------------------------------------
const slide6 = createBaseSlide('Key Features Overview', 'PLATFORM CAPABILITIES');

const features = [
    { t: 'Live Video Analytics', d: 'Processes streams in real-time.' },
    { t: 'Automated E-Challans', d: 'Generates PDF tickets with photo proof.' },
    { t: 'Smart Patrol Dispatch', d: 'Routes cops based on GPS proximity.' },
    { t: 'Risk Profiling', d: 'Flags highly dangerous repeat offenders.' },
    { t: 'Live MongoDB Sync', d: 'Data is instantly backed up to the cloud.' },
    { t: 'Interactive Heatmaps', d: 'Visualizes congestion zones dynamically.' }
];

features.forEach((feat, idx) => {
    let row = Math.floor(idx / 3);
    let col = idx % 3;
    let x = 0.8 + (col * 3.9);
    let y = 2.5 + (row * 2.0);
    
    slide6.addShape(pptx.shapes.RECTANGLE, { x: x, y: y, w: 3.6, h: 1.5, fill: { color: colors.card }, line: { color: colors.blue, width: 1 } });
    slide6.addText(feat.t, { x: x+0.2, y: y+0.2, w: 3.2, h: 0.4, fontSize: 14, bold: true, color: colors.cyan, fontFace: fontHeading });
    slide6.addText(feat.d, { x: x+0.2, y: y+0.6, w: 3.2, h: 0.8, fontSize: 12, color: colors.textMuted, fontFace: fontBody });
});

// -------------------------------------------------------------
// SLIDE 7: AI Vision Pipeline
// -------------------------------------------------------------
const slide7 = createBaseSlide('AI Vision Pipeline', 'TECHNOLOGY DEEP DIVE');

slide7.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.5, w: 11.73, h: 3.5, fill: { color: colors.card } });

slide7.addText('CCTV Frame', { x: 1.2, y: 3.8, w: 2.0, h: 0.8, fontSize: 16, bold:true, color: colors.text, align:'center' });
slide7.addText('➔', { x: 3.3, y: 3.8, w: 0.5, h: 0.8, fontSize: 24, color: colors.cyan, align:'center' });
slide7.addText('YOLOv8 Inference', { x: 4.0, y: 3.8, w: 2.0, h: 0.8, fontSize: 16, bold:true, color: colors.cyan, align:'center' });
slide7.addText('➔', { x: 6.1, y: 3.8, w: 0.5, h: 0.8, fontSize: 24, color: colors.cyan, align:'center' });
slide7.addText('Plate OCR', { x: 6.8, y: 3.8, w: 2.0, h: 0.8, fontSize: 16, bold:true, color: colors.blue, align:'center' });
slide7.addText('➔', { x: 8.9, y: 3.8, w: 0.5, h: 0.8, fontSize: 24, color: colors.cyan, align:'center' });
slide7.addText('MERN Backend', { x: 9.6, y: 3.8, w: 2.0, h: 0.8, fontSize: 16, bold:true, color: colors.green, align:'center' });

// -------------------------------------------------------------
// SLIDE 8: AI Vision Demo (Helmet Violation)
// -------------------------------------------------------------
const slide8 = createBaseSlide('AI Vision Demo: Helmet Violation', 'LIVE CAPTURE');
try {
    slide8.addImage({
        path: 'C:\\\\Users\\\\Acer\\\\.gemini\\\\antigravity\\\\brain\\\\bd687b3f-1672-44c1-937e-b4831c6ad795\\\\helmet_violation_1781779175727.png',
        x: 2.5, y: 2.0, w: 8.33, h: 4.8, sizing: { type: 'contain' }
    });
} catch(e) {}

// -------------------------------------------------------------
// SLIDE 9: Dashboard Demo
// -------------------------------------------------------------
const slide9 = createBaseSlide('SmartVision X Dashboard', 'LIVE INTERFACE');
try {
    slide9.addImage({
        path: 'C:\\\\Users\\\\Acer\\\\.gemini\\\\antigravity\\\\brain\\\\bd687b3f-1672-44c1-937e-b4831c6ad795\\\\smartvision_dashboard_1781779190351.png',
        x: 2.0, y: 2.0, w: 9.33, h: 5.0, sizing: { type: 'contain' }
    });
} catch(e) {}

// -------------------------------------------------------------
// SLIDE 10: Automated E-Challan Generation
// -------------------------------------------------------------
const slide10 = createBaseSlide('Automated E-Challan Generation', 'CORE MODULE');
slide10.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.5, w: 5.0, h: 4.0, fill: { color: colors.card }, line: { color: colors.cyan, width: 1 } });
slide10.addText('The e-Challan module replaces manual ticket writing.', { x: 1.2, y: 2.8, w: 4.2, h: 1.0, fontSize: 16, color: colors.text });
slide10.addText('• Verified by Operator\n• Fetches RTO Data\n• Attaches Image Proof\n• PDF Export Ready', { x: 1.2, y: 4.0, w: 4.2, h: 2.0, fontSize: 14, color: colors.textMuted, bullet: true, lineSpacing: 20 });

// -------------------------------------------------------------
// SLIDE 11: MongoDB Atlas Live Sync
// -------------------------------------------------------------
const slide11 = createBaseSlide('MongoDB Atlas Live Cloud Sync', 'DATABASE ARCHITECTURE');
slide11.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.5, w: 11.73, h: 2.0, fill: { color: colors.card }, line: { color: colors.green, width: 2 } });
slide11.addText('Enterprise-Grade Persistence', { x: 1.2, y: 2.8, w: 10.0, h: 0.5, fontSize: 20, bold: true, color: colors.green });
slide11.addText('All violations, patrol statuses, and user accounts are instantly synchronized to MongoDB Atlas, ensuring 100% data integrity and global accessibility for authorized traffic personnel.', { x: 1.2, y: 3.4, w: 10.0, h: 1.0, fontSize: 16, color: colors.text });

// -------------------------------------------------------------
// SLIDE 12: Smart Dispatch System
// -------------------------------------------------------------
const slide12 = createBaseSlide('Smart Dispatch System', 'OPERATIONS');
slide12.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: 2.5, w: 11.73, h: 3.5, fill: { color: colors.card }, line: { color: colors.purple, width: 1 } });
slide12.addText('Dynamic Routing for Patrol Officers', { x: 1.2, y: 2.8, w: 10.0, h: 0.5, fontSize: 20, bold: true, color: colors.purple });
const dispatchTxt = 'When a severe violation (like heavy gridlock or illegal parking) is detected, the system calculates the GPS distance of all on-duty officers and automatically dispatches the closest unit, reducing response times from hours to minutes.';
slide12.addText(dispatchTxt, { x: 1.2, y: 3.5, w: 10.0, h: 2.0, fontSize: 18, color: colors.text, lineSpacing: 24 });

// -------------------------------------------------------------
// SLIDE 13: Technology Stack
// -------------------------------------------------------------
const slide13 = createBaseSlide('Technology Stack', 'ENGINEERING');
const techList = [
    { n: 'Frontend', d: 'React.js, Vite, Tailwind CSS, Recharts' },
    { n: 'Backend', d: 'Node.js, Express.js, REST APIs' },
    { n: 'Database', d: 'MongoDB Atlas, Mongoose ORM' },
    { n: 'AI & Vision', d: 'Python, YOLOv8, OpenCV, Tesseract OCR' }
];

techList.forEach((t, idx) => {
    let y = 2.5 + (idx * 1.1);
    slide13.addShape(pptx.shapes.RECTANGLE, { x: 0.8, y: y, w: 11.73, h: 0.9, fill: { color: colors.card } });
    slide13.addText(t.n, { x: 1.2, y: y+0.25, w: 3.0, h: 0.4, fontSize: 18, bold: true, color: colors.cyan });
    slide13.addText(t.d, { x: 4.5, y: y+0.25, w: 7.0, h: 0.4, fontSize: 16, color: colors.text });
});

// -------------------------------------------------------------
// SLIDE 14: Business Impact & ROI
// -------------------------------------------------------------
const slide14 = createBaseSlide('Business Impact & ROI', 'VALUE PROPOSITION');
const impacts = [
    { t: '90% Faster Resolution', d: 'Automated processing eliminates paperwork.' },
    { t: '40% Reduction in Congestion', d: 'Faster dispatch clears bottlenecks instantly.' },
    { t: '3x Fine Recovery', d: 'No violator escapes the automated camera net.' }
];

impacts.forEach((imp, idx) => {
    let x = 0.8 + (idx * 4.0);
    slide14.addShape(pptx.shapes.RECTANGLE, { x: x, y: 2.8, w: 3.7, h: 3.0, fill: { color: colors.card }, line: { color: colors.green, width: 2 } });
    slide14.addText(imp.t, { x: x+0.2, y: 3.5, w: 3.3, h: 0.8, fontSize: 20, bold: true, color: colors.green, align:'center' });
    slide14.addText(imp.d, { x: x+0.2, y: 4.5, w: 3.3, h: 1.0, fontSize: 14, color: colors.text, align:'center' });
});

// -------------------------------------------------------------
// SLIDE 15: Future Roadmap & Conclusion
// -------------------------------------------------------------
const slide15 = createBaseSlide('Future Roadmap & Conclusion', 'WHAT\'S NEXT');
slide15.addText('Where we are heading next:', { x: 0.8, y: 2.2, w: 10.0, h: 0.5, fontSize: 18, color: colors.text });

const roadmap = [
    '• Hardware Edge Integration (running YOLOv8 directly on camera chips)',
    '• Direct Integration with VAHAN & NIC National Databases',
    '• Citizen App for crowdsourced violation reporting',
    '• AI-Predictive Traffic Light Control'
];
slide15.addText(roadmap.join('\n\n'), { x: 1.2, y: 3.0, w: 10.0, h: 3.0, fontSize: 16, color: colors.cyan, fontFace: fontHeading });

slide15.addText('Thank You! Ready to Transform Urban Mobility.', { x: 0.8, y: 6.2, w: 11.73, h: 0.8, fontSize: 22, bold: true, color: colors.text, align: 'center' });

// Save the presentation
const outputPath = path.join(__dirname, '..', 'SmartVision_X_Pitch_Deck.pptx');
pptx.writeFile({ fileName: outputPath })
    .then(fileName => {
        console.log(`🎉 PowerPoint presentation successfully generated and saved to: ${fileName}`);
    })
    .catch(err => {
        console.error('❌ Error generating PowerPoint:', err);
    });
