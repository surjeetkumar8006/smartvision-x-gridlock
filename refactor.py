import os

app_path = r"c:\Users\Acer\Downloads\e88186124ec611f1\dataset\SmartVision_X\frontend\src\App.jsx"
data_path = r"c:\Users\Acer\Downloads\e88186124ec611f1\dataset\SmartVision_X\frontend\src\data\mockData.js"

with open(app_path, "r", encoding="utf-8") as f:
    lines = f.readlines()

# The data starts at line 15 (index 14) and ends at line 247 (index 246)
data_lines = lines[14:248]

# Process data lines to add export
processed_data_lines = []
for line in data_lines:
    if line.startswith("const ") and " = " in line:
        processed_data_lines.append("export " + line)
    else:
        processed_data_lines.append(line)

with open(data_path, "w", encoding="utf-8") as f:
    f.writelines(processed_data_lines)

# Now modify App.jsx to import these
import_statement = """import {
  AI_VIOLATION_TEMPLATES, AI_PLATES, AI_INSIGHTS_POOL, initialViolations,
  initialPatrols, CCTV_CAMERAS, STOLEN_PLATES, WEEKLY_REVENUE, COMPLIANCE_TREND,
  TICKER_ALERTS, HOURLY_VIOLATIONS, SIGNAL_JUNCTIONS
} from './data/mockData';\n"""

new_app_lines = lines[:14] + [import_statement] + lines[248:]

with open(app_path, "w", encoding="utf-8") as f:
    f.writelines(new_app_lines)

print("Data successfully extracted to mockData.js and imported in App.jsx.")
