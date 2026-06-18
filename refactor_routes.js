const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// 1. Add imports for react-router-dom
content = content.replace(
  "import React, { useState, useEffect, useRef, useCallback } from 'react';",
  "import React, { useState, useEffect, useRef, useCallback } from 'react';\nimport { Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';"
);

// 2. Add router hooks inside App
content = content.replace(
  "const [activeTab, setActiveTab] = useState('command');",
  `const navigate = useNavigate();
  const location = useLocation();
  const activeTab = location.pathname.length > 1 ? location.pathname.substring(1) : 'command';
  
  // Custom navigation handler to replace setActiveTab
  const setActiveTab = (tabId) => navigate('/' + tabId);`
);

// 3. Wrap the main content area in <Routes>
// Find where the content area starts
const contentStartMarker = `<main className="flex-1 bg-[#0a0d14] p-6 overflow-y-auto no-scrollbar relative z-10">`;
content = content.replace(
  contentStartMarker,
  `${contentStartMarker}\n        <Routes>\n          <Route path="/" element={<Navigate to="/command" replace />} />`
);

// Find where the content area ends
const contentEndMarker = `</main>`;
content = content.replace(
  `        </main>`,
  `        </Routes>\n        </main>`
);

// 4. Replace conditional rendering with <Route>
const tabs = [
  'command', 'cctv', 'analytics', 'heatmap', 'offenders', 'patrol', 'predictive', 'config', 'emergency', 'syshealth', 'aibrain', 'violations'
];

for (const tab of tabs) {
  const startRegex = new RegExp(`\\{activeTab === '${tab}' && \\(`, 'g');
  // It's safer to just replace the opening condition
  content = content.replace(startRegex, `<Route path="/${tab}" element={<>`);
}

// 5. Replace the closing `)}` of the conditional blocks. 
// Since we wrapped it in `<Route ... element={<>`, we need to close it with `</>} />`.
// Because regex for closing parenthesis is hard, let's look for `)}` that are followed by the next `{activeTab ===` or the closing `</main>`.
// Actually, it's easier to find the exact closing `)}` by tracing indentation or using a custom parser. 
// Let's implement a simple brace matching parser.

let result = "";
let i = 0;
while (i < content.length) {
    // Look for <Route path="/... element={<>
    const match = content.substring(i).match(/<Route path="\/[a-z]+" element=\{<>/);
    if (match && match.index === 0) {
        // We found the start of a route. 
        // We need to find the matching closing `)}` that used to be there.
        // Wait, since we ALREADY replaced the start, the closing `)}` is still there.
        // Let's just find the closing `)}` by tracking `{` and `}` or `(` and `)`.
    }
    result += content[i];
    i++;
}

// Write the modified content
// fs.writeFileSync(appPath, content, 'utf8');
