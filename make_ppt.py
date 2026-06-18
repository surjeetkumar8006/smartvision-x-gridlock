import collections
import collections.abc
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.enum.text import PP_ALIGN
from pptx.dml.color import RGBColor
import os

prs = Presentation()

# Slide 1: Title Slide
slide = prs.slides.add_slide(prs.slide_layouts[0])
title = slide.shapes.title
subtitle = slide.placeholders[1]
title.text = "SmartVision X"
subtitle.text = "AI-Powered Traffic & Safety Monitoring\nGridlock Hackathon 2.0 - Round 2 Submission"

# Slide 2: Problem & Solution
slide = prs.slides.add_slide(prs.slide_layouts[1])
title = slide.shapes.title
title.text = "The Problem & Our Solution"
content = slide.placeholders[1]
content.text = "Traffic violations and safety hazards often go unnoticed.\n\nOur Solution:\n- Real-time AI analysis of camera feeds.\n- Automated detection of helmet violations.\n- Live dashboard for authorities.\n- Integrated MongoDB Atlas for cloud syncing."

# Slide 3: Helmet Violation Detection
slide = prs.slides.add_slide(prs.slide_layouts[5]) # Title only layout
title = slide.shapes.title
title.text = "Helmet Violation Detection (AI in Action)"

img_path = r"C:\Users\Acer\.gemini\antigravity\brain\bd687b3f-1672-44c1-937e-b4831c6ad795\helmet_violation_1781779175727.png"
if os.path.exists(img_path):
    # Add image, centered roughly
    slide.shapes.add_picture(img_path, Inches(1), Inches(2), width=Inches(8))

# Slide 4: SmartVision X Dashboard
slide = prs.slides.add_slide(prs.slide_layouts[5]) # Title only layout
title = slide.shapes.title
title.text = "SmartVision X Live Dashboard"

img_path2 = r"C:\Users\Acer\.gemini\antigravity\brain\bd687b3f-1672-44c1-937e-b4831c6ad795\smartvision_dashboard_1781779190351.png"
if os.path.exists(img_path2):
    slide.shapes.add_picture(img_path2, Inches(1), Inches(2), width=Inches(8))

# Slide 5: Tech Stack
slide = prs.slides.add_slide(prs.slide_layouts[1])
title = slide.shapes.title
title.text = "Our Technology Stack"
content = slide.placeholders[1]
content.text = "- Frontend: React, TailwindCSS, Vite\n- Backend: Node.js, Express\n- Database: MongoDB Atlas (Cloud Live)\n- AI Models: YOLOv8 for Object Detection\n- Deployment: Cross-platform"

prs.save("SmartVision_X_Final_Presentation.pptx")
print("Presentation generated successfully!")
