import collections
import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.shapes import MSO_SHAPE
from pptx.dml.color import RGBColor
from pptx.enum.text import PP_ALIGN
import os

prs = Presentation()

# Set slide size to 16:9 widescreen (13.33 x 7.5 inches)
prs.slide_width = Inches(13.33)
prs.slide_height = Inches(7.5)

# Premium Theme Palette
c_bg = RGBColor(0x07, 0x0C, 0x16)
c_card = RGBColor(0x0E, 0x16, 0x26)
c_cardHeader = RGBColor(0x15, 0x20, 0x35)
c_cyan = RGBColor(0x00, 0xF0, 0xFF)
c_blue = RGBColor(0x2A, 0x82, 0xE6)
c_green = RGBColor(0x05, 0xD7, 0x82)
c_red = RGBColor(0xFF, 0x2A, 0x5F)
c_purple = RGBColor(0x8A, 0x5C, 0xF5)
c_orange = RGBColor(0xFF, 0x9F, 0x1C)
c_text = RGBColor(0xF5, 0xF9, 0xFC)
c_textMuted = RGBColor(0x8A, 0x9B, 0xB4)
c_border = RGBColor(0x1A, 0x2C, 0x46)

def add_full_bg(slide):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, Inches(13.33), Inches(7.5))
    bg.fill.solid()
    bg.fill.fore_color.rgb = c_bg
    bg.line.fill.background()
    return bg

def add_para_run(tf, text, font_size, color, bold=False, font_name='Calibri', line_spacing=None, is_first=False):
    """
    Helper function to safely add colored text to a python-pptx TextFrame.
    This creates an explicit text run object, which is guaranteed to render
    with the correct color across all PowerPoint viewers.
    """
    if is_first:
        p = tf.paragraphs[0]
        # Clear default text if any
        p.text = ""
    else:
        p = tf.add_paragraph()
    
    if line_spacing:
        p.line_spacing = line_spacing
        
    run = p.add_run()
    run.text = text
    run.font.size = Pt(font_size)
    run.font.bold = bold
    run.font.color.rgb = color
    run.font.name = font_name
    return p

def createBaseSlide(title_text, category_text="GRIDLOCK HACKATHON 2.0"):
    slide = prs.slides.add_slide(prs.slide_layouts[6]) # blank layout
    add_full_bg(slide)
    
    # Top tag
    tx_hud = slide.shapes.add_textbox(Inches(0.8), Inches(0.4), Inches(10.0), Inches(0.3))
    tf = tx_hud.text_frame
    tf.word_wrap = True
    add_para_run(tf, f"SMARTVISION X  //  {category_text}", 10, c_cyan, bold=True, font_name='Arial', is_first=True)
    
    if title_text:
        # Title text
        tx_title = slide.shapes.add_textbox(Inches(0.8), Inches(0.7), Inches(11.0), Inches(0.6))
        tf_title = tx_title.text_frame
        tf_title.word_wrap = True
        add_para_run(tf_title, title_text, 28, c_text, bold=True, font_name='Arial', is_first=True)
        
        # Horizontal line
        line = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.45), Inches(11.73), Inches(0.02))
        line.fill.solid()
        line.fill.fore_color.rgb = c_border
        line.line.fill.background()
        
        # HUD highlight line
        line_hud = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(1.45), Inches(1.8), Inches(0.03))
        line_hud.fill.solid()
        line_hud.fill.fore_color.rgb = c_cyan
        line_hud.line.fill.background()
        
    # Watermark showing live URL
    tx_watermark = slide.shapes.add_textbox(Inches(0.8), Inches(7.0), Inches(11.73), Inches(0.3))
    tf_wm = tx_watermark.text_frame
    tf_wm.word_wrap = True
    add_para_run(tf_wm, "LIVE PLATFORM DEMO: smartvision-x-gridlock-c579.vercel.app", 9, c_cyan, bold=True, font_name='Arial', is_first=True)
    
    return slide

def add_card(slide, x, y, w, h, border_color, fill_color=c_card):
    card = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(w), Inches(h))
    card.fill.solid()
    card.fill.fore_color.rgb = fill_color
    if border_color:
        card.line.color.rgb = border_color
        card.line.width = Pt(1.5)
    else:
        card.line.fill.background()
    return card

# -----------------------------------------------------------------------------
# SLIDE 1: Cover
# -----------------------------------------------------------------------------
slide1 = prs.slides.add_slide(prs.slide_layouts[6])
add_full_bg(slide1)

# Dynamic HUD elements
el1 = slide1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(4.66), Inches(1.75), Inches(4.0), Inches(4.0))
el1.fill.solid()
el1.fill.fore_color.rgb = RGBColor(0x0A, 0x12, 0x24)
el1.line.color.rgb = c_cyan
el1.line.width = Pt(1)

el2 = slide1.shapes.add_shape(MSO_SHAPE.OVAL, Inches(5.16), Inches(2.25), Inches(3.0), Inches(3.0))
el2.fill.solid()
el2.fill.fore_color.rgb = RGBColor(0x0F, 0x1B, 0x35)
el2.line.color.rgb = c_blue
el2.line.width = Pt(1)

# Text blocks
tx = slide1.shapes.add_textbox(Inches(0.5), Inches(1.7), Inches(12.33), Inches(0.4))
tf = tx.text_frame
tf.word_wrap = True
add_para_run(tf, "FLIPKART GRIDLOCK HACKATHON 2.0  //  THEME 3 SUBMISSION", 12, c_cyan, bold=True, font_name='Arial', is_first=True).alignment = PP_ALIGN.CENTER

tx2 = slide1.shapes.add_textbox(Inches(0.5), Inches(2.2), Inches(12.33), Inches(1.3))
tf2 = tx2.text_frame
tf2.word_wrap = True
add_para_run(tf2, "SMARTVISION X", 68, c_text, bold=True, font_name='Arial', is_first=True).alignment = PP_ALIGN.CENTER

