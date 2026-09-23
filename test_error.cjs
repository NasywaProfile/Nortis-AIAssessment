const fs = require('fs');
let aq = fs.readFileSync('src/components/AssessmentQuestions.tsx', 'utf8');

aq = aq.replace(
  "const isIndividual = assessmentType === 'individual';",
  `const isIndividual = assessmentType === 'individual';
  console.log('isIndividual', isIndividual);
  console.log('translations', translations);
  console.log('rawAssessmentData', isIndividual ? translations[language].individualAssessmentData : translations[language].assessmentData);
  console.log('rawQuestionsData', isIndividual ? translations[language].individualQuestions : translations[language].questions);
  `
);
fs.writeFileSync('src/components/AssessmentQuestions.tsx', aq);
