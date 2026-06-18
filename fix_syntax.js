const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

// The regex matches `${API_BASE_URL} followed by any non-quote chars, then a single quote
// and replaces the single quote with a backtick
content = content.replace(/\$\{API_BASE_URL\}([^']+)'/g, '${API_BASE_URL}$1`');

fs.writeFileSync(appPath, content, 'utf8');
console.log('Fixed syntax error in App.jsx');
