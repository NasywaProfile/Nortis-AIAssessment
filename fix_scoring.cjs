const fs = require('fs');
let content = fs.readFileSync('src/components/AssessmentQuestions.tsx', 'utf8');

// I will just replace the whole score calculation block
const oldCalc = `      // Calculate scores
      let strategyScore = 0;
      let processScore = 0;
      let peopleScore = 0;
      let dataScore = 0;
      let governanceScore = 0;

      assessmentData.forEach(p => {
        let sum = 0;
        p.questions.forEach(q => {
          sum += (answers[q.id] || 0);
        });
        const avg = sum / p.questions.length;
        if (p.id === 'strategi') strategyScore = avg;
        else if (p.id === 'proses') processScore = avg;
        else if (p.id === 'sdm') peopleScore = avg;
        else if (p.id === 'data') dataScore = avg;
        else if (p.id === 'tata-kelola') governanceScore = avg;
      });

      const overallScore = (strategyScore + processScore + peopleScore + dataScore + governanceScore) / 5;

      let readinessLevel = '';
      let readinessDesc = '';

      if (overallScore <= 1.5) {
        readinessLevel = 'AI-Unready';
        readinessDesc = 'AI Literacy + Awareness';
      } else if (overallScore > 1.5 && overallScore <= 2.5) {
        readinessLevel = 'AI-Aware';
        readinessDesc = 'Readiness Program';
      } else if (overallScore > 2.5 && overallScore <= 3.5) {
        readinessLevel = 'AI-Ready';
        readinessDesc = 'Implementation Pilot';
      } else if (overallScore > 3.5 && overallScore <= 4.5) {
        readinessLevel = 'AI-Enabled';
        readinessDesc = 'Scaling & Retainer';
      } else if (overallScore > 4.5) {
        readinessLevel = 'AI-Mature';
        readinessDesc = 'Strategic Advisory';
      }

      const submission: AssessmentSubmission = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        ...formData,
        overallScore,
        scores: {
          strategi: strategyScore,
          proses: processScore,
          sdm: peopleScore,
          data: dataScore,
          tataKelola: governanceScore
        },
        readinessLevel,
        readinessDescription: readinessDesc,
        answers
      };`;

const newCalc = `      // Calculate scores dynamically
      const calculatedScores: Record<string, number> = {};
      let totalSum = 0;
      
      assessmentData.forEach(p => {
        let sum = 0;
        p.questions.forEach(q => {
          sum += (answers[q.id] || 0);
        });
        const avg = sum / p.questions.length;
        // Keep camelCase for ID compatibility
        const key = p.id === 'tata-kelola' ? 'tataKelola' : p.id;
        calculatedScores[key] = avg;
        totalSum += avg;
      });

      const overallScore = totalSum / assessmentData.length;

      let readinessLevel = '';
      let readinessDesc = '';

      if (overallScore <= 1.5) {
        readinessLevel = 'AI-Unready';
        readinessDesc = 'AI Literacy + Awareness';
      } else if (overallScore > 1.5 && overallScore <= 2.5) {
        readinessLevel = 'AI-Aware';
        readinessDesc = 'Readiness Program';
      } else if (overallScore > 2.5 && overallScore <= 3.5) {
        readinessLevel = 'AI-Ready';
        readinessDesc = 'Implementation Pilot';
      } else if (overallScore > 3.5 && overallScore <= 4.5) {
        readinessLevel = 'AI-Enabled';
        readinessDesc = 'Scaling & Retainer';
      } else if (overallScore > 4.5) {
        readinessLevel = 'AI-Mature';
        readinessDesc = 'Strategic Advisory';
      }

      const submission: AssessmentSubmission = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        ...formData,
        overallScore,
        scores: calculatedScores,
        readinessLevel,
        readinessDescription: readinessDesc,
        answers
      };`;

content = content.replace(oldCalc, newCalc);

// Also need to fix where `pillar.questions` is mapped because `currentQuestions` needs to be injected into `pillar`.
const oldPillar = `  const pillar = {
    ...currentCategory,
    questions: questionsData[currentCategory.id]?.map((q: any) => ({
      id: q.id,
      text: q.text
    })) || []
  };`;

const newPillar = `  const pillar = {
    ...currentCategory,
    questions: currentQuestions?.map((q: any) => ({
      id: q.id,
      text: q.text
    })) || []
  };`;
content = content.replace(oldPillar, newPillar);

// Also change scoringScale to use dynamic scale
content = content.replace(/const scoringScale = t\('questions\.scoringScale'\) as any;/g, "const scoringScale = scale || t('questions.scoringScale') as any;");


fs.writeFileSync('src/components/AssessmentQuestions.tsx', content);
