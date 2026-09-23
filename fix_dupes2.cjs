const fs = require('fs');
let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

const enIndex = content.indexOf('EN: {');
let beforeEN = content.substring(0, enIndex);
let afterEN = content.substring(enIndex);

// Let's count how many 'recommendations: {' are in afterEN
let count = (afterEN.match(/recommendations:\s*\{/g) || []).length;
console.log("Count in EN:", count);

if (count > 1) {
  // Let's just remove the first one if there are duplicates, or rather remove ALL and add one
  afterEN = afterEN.replace(/\s*recommendations:\s*\{[\s\S]*?(?=\s*(admin|recommendations):\s*\{)/g, '\n');
  
  // Clean up any remaining just in case
  afterEN = afterEN.replace(/\s*recommendations:\s*\{[\s\S]*?(?=\s*(admin|recommendations):\s*\{)/g, '\n');
  afterEN = afterEN.replace(/\s*recommendations:\s*\{[\s\S]*?(?=\s*admin:\s*\{)/g, '\n');
}

const enRecommendations = `
    recommendations: {
      mature: {
        title: 'Strategic Advisory',
        desc: 'The organization is mature in AI and needs strategic advisory for advanced innovation, ecosystem development, and thought leadership.',
        shortDesc: 'Mature organization needing strategic advisory.',
        slideActions: [
          'Explore advanced AI capabilities',
          'Develop AI innovation pipeline',
          'Thought leadership positioning',
          'AI ecosystem development'
        ],
        slideOutcomes: [
          'Improved organizational readiness',
          'Clear implementation roadmap',
          'Stakeholder alignment',
          'Foundation for AI success'
        ]
      },
      enabled: {
        title: 'Scaling & Retainer',
        desc: 'The organization needs to focus on scaling successful AI solutions to other areas, with retainer support for continuous optimization.',
        shortDesc: 'Scaling successful AI solutions to other areas.',
        slideActions: [
          'Scale successful pilot to additional business units',
          'Optimize existing AI implementations for efficiency',
          'Build internal AI competence through knowledge sharing',
          'Develop MLOps capabilities for continuous deployment'
        ],
        slideOutcomes: [
          'Scaled return on investment',
          'Optimized operational efficiency',
          'Enhanced internal AI capabilities',
          'Robust AI operations framework'
        ]
      },
      ready: {
        title: 'Implementation Pilot',
        desc: 'Focus on implementing an AI pilot project on a priority use case to prove business value and technical feasibility.',
        shortDesc: 'Implement a pilot project on a priority use case.',
        slideActions: [
          'Execute pilot project on highest-priority use case',
          'Establish baseline metrics and measure ROI',
          'Train core team on AI implementation',
          'Evaluate technology vendors and partners'
        ],
        slideOutcomes: [
          'Proven business value from pilot',
          'Technical feasibility validated',
          'Capable core implementation team',
          'Selected technology stack'
        ]
      },
      aware: {
        title: 'Readiness Program',
        desc: 'Build the foundation of data infrastructure, governance, and team capabilities in preparation for AI implementation.',
        shortDesc: 'Build data infrastructure and capabilities foundation.',
        slideActions: [
          'Identify and prioritize high-value AI use cases',
          'Build data foundation and governance framework',
          'Secure leadership buy-in and budget allocation',
          'Develop detailed implementation roadmap'
        ],
        slideOutcomes: [
          'Prioritized use case backlog',
          'Structured data foundation',
          'Committed leadership support',
          'Clear path to initial pilot'
        ]
      },
      unready: {
        title: 'AI Literacy + Awareness',
        desc: 'Build basic understanding of AI and its potential for the business through training and workshops for the team.',
        shortDesc: 'Build basic understanding of AI in the organization.',
        slideActions: [
          'Conduct basic AI literacy training for leadership',
          'Identify immediate operational pain points',
          'Establish an initial data inventory',
          'Form a cross-functional AI task force'
        ],
        slideOutcomes: [
          'Improved AI awareness',
          'Clear understanding of AI potential',
          'Initial alignment on business goals',
          'Preparation for structured readiness program'
        ]
      }
    },`;

// Check how many are left
count = (afterEN.match(/recommendations:\s*\{/g) || []).length;
console.log("Count in EN after removal:", count);

if (count === 0) {
  afterEN = afterEN.replace('    admin: {', enRecommendations + '\n    admin: {');
} else {
  // If still there, manual string manipulation
  let recIdx = afterEN.lastIndexOf('recommendations: {');
  let admIdx = afterEN.indexOf('admin: {', recIdx);
  afterEN = afterEN.substring(0, recIdx) + enRecommendations + '\n    ' + afterEN.substring(admIdx);
  // Do it again just in case there were 3
  recIdx = afterEN.indexOf('recommendations: {');
  let lastRecIdx = afterEN.lastIndexOf('recommendations: {');
  if (recIdx !== lastRecIdx) {
     afterEN = afterEN.substring(0, recIdx) + afterEN.substring(lastRecIdx);
  }
}

fs.writeFileSync('src/contexts/LanguageContext.tsx', beforeEN + afterEN);