tx3 = slide1.shapes.add_textbox(Inches(0.5), Inches(3.6), Inches(12.33), Inches(0.5))
tf3 = tx3.text_frame
tf3.word_wrap = True
add_para_run(tf3, "Autonomous AI-Powered Traffic Enforcement & Safety Platform", 20, c_blue, bold=True, font_name='Arial', is_first=True).alignment = PP_ALIGN.CENTER

add_card(slide1, 1.66, 4.8, 10.0, 1.8, c_border)
tx_meta = slide1.shapes.add_textbox(Inches(2.0), Inches(4.9), Inches(9.33), Inches(1.6))
tf_meta = tx_meta.text_frame
tf_meta.word_wrap = True

add_para_run(tf_meta, "PROJECT OVERVIEW", 11, c_cyan, bold=True, font_name='Arial', is_first=True)
add_para_run(tf_meta, "Presented by: Surjeet Yadav", 16, c_text, bold=True, font_name='Arial')
add_para_run(tf_meta, "Live Demo: smartvision-x-gridlock-c579.vercel.app", 12, c_green, bold=True)
add_para_run(tf_meta, "Architecture: React / Vite + Express MVC + YOLOv8 + MongoDB Atlas Sync", 12, c_textMuted)

# -----------------------------------------------------------------------------
# SLIDE 2: Vision & Mission
# -----------------------------------------------------------------------------
slide2 = createBaseSlide("Our Vision & Mission", "EXECUTIVE SUMMARY")

add_card(slide2, 0.8, 2.2, 5.5, 4.2, c_cyan)
add_card(slide2, 0.8, 2.2, 5.5, 0.6, None, c_cardHeader)

tx_vis = slide2.shapes.add_textbox(Inches(1.1), Inches(2.25), Inches(4.9), Inches(3.9))
tf_vis = tx_vis.text_frame
tf_vis.word_wrap = True
add_para_run(tf_vis, "THE VISION", 16, c_cyan, bold=True, font_name='Arial', is_first=True)
add_para_run(tf_vis, "To construct a fully autonomous urban mobility nervous system that eliminates human delays in traffic enforcement, instantly detects life-threatening safety violations, and secures Indian roads using real-time Edge Artificial Intelligence.", 15, c_text, line_spacing=1.3)

add_card(slide2, 7.0, 2.2, 5.5, 4.2, c_blue)
add_card(slide2, 7.0, 2.2, 5.5, 0.6, None, c_cardHeader)

tx_mis = slide2.shapes.add_textbox(Inches(7.3), Inches(2.25), Inches(4.9), Inches(3.9))
tf_mis = tx_mis.text_frame
tf_mis.word_wrap = True
add_para_run(tf_mis, "THE MISSION", 16, c_blue, bold=True, font_name='Arial', is_first=True)
add_para_run(tf_mis, "Deploy an end-to-end MERN stack + Python CV application that processes live CCTV streams to:", 14, c_text, line_spacing=1.2)
add_para_run(tf_mis, "• Detect Helmetless Riders & Triple Riding", 13.5, c_textMuted)
add_para_run(tf_mis, "• Identify Sidewalk/Illegal Parking Blockages", 13.5, c_textMuted)
add_para_run(tf_mis, "• Auto-generate legal evidence & PDF Challans", 13.5, c_textMuted)
add_para_run(tf_mis, "• Dispatch patrol officers based on GPS proximity.", 13.5, c_textMuted)

# -----------------------------------------------------------------------------
# SLIDE 3: The Urban Traffic Crisis
# -----------------------------------------------------------------------------
slide3 = createBaseSlide("The Urban Traffic Crisis", "PROBLEM STATEMENT")

crisisData = [
    { 'title': 'Critical Safety Violations', 'desc': 'Riders ignoring helmet mandates and practicing dangerous triple-riding habits cause 60%+ of two-wheeler road casualties.', 'stat': '60% Fatalities', 'color': c_red },
    { 'title': 'Junction Bottlenecks', 'desc': 'Illegal parking on major urban arterial roads blocks sidewalks and creates severe choke points (e.g., Silk Board Jn).', 'stat': 'Severe Congestion', 'color': c_orange },
    { 'title': 'Enforcement Leakage', 'desc': 'Manual operators miss over 80% of transient parking and helmet violations due to sheer feed volume and visual fatigue.', 'stat': '80% Missed Tickets', 'color': c_cyan }
]

for idx, item in enumerate(crisisData):
    x = 0.8 + (idx * 4.0)
    add_card(slide3, x, 2.2, 3.7, 4.2, item['color'])
    top_line = slide3.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(2.2), Inches(3.7), Inches(0.1))
    top_line.fill.solid()
    top_line.fill.fore_color.rgb = item['color']
    top_line.line.fill.background()
    
    tx_c = slide3.shapes.add_textbox(Inches(x + 0.2), Inches(2.4), Inches(3.3), Inches(3.8))
    tf_c = tx_c.text_frame
    tf_c.word_wrap = True
    
    add_para_run(tf_c, f"METRIC 0{idx+1}", 9, c_textMuted, bold=True, is_first=True)
    add_para_run(tf_c, item['stat'], 24, item['color'], bold=True)
    add_para_run(tf_c, item['title'], 15, c_text, bold=True)
    add_para_run(tf_c, item['desc'], 12.5, c_textMuted, line_spacing=1.2)

# -----------------------------------------------------------------------------
# SLIDE 4: Limitations of Manual Enforcement
# -----------------------------------------------------------------------------
slide4 = createBaseSlide("Limitations of Manual Enforcement", "PROBLEM STATEMENT")

tx_intro = slide4.shapes.add_textbox(Inches(0.8), Inches(1.9), Inches(11.0), Inches(0.4))
tf_intro = tx_intro.text_frame
tf_intro.word_wrap = True
add_para_run(tf_intro, "Traditional traffic policing methods cannot scale with mega-city volumes due to:", 16, c_text, is_first=True)

