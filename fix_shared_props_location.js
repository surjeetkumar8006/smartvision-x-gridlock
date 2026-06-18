const fs = require('fs');
const path = require('path');

const appPath = path.join(__dirname, 'frontend', 'src', 'App.jsx');
let content = fs.readFileSync(appPath, 'utf8');

const sharedPropsStart = content.indexOf('  const sharedProps = {');
const sharedPropsEnd = content.indexOf('  };\n', sharedPropsStart) + 5;

if (sharedPropsStart !== -1) {
  const sharedPropsStr = content.slice(sharedPropsStart, sharedPropsEnd);
  
  // Remove it from current location
  content = content.slice(0, sharedPropsStart) + content.slice(sharedPropsEnd);
  
  // Find the return statement for the component
  const returnIndex = content.indexOf('  return (\n    <div className={`flex h-screen');
  if (returnIndex !== -1) {
    // Insert right before return
    content = content.slice(0, returnIndex) + sharedPropsStr + '\n' + content.slice(returnIndex);
    fs.writeFileSync(appPath, content, 'utf8');
    console.log('Moved sharedProps to the end of the component logic!');
  } else {
    // Alternate return match if the spacing is different
    const altReturnIndex = content.indexOf('  return (');
    if (altReturnIndex !== -1) {
      content = content.slice(0, altReturnIndex) + sharedPropsStr + '\n' + content.slice(altReturnIndex);
      fs.writeFileSync(appPath, content, 'utf8');
      console.log('Moved sharedProps to the alternate return match!');
    }
  }
}
