const fs = require('fs');
let content = fs.readFileSync('src/components/AssessmentQuestions.tsx', 'utf8');

const regex = /\/\/ Calculate scores[\s\S]*?readinessDesc = 'AI Literacy \+ Awareness';/m;

const newCalc = `// Calculate scores dynamically
      const calculatedScores: Record<string, number> = {};
      let totalSum = 0;
      
      assessmentData.forEach(p => {
        let sum = 0;
        if (p.questions && p.questions.length > 0) {
          p.questions.forEach((q: any) => {
            sum += (answers[q.id] || 0);
          });
          const avg = sum / p.questions.length;
          // Keep camelCase for ID compatibility
          const key = p.id === 'tata-kelola' ? 'tataKelola' : p.id;
          calculatedScores[key] = avg;
          totalSum += avg;
        }
      });

      const overallScore = assessmentData.length > 0 ? totalSum / assessmentData.length : 0;

      let readinessLevel = 'AI-Unready';
      let readinessDesc = 'AI Literacy + Awareness';`;

content = content.replace(regex, newCalc);

// Also need to update the submission object to use calculatedScores
const subRegex = /scores: \{\s*strategi: strategyScore,\s*proses: processScore,\s*sdm: peopleScore,\s*data: dataScore,\s*tataKelola: governanceScore\s*\}/m;
content = content.replace(subRegex, "scores: calculatedScores");

fs.writeFileSync('src/components/AssessmentQuestions.tsx', content);
