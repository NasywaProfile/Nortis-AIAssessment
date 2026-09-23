import React, { useEffect } from 'react';
import { AssessmentSubmission } from '../types';
import { useLanguage } from '../contexts/LanguageContext';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from 'recharts';
import { 
  Download, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Compass, 
  TrendingUp, 
  Target, 
  Calendar,
  Check,
  HelpCircle,
  FileText,
  RefreshCw,
  Sparkles,
  ExternalLink,
  Zap,
  GraduationCap,
  Mail,
  MessageCircle,
  Briefcase,
  Building2
} from 'lucide-react';
import { exportToIndividualPDF } from '../utils/individualPdfExport';
import { 
  getLevelSummary, 
  getReadinessProfileTitle, 
  get90DayFocus,
  get90DayFocusEN,
  getDimensionStatus, 
  getDimensionDescription, 
  getStrengthInsight, 
  getGrowthInsight, 
  getActionPlan, 
  getReflectionPrompts, 
  getReadinessSummary 
} from '../utils/individualInsights';

interface IndividualResultProps {
  submission: AssessmentSubmission;
  onBack?: () => void;
}

export function IndividualAssessmentResult({ submission, onBack }: IndividualResultProps) {
  const { t, translations, language } = useLanguage();
  const overallScore = submission.overallScore;
  const percentageScore = Math.round((overallScore / 5) * 100);
  const readinessLevel = submission.readinessLevel;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [submission]);

  // Dimensions
  const dimNames = {
    aiLiteracy: "AI Literacy & Mindset",
    taskFraming: "Task Framing & Prompting",
    workflow: "Workflow & Integration",
    evaluation: "Evaluation & Human Judgment",
    responsibleAi: "Responsible AI & Risk",
    collaboration: "Collaboration & AI Growth"
  };

  const indInsights = (translations[language] as any)?.individualInsights;

  const dimensions = Object.keys(dimNames).map((key) => {
    const score = submission.scores[key as keyof typeof submission.scores] || 0;
    return {
      id: key,
      name: dimNames[key as keyof typeof dimNames],
      score: score,
      fullMark: 5,
      status: getDimensionStatus(score),
      description: getDimensionDescription(key, getDimensionStatus(score), indInsights?.dimensionDescriptions)
    };
  });

  const sortedDimensions = [...dimensions].sort((a, b) => b.score - a.score);
  // Rule: Skor > 3.0 masuk ke Kekuatan Utama, Skor <= 3.0 masuk ke Area Pengembangan
  const strongest = sortedDimensions.filter(d => d.score > 3.0);
  const weakest = [...dimensions].filter(d => d.score <= 3.0).sort((a, b) => a.score - b.score);

  const getLevelKey = (level: string) => {
    if (level.includes('Mature')) return 'mature';
    if (level.includes('Enabled')) return 'enabled';
    if (level.includes('Unready')) return 'unready';
    if (level.includes('Ready')) return 'ready';
    if (level.includes('Aware')) return 'aware';
    return 'unready';
  };
  const levelKey = getLevelKey(readinessLevel);
  const indRec = (translations[language] as any)?.individualRecommendations?.[levelKey];

  const effectiveStrongest = strongest.length > 0 ? strongest : sortedDimensions.slice(0, 3);
  const effectiveWeakest = weakest.length > 0 ? weakest : sortedDimensions.slice(-3).reverse();

  const fallbackSummary = getReadinessSummary(readinessLevel, effectiveStrongest, effectiveWeakest, overallScore);
  const fallbackActionPlan = getActionPlan(effectiveWeakest.map(w => w.id), readinessLevel);
  const fallbackReflectionPrompts = getReflectionPrompts(effectiveWeakest.map(w => w.id), effectiveStrongest.map(s => s.id));

  const profileTitle = indRec?.title || getReadinessProfileTitle(overallScore, readinessLevel);
  const executiveSummary = indRec?.desc || getLevelSummary(readinessLevel);

  const resultData = translations[language]?.result || {};
  const emailTarget = resultData.emailTarget || 'hai@nortis.ai';
  const whatsappNumber = (resultData.whatsappNumber || '6282337576338').replace(/[^0-9]/g, '') || '6282337576338';
  const emailSubject = `Konsultasi Program Nortis AI - ${submission.fullName || 'Individu'}`;
  const emailBody = language === 'EN'
    ? `Hello Nortis AI Team,\n\nI would like to consult regarding the AI Readiness Assessment results for myself (${submission.fullName || 'Professional'}, Level: ${readinessLevel}, Overall Score: ${overallScore.toFixed(2)}/5.00).\n\nEmail: ${submission.email || '-'}\nPhone: ${submission.phone || '-'}\nJob Title: ${submission.jobTitle || '-'}\n\nThank you.`
    : `Halo Tim Nortis AI,\n\nSaya ingin berkonsultasi mengenai hasil AI Readiness Assessment individu saya (${submission.fullName || 'Profesional'}, Level: ${readinessLevel}, Skor: ${overallScore.toFixed(2)}/5.00).\n\nEmail: ${submission.email || '-'}\nNo. HP: ${submission.phone || '-'}\nJabatan/Profesi: ${submission.jobTitle || '-'}\n\nTerima kasih.`;
  const emailGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTarget)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;

  const levelSpecificPrograms = resultData.individualNortisProgramsByLevel?.[levelKey] || resultData.nortisProgramsByLevel?.[levelKey];
  const nortisPrograms: any[] = Array.isArray(levelSpecificPrograms)
    ? levelSpecificPrograms
    : (Array.isArray(resultData.individualNortisPrograms) ? resultData.individualNortisPrograms : []);

  const whatsWorkingText = indRec?.whatsWorking || fallbackSummary.whatsWorking;
  const whatsAtRiskText = indRec?.whatsAtRisk || fallbackSummary.whatsAtRisk;
  const focusNextText = indRec?.focusNext || fallbackSummary.focusNext;

  const phase1ActionsList: string[] = (indRec?.phase1Actions && indRec.phase1Actions.length > 0)
    ? indRec.phase1Actions
    : fallbackActionPlan.sekarang;

  const phase2ActionsList: string[] = (indRec?.phase2Actions && indRec.phase2Actions.length > 0)
    ? indRec.phase2Actions
    : fallbackActionPlan.berikutnya;

  const phase3ActionsList: string[] = (indRec?.phase3Actions && indRec.phase3Actions.length > 0)
    ? indRec.phase3Actions
    : fallbackActionPlan.selanjutnya;

  const reflectionPromptsList: string[] = (indRec?.reflectionPrompts && indRec.reflectionPrompts.length > 0)
    ? indRec.reflectionPrompts
    : fallbackReflectionPrompts;

  const reflectionTipText = indRec?.reflectionTip || t('individualResult.reflectionTip') || 'Tip: Diskusikan pertanyaan ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.';

  const handleDownloadPDF = () => {
    exportToIndividualPDF(submission, (translations[language] as any)?.individualRecommendations);
  };

  const getIndustryLabel = (ind?: string) => {
    if (!ind) return '';
    const indForm = (translations[language] as any)?.individualForm?.industries;
    const orgForm = (translations[language] as any)?.form?.industries;
    const mapped = indForm?.[ind] || orgForm?.[ind] || ind;
    return mapped.charAt(0).toUpperCase() + mapped.slice(1);
  };

  const getScoreColor = (score: number) => {
    if (score >= 4.0) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 3.0) return 'text-blue-600 bg-blue-50 border-blue-200';
    if (score >= 2.0) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-rose-600 bg-rose-50 border-rose-200';
  };

  const getProgressBarColor = (score: number) => {
    if (score >= 4.0) return 'bg-emerald-500';
    if (score >= 3.0) return 'bg-blue-500';
    if (score >= 2.0) return 'bg-amber-500';
    return 'bg-rose-500';
  };

  const formattedDate = submission.timestamp 
    ? new Date(submission.timestamp).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })
    : new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <div className="w-full min-h-screen bg-slate-50/60 py-6 sm:py-8 px-4 sm:px-6 lg:px-8 text-slate-800">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Top Bar Navigation */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200/80">
          <div className="flex items-center gap-3">
            {onBack && (
              <button 
                onClick={onBack}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                {t('individualResult.back') || 'Kembali'}
              </button>
            )}
            <div className="h-4 w-px bg-slate-200 hidden sm:block"></div>
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              {t('individualResult.reportTitle') || 'Laporan Kesiapan AI Individu'}
            </span>
          </div>
        </div>

        {/* 1. Hero / Executive Snapshot Card */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left: Candidate Info & Dial */}
            <div className="lg:col-span-4 flex flex-col items-center text-center pb-6 lg:pb-0 lg:border-r lg:border-slate-100 lg:pr-8">
              {/* Circular Gauge */}
              <div className="relative w-36 h-36 mb-4 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                  <circle cx="50" cy="50" r="42" fill="none" stroke="#f1f5f9" strokeWidth="9" />
                  <circle 
                    cx="50" 
                    cy="50" 
                    r="42" 
                    fill="none" 
                    stroke="#10b981" 
                    strokeWidth="9" 
                    strokeLinecap="round" 
                    strokeDasharray="264" 
                    strokeDashoffset={264 - (264 * percentageScore) / 100} 
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    {overallScore.toFixed(2)}
                  </div>
                  <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    {t('individualResult.outOf') || 'dari 5.00'}
                  </div>
                </div>
              </div>

              {/* Status Level Badge */}
              <div className="inline-flex items-center px-3.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-2">
                {readinessLevel}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                {t('individualResult.maturityScore') || 'Skor Kematangan'}: <span className="font-bold text-slate-800">{percentageScore}%</span>
              </p>
            </div>

            {/* Right: Executive Details */}
            <div className="lg:col-span-8 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                    {submission.fullName || 'Profesional'}
                  </h1>
                  <p className="text-sm text-slate-500 font-medium mt-0.5">
                    {submission.jobTitle || 'Profesional'} {submission.companyName ? `· ${submission.companyName}` : ''}
                  </p>
                  {(submission.industry || submission.experienceYears) && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {submission.industry && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Building2 className="w-3 h-3 text-slate-400" />
                          {getIndustryLabel(submission.industry)}
                        </span>
                      )}
                      {submission.experienceYears && (
                        <span className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                          <Briefcase className="w-3 h-3 text-slate-400" />
                          {submission.experienceYears}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 font-medium self-start sm:self-auto bg-slate-50 px-2.5 py-1 rounded-md border border-slate-100">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>{formattedDate}</span>
                </div>
              </div>

              <div className="pt-2">
                <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5">
                  {t('individualResult.profilePrefix') || 'Profil: '}{profileTitle}
                </div>
                <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                  {executiveSummary}
                </p>
              </div>

              {/* Quick dimension tags */}
              <div className="pt-2 flex flex-wrap gap-2">
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
                  {t('individualResult.dimensionsEvaluated') || '6 Dimensi Dievaluasi'}
                </span>
                <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-100">
                  Top: {strongest[0]?.name || 'AI Literacy'} ({strongest[0]?.score.toFixed(1)})
                </span>
                <span className="text-[11px] font-medium text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-100">
                  Fokus: {weakest[0]?.name || 'Workflow'} ({weakest[0]?.score.toFixed(1)})
                </span>
              </div>
            </div>

          </div>
        </div>

        {/* 2. Three Focus Cards (What's Working, What's At Risk, Focus Next) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {/* What's Working */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-50 text-emerald-600">
                <CheckCircle2 className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('individualResult.whatsWorkingTitle') || "What's Working"}
              </h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed flex-1">
              {whatsWorkingText}
            </p>
          </div>

          {/* What's At Risk */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 sm:p-6 shadow-xs flex flex-col">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 rounded-lg bg-amber-50 text-amber-600">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                {t('individualResult.whatsAtRiskTitle') || "What's At Risk"}
              </h3>
            </div>
            <p className="text-slate-600 text-sm leading-relaxed flex-1">
              {whatsAtRiskText}
            </p>
          </div>

          {/* Focus Next */}
          <div className="bg-white rounded-2xl border border-emerald-200/80 bg-gradient-to-br from-white to-emerald-50/40 p-5 sm:p-6 shadow-xs flex flex-col">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="p-1.5 rounded-lg bg-emerald-100/80 text-emerald-700">
                <Compass className="w-4 h-4" />
              </div>
              <h3 className="text-xs font-bold text-emerald-900 uppercase tracking-wider">
                {t('individualResult.focusNextTitle') || 'Focus Next'}
              </h3>
            </div>
            <p className="text-slate-700 text-sm leading-relaxed flex-1 font-medium">
              {focusNextText}
            </p>
          </div>
        </div>

        {/* 3. Bento Grid: Radar Chart (Col 5) & 6 Dimensions Detail (Col 7) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* Left: Radar Chart */}
          <div className="lg:col-span-5 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-slate-900">{t('individualResult.radarTitle') || 'Radar Kesiapan AI'}</h3>
                <span className="text-[11px] font-semibold text-slate-400 uppercase">{t('individualResult.radarScale') || 'Skala 0–5'}</span>
              </div>
              <p className="text-xs text-slate-500">{t('individualResult.radarDesc') || 'Peta distribusi kematangan 6 dimensi kompetensi.'}</p>
            </div>

            <div className="w-full h-[320px] my-2">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="72%" data={dimensions}>
                  <PolarGrid stroke="#e2e8f0" strokeDasharray="3 3" />
                  <PolarAngleAxis 
                    dataKey="name" 
                    tick={{ fill: '#475569', fontSize: 11, fontWeight: 600 }} 
                  />
                  <PolarRadiusAxis angle={30} domain={[0, 5]} tick={{ fill: '#94a3b8', fontSize: 10 }} />
                  <Radar 
                    name="Skor Anda" 
                    dataKey="score" 
                    stroke="#10b981" 
                    strokeWidth={2}
                    fill="#10b981" 
                    fillOpacity={0.25} 
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-center gap-6 pt-3 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-emerald-500/80 border border-emerald-600"></span>
                <span>{t('individualResult.radarLegendScore') || 'Skor Hasil Asesmen'}</span>
              </div>
              <div className="text-slate-400">{t('individualResult.radarLegendIdeal') || 'Target Ideal: 5.00'}</div>
            </div>
          </div>

          {/* Right: 6 Dimension Breakdown */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex flex-col justify-between">
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <h3 className="text-base font-bold text-slate-900">{t('individualResult.dimensionsDetailTitle') || 'Rincian 6 Dimensi'}</h3>
                <span className="text-xs text-slate-400">{t('individualResult.dimensionsDetailBadge') || 'Diurutkan dari evaluasi lengkap'}</span>
              </div>
              <p className="text-xs text-slate-500">{t('individualResult.dimensionsDetailDesc') || 'Tingkat penguasaan pada masing-masing pilar kerja harian.'}</p>
            </div>

            <div className="space-y-3.5">
              {dimensions.map((dim) => {
                const scoreColorClass = getScoreColor(dim.score);
                const progressBarColor = getProgressBarColor(dim.score);
                const pct = Math.round((dim.score / 5) * 100);

                return (
                  <div key={dim.id} className="p-3 rounded-xl bg-slate-50/70 border border-slate-100 hover:border-slate-200 transition-colors">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-xs sm:text-sm font-semibold text-slate-800">
                        {dim.name}
                      </span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${scoreColorClass}`}>
                          {dim.status}
                        </span>
                        <span className="text-xs font-bold text-slate-900 w-10 text-right">
                          {dim.score.toFixed(1)}/5
                        </span>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="w-full bg-slate-200/70 h-1.5 rounded-full overflow-hidden mb-1.5">
                      <div 
                        className={`h-full rounded-full ${progressBarColor} transition-all duration-700`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>

                    <p className="text-[12px] text-slate-500 leading-snug line-clamp-1">
                      {dim.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* 4. Strengths & Growth Areas (Adaptive Full-Width Layout) */}
        <div className="space-y-6">
          
          {/* Kekuatan Utama */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t('individualResult.strengthsTitle') || 'Kekuatan Utama Anda'}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'EN' 
                      ? 'Key competency dimensions with high performance (score > 3.0).' 
                      : 'Dimensi kompetensi utama dengan pencapaian tinggi (skor di atas 3.0).'}
                  </p>
                </div>
              </div>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
                {strongest.length} {language === 'EN' ? 'Dimensions > 3.0' : 'Dimensi Unggul'}
              </span>
            </div>

            {strongest.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {strongest.map((str, idx) => (
                  <div key={str.id} className="p-4 rounded-xl bg-emerald-50/40 border border-emerald-100/80 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{str.name}</span>
                        </div>
                        <span className="text-xs font-bold text-emerald-700 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-200 shrink-0">
                          {str.score.toFixed(1)} / 5.0
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-7">
                        {getStrengthInsight(str.id, indRec?.strengthInsights, indInsights?.strengthInsights, getLevelKey(readinessLevel))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4.5 rounded-xl bg-slate-50 border border-dashed border-slate-200">
                <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-500 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-slate-800">
                    {language === 'EN' ? 'No dimensions currently above 3.0' : 'Belum ada dimensi dengan skor di atas 3.0'}
                  </h4>
                  <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                    {language === 'EN'
                      ? 'Focus on the prioritized growth areas below to build your foundational AI capabilities.'
                      : 'Fokus pada area prioritas pengembangan di bawah untuk membangun fondasi kemampuan AI Anda.'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Area Prioritas Pengembangan */}
          <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-7 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
                  <Target className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">{t('individualResult.growthAreasTitle') || 'Area Prioritas Pengembangan'}</h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {language === 'EN' 
                      ? 'Dimensions requiring focused learning and targeted practice (score ≤ 3.0).' 
                      : 'Dimensi yang memerlukan pendalaman dan latihan terfokus (skor 3.0 ke bawah).'}
                  </p>
                </div>
              </div>
              <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border self-start sm:self-auto ${
                weakest.length > 0 
                  ? 'bg-amber-50 text-amber-700 border-amber-200' 
                  : 'bg-emerald-50 text-emerald-700 border-emerald-200'
              }`}>
                {weakest.length > 0 
                  ? `${weakest.length} ${language === 'EN' ? 'Dimensions ≤ 3.0' : 'Dimensi Prioritas'}` 
                  : (language === 'EN' ? 'All Dimensions > 3.0' : 'Semua Optimal')}
              </span>
            </div>

            {weakest.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {weakest.map((wk, idx) => (
                  <div key={wk.id} className="p-4 rounded-xl bg-slate-50 border border-slate-200/70 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2.5">
                          <span className="w-5 h-5 rounded-full bg-slate-700 text-white text-[10px] font-bold flex items-center justify-center shrink-0">
                            {idx + 1}
                          </span>
                          <span className="text-sm font-bold text-slate-900">{wk.name}</span>
                        </div>
                        <span className="text-xs font-bold text-slate-700 bg-slate-200/70 px-2.5 py-0.5 rounded-full border border-slate-300 shrink-0">
                          {wk.score.toFixed(1)} / 5.0
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed pl-7">
                        {getGrowthInsight(wk.id, indRec?.growthInsights, indInsights?.growthInsights, getLevelKey(readinessLevel))}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex items-center gap-4 p-4.5 rounded-xl bg-gradient-to-r from-emerald-50/80 to-teal-50/60 border border-emerald-200/70">
                <div className="w-10 h-10 rounded-xl bg-[#009E4F] text-white flex items-center justify-center shrink-0 shadow-xs">
                  <Sparkles className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-[#0F172A]">
                    {language === 'EN' ? 'Optimal Performance Across All Dimensions' : 'Kinerja Optimal di Seluruh Dimensi'}
                  </h4>
                  <p className="text-xs text-[#475569] mt-0.5 leading-relaxed">
                    {language === 'EN'
                      ? 'Congratulations! All your AI competency dimensions have achieved an optimal score. Maintain your excellence and continue exploring advanced AI workflows.'
                      : 'Selamat! Seluruh dimensi kompetensi AI Anda telah mencapai tingkat optimal. Pertahankan keunggulan ini dan terus tingkatkan implementasi AI ke jenjang berikutnya.'}
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>

        {/* Fokus Strategis 90 Hari */}
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-2xl p-6 sm:p-7 shadow-xs relative overflow-hidden">
          <div className="flex items-start sm:items-center gap-3.5 mb-2">
            <div className="p-2 rounded-xl bg-emerald-800/80 text-emerald-300 border border-emerald-700/50">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[11px] font-bold text-emerald-400 uppercase tracking-wider block">
                {language === 'EN' ? '90-Day Strategic Priority' : 'Fokus Strategis 90 Hari'}
              </span>
              <h3 className="text-base sm:text-lg font-bold text-white">
                {readinessLevel} · {profileTitle}
              </h3>
            </div>
          </div>
          <p className="text-sm sm:text-base text-emerald-100/90 leading-relaxed mt-2 pl-0 sm:pl-12">
            {language === 'EN' ? get90DayFocusEN(readinessLevel) : get90DayFocus(readinessLevel)}
          </p>
        </div>

        {/* 5. Action Plan (3 Timeline Columns) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6 pb-4 border-b border-slate-100">
            <div>
              <h3 className="text-lg font-bold text-slate-900 tracking-tight">{t('individualResult.roadmapTitle') || 'Rencana Aksi & Roadmap Pengembangan'}</h3>
              <p className="text-xs text-slate-500 mt-0.5">{t('individualResult.roadmapDesc') || 'Panduan bertahap untuk meningkatkan kecakapan AI Anda dari taktis hingga kepemimpinan.'}</p>
            </div>
            <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200 self-start sm:self-auto">
              {t('individualResult.roadmapBadge') || '3 Fase Terstruktur'}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* SEKARANG */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 flex flex-col">
              <div className="mb-4 pb-3 border-b border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">Fase 1</span>
                  <h4 className="text-sm font-bold text-slate-900">{t('individualResult.phase1Title') || 'Sekarang'}</h4>
                </div>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded">
                  {t('individualResult.phase1Range') || '0–30 Hari'}
                </span>
              </div>
              <ul className="space-y-3 flex-1">
                {phase1ActionsList.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-emerald-600 mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* BERIKUTNYA */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 flex flex-col">
              <div className="mb-4 pb-3 border-b border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">Fase 2</span>
                  <h4 className="text-sm font-bold text-slate-900">{t('individualResult.phase2Title') || 'Berikutnya'}</h4>
                </div>
                <span className="text-xs font-bold text-blue-700 bg-blue-100/70 px-2 py-0.5 rounded">
                  {t('individualResult.phase2Range') || '1–3 Bulan'}
                </span>
              </div>
              <ul className="space-y-3 flex-1">
                {phase2ActionsList.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* SELANJUTNYA */}
            <div className="rounded-xl border border-slate-200/80 bg-slate-50/50 p-5 flex flex-col">
              <div className="mb-4 pb-3 border-b border-slate-200/70 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold tracking-wider uppercase text-slate-400 block">Fase 3</span>
                  <h4 className="text-sm font-bold text-slate-900">{t('individualResult.phase3Title') || 'Selanjutnya'}</h4>
                </div>
                <span className="text-xs font-bold text-purple-700 bg-purple-100/70 px-2 py-0.5 rounded">
                  {t('individualResult.phase3Range') || '3–12 Bulan'}
                </span>
              </div>
              <ul className="space-y-3 flex-1">
                {phase3ActionsList.map((action, i) => (
                  <li key={i} className="flex items-start gap-2 text-xs text-slate-600 leading-relaxed">
                    <Check className="w-3.5 h-3.5 text-purple-600 mt-0.5 flex-shrink-0" />
                    <span>{action}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 6. Pertanyaan Refleksi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 p-6 sm:p-8 shadow-xs">
          <div className="flex items-center gap-2.5 mb-4">
            <div className="p-1.5 rounded-lg bg-indigo-50 text-indigo-600">
              <HelpCircle className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900">{t('individualResult.reflectionTitle') || 'Pertanyaan Refleksi Profesional'}</h3>
              <p className="text-xs text-slate-400">{t('individualResult.reflectionSubtitle') || 'Bahan perenungan kritis untuk memperdalam kedewasaan berpikir AI'}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            {reflectionPromptsList.map((prompt, i) => (
              <div key={i} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/70 flex items-start gap-3">
                <span className="text-slate-400 text-lg font-serif select-none leading-none">“</span>
                <p className="text-xs sm:text-sm text-slate-700 leading-relaxed italic">
                  {prompt}
                </p>
              </div>
            ))}
          </div>

          <p className="text-slate-400 text-[11px] mt-4 text-center">
            {reflectionTipText}
          </p>
        </div>

        {/* Recommended Nortis Programs for Individuals (Only rendered if programs exist) */}
        {nortisPrograms.length > 0 && (
          <div className="bg-[#F0FDF4] rounded-2xl p-6 sm:p-8 border border-emerald-100 shadow-sm space-y-6 mb-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/60 pb-5">
              <div className="flex items-center gap-3.5">
                <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#009E4F] text-white flex items-center justify-center shrink-0 shadow-sm">
                  <Sparkles className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-bold text-[#0F172A] flex items-center gap-2">
                    {language === 'EN' ? 'Recommended Nortis AI Programs' : 'Program Nortis yang Direkomendasikan untuk Anda'}
                  </h3>
                  <p className="text-xs sm:text-[13px] text-[#475569] mt-0.5 max-w-3xl leading-relaxed">
                    {language === 'EN' 
                      ? 'Accelerate your professional AI readiness with personalized training and mentorship programs from Nortis AI.' 
                      : 'Akselerasikan kesiapan dan keterampilan AI profesional Anda dengan program pelatihan dan pendampingan terstruktur dari Nortis AI.'}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
              {nortisPrograms.map((prog: any, idx: number) => {
                const isCustomLink = Boolean(prog.ctaLink && prog.ctaLink.trim() !== '');
                const targetUrl = isCustomLink
                  ? prog.ctaLink.trim()
                  : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                      language === 'EN'
                        ? `Hello Nortis AI Team, I am interested in learning more about the "${prog.title}" program for myself (${submission.fullName || 'Professional'}, Level: ${readinessLevel}).`
                        : `Halo Tim Nortis AI, saya berminat mempelajari lebih lanjut mengenai program "${prog.title}" (${submission.fullName || 'Profesional'}, Level: ${readinessLevel}).`
                    )}`;
                const isMailto = targetUrl.toLowerCase().startsWith('mailto:');
                const isExternal = !isMailto;
                const hasBadge = !!(prog.badge && prog.badge.trim() !== '') || prog.isHighestPriority === true;
                const badgeText = prog.badge && prog.badge.trim() !== ''
                  ? prog.badge
                  : (language === 'EN' ? '⭐ RECOMMENDED' : '⭐ DIREKOMENDASIKAN');

                const iconType = prog.iconType || (idx === 0 ? 'zap' : idx === 1 ? 'training' : 'chart');
                const iconBg = prog.iconBg || (idx === 0 ? 'bg-[#FF6A00]' : idx === 1 ? 'bg-[#2563EB]' : 'bg-[#009E4F]');

                return (
                  <div
                    key={prog.id || idx}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                  >
                    {hasBadge && (
                      <div className="bg-[#009E4F] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider py-1.5 px-4 text-center">
                        {badgeText}
                      </div>
                    )}
                    <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                      <div>
                        <div className="flex items-start gap-3">
                          <div className={`w-10 h-10 rounded-xl ${iconBg} text-white flex items-center justify-center shrink-0 font-bold shadow-xs`}>
                            {iconType === 'zap' ? (
                              <Zap className="w-5 h-5 text-white fill-white/20" />
                            ) : iconType === 'training' ? (
                              <GraduationCap className="w-5 h-5 text-white" />
                            ) : iconType === 'chart' ? (
                              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <rect x="3" y="10" width="4.5" height="11" rx="1.5" fill="#86EFAC" />
                                <rect x="9.5" y="4" width="4.5" height="17" rx="1.5" fill="#F472B6" />
                                <rect x="16" y="8" width="4.5" height="13" rx="1.5" fill="#93C5FD" />
                              </svg>
                            ) : (
                              <Compass className="w-5 h-5 text-white" />
                            )}
                          </div>
                          <div className="min-w-0 flex-1">
                            <h4 className="text-[15px] sm:text-base font-bold text-slate-900 leading-snug">
                              {prog.title}
                            </h4>
                            {prog.subtitle && (
                              <p className="text-[12px] text-slate-500 italic mt-0.5">
                                {prog.subtitle}
                              </p>
                            )}
                          </div>
                        </div>
                        <p className="text-slate-600 text-[13px] leading-relaxed mt-4">
                          {prog.desc}
                        </p>
                      </div>
                      <a
                        href={targetUrl}
                        target={isExternal ? '_blank' : undefined}
                        rel={isExternal ? 'noopener noreferrer' : undefined}
                        className="w-full mt-6 py-2.5 px-4 bg-[#00A854] hover:bg-[#009048] text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                      >
                        <span>{prog.ctaText || (language === 'EN' ? 'Learn More' : 'Pelajari Lebih Lanjut')}</span>
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Direct Contact Section (Email & WhatsApp) - Always Visible whether programs exist or not */}
        <div className="bg-[#F0FDF4] rounded-2xl p-6 sm:p-7 border border-emerald-100 shadow-sm mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-5">
          <div className="flex items-start sm:items-center gap-3.5">
            <div className="w-10 h-10 rounded-xl bg-emerald-100/80 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-200/60">
              <MessageCircle className="w-5 h-5" />
            </div>
            <p className="text-[13.5px] text-[#334155] font-medium leading-relaxed max-w-2xl">
              {language === 'EN'
                ? 'Want to discuss the best program for your professional AI development? Contact our team for a personalized consultation.'
                : 'Ingin mendiskusikan program terbaik untuk pengembangan profesional AI Anda? Hubungi tim kami untuk konsultasi yang dipersonalisasi.'}
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 sm:shrink-0">
            <a
              href={emailGmailUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-slate-700 border border-slate-200 rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <Mail className="w-4 h-4 text-slate-500" />
              <span>{t('result.emailUs') || (language === 'EN' ? 'Send Email' : 'Kirim Email')}</span>
            </a>
            <a
              href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                language === 'EN'
                  ? `Hello Nortis AI Team, I would like to consult about the best program for my AI readiness (${submission.fullName || 'Professional'}, Level: ${readinessLevel}).`
                  : `Halo Tim Nortis AI, saya ingin berkonsultasi mengenai program pengembangan AI yang tepat untuk saya (${submission.fullName || 'Profesional'}, Level: ${readinessLevel}).`
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00A854] hover:bg-[#009048] active:bg-[#007D3E] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t('result.whatsapp') || (language === 'EN' ? 'Chat on WhatsApp' : 'Hubungi via WhatsApp')}</span>
            </a>
          </div>
        </div>

        {/* 7. Action Bottom Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6 mb-12">
           <div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">{t('result.downloadReport') || 'Ekspor Hasil'}</h3>
              <div className="flex flex-wrap gap-2">
                  <button 
                    onClick={() => submission && exportToIndividualPDF(submission, indRec, language, translations[language])} 
                    className="flex items-center gap-2 px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow"
                  >
                     <FileText className="w-4 h-4" /> {t('result.downloadPdf') || 'Ekspor PDF'}
                  </button>
               </div>
           </div>
           {onBack && (
             <button 
               onClick={onBack} 
               className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-[#475569] rounded-lg text-[13px] font-medium transition-colors sm:ml-auto whitespace-nowrap cursor-pointer"
             >
                <RefreshCw className="w-4 h-4" /> {t('result.startNewAssessment') || 'Mulai Assessment Baru'}
             </button>
           )}
        </div>

      </div>
    </div>
  );
}

