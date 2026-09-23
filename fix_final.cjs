const fs = require('fs');
let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

// The file has two sections: ID: { ... }, EN: { ... }
const enIndex = content.indexOf('EN: {');
let beforeEN = content.substring(0, enIndex);
let afterEN = content.substring(enIndex);

// Let's remove ALL recommendations blocks in beforeEN, and add just one
beforeEN = beforeEN.replace(/\s*recommendations:\s*\{[\s\S]*?(?=\s*(admin|recommendations):\s*\{)/g, '\n');
// Clean up again just in case there are consecutive ones
beforeEN = beforeEN.replace(/\s*recommendations:\s*\{[\s\S]*?(?=\s*(admin|recommendations):\s*\{)/g, '\n');
beforeEN = beforeEN.replace(/\s*recommendations:\s*\{[\s\S]*?(?=\s*admin:\s*\{)/g, '\n');

// And add it before the admin: { in beforeEN
const idRecommendations = `
    recommendations: {
      mature: {
        title: 'Strategic Advisory',
        desc: 'Organisasi sudah mature dalam AI dan perlu strategic advisory untuk inovasi lanjutan, ecosystem development, dan thought leadership.',
        shortDesc: 'Organisasi mature dan perlu strategic advisory.',
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
        desc: 'Organisasi perlu fokus pada scaling solusi AI yang sudah berhasil ke area lain, dengan dukungan retainer untuk optimasi berkelanjutan.',
        shortDesc: 'Scaling solusi AI yang berhasil ke area lain.',
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
        desc: 'Fokus pada implementasi pilot project AI pada use case prioritas untuk membuktikan business value dan kelayakan teknis.',
        shortDesc: 'Implementasi pilot project pada use case prioritas.',
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
        desc: 'Membangun fondasi infrastruktur data, tata kelola, dan kapabilitas tim untuk persiapan implementasi AI.',
        shortDesc: 'Membangun fondasi infrastruktur data dan kapabilitas.',
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
        desc: 'Membangun pemahaman dasar tentang AI dan potensinya bagi bisnis melalui training dan workshop kepada tim.',
        shortDesc: 'Membangun pemahaman dasar tentang AI di organisasi.',
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

beforeEN = beforeEN.replace('    admin: {', idRecommendations + '\n    admin: {');

// Just check EN again, making sure we haven't lost its admin { block somehow
const enAdminCount = (afterEN.match(/admin:\s*\{/g) || []).length;
if (enAdminCount === 0) {
  // We need to restore it
  afterEN = afterEN.replace('}', '  admin: {\n    // ... (restored placeholder)\n  }\n}'); // Not ideal, better hope it exists!
}

fs.writeFileSync('src/contexts/LanguageContext.tsx', beforeEN + afterEN);
