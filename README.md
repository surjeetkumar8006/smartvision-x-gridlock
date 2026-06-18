# SmartVision X - Autonomous Traffic Enforcement Intelligence Platform

**SmartVision X** is an enterprise-grade AI-powered traffic violation intelligence platform developed for Bengaluru Traffic Police (BTP). The solution processes real-time camera streams to identify multiple classes of traffic violations, generate legal evidence reports, calculate risk scores, and simulate patrol unit dispatches.

---

## 🚀 Key Modules Built

1.  **AI Violation Detection Center:** Live incoming feeds stream with automated bounding-box localization.
2.  **Evidence Generation Engine:** Generates high-fidelity frame crops, overlay annotations, and prints legal PDF reports.
3.  **Risk Intelligence System:** A multi-factor rating algorithm scoring vehicle registration history to flag repeat offenders.
4.  **Patrol Dispatch Console:** An interface to route nearby BTP response vehicles directly to violation sites.
5.  **AI Engine Tuner:** Admin configurations to dynamically adjust confidence thresholds and IR enhancements.
6.  **Interactive City Heatmap:** High-risk junction monitoring in Bengaluru.

---

## 🛠️ Project Structure
```text
SmartVision_X/
├── backend/
│   ├── assets/       # CCTV cameras visual frames
│   ├── data/         # Fallback JSON Local Storage
│   └── server.js     # Express REST Server
└── frontend/
    ├── src/          # React (Vite) Components
    └── index.html    # Tailwind CSS layout
```

---

## ⚙️ How to Setup & Run

### Prerequisites
- Node.js installed (v18+)

### The One-Command Launch (Windows PowerShell)
In the root directory, run:
```powershell
./start-all.ps1
```
This script will automatically install backend & frontend dependencies, then spin up the Express server (port 5000) and the React Vite application (port 3000) concurrently!

### Manual Execution

1.  **Start Backend:**
    ```bash
    cd backend
    npm install
    npm start
    ```
2.  **Start Frontend:**
    ```bash
    cd ../frontend
    npm install
    npm run dev
    ```
    Open `http://localhost:3000` in your browser.