limits = [
    { 'label': 'HUMAN VISUAL FATIGUE', 'desc': 'Impossible for control room officers to monitor hundreds of CCTV streams concurrently 24×7 without missing violations.' },
    { 'label': 'HIGH PROCESSING LATENCY', 'desc': 'Manual e-challans take days to process and dispatch, losing the psychological impact of immediate traffic fine warnings.' },
    { 'label': 'OFF-LINE DISPATCH LOOP', 'desc': 'No active connection between cameras flagging violations and nearby patrol cars, leaving field units unrouted.' },
    { 'label': 'DISCONNECTED REPEAT HISTORIES', 'desc': 'No system queries registration numbers against history to identify high-risk drivers in real-time.' }
]

for idx, limit in enumerate(limits):
    y = 2.6 + (idx * 1.05)
    bar = slide4.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(y), Inches(0.15), Inches(0.9))
    bar.fill.solid()
    bar.fill.fore_color.rgb = c_red
    bar.line.fill.background()
    
    add_card(slide4, 0.95, y, 11.58, 0.9, c_border)
    
    tx_lim = slide4.shapes.add_textbox(Inches(1.15), Inches(y + 0.1), Inches(11.2), Inches(0.7))
    tf_lim = tx_lim.text_frame
    tf_lim.word_wrap = True
    
    # We add a paragraph with two runs to keep bold label and normal description together beautifully
    p_lh = tf_lim.paragraphs[0]
    p_lh.text = "" # Clear default
    
    r_label = p_lh.add_run()
    r_label.text = limit['label'] + "   |   "
    r_label.font.size = Pt(13)
    r_label.font.bold = True
    r_label.font.color.rgb = c_red
    r_label.font.name = 'Arial'
    
    r_desc = p_lh.add_run()
    r_desc.text = limit['desc']
    r_desc.font.size = Pt(13)
    r_desc.font.bold = False
    r_desc.font.color.rgb = c_text
    r_desc.font.name = 'Calibri'

# -----------------------------------------------------------------------------
# SLIDE 5: Introducing SmartVision X
# -----------------------------------------------------------------------------
slide5 = createBaseSlide("Introducing SmartVision X", "THE SOLUTION")

# Unified Header Block
add_card(slide5, 0.8, 2.0, 11.73, 1.3, c_cyan, RGBColor(0x0D, 0x17, 0x2A))
tx_sh = slide5.shapes.add_textbox(Inches(1.0), Inches(2.1), Inches(11.33), Inches(1.1))
tf_sh = tx_sh.text_frame
tf_sh.word_wrap = True

add_para_run(tf_sh, "The Ultimate AI-Powered Traffic Nervous System", 24, c_cyan, bold=True, font_name='Arial', is_first=True).alignment = PP_ALIGN.CENTER
add_para_run(tf_sh, "An end-to-end platform that captures street streams, detects violations using custom-quantised YOLOv8 models, reads license plates with OCR, and dispatches responders via a real-time web portal.", 14, c_text, is_first=False).alignment = PP_ALIGN.CENTER

# 4 Horizontal cards
steps = [
    { 'num': '01', 'title': 'CCTV CAPTURE', 'desc': 'RTSP video feeds from high-density junctions stream directly to edge servers.' },
    { 'num': '02', 'title': 'EDGE AI INFERENCE', 'desc': 'Optimised YOLOv8 instantly locates riders, cars, helmets, and plates.' },
    { 'num': '03', 'title': 'PLATE OCR READ', 'desc': 'EasyOCR extracts alphanumeric text from HSRP plates on violation frames.' },
    { 'num': '04', 'title': 'CLOUD ENFORCEMENT', 'desc': 'MongoDB Atlas stores record. Dispatch triggers closest patrol car.' }
]

for idx, step in enumerate(steps):
    x = 0.8 + (idx * 2.95)
    add_card(slide5, x, 3.8, 2.8, 2.6, c_border)
    
    tx_step = slide5.shapes.add_textbox(Inches(x + 0.15), Inches(3.9), Inches(2.5), Inches(2.4))
    tf_step = tx_step.text_frame
    tf_step.word_wrap = True
    
    add_para_run(tf_step, step['num'], 18, c_cyan, bold=True, is_first=True)
    add_para_run(tf_step, step['title'], 12, c_text, bold=True)
    add_para_run(tf_step, step['desc'], 11, c_textMuted, line_spacing=1.1)
    
    # Arrow
    if idx < 3:
        tx_arr = slide5.shapes.add_textbox(Inches(x + 2.75), Inches(4.7), Inches(0.3), Inches(0.5))
        tf_arr = tx_arr.text_frame
        tf_arr.word_wrap = True
        add_para_run(tf_arr, "➔", 18, c_blue, bold=True, is_first=True)

# -----------------------------------------------------------------------------
# SLIDE 6: Key Modules Overview
# -----------------------------------------------------------------------------
slide6 = createBaseSlide("Key Modules Overview", "PLATFORM CAPABILITIES")

features = [
    { 't': 'Live Violation Detection', 'd': 'Real-time camera feed analysis with bounding boxes for motorcycles, riders, helmet status, and illegal parking.' },
    { 't': 'Automated Evidence Center', 'd': 'Frictionless dashboard showing violation snapshots, confidence rates, plate crops, and PDF download buttons.' },
    { 't': 'Smart Patrol Dispatcher', 'd': 'GPS-tracked patrol dispatches. Calculates nearest active responder using coordinates and dispatches with route details.' },
    { 't': 'Offenders Database (Risk)', 'd': 'Alphanumeric query interface retrieving history records from VAHAN database simulator to calculate recidivism risk scores.' },
    { 't': 'AI Configuration Console', 'd': 'Interactive threshold tuners allowing operators to live-adjust YOLOv8 confidence rates, OCR sensitivity, and IR exposure.' },
    { 't': 'Emergency Override Module', 'd': 'VIP Corridor simulator which triggers green lights sequentially across junctions to ensure gridlock clearance.' }
]

