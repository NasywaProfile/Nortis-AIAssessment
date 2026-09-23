const fs = require('fs');
let content = fs.readFileSync('src/components/AssessmentQuestions.tsx', 'utf8');

// I will find the part where rawAssessmentData is handled and map it to inject questions.
const regex = /const isIndividual = assessmentType === 'individual';[\s\S]*?const pillar = currentCategory \? \{[\s\S]*?\} : null;/;

const newLogic = `  const isIndividual = assessmentType === 'individual';
  const rawAssessmentData = isIndividual ? (translations[language].individualAssessmentData || []) : (translations[language].assessmentData || []);
  const rawQuestionsData = isIndividual ? translations[language].individualQuestions : translations[language].questions;
  
  // Normalize assessment data so it always has questions array
  const assessmentData = (Array.isArray(rawAssessmentData) ? rawAssessmentData : []).map(cat => {
    let qs = cat.questions;
    if (!qs && rawQuestionsData) {
      qs = rawQuestionsData[cat.id];
    }
    return {
      ...cat,
      questions: qs || []
    };
  });
  
  const currentCategory = assessmentData[currentStep];
  
  const scale = isIndividual && rawQuestionsData ? rawQuestionsData.scale : (rawQuestionsData?.scale || t('questions.scale'));
  const scoringScale = scale as any as { score?: number, value?: number, label: string }[];
  const normalizedScale = (scoringScale || []).map((s: any) => ({ score: s.score !== undefined ? s.score : s.value, label: s.label }));

  const pillar = currentCategory || null;`;

content = content.replace(regex, newLogic);

fs.writeFileSync('src/components/AssessmentQuestions.tsx', content);
