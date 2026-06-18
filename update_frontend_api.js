const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// Define API URL variable at the top
if (!content.includes('const API_BASE_URL')) {
    const importIdx = content.lastIndexOf("import");
    const endOfImports = content.indexOf(';', importIdx) + 1;
    content = content.slice(0, endOfImports) + "\n\nconst API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';\n" + content.slice(endOfImports);
}

// Replace all occurrences
content = content.replace(/'http:\/\/localhost:5000/g, '`${API_BASE_URL}');
content = content.replace(/http:\/\/localhost:5000/g, '${API_BASE_URL}');

fs.writeFileSync(appPath, content, 'utf8');
console.log('App.jsx updated with VITE_API_URL');
