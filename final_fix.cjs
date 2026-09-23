const fs = require('fs');

// 1. AssessmentQuestions.tsx
let aq = fs.readFileSync('src/components/AssessmentQuestions.tsx', 'utf8');
aq = aq.replace(
  "interface AssessmentQuestionsProps {\n  formData: FormData;\n  onBack: () => void;\n  onComplete: (id: string, submission?: AssessmentSubmission) => void;\n}",
  "interface AssessmentQuestionsProps {\n  assessmentType: 'organization' | 'individual';\n  formData: FormData;\n  onBack: () => void;\n  onComplete: (id: string, submission?: AssessmentSubmission) => void;\n}"
);
aq = aq.replace(
  "export function AssessmentQuestions({ formData, onBack, onComplete }: AssessmentQuestionsProps) {",
  "export function AssessmentQuestions({ assessmentType, formData, onBack, onComplete }: AssessmentQuestionsProps) {"
);

const oldDataExtraction = `  const assessmentData = translations[language].assessmentData;
  const scoringScale = (scale || t('questions.scale')) as any as { score: number, label: string, value?: number }[];
  // Normalize scale to always have score (value is used in individual)
  const normalizedScale = normalizedScale.map(s => ({ score: s.score !== undefined ? s.score : s.value, label: s.label }));

  const pillar = assessmentData && assessmentData.length > 0 ? assessmentData[currentStep] : null;`;

const newDataExtraction = `  const isIndividual = assessmentType === 'individual';
  const rawAssessmentData = isIndividual ? (translations[language].individualAssessmentData || []) : (translations[language].assessmentData || []);
  const assessmentData = Array.isArray(rawAssessmentData) ? rawAssessmentData : [];
  
  const rawQuestionsData = isIndividual ? translations[language].individualQuestions : translations[language].questions;
  
  const currentCategory = assessmentData[currentStep];
  const currentQuestions = currentCategory && rawQuestionsData ? rawQuestionsData[currentCategory.id] : [];
  
  const scale = isIndividual && rawQuestionsData ? rawQuestionsData.scale : (rawQuestionsData?.scale || t('questions.scale'));
  const scoringScale = scale as any as { score?: number, value?: number, label: string }[];
  const normalizedScale = (scoringScale || []).map((s: any) => ({ score: s.score !== undefined ? s.score : s.value, label: s.label }));

  const pillar = currentCategory ? {
    ...currentCategory,
    questions: currentQuestions?.map((q: any) => ({
      id: q.id,
      text: q.text
    })) || []
  } : null;`;

// Use regex because there might be some variation.
aq = aq.replace(/const assessmentData = translations\[language\]\.assessmentData;[\s\S]*?const pillar = assessmentData && assessmentData\.length > 0 \? assessmentData\[currentStep\] : null;/m, newDataExtraction);

fs.writeFileSync('src/components/AssessmentQuestions.tsx', aq);

// 2. pdfExport.ts
let pdf = fs.readFileSync('src/utils/pdfExport.ts', 'utf8');
pdf = pdf.replace(
  "export const exportToPDF = (submission: AssessmentSubmission, recTexts?: any) => {",
  "export const exportToPDF = (submission: AssessmentSubmission, recTexts?: any) => {\n  const isIndividual = submission.assessmentType === 'individual';"
);
fs.writeFileSync('src/utils/pdfExport.ts', pdf);