for idx, feat in enumerate(features):
    row = idx // 3
    col = idx % 3
    x = 0.8 + (col * 3.9)
    y = 2.1 + (row * 2.3)
    
    add_card(slide6, x, y, 3.7, 2.0, c_border)
    header = slide6.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(y), Inches(3.7), Inches(0.4))
    header.fill.solid()
    header.fill.fore_color.rgb = c_cardHeader
    header.line.fill.background()
    
    tx_f = slide6.shapes.add_textbox(Inches(x + 0.15), Inches(y + 0.05), Inches(3.4), Inches(1.8))
    tf_f = tx_f.text_frame
    tf_f.word_wrap = True
    
    add_para_run(tf_f, feat['t'], 12, c_cyan, bold=True, font_name='Arial', is_first=True)
    add_para_run(tf_f, feat['d'], 11, c_text, line_spacing=1.15)

# -----------------------------------------------------------------------------
# SLIDE 7: AI Vision Pipeline
# -----------------------------------------------------------------------------
slide7 = createBaseSlide("AI Vision Pipeline", "TECHNOLOGY DEEP DIVE")

tx_pi = slide7.shapes.add_textbox(Inches(0.8), Inches(1.8), Inches(11.0), Inches(0.4))
tf_pi = tx_pi.text_frame
tf_pi.word_wrap = True
add_para_run(tf_pi, "How raw CCTV camera feeds are processed into legally binding traffic citations in milliseconds:", 14, c_textMuted, is_first=True)

pipelineNodes = [
    { 'step': 'CCTV CAPTURE', 'model': 'RTSP Stream', 'info': '1080p stream at 30 FPS. Weather filters simulation (Rain/Night) adjust exposure.', 'color': c_blue },
    { 'step': 'YOLOv8 DETECT', 'model': 'YOLOv8-nano', 'info': 'Localises class boxes: car, motorcycle, rider, helmet, plate.', 'color': c_cyan },
    { 'step': 'EASYOCR ENGINE', 'model': 'CRNN OCR', 'info': 'Processes cropped plate image. Applies perspective warp and Otsu thresholding.', 'color': c_purple },
    { 'step': 'DECISION RULES', 'model': 'Rule Compiler', 'info': 'Triple riding check (>2 rider boxes in vehicle box). No-helmet threshold logic.', 'color': c_orange },
    { 'step': 'REST ENGINE', 'model': 'Express Controller', 'info': 'Persists violation to MongoDB. Auto-sends challan notice.', 'color': c_green }
]

for idx, node in enumerate(pipelineNodes):
    x = 0.8 + (idx * 2.38)
    add_card(slide7, x, 2.6, 2.15, 3.8, node['color'])
    
    pill = slide7.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(x + 0.15), Inches(2.8), Inches(1.85), Inches(0.5))
    pill.fill.solid()
    pill.fill.fore_color.rgb = node['color']
    pill.line.fill.background()
    
    tx_node = slide7.shapes.add_textbox(Inches(x + 0.1), Inches(2.85), Inches(1.95), Inches(3.4))
    tf_node = tx_node.text_frame
    tf_node.word_wrap = True
    
    add_para_run(tf_node, node['step'], 10, RGBColor(0, 0, 0), bold=True, is_first=True).alignment = PP_ALIGN.CENTER
    add_para_run(tf_node, node['model'], 11, c_text, bold=True).alignment = PP_ALIGN.CENTER
    add_para_run(tf_node, "---------------------", 8, c_border).alignment = PP_ALIGN.CENTER
    add_para_run(tf_node, node['info'], 10.5, c_textMuted, line_spacing=1.1)

    if idx < 4:
        tx_arr = slide7.shapes.add_textbox(Inches(x + 2.2), Inches(4.1), Inches(0.2), Inches(0.4))
        tf_arr = tx_arr.text_frame
        tf_arr.word_wrap = True
        add_para_run(tf_arr, "➔", 16, c_cyan, bold=True, is_first=True)

# -----------------------------------------------------------------------------
# SLIDE 8: AI Vision Demo
# -----------------------------------------------------------------------------
slide8 = createBaseSlide("AI Vision Demo: Helmet Violation", "LIVE DETECTION CORE")

add_card(slide8, 0.8, 2.1, 4.5, 4.4, c_border)
add_card(slide8, 0.8, 2.1, 4.5, 0.5, None, c_cardHeader)

tx_e8 = slide8.shapes.add_textbox(Inches(0.95), Inches(2.15), Inches(4.2), Inches(4.2))
tf_e8 = tx_e8.text_frame
tf_e8.word_wrap = True

add_para_run(tf_e8, "YOLOv8 + OCR PIPELINE IN ACTION", 12, c_cyan, bold=True, font_name='Arial', is_first=True)
add_para_run(tf_e8, "• Vehicle Bounding Box: YOLOv8 locates the motorcycle and crops the regional coordinates.", 11.5, c_text, line_spacing=1.2)
add_para_run(tf_e8, "• Helmet Status Classifier: Specifically isolates the rider head box to run binary prediction (Helmet/No Helmet).", 11.5, c_text, line_spacing=1.2)
add_para_run(tf_e8, "• Automatic Plate Localization: Identifies HSRP plate location and applies OCR perspective warping.", 11.5, c_text, line_spacing=1.2)
add_para_run(tf_e8, "• Real-time Confidence Rating: The AI engine returns a 94.6% prediction confidence.", 11.5, c_text, line_spacing=1.2)

# Image Frame right side
img_frame1 = slide8.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(5.7), Inches(2.1), Inches(6.83), Inches(4.4))
img_frame1.fill.solid()
img_frame1.fill.fore_color.rgb = RGBColor(0x03, 0x08, 0x11)
img_frame1.line.color.rgb = c_cyan
img_frame1.line.width = Pt(2)

img_p1 = "docs/assets/helmet_violation.png"
if os.path.exists(img_p1):
    slide8.shapes.add_picture(img_p1, Inches(5.8), Inches(2.2), width=Inches(6.63), height=Inches(4.2))
else:
    tx_err = slide8.shapes.add_textbox(Inches(6.2), Inches(3.8), Inches(5.8), Inches(1.0))
    tf_err = tx_err.text_frame
    tf_err.word_wrap = True
    add_para_run(tf_err, "[Image: helmet_violation.png not found]", 14, c_red, is_first=True)

