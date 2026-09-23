const fs = require('fs');
let content = fs.readFileSync('src/components/AssessmentQuestions.tsx', 'utf8');

content = content.replace(
  "interface AssessmentQuestionsProps {",
  "interface AssessmentQuestionsProps {\n  assessmentType: 'organization' | 'individual';"
);

content = content.replace(
  "export function AssessmentQuestions({ formData, onBack, onComplete }: AssessmentQuestionsProps) {",
  "export function AssessmentQuestions({ assessmentType, formData, onBack, onComplete }: AssessmentQuestionsProps) {"
);

// We need to change how dimensions are accessed
const oldDataExtraction = `  const assessmentData = t('assessmentData') as AssessmentCategory[];
  const currentCategory = assessmentData[currentStep];
  const questionsData = t('questions') as any;`;

const newDataExtraction = `  const isIndividual = assessmentType === 'individual';
  const assessmentData = (isIndividual ? t('individualAssessmentData') : t('assessmentData')) as AssessmentCategory[];
  const currentCategory = assessmentData[currentStep];
  const questionsData = (isIndividual ? t('individualQuestions') : t('questions')) as any;
  const currentQuestions = isIndividual ? questionsData[currentCategory.id] : questionsData[currentCategory.id];
  const scale = isIndividual ? questionsData.scale : questionsData.scale;`;

content = content.replace(
  /const assessmentData = t\('assessmentData'\) as AssessmentCategory\[\];\s*const currentCategory = assessmentData\[currentStep\];\s*const questionsData = t\('questions'\) as any;/,
  newDataExtraction
);

// The original map to questions was `questionsData[currentCategory.id].map`. That should still work since `currentQuestions` is mapped.
// Wait, I need to look at how `questions` is mapped.
