const fs = require('fs');
const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const defaultArrays = `
        risikoUtama: [
          'Risiko 1 belum didefinisikan',
          'Risiko 2 belum didefinisikan'
        ],
        quickWins: [
          'Quick Win 1 belum didefinisikan',
          'Quick Win 2 belum didefinisikan'
        ],
        hambatan: [
          'Hambatan 1 belum didefinisikan',
          'Hambatan 2 belum didefinisikan'
        ],
        rekomendasiPrioritas: [
          'Prioritas 1 belum didefinisikan',
          'Prioritas 2 belum didefinisikan'
        ],`;

const defaultArraysEn = `
        risikoUtama: [
          'Risk 1 not defined',
          'Risk 2 not defined'
        ],
        quickWins: [
          'Quick Win 1 not defined',
          'Quick Win 2 not defined'
        ],
        hambatan: [
          'Barrier 1 not defined',
          'Barrier 2 not defined'
        ],
        rekomendasiPrioritas: [
          'Priority 1 not defined',
          'Priority 2 not defined'
        ],`;

// Let's replace "slideActions: [" with the defaultArrays + "slideActions: [" for both ID and EN, except mature because mature is already replaced!
// Since we only have 4 occurrences of "slideActions:" left in ID and 4 in EN after mature, we can just replace them all.

let idCount = 0;
let enCount = 0;
let lines = content.split('\n');

let insideEN = false;
let updatedLines = [];

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('export const defaultTranslations')) {
    insideEN = false; // starting ID
  }
  if (lines[i].includes('EN: {') && i > 500) {
    insideEN = true;
  }
  
  if (lines[i].includes('        slideActions: [')) {
    // Check if it's inside mature. The mature block now has `risikoUtama` before `slideActions`.
    // Let's check 5 lines above if it's mature. If not, add the default Arrays.
    let isMature = false;
    for (let j = 1; j <= 20; j++) {
      if (lines[i-j] && lines[i-j].includes('mature: {')) {
        isMature = true;
        break;
      }
    }
    
    if (!isMature) {
      if (!insideEN) {
        updatedLines.push(defaultArrays.substring(1));
      } else {
        updatedLines.push(defaultArraysEn.substring(1));
      }
    }
  }
  updatedLines.push(lines[i]);
}

fs.writeFileSync(path, updatedLines.join('\n'));