# -----------------------------------------------------------------------------
# SLIDE 9: Dashboard Demo
# -----------------------------------------------------------------------------
slide9 = createBaseSlide("SmartVision X Dashboard", "LIVE INTERFACE")

img_frame2 = slide9.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(2.1), Inches(7.2), Inches(4.4))
img_frame2.fill.solid()
img_frame2.fill.fore_color.rgb = RGBColor(0x03, 0x08, 0x11)
img_frame2.line.color.rgb = c_blue
img_frame2.line.width = Pt(2)

img_p2 = "docs/assets/smartvision_dashboard.png"
if os.path.exists(img_p2):
    slide9.shapes.add_picture(img_p2, Inches(0.9), Inches(2.2), width=Inches(7.0), height=Inches(4.2))
else:
    tx_err = slide9.shapes.add_textbox(Inches(1.2), Inches(3.8), Inches(6.2), Inches(1.0))
    tf_err = tx_err.text_frame
    tf_err.word_wrap = True
    add_para_run(tf_err, "[Image: smartvision_dashboard.png not found]", 14, c_red, is_first=True)

add_card(slide9, 8.4, 2.1, 4.13, 4.4, c_border)
add_card(slide9, 8.4, 2.1, 4.13, 0.5, None, c_cardHeader)

tx_e9 = slide9.shapes.add_textbox(Inches(8.55), Inches(2.15), Inches(3.8), Inches(3.0))
tf_e9 = tx_e9.text_frame
tf_e9.word_wrap = True

add_para_run(tf_e9, "INTEGRATED CONTROL ROOM", 12, c_cyan, bold=True, font_name='Arial', is_first=True)
add_para_run(tf_e9, "• Live CCTV Grid: Stream switcher simulating camera junctions across Silk Board and Majestic.", 10.5, c_text, line_spacing=1.1)
add_para_run(tf_e9, "• AI Brain Panel: Audio/visual alerts switch with live CPU/GPU tracking.", 10.5, c_text, line_spacing=1.1)
add_para_run(tf_e9, "• Violations Center: Instant table rendering with OCR read outs.", 10.5, c_text, line_spacing=1.1)
add_para_run(tf_e9, "• Weather Toggles: Simulates clear, rain, or night exposure conditions.", 10.5, c_text, line_spacing=1.1)

# Live link button
btn = slide9.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(8.7), Inches(5.3), Inches(3.5), Inches(0.9))
btn.fill.solid()
btn.fill.fore_color.rgb = RGBColor(0x0A, 0x1E, 0x3A)
btn.line.color.rgb = c_green
btn.line.width = Pt(2)

tx_btn = slide9.shapes.add_textbox(Inches(8.7), Inches(5.35), Inches(3.5), Inches(0.8))
tf_btn = tx_btn.text_frame
tf_btn.word_wrap = True

add_para_run(tf_btn, "LIVE PLATFORM URL", 10, c_green, bold=True, is_first=True).alignment = PP_ALIGN.CENTER
add_para_run(tf_btn, "smartvision-x-gridlock-c579.vercel.app/command", 9.5, c_text, bold=True, font_name='Courier New').alignment = PP_ALIGN.CENTER

# -----------------------------------------------------------------------------
# SLIDE 10: Automated Evidence & E-Challan Generation
# -----------------------------------------------------------------------------
slide10 = createBaseSlide("Automated E-Challan Generation", "CORE MODULE")

add_card(slide10, 0.8, 2.1, 5.5, 4.4, c_border)
add_card(slide10, 0.8, 2.1, 5.5, 0.5, None, c_cardHeader)

tx_e10 = slide10.shapes.add_textbox(Inches(0.95), Inches(2.15), Inches(5.2), Inches(4.2))
tf_e10 = tx_e10.text_frame
tf_e10.word_wrap = True

add_para_run(tf_e10, "E-CHALLAN GENERATION ENGINE", 13, c_cyan, bold=True, font_name='Arial', is_first=True)
add_para_run(tf_e10, "• Operator Verification: The platform keeps a human in the loop. The control officer reviews the auto-cropped plate frame before confirming.", 11, c_text, line_spacing=1.15)
add_para_run(tf_e10, "• Automated Fine Calculation: System auto-assigns fine amounts (₹1,000 for helmet violations, ₹2,000 for triple riding).", 11, c_text, line_spacing=1.15)
add_para_run(tf_e10, "• RTO Vahan Sync: Connects license plates to registered owner mobile data for automated SMS alert simulations.", 11, c_text, line_spacing=1.15)
add_para_run(tf_e10, "• High-fidelity PDF Receipt: Exports clean legal tickets complete with plate crops, maps, and barcode elements.", 11, c_text, line_spacing=1.15)

# Mock Ticket Card
tx_x = 7.3
ticket = slide10.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, Inches(tx_x), Inches(2.1), Inches(5.2), Inches(4.4))
ticket.fill.solid()
ticket.fill.fore_color.rgb = RGBColor(255, 255, 255)
ticket.line.color.rgb = RGBColor(0xCC, 0xCC, 0xCC)
ticket.line.width = Pt(1.5)

tx_th = slide10.shapes.add_textbox(Inches(tx_x + 0.2), Inches(2.2), Inches(4.8), Inches(0.7))
tf_th = tx_th.text_frame
tf_th.word_wrap = True

add_para_run(tf_th, "BENGALURU TRAFFIC POLICE", 13, RGBColor(0x0A, 0x19, 0x2F), bold=True, is_first=True).alignment = PP_ALIGN.CENTER
add_para_run(tf_th, "OFFICIAL E-CHALLAN RECEIPT", 9, RGBColor(0x66, 0x66, 0x66), is_first=False).alignment = PP_ALIGN.CENTER

t_line = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(tx_x + 0.3), Inches(2.85), Inches(4.6), Inches(0.01))
t_line.fill.solid()
t_line.fill.fore_color.rgb = RGBColor(0xCC, 0xCC, 0xCC)
t_line.line.fill.background()

