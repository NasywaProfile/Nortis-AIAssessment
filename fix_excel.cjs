const fs = require('fs');
let content = fs.readFileSync('src/utils/excelExport.ts', 'utf8');

const isIndividualAdd = `  const isIndividual = submission.assessmentType === 'individual';`;

content = content.replace("export const exportToExcel = async (submission: AssessmentSubmission, recTexts?: any) => {", "export const exportToExcel = async (submission: AssessmentSubmission, recTexts?: any) => {\n" + isIndividualAdd);

const oldCompanyInfo = `  addRow(['Company Information'], { font: { bold: true, size: 12 } });
  addRow(['Company Name', submission.companyName || '-']);
  addRow(['Industry', industries[submission.industry] || submission.industry || '-']);
  addRow(['Company Size', companySizes[submission.companySize] || submission.companySize || '-']);
  addRow(['Location', submission.location || '-']);
  addRow(['PIC Name', submission.fullName || '-']);
  addRow(['PIC Email', submission.email || '-']);`;

const newCompanyInfo = `  addRow([isIndividual ? 'Personal Information' : 'Company Information'], { font: { bold: true, size: 12 } });
  if (isIndividual) {
    addRow(['Name', submission.fullName || '-']);
    addRow(['Job Title', submission.jobTitle || '-']);
    addRow(['Company', submission.companyName || '-']);
    addRow(['Industry', industries[submission.industry] || submission.industry || '-']);
    addRow(['Experience', submission.experienceYears || '-']);
    addRow(['AI Usage Frequency', submission.aiUsageFrequency || '-']);
    addRow(['AI Tools Used', submission.aiToolsUsed || '-']);
    addRow(['Email', submission.email || '-']);
    addRow(['Phone', submission.phone || '-']);
  } else {
    addRow(['Company Name', submission.companyName || '-']);
    addRow(['Industry', industries[submission.industry] || submission.industry || '-']);
    addRow(['Company Size', companySizes[submission.companySize] || submission.companySize || '-']);
    addRow(['Location', submission.location || '-']);
    addRow(['PIC Name', submission.fullName || '-']);
    addRow(['PIC Email', submission.email || '-']);
  }`;

content = content.replace(oldCompanyInfo, newCompanyInfo);

// I'll skip detail rows for individual for now, or just leave it empty.
// Actually, it's safer just to add a check:
const oldDetailRows = `  const detailRows = [`;
const newDetailRows = `  const detailRows = isIndividual ? [
    ['AI Literacy', 'A1', '-', submission.answers?.A1 ?? '-'],
    ['AI Literacy', 'A2', '-', submission.answers?.A2 ?? '-'],
    ['AI Literacy', 'A3', '-', submission.answers?.A3 ?? '-'],
    ['AI Literacy', 'A4', '-', submission.answers?.A4 ?? '-'],
    ['AI Literacy', 'A5', '-', submission.answers?.A5 ?? '-'],
    ['Task Framing', 'B1', '-', submission.answers?.B1 ?? '-'],
    ['Task Framing', 'B2', '-', submission.answers?.B2 ?? '-'],
    ['Task Framing', 'B3', '-', submission.answers?.B3 ?? '-'],
    ['Task Framing', 'B4', '-', submission.answers?.B4 ?? '-'],
    ['Task Framing', 'B5', '-', submission.answers?.B5 ?? '-'],
    ['Workflow', 'C1', '-', submission.answers?.C1 ?? '-'],
    ['Workflow', 'C2', '-', submission.answers?.C2 ?? '-'],
    ['Workflow', 'C3', '-', submission.answers?.C3 ?? '-'],
    ['Workflow', 'C4', '-', submission.answers?.C4 ?? '-'],
    ['Workflow', 'C5', '-', submission.answers?.C5 ?? '-'],
    ['Evaluation', 'D1', '-', submission.answers?.D1 ?? '-'],
    ['Evaluation', 'D2', '-', submission.answers?.D2 ?? '-'],
    ['Evaluation', 'D3', '-', submission.answers?.D3 ?? '-'],
    ['Evaluation', 'D4', '-', submission.answers?.D4 ?? '-'],
    ['Evaluation', 'D5', '-', submission.answers?.D5 ?? '-'],
    ['Risk', 'E1', '-', submission.answers?.E1 ?? '-'],
    ['Risk', 'E2', '-', submission.answers?.E2 ?? '-'],
    ['Risk', 'E3', '-', submission.answers?.E3 ?? '-'],
    ['Risk', 'E4', '-', submission.answers?.E4 ?? '-'],
    ['Risk', 'E5', '-', submission.answers?.E5 ?? '-'],
    ['Growth', 'F1', '-', submission.answers?.F1 ?? '-'],
    ['Growth', 'F2', '-', submission.answers?.F2 ?? '-'],
    ['Growth', 'F3', '-', submission.answers?.F3 ?? '-'],
    ['Growth', 'F4', '-', submission.answers?.F4 ?? '-'],
    ['Growth', 'F5', '-', submission.answers?.F5 ?? '-']
  ] : [`;

