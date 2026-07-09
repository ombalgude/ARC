const fs = require('fs');
const path = require('path');

const dir = 'apps/web/app';

function walk(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? 
      walk(dirPath, callback) : callback(path.join(dir, f));
  });
}

walk(dir, function(filePath) {
  if (filePath.endsWith('.tsx') || filePath.endsWith('.ts')) {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Remove JSX comments: {/* ... */}
    content = content.replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
    
    // Remove standard JS block comments: /* ... */ (but ignore if it contains eslint)
    content = content.replace(/\/\*(?! eslint)[\s\S]*?\*\//g, '');
    
    // Remove inline comments: // ... (but ignore lines starting with http or similar false positives, only match if it's the start of line or after whitespace)
    content = content.replace(/(?<=^|\s)\/\/.*$/gm, '');

    // Cleanup multiple empty lines
    content = content.replace(/\n\s*\n\s*\n/g, '\n\n');

    fs.writeFileSync(filePath, content);
  }
});
console.log('Comments removed.');