ticketDetails = [
    ['Challan Number:', 'BTP-9082-2026-X'],
    ['Date & Time:', '20-June-2026 | 10:00 AM'],
    ['Junction Area:', 'Silk Board Junction (CAM-04)'],
    ['Vehicle Plate:', 'KA-03-MX-8891'],
    ['Violation Class:', 'Helmet Non-Compliance'],
    ['Fine Amount:', '₹ 1,000.00']
]

for idx, row in enumerate(ticketDetails):
    y = 3.0 + (idx * 0.35)
    tx_row1 = slide10.shapes.add_textbox(Inches(tx_x + 0.3), Inches(y), Inches(1.8), Inches(0.3))
    tf_row1 = tx_row1.text_frame
    tf_row1.word_wrap = True
    add_para_run(tf_row1, row[0], 10.5, RGBColor(0x44, 0x44, 0x44), bold=True, is_first=True)
    
    tx_row2 = slide10.shapes.add_textbox(Inches(tx_x + 2.1), Inches(y), Inches(2.8), Inches(0.3))
    tf_row2 = tx_row2.text_frame
    tf_row2.word_wrap = True
    color_val = RGBColor(0xFF, 0, 0) if row[1].startswith('₹') else RGBColor(0x11, 0x11, 0x11)
    add_para_run(tf_row2, row[1], 10.5, color_val, bold=(True if row[1].startswith('₹') else False), is_first=True)

# Green Verified Stamp
stamp = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(tx_x + 3.2), Inches(5.2), Inches(1.6), Inches(0.5))
stamp.fill.solid()
stamp.fill.fore_color.rgb = RGBColor(0xE6, 0xFB, 0xF3)
stamp.line.color.rgb = RGBColor(0x05, 0xD7, 0x82)
stamp.line.width = Pt(2)

tx_st = slide10.shapes.add_textbox(Inches(tx_x + 3.2), Inches(5.2), Inches(1.6), Inches(0.5))
tf_st = tx_st.text_frame
tf_st.word_wrap = True
add_para_run(tf_st, "VERIFIED & PAID", 9.5, RGBColor(0x05, 0xB3, 0x6C), bold=True, is_first=True).alignment = PP_ALIGN.CENTER

# Barcode
bar_widths = [0.03, 0.08, 0.04, 0.02, 0.09, 0.03, 0.05, 0.02, 0.08, 0.04, 0.02, 0.09, 0.03, 0.05, 0.02, 0.08]
curr_x = tx_x + 0.4
for bw in bar_widths:
    bar_rect = slide10.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(curr_x), Inches(5.3), Inches(bw), Inches(0.4))
    bar_rect.fill.solid()
    bar_rect.fill.fore_color.rgb = RGBColor(0, 0, 0)
    bar_rect.line.fill.background()
    curr_x += bw + 0.03

# -----------------------------------------------------------------------------
# SLIDE 11: MongoDB Sync
# -----------------------------------------------------------------------------
slide11 = createBaseSlide("MongoDB Atlas Live Cloud Sync", "DATABASE ARCHITECTURE")

add_card(slide11, 0.8, 2.1, 5.5, 4.4, c_border)
add_card(slide11, 0.8, 2.1, 5.5, 0.5, None, c_cardHeader)

tx_e11 = slide11.shapes.add_textbox(Inches(0.95), Inches(2.15), Inches(5.2), Inches(4.2))
tf_e11 = tx_e11.text_frame
tf_e11.word_wrap = True

add_para_run(tf_e11, "ENTERPRISE DATA PERSISTENCE", 13, c_green, bold=True, font_name='Arial', is_first=True)
add_para_run(tf_e11, "• Hybrid Mode: Connects to live MongoDB Atlas Cloud cluster. Automatically falls back to local JSON persistence if internet drops.", 11, c_text, line_spacing=1.15)
add_para_run(tf_e11, "• Real-time Schema Validation: Mongoose models enforce validation rules, timestamp audits, and geospatial coordinates.", 11, c_text, line_spacing=1.15)
add_para_run(tf_e11, "• Query Optimization: Indexes on vehicle license plates and violation timestamps allow instant search queries.", 11, c_text, line_spacing=1.15)
add_para_run(tf_e11, "• Global Accessibility: Command Center dashboard queries sync instantly, giving city inspectors access to active logs.", 11, c_text, line_spacing=1.15)

# Mock Code Block
codeX = 7.3
add_card(slide11, codeX, 2.1, 5.2, 4.4, c_green, RGBColor(0x02, 0x07, 0x12))
header_code = slide11.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(codeX), Inches(2.1), Inches(5.2), Inches(0.4))
header_code.fill.solid()
header_code.fill.fore_color.rgb = RGBColor(0x0B, 0x15, 0x28)
header_code.line.fill.background()

tx_ch = slide11.shapes.add_textbox(Inches(codeX + 0.2), Inches(2.15), Inches(4.8), Inches(0.3))
tf_ch = tx_ch.text_frame
tf_ch.word_wrap = True
add_para_run(tf_ch, "mongoose.model(\"Violation\")", 10, c_textMuted, bold=True, font_name='Courier New', is_first=True)

jsonLines = [
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
]

for idx, line in enumerate(jsonLines):
    y = 2.7 + (idx * 0.32)
    color = c_text
    if '"_id"' in line or '"plate_number"' in line or '"violation_type"' in line or '"location"' in line or '"confidence"' in line or '"evidence_image"' in line or '"challan_amount"' in line or '"status"' in line or '"timestamp"' in line:
        color = c_green
    elif 'ObjectId' in line or 'ISODate' in line or '0.946' in line or '1000' in line:
        color = c_orange
    elif 'KA03MX8891' in line or 'No Helmet' in line or 'Silk Board' in line or 'uploads/' in line or 'pending' in line:
        color = c_cyan
        
    tx_line = slide11.shapes.add_textbox(Inches(codeX + 0.3), Inches(y), Inches(4.8), Inches(0.3))
    tf_line = tx_line.text_frame
    tf_line.word_wrap = True
    add_para_run(tf_line, line, 9.5, color, font_name='Courier New', is_first=True)

