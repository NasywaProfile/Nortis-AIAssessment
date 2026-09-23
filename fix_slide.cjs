const fs = require('fs');
let content = fs.readFileSync('src/utils/slideExport.ts', 'utf8');

const isIndividualAdd = `  const isIndividual = submission.assessmentType === 'individual';`;

content = content.replace("export const exportToSlideSummary = (submission: AssessmentSubmission, recTexts?: any) => {", "export const exportToSlideSummary = (submission: AssessmentSubmission, recTexts?: any) => {\n" + isIndividualAdd);

const oldPillars = `  const pillars = [
    { name: 'Strategy & Leadership', score: submission.scores.strategi },
    { name: 'Process & Workflow', score: submission.scores.proses },
    { name: 'People & Capability', score: submission.scores.sdm },
    { name: 'Data & Technology', score: submission.scores.data },
    { name: 'Governance & Responsible AI', score: submission.scores.tataKelola }
  ];`;

const newPillars = `  const pillars = isIndividual ? [
    { name: 'AI Literacy & Mindset', score: submission.scores.aiLiteracy || 0 },
    { name: 'Task Framing & Prompting', score: submission.scores.taskFraming || 0 },
    { name: 'Workflow & Integration', score: submission.scores.workflow || 0 },
    { name: 'Evaluation & Human Judgment', score: submission.scores.evaluation || 0 },
    { name: 'Responsible AI & Risk', score: submission.scores.responsibleAi || 0 },
    { name: 'Collaboration & AI Growth', score: submission.scores.collaboration || 0 }
  ] : [
    { name: 'Strategy & Leadership', score: submission.scores.strategi || 0 },
    { name: 'Process & Workflow', score: submission.scores.proses || 0 },
    { name: 'People & Capability', score: submission.scores.sdm || 0 },
    { name: 'Data & Technology', score: submission.scores.data || 0 },
    { name: 'Governance & Responsible AI', score: submission.scores.tataKelola || 0 }
  ];`;

content = content.replace(oldPillars, newPillars);

const oldSlide2 = `SLIDE 2: PILLAR SCORES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Strategy & Leadership      \${submission.scores.strategi.toFixed(2)}/5.0  \${generateProgressBar(submission.scores.strategi)}
2. Process & Workflow          \${submission.scores.proses.toFixed(2)}/5.0  \${generateProgressBar(submission.scores.proses)}
3. People & Capability         \${submission.scores.sdm.toFixed(2)}/5.0  \${generateProgressBar(submission.scores.sdm)}
4. Data & Technology           \${submission.scores.data.toFixed(2)}/5.0  \${generateProgressBar(submission.scores.data)}
5. Governance & Responsible AI \${submission.scores.tataKelola.toFixed(2)}/5.0  \${generateProgressBar(submission.scores.tataKelola)}
═══════════════════════════════════════════════════`;

const newSlide2 = `\${isIndividual ? 'SLIDE 2: DIMENSION SCORES' : 'SLIDE 2: PILLAR SCORES'}
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
\${pillars.map((p, idx) => \`\${idx + 1}. \${p.name.padEnd(28)} \${p.score.toFixed(2)}/5.0  \${generateProgressBar(p.score)}\`).join('\\n')}
═══════════════════════════════════════════════════`;

content = content.replace(oldSlide2, newSlide2);

fs.writeFileSync('src/utils/slideExport.ts', content);
