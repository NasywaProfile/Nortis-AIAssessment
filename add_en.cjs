const fs = require('fs');
let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

const enIndex = content.indexOf('EN: {');
let beforeEN = content.substring(0, enIndex);
let afterEN = content.substring(enIndex);

if (afterEN.indexOf('recommendations:') === -1) {
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

    // Note: in previous step, en admin is missing space formatting somehow because of previous bugs
    // We just need to inject before `admin: {`
    afterEN = afterEN.replace('admin: {', enRecommendations + '\n    admin: {');
    fs.writeFileSync('src/contexts/LanguageContext.tsx', beforeEN + afterEN);
}