# -----------------------------------------------------------------------------
# SLIDE 12: Smart Dispatch
# -----------------------------------------------------------------------------
slide12 = createBaseSlide("Smart Dispatch System", "OPERATIONS")

add_card(slide12, 0.8, 2.1, 5.5, 4.4, c_border)
add_card(slide12, 0.8, 2.1, 5.5, 0.5, None, c_cardHeader)

tx_e12 = slide12.shapes.add_textbox(Inches(0.95), Inches(2.15), Inches(5.2), Inches(4.2))
tf_e12 = tx_e12.text_frame
tf_e12.word_wrap = True

add_para_run(tf_e12, "HAVERSINE NEAREST OFFICER ROUTING", 13, c_purple, bold=True, font_name='Arial', is_first=True)
add_para_run(tf_e12, "• Real-time GPS Tracking: Field officers update their live coordinate pairs back to the dashboard.", 11, c_text, line_spacing=1.1)
add_para_run(tf_e12, "• Haversine Metric: When an operator verifies a critical block or triple-riding event, the backend runs the Haversine formula to compute distance.", 11, c_text, line_spacing=1.1)
add_para_run(tf_e12, "• Dynamic dispatch: Instantly orders patrol vehicles closest to the target coordinate (e.g. Officer Surjeet located 1.2km away).", 11, c_text, line_spacing=1.1)
add_para_run(tf_e12, "• Interactive Route Map: Highlights target coordinates on the CommandCenter dispatch console.", 11, c_text, line_spacing=1.1)

# Routing Flowchart
flowX = 7.3
add_card(slide12, flowX, 2.1, 5.2, 4.4, c_purple)

flowNodes = [
    { 'title': '1. CRITICAL INCIDENT FLAGGED', 'desc': 'CAM-04 identifies illegal parking gridlock.', 'col': c_red },
    { 'title': '2. PROXIMITY ENGINE COMPUTES', 'desc': 'Backend filters active patrol coordinate arrays.', 'col': c_cyan },
    { 'title': '3. CLOSEST CO-ORDINATE ROUTE', 'desc': 'Officer dispatch instructions pushed automatically.', 'col': c_green }
]

for idx, node in enumerate(flowNodes):
    y = 2.4 + (idx * 1.3)
    
    circle = slide12.shapes.add_shape(MSO_SHAPE.OVAL, Inches(flowX + 0.3), Inches(y), Inches(0.6), Inches(0.6))
    circle.fill.solid()
    circle.fill.fore_color.rgb = node['col']
    circle.line.fill.background()
    
    tx_num = slide12.shapes.add_textbox(Inches(flowX + 0.3), Inches(y), Inches(0.6), Inches(0.6))
    tf_num = tx_num.text_frame
    tf_num.word_wrap = True
    add_para_run(tf_num, str(idx+1), 18, RGBColor(0,0,0), bold=True, is_first=True).alignment = PP_ALIGN.CENTER
    
    tx_node = slide12.shapes.add_textbox(Inches(flowX + 1.1), Inches(y), Inches(3.8), Inches(0.55))
    tf_node = tx_node.text_frame
    tf_node.word_wrap = True
    add_para_run(tf_node, node['title'], 11.5, c_text, bold=True, font_name='Arial', is_first=True)
    add_para_run(tf_node, node['desc'], 10.5, c_textMuted)

    if idx < 2:
        conn = slide12.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(flowX + 0.58), Inches(y + 0.6), Inches(0.04), Inches(0.7))
        conn.fill.solid()
        conn.fill.fore_color.rgb = c_border
        conn.line.fill.background()

# -----------------------------------------------------------------------------
# SLIDE 13: Technology Stack
# -----------------------------------------------------------------------------
slide13 = createBaseSlide("Technology Stack", "ENGINEERING")

techList = [
    { 'name': 'FRONTEND MODULES', 'list': 'React.js, Vite Builder, Tailwind CSS, Lucide Icons, React Router DOM v6', 'spec': 'Dynamic route-based views, theme controllers, responsive dashboards.', 'color': c_cyan },
    { 'name': 'BACKEND SYSTEM', 'list': 'Node.js, Express Framework, Multer File Uploads, REST controllers', 'spec': 'MVC structure: split models, controllers, and JSON local mock storage fallbacks.', 'color': c_blue },
    { 'name': 'CLOUD PERSISTENCE', 'list': 'MongoDB Atlas, Mongoose ORM, Connection Status Flags', 'spec': 'Auto-sync loop triggers collection upserts, online dashboard flag updates.', 'color': c_green },
    { 'name': 'COMPUTER VISION ENGINE', 'list': 'Python 3.13, Flask API, YOLOv8 (Ultralytics), EasyOCR, OpenCV', 'spec': 'Flask server runs YOLO inference and EasyOCR reader inside isolated venv.', 'color': c_purple }
]

for idx, t in enumerate(techList):
    y = 2.1 + (idx * 1.15)
    add_card(slide13, 0.8, y, 11.73, 1.0, c_border)
    
    bar = slide13.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(y), Inches(0.1), Inches(1.0))
    bar.fill.solid()
    bar.fill.fore_color.rgb = t['color']
    bar.line.fill.background()
    
    tx_t = slide13.shapes.add_textbox(Inches(1.1), Inches(y + 0.05), Inches(11.0), Inches(0.9))
    tf_t = tx_t.text_frame
    tf_t.word_wrap = True
    
    add_para_run(tf_t, t['name'], 12, t['color'], bold=True, font_name='Arial', is_first=True)
    add_para_run(tf_t, "Stack: " + t['list'], 12, c_text, bold=True)
    add_para_run(tf_t, "Usage: " + t['spec'], 11, c_textMuted)

# -----------------------------------------------------------------------------
# SLIDE 14: Business Impact & ROI
# -----------------------------------------------------------------------------
slide14 = createBaseSlide("Business Impact & ROI", "VALUE PROPOSITION")

