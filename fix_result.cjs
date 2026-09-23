const fs = require('fs');
let content = fs.readFileSync('src/components/AssessmentResult.tsx', 'utf8');

// I will insert a dynamic radarData generation based on submission.assessmentType
const oldRadarData = `  const radarData = [
    { subject: 'Strategy', A: scores.strategi, fullMark: 5 },
    { subject: 'Process', A: scores.proses, fullMark: 5 },
    { subject: 'People', A: scores.sdm, fullMark: 5 },
    { subject: 'Data & Tech', A: scores.data, fullMark: 5 },
    { subject: 'Governance', A: scores.tataKelola, fullMark: 5 },
  ];`;

const newRadarData = `  const isIndividual = submission?.assessmentType === 'individual';
  const radarData = isIndividual ? [
    { subject: 'Literacy', A: scores.aiLiteracy || 0, fullMark: 5 },
    { subject: 'Prompting', A: scores.taskFraming || 0, fullMark: 5 },
    { subject: 'Workflow', A: scores.workflow || 0, fullMark: 5 },
    { subject: 'Evaluation', A: scores.evaluation || 0, fullMark: 5 },
    { subject: 'Risk', A: scores.responsibleAi || 0, fullMark: 5 },
    { subject: 'Growth', A: scores.collaboration || 0, fullMark: 5 },
  ] : [
    { subject: 'Strategy', A: scores.strategi || 0, fullMark: 5 },
    { subject: 'Process', A: scores.proses || 0, fullMark: 5 },
    { subject: 'People', A: scores.sdm || 0, fullMark: 5 },
    { subject: 'Data & Tech', A: scores.data || 0, fullMark: 5 },
    { subject: 'Governance', A: scores.tataKelola || 0, fullMark: 5 },
  ];`;

content = content.replace(oldRadarData, newRadarData);

// Now the pillar breakdown section. The old code hardcoded the 5 pillars:
// "Area Fokus Berdasarkan Pilar"
// {/* Strategy */}
// ...
const oldFocusAreaStart = `{/* Area Fokus Berdasarkan Pilar */}`;
const oldFocusAreaRegex = /\{\/\* Area Fokus Berdasarkan Pilar \*\/\}[\s\S]*?(?=\{\/\* Program Rekomendasi Nortis \*\/\}|\{\/\* Action Bottom Bar \*\/\}|<div className="bg-\[\#F0FDF4\])/;

const newFocusArea = `{/* Area Fokus Berdasarkan Pilar */}
        <div className="bg-[#F0FDF4] rounded-2xl p-6 sm:p-8 mb-6 border border-emerald-100">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">Area Fokus Berdasarkan {isIndividual ? 'Dimensi' : 'Pilar'}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {radarData.map((data, idx) => {
                    const score = data.A;
                    const isStrong = score >= 3.5;
                    return (
                        <div key={idx} className="bg-white rounded-xl p-5 border border-slate-100 relative overflow-hidden shadow-sm">
                            <div className={\`absolute left-0 top-0 bottom-0 w-1 \${isStrong ? 'bg-emerald-500' : 'bg-rose-500'}\`}></div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={\`w-2.5 h-2.5 rounded-full \${isStrong ? 'bg-emerald-500' : 'bg-rose-500'}\`}></div>
                                <h4 className="text-[14px] font-bold text-[#0F172A]">{data.subject}</h4>
                            </div>
                            <p className="text-[11px] text-[#64748B] mb-2">Score: {score.toFixed(2)} · {isStrong ? 'Fondasi Kuat' : 'Perlu Perhatian Segera'}</p>
                            <p className="text-[12px] text-[#475569]">
                                {isStrong 
                                    ? 'Manfaatkan kekuatan ini untuk mendorong inisiatif AI dan mendukung area lainnya.' 
                                    : 'Area ini memerlukan investasi prioritas dan inisiatif perbaikan yang terfokus.'}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>

        `;

content = content.replace(oldFocusAreaRegex, newFocusArea);

// Need to fix the summary header loop as well.
// The code loops over `[ { title: 'Strategy', score: scores.strategi }, ... ]`
const oldPillarScoresLoop = `const pillarScores = [
    { title: 'Strategi & Kepemimpinan', score: scores.strategi },
    { title: 'Proses & Alur Kerja', score: scores.proses },
    { title: 'SDM & Kapabilitas', score: scores.sdm },
    { title: 'Data & Teknologi', score: scores.data },
    { title: 'Tata Kelola & Responsible AI', score: scores.tataKelola },
  ];`;

const newPillarScoresLoop = `const pillarScores = isIndividual ? [
    { title: 'AI Literacy & Mindset', score: scores.aiLiteracy || 0 },
    { title: 'Task Framing & Prompting', score: scores.taskFraming || 0 },
    { title: 'Workflow & Integration', score: scores.workflow || 0 },
    { title: 'Evaluation & Human Judgment', score: scores.evaluation || 0 },
    { title: 'Responsible AI & Risk', score: scores.responsibleAi || 0 },
    { title: 'Collaboration & AI Growth', score: scores.collaboration || 0 },
  ] : [
    { title: 'Strategi & Kepemimpinan', score: scores.strategi || 0 },
    { title: 'Proses & Alur Kerja', score: scores.proses || 0 },
    { title: 'SDM & Kapabilitas', score: scores.sdm || 0 },
    { title: 'Data & Teknologi', score: scores.data || 0 },
    { title: 'Tata Kelola & Responsible AI', score: scores.tataKelola || 0 },
  ];`;

content = content.replace(oldPillarScoresLoop, newPillarScoresLoop);

fs.writeFileSync('src/components/AssessmentResult.tsx', content);
