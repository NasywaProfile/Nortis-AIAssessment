const fs = require('fs');
let content = fs.readFileSync('src/components/AssessmentResult.tsx', 'utf8');

// Insert import at the top
content = content.replace(
  "import { useLanguage } from '../contexts/LanguageContext';",
  "import { useLanguage } from '../contexts/LanguageContext';\nimport { IndividualAssessmentResult } from './IndividualAssessmentResult';"
);

// find where it returns the main JSX. Usually around `return (`
const regex = /return \([\s\S]*?<div className="w-full max-w-\[1200px\] mx-auto px-4 py-8 md:py-12">/;

const newLogic = `
  if (submission && submission.assessmentType === 'individual') {
    return <IndividualAssessmentResult submission={submission} />;
  }

  return (
    <div className="w-full max-w-[1200px] mx-auto px-4 py-8 md:py-12">`;

content = content.replace(/return \(\s*<div className="w-full max-w-\[1200px\] mx-auto px-4 py-8 md:py-12">/, newLogic);

fs.writeFileSync('src/components/AssessmentResult.tsx', content);
