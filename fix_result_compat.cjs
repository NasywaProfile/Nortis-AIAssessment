const fs = require('fs');
let ar = fs.readFileSync('src/components/AssessmentResult.tsx', 'utf8');

ar = ar.replace(
  "if (submission && submission.assessmentType === 'individual') {",
  "if (submission && (submission.assessmentType === 'individual' || (!submission.assessmentType && !submission.companySize))) {"
);

fs.writeFileSync('src/components/AssessmentResult.tsx', ar);