impacts = [
    { 't': '90% Processing Efficiency', 'd': 'Automated YOLO/OCR identification reduces time-to-issue for challans from 3 days to under 5 seconds.', 'val': '90%', 'sub': 'Time Reduced', 'color': c_cyan },
    { 't': '40% Congestion Relief', 'd': 'Proximity dispatch clears illegal street parking blockers from sidewalk junctions before gridlocks expand.', 'val': '40%', 'sub': 'Junction Clearance', 'color': c_green },
    { 't': '3.5x Fine Collection', 'd': 'Eliminates human observation leakage. Multiple cameras stream 24/7 without fatigue, checking every vehicle registration.', 'val': '3.5x', 'sub': 'Enforcement Yield', 'color': c_blue }
]

for idx, imp in enumerate(impacts):
    x = 0.8 + (idx * 4.0)
    add_card(slide14, x, 2.2, 3.7, 4.2, c_border)
    
    header = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x), Inches(2.2), Inches(3.7), Inches(1.5))
    header.fill.solid()
    header.fill.fore_color.rgb = c_cardHeader
    header.line.fill.background()
    
    tx_num = slide14.shapes.add_textbox(Inches(x + 0.2), Inches(2.25), Inches(3.3), Inches(1.4))
    tf_num = tx_num.text_frame
    tf_num.word_wrap = True
    
    add_para_run(tf_num, imp['val'], 48, imp['color'], bold=True, font_name='Arial', is_first=True).alignment = PP_ALIGN.CENTER
    add_para_run(tf_num, imp['sub'], 11, c_textMuted, bold=True, font_name='Arial').alignment = PP_ALIGN.CENTER
    
    div = slide14.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(x + 0.5), Inches(3.8), Inches(2.7), Inches(0.01))
    div.fill.solid()
    div.fill.fore_color.rgb = c_border
    div.line.fill.background()
    
    tx_desc = slide14.shapes.add_textbox(Inches(x + 0.2), Inches(4.0), Inches(3.3), Inches(2.3))
    tf_desc = tx_desc.text_frame
    tf_desc.word_wrap = True
    
    add_para_run(tf_desc, imp['t'], 14, c_text, bold=True, font_name='Arial', is_first=True).alignment = PP_ALIGN.CENTER
    add_para_run(tf_desc, "\n" + imp['d'], 11.5, c_textMuted, line_spacing=1.1)

# -----------------------------------------------------------------------------
# SLIDE 15: Roadmap
# -----------------------------------------------------------------------------
slide15 = createBaseSlide("Future Roadmap & Milestones", "ROADMAP")

tx_rm = slide15.shapes.add_textbox(Inches(0.8), Inches(2.0), Inches(11.0), Inches(0.4))
tf_rm = tx_rm.text_frame
tf_rm.word_wrap = True
add_para_run(tf_rm, "Strategic roadmap for scaling SmartVision X across regional state grids:", 15, c_text, is_first=True)

# Horiz Line
line = slide15.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(4.2), Inches(11.73), Inches(0.04))
line.fill.solid()
line.fill.fore_color.rgb = c_border
line.line.fill.background()

line_act = slide15.shapes.add_shape(MSO_SHAPE.RECTANGLE, Inches(0.8), Inches(4.2), Inches(3.0), Inches(0.05))
line_act.fill.solid()
line_act.fill.fore_color.rgb = c_cyan
line_act.line.fill.background()

roadmap = [
    { 'date': 'Q3 2026', 'title': 'Edge Hardware Port', 'desc': 'Deploy YOLOv8-nano onto NVIDIA Jetson Orin Nano modules for physical CCTV cam placement.' },
    { 'date': 'Q4 2026', 'title': 'NIC Vahan Integration', 'desc': 'Establish direct API handshakes with NIC Vahan/Sarathi databases for real-time owner registry search.' },
    { 'date': 'H1 2027', 'title': 'Citizen Complaint App', 'desc': 'Launch crowdsourced reporting app. Citizens upload pictures which run auto YOLO checks.' },
    { 'date': 'H2 2027', 'title': 'AI-Predictive Signals', 'desc': 'Direct intersection overrides to green corridor routing based on neural traffic forecasts.' }
]

for idx, item in enumerate(roadmap):
    x = 0.8 + (idx * 2.95)
    
    add_card(slide15, x, 2.6, 2.8, 1.3, c_border)
    
    tx_node = slide15.shapes.add_textbox(Inches(x + 0.15), Inches(2.65), Inches(2.5), Inches(1.2))
    tf_node = tx_node.text_frame
    tf_node.word_wrap = True
    
    add_para_run(tf_node, item['date'], 13, c_cyan, bold=True, font_name='Arial', is_first=True)
    add_para_run(tf_node, item['title'], 12, c_text, bold=True, font_name='Arial')
    
    # Circle node
    circle = slide15.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x + 1.25), Inches(4.08), Inches(0.3), Inches(0.3))
    circle.fill.solid()
    circle.fill.fore_color.rgb = c_bg
    circle.line.color.rgb = c_cyan
    circle.line.width = Pt(2)
    
    inner = slide15.shapes.add_shape(MSO_SHAPE.OVAL, Inches(x + 1.35), Inches(4.18), Inches(0.1), Inches(0.1))
    inner.fill.solid()
    inner.fill.fore_color.rgb = c_cyan
    inner.line.fill.background()
    
    tx_desc = slide15.shapes.add_textbox(Inches(x), Inches(4.6), Inches(2.8), Inches(1.8))
    tf_desc = tx_desc.text_frame
    tf_desc.word_wrap = True
    add_para_run(tf_desc, item['desc'], 11, c_textMuted, line_spacing=1.1, is_first=True)

tx_thank = slide15.shapes.add_textbox(Inches(0.8), Inches(6.3), Inches(11.73), Inches(0.5))
tf_thank = tx_thank.text_frame
tf_thank.word_wrap = True
add_para_run(tf_thank, "Autonomous Urban Safety Platform — Ready to Scale.", 16, c_cyan, bold=True, is_first=True).alignment = PP_ALIGN.CENTER

# Save
outputPath = "SmartVision_X_Final_Presentation.pptx"
prs.save(outputPath)
print("Presentation generated successfully!")
