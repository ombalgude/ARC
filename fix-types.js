const fs = require('fs');
const path = require('path');

const dirs = [
  'apps/web/app',
  'apps/web/app/coming-soon',
];

dirs.forEach(dir => {
  if (fs.existsSync(dir)) {
    fs.readdirSync(dir).forEach(file => {
      if (file.endsWith('.tsx') || file.endsWith('.ts')) {
        const p = path.join(dir, file);
        let cnt = fs.readFileSync(p, 'utf8');
        let changed = false;

        if (!cnt.includes('import React')) {
          // add import after 'use client' if present
          if (cnt.startsWith('"use client";') || cnt.startsWith("'use client';")) {
            cnt = cnt.replace(/("use client";|'use client';)/, '$1\nimport React from "react";');
          } else {
            cnt = 'import React from "react";\n' + cnt;
          }
          changed = true;
        }

        // Add : React.JSX.Element or : React.ReactNode
        if (cnt.match(/export default (async )?function \w+\([^)]*\) \{/)) {
          cnt = cnt.replace(/(export default (async )?function \w+\([^)]*\)) \{/g, '$1: React.JSX.Element | Promise<React.JSX.Element> {');
          changed = true;
        }
        
        if (changed) {
          fs.writeFileSync(p, cnt);
          console.log('Fixed', p);
        }
      }
    });
  }
});
