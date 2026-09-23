const fs = require('fs');
let content = fs.readFileSync('src/components/cms/CMSDashboard.tsx', 'utf8');

// I will find `{Object.keys(idData).map(key => {` and change it to sort if sectionId === 'recommendations'
const oldKeysMap = `{Object.keys(idData).map(key => {`;

const newKeysMap = `{Object.keys(idData).sort((a, b) => {
          if (sectionId === 'recommendations') {
            const order = ['unready', 'aware', 'ready', 'enabled', 'mature'];
            const idxA = order.indexOf(a);
            const idxB = order.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          }
          return 0;
        }).map(key => {`;

content = content.replace(oldKeysMap, newKeysMap);

fs.writeFileSync('src/components/cms/CMSDashboard.tsx', content);
