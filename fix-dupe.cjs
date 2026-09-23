const fs = require('fs');
const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

// I will just read line by line and remove the second block of risikoUtama... in mature block
let lines = content.split('\n');
let newLines = [];
let skip = 0;
for(let i=0; i<lines.length; i++) {
  if (skip > 0) {
    skip--;
    continue;
  }
  
  if (lines[i].includes('risikoUtama: [')) {
    // Check if this is the duplicate one in mature
    // If the next few lines are 'Risiko 1 belum didefinisikan' or 'Risk 1 not defined' but we are inside mature block
    // Wait, the easiest way is to just find the exact duplicate strings and remove them!
    if (lines[i+1].includes('Risiko 1 belum didefinisikan') || lines[i+1].includes('Risk 1 not defined')) {
      // Check if previous lines contain 'Membentuk kemitraan strategis dengan penyedia infrastruktur cloud' or 'Form strategic partnerships'
      let isInsideMature = false;
      for (let j=1; j<=30; j++) {
         if (lines[i-j] && (lines[i-j].includes('Membentuk kemitraan strategis') || lines[i-j].includes('Form strategic partnerships'))) {
             isInsideMature = true;
             break;
         }
      }
      
      if (isInsideMature) {
         // skip the next 17 lines which contains the default arrays for mature duplicate
         skip = 16;
         continue;
      }
    }
  }
  newLines.push(lines[i]);
}

fs.writeFileSync(path, newLines.join('\n'));