content = content.replace(oldDetailRows, newDetailRows);

const oldPData = `  const pData = [
    ['Strategi & Kepemimpinan', submission.scores.strategi.toFixed(2), \`\${((submission.scores.strategi / 5) * 100).toFixed(1)}%\`],
    ['Proses & Alur Kerja', submission.scores.proses.toFixed(2), \`\${((submission.scores.proses / 5) * 100).toFixed(1)}%\`],
    ['SDM & Kapabilitas', submission.scores.sdm.toFixed(2), \`\${((submission.scores.sdm / 5) * 100).toFixed(1)}%\`],
    ['Data & Teknologi', submission.scores.data.toFixed(2), \`\${((submission.scores.data / 5) * 100).toFixed(1)}%\`],
    ['Tata Kelola & AI Bertanggung Jawab', submission.scores.tataKelola.toFixed(2), \`\${((submission.scores.tataKelola / 5) * 100).toFixed(1)}%\`]
  ];`;

const newPData = `  const pData = isIndividual ? [
    ['AI Literacy', (submission.scores.aiLiteracy || 0).toFixed(2), \`\${(((submission.scores.aiLiteracy || 0) / 5) * 100).toFixed(1)}%\`],
    ['Task Framing', (submission.scores.taskFraming || 0).toFixed(2), \`\${(((submission.scores.taskFraming || 0) / 5) * 100).toFixed(1)}%\`],
    ['Workflow', (submission.scores.workflow || 0).toFixed(2), \`\${(((submission.scores.workflow || 0) / 5) * 100).toFixed(1)}%\`],
    ['Evaluation', (submission.scores.evaluation || 0).toFixed(2), \`\${(((submission.scores.evaluation || 0) / 5) * 100).toFixed(1)}%\`],
    ['Risk', (submission.scores.responsibleAi || 0).toFixed(2), \`\${(((submission.scores.responsibleAi || 0) / 5) * 100).toFixed(1)}%\`],
    ['Growth', (submission.scores.collaboration || 0).toFixed(2), \`\${(((submission.scores.collaboration || 0) / 5) * 100).toFixed(1)}%\`]
  ] : [
    ['Strategi & Kepemimpinan', (submission.scores.strategi || 0).toFixed(2), \`\${(((submission.scores.strategi || 0) / 5) * 100).toFixed(1)}%\`],
    ['Proses & Alur Kerja', (submission.scores.proses || 0).toFixed(2), \`\${(((submission.scores.proses || 0) / 5) * 100).toFixed(1)}%\`],
    ['SDM & Kapabilitas', (submission.scores.sdm || 0).toFixed(2), \`\${(((submission.scores.sdm || 0) / 5) * 100).toFixed(1)}%\`],
    ['Data & Teknologi', (submission.scores.data || 0).toFixed(2), \`\${(((submission.scores.data || 0) / 5) * 100).toFixed(1)}%\`],
    ['Tata Kelola & AI Bertanggung Jawab', (submission.scores.tataKelola || 0).toFixed(2), \`\${(((submission.scores.tataKelola || 0) / 5) * 100).toFixed(1)}%\`]
  ];`;

content = content.replace(oldPData, newPData);

fs.writeFileSync('src/utils/excelExport.ts', content);
