const fs = require('fs');
let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

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

// First remove any existing recommendations blocks completely
content = content.replace(/\s*recommendations:\s*\{[\s\S]*?(?=\s*admin:\s*\{)/g, '\n');

// Now explicitly inject ID before the first 'admin: {'
const firstAdmin = content.indexOf('    admin: {');
content = content.substring(0, firstAdmin) + idRecommendations + '\n' + content.substring(firstAdmin);

// We need to inject EN before the second 'admin: {'
// But since we just added one before the first, let's find the LAST 'admin: {'
const lastAdmin = content.lastIndexOf('    admin: {');
const enRecommendations = idRecommendations.replace('Organisasi sudah mature dalam AI dan perlu strategic advisory untuk inovasi lanjutan, ecosystem development, dan thought leadership.', 'The organization is mature in AI and needs strategic advisory for advanced innovation, ecosystem development, and thought leadership.').replace('Organisasi mature dan perlu strategic advisory.', 'Mature organization needing strategic advisory.').replace('Organisasi perlu fokus pada scaling solusi AI yang sudah berhasil ke area lain, dengan dukungan retainer untuk optimasi berkelanjutan.', 'The organization needs to focus on scaling successful AI solutions to other areas, with retainer support for continuous optimization.').replace('Scaling solusi AI yang berhasil ke area lain.', 'Scaling successful AI solutions to other areas.').replace('Fokus pada implementasi pilot project AI pada use case prioritas untuk membuktikan business value dan kelayakan teknis.', 'Focus on implementing an AI pilot project on a priority use case to prove business value and technical feasibility.').replace('Implementasi pilot project pada use case prioritas.', 'Implement a pilot project on a priority use case.').replace('Membangun fondasi infrastruktur data, tata kelola, dan kapabilitas tim untuk persiapan implementasi AI.', 'Build the foundation of data infrastructure, governance, and team capabilities in preparation for AI implementation.').replace('Membangun fondasi infrastruktur data dan kapabilitas.', 'Build data infrastructure and capabilities foundation.').replace('Membangun pemahaman dasar tentang AI dan potensinya bagi bisnis melalui training dan workshop kepada tim.', 'Build basic understanding of AI and its potential for the business through training and workshops for the team.').replace('Membangun pemahaman dasar tentang AI di organisasi.', 'Build basic understanding of AI in the organization.');

content = content.substring(0, lastAdmin) + enRecommendations + '\n' + content.substring(lastAdmin);

fs.writeFileSync('src/contexts/LanguageContext.tsx', content);
