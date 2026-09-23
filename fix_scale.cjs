const fs = require('fs');
let aq = fs.readFileSync('src/components/AssessmentQuestions.tsx', 'utf8');

aq = aq.replace(
  "const scale = isIndividual && rawQuestionsData ? rawQuestionsData.scale : (rawQuestionsData?.scale || t('questions.scale'));",
  "const scale = rawQuestionsData?.scale || t('questions.scale');"
);

fs.writeFileSync('src/components/AssessmentQuestions.tsx', aq);
