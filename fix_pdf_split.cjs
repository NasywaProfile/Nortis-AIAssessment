const fs = require('fs');
let content = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');

content = content.replace(
  "export const exportToPDF = (submission: AssessmentSubmission, recTexts?: any) => {\n  const isIndividual = submission.assessmentType === 'individual';",
  `import { exportToIndividualPDF } from './individualPdfExport';

export const exportToPDF = (submission: AssessmentSubmission, recTexts?: any) => {
  const isIndividual = submission.assessmentType === 'individual';
  if (isIndividual) {
    exportToIndividualPDF(submission, recTexts);
    return;
  }
`
);

fs.writeFileSync('src/utils/pdfExport.ts', content);
