const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');

const oldTableData = `  const tableData = [
    ['Strategi & Kepemimpinan', submission.scores.strategi.toFixed(2), \`\${((submission.scores.strategi / 5) * 100).toFixed(0)}%\`],
    ['Proses & Alur Kerja', submission.scores.proses.toFixed(2), \`\${((submission.scores.proses / 5) * 100).toFixed(0)}%\`],
    ['SDM & Kapabilitas', submission.scores.sdm.toFixed(2), \`\${((submission.scores.sdm / 5) * 100).toFixed(0)}%\`],
    ['Data & Teknologi', submission.scores.data.toFixed(2), \`\${((submission.scores.data / 5) * 100).toFixed(0)}%\`],
    ['Tata Kelola & Responsible AI', submission.scores.tataKelola.toFixed(2), \`\${((submission.scores.tataKelola / 5) * 100).toFixed(0)}%\`]
  ];`;

const newTableData = `  const isIndividual = submission.assessmentType === 'individual';
  const tableData = isIndividual ? [
    ['AI Literacy & Mindset', (submission.scores.aiLiteracy || 0).toFixed(2), \`\${(((submission.scores.aiLiteracy || 0) / 5) * 100).toFixed(0)}%\`],
    ['Task Framing & Prompting', (submission.scores.taskFraming || 0).toFixed(2), \`\${(((submission.scores.taskFraming || 0) / 5) * 100).toFixed(0)}%\`],
    ['Workflow & Integration', (submission.scores.workflow || 0).toFixed(2), \`\${(((submission.scores.workflow || 0) / 5) * 100).toFixed(0)}%\`],
    ['Evaluation & Human Judgment', (submission.scores.evaluation || 0).toFixed(2), \`\${(((submission.scores.evaluation || 0) / 5) * 100).toFixed(0)}%\`],
    ['Responsible AI & Risk', (submission.scores.responsibleAi || 0).toFixed(2), \`\${(((submission.scores.responsibleAi || 0) / 5) * 100).toFixed(0)}%\`],
    ['Collaboration & AI Growth', (submission.scores.collaboration || 0).toFixed(2), \`\${(((submission.scores.collaboration || 0) / 5) * 100).toFixed(0)}%\`]
  ] : [
    ['Strategi & Kepemimpinan', (submission.scores.strategi || 0).toFixed(2), \`\${(((submission.scores.strategi || 0) / 5) * 100).toFixed(0)}%\`],
    ['Proses & Alur Kerja', (submission.scores.proses || 0).toFixed(2), \`\${(((submission.scores.proses || 0) / 5) * 100).toFixed(0)}%\`],
    ['SDM & Kapabilitas', (submission.scores.sdm || 0).toFixed(2), \`\${(((submission.scores.sdm || 0) / 5) * 100).toFixed(0)}%\`],
    ['Data & Teknologi', (submission.scores.data || 0).toFixed(2), \`\${(((submission.scores.data || 0) / 5) * 100).toFixed(0)}%\`],
    ['Tata Kelola & Responsible AI', (submission.scores.tataKelola || 0).toFixed(2), \`\${(((submission.scores.tataKelola || 0) / 5) * 100).toFixed(0)}%\`]
  ];`;

content = content.replace(oldTableData, newTableData);

// also "Skor per Pilar" title
content = content.replace("'Skor per Pilar', marginLeft, currentY", "isIndividual ? 'Skor per Dimensi' : 'Skor per Pilar', marginLeft, currentY");
content = content.replace("head: [['Pilar', 'Skor', 'Persentase']]", "head: [[isIndividual ? 'Dimensi' : 'Pilar', 'Skor', 'Persentase']]");

fs.writeFileSync('src/utils/pdfExport.ts', content);
