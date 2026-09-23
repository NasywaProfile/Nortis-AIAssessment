const fs = require('fs');
let aq = fs.readFileSync('src/components/AssessmentQuestions.tsx', 'utf8');

aq = aq.replace(
  "timestamp: new Date().toISOString(),\n        ...formData,",
  "timestamp: new Date().toISOString(),\n        assessmentType: assessmentType,\n        ...formData,"
);

fs.writeFileSync('src/components/AssessmentQuestions.tsx', aq);
