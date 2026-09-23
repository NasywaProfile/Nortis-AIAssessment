import React, { useEffect, useState } from 'react';
import {
  TrendingUp,
  AlertTriangle,
  RefreshCw,
  FileText,
  Lock as LockIcon,
  MessageCircle,
  CheckCircle2,
  Users,
  Mail,
  Clock,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Zap,
  GraduationCap,
  Compass
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import { IndividualAssessmentResult } from './IndividualAssessmentResult';
import { AssessmentSubmission } from '../types';
import { apiService } from '../services/api';
import { ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { exportToPDF } from '../utils/pdfExport';
import { getRecommendation, getRecommendationKey } from '../utils/recommendations';

interface AssessmentResultProps {
  submissionId: string;
  initialSubmission?: AssessmentSubmission | null;
  onBack: () => void;
}

export function AssessmentResult({ onBack, submissionId, initialSubmission }: AssessmentResultProps) {
  const [submission, setSubmission] = useState<AssessmentSubmission | null>(initialSubmission || null);
  const [loading, setLoading] = useState<boolean>(!initialSubmission);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (initialSubmission) {
      setSubmission(initialSubmission);
      setLoading(false);
      return;
    }
    if (submissionId) {
      setLoading(true);
      apiService.getSubmissionById(submissionId).then((data) => {
        if (data) {
          setSubmission(data);
        } else {
          const existingStr = localStorage.getItem('nortis_assessment_submissions') || localStorage.getItem('nortis_submissions');
          if (existingStr) {
            const existing: AssessmentSubmission[] = JSON.parse(existingStr);
            const found = existing.find(s => s.id === submissionId);
            if (found) setSubmission(found);
            else setError('Assessment tidak ditemukan.');
          } else {
            setError('Assessment tidak ditemukan.');
          }
        }
        setLoading(false);
      }).catch(err => {
        console.error("Error loading assessment:", err);
        setError('Gagal memuat data assessment.');
        setLoading(false);
      });
    }
  }, [submissionId, initialSubmission]);

  const { t, language, translations, images } = useLanguage();

  if (loading) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
        <p className="text-slate-500 text-sm">{t('result.analyzing')}</p>
      </div>
    );
  }

  if (error || !submission) {
    return (
      <div className="min-h-screen bg-[#F1F5F9] flex flex-col items-center justify-center p-4">
        <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200 max-w-md w-full">
          <AlertTriangle className="w-12 h-12 text-rose-500 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-slate-800 mb-2">{t('result.error')}</h2>
          <p className="text-slate-500 text-sm mb-6">{error || 'Data tidak ditemukan'}</p>
          <button 
            onClick={onBack}
            className="px-5 py-2.5 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors text-sm font-medium"
          >
            {t('common.back')}
          </button>
        </div>
      </div>
    );
  }

  if (submission.assessmentType === 'individual') {
    return <IndividualAssessmentResult submission={submission} onBack={onBack} />;
  }

  const overallScore = submission.overallScore || 0;
  const scores = submission.scores || { strategi: 0, proses: 0, sdm: 0, data: 0, tataKelola: 0 };
  
  const pillarData = [
    { title: translations[language]?.assessmentData?.[0]?.shortTitle || 'Strategi & Kepemimpinan', score: scores.strategi },
    { title: translations[language]?.assessmentData?.[1]?.shortTitle || 'Proses & Alur Kerja', score: scores.proses },
    { title: translations[language]?.assessmentData?.[2]?.shortTitle || 'SDM & Kapabilitas', score: scores.sdm },
    { title: translations[language]?.assessmentData?.[3]?.shortTitle || 'Data & Teknologi', score: scores.data },
    { title: translations[language]?.assessmentData?.[4]?.shortTitle || 'Tata Kelola & AI Bertanggung Jawab', score: scores.tataKelola }
  ];

  const getPillarColor = (title: string) => {
    const titleUpper = title.toUpperCase();
    if (titleUpper.includes('STRATEG')) return 'bg-[#A855F7]'; // Purple
    if (titleUpper.includes('PROSES') || titleUpper.includes('WORKFLOW')) return 'bg-[#10B981]'; // Emerald
    if (titleUpper.includes('SDM') || titleUpper.includes('PEOPLE')) return 'bg-[#3B82F6]'; // Blue
    if (titleUpper.includes('DATA')) return 'bg-[#F97316]'; // Orange
    return 'bg-[#EF4444]'; // Red
  };

  const radarData = [
    { subject: 'Strategy', A: scores.strategi || 0, fullMark: 5 },
    { subject: 'Process', A: scores.proses || 0, fullMark: 5 },
    { subject: 'People', A: scores.sdm || 0, fullMark: 5 },
    { subject: 'Data & Tech', A: scores.data || 0, fullMark: 5 },
    { subject: 'Governance', A: scores.tataKelola || 0, fullMark: 5 },
  ];

  const getLevelKey = (level?: string, score?: number): 'mature' | 'enabled' | 'ready' | 'aware' | 'unready' => {
    if (level) {
      const l = level.toLowerCase();
      if (l.includes('mature')) return 'mature';
      if (l.includes('enabled')) return 'enabled';
      if (l.includes('ready') && !l.includes('unready')) return 'ready';
      if (l.includes('aware')) return 'aware';
      if (l.includes('unready')) return 'unready';
    }
    if (score !== undefined) {
      if (score > 4.5) return 'mature';
      if (score > 3.5) return 'enabled';
      if (score > 2.5) return 'ready';
      if (score > 1.5) return 'aware';
    }
    return 'unready';
  };

  const levelKey = getLevelKey(submission.readinessLevel, overallScore);
  const recs = (translations[language] as any)?.recommendations || {};
  const defaultRec = recs[levelKey] || getRecommendation(overallScore, recs);
  const recTitle = defaultRec.title;
  const recDesc = defaultRec.desc;
  const recShort = defaultRec.shortDesc;
  const recExecutiveSummary = defaultRec.executiveSummary || defaultRec.desc || '';

  const resultData = translations[language]?.result || {};
  const levelSpecificPrograms = resultData.nortisProgramsByLevel?.[levelKey];
  const nortisPrograms: any[] = Array.isArray(levelSpecificPrograms)
    ? levelSpecificPrograms
    : (Array.isArray(resultData.nortisPrograms) ? resultData.nortisPrograms : []);

  const emailTarget = resultData.emailTarget || 'hai@nortis.ai';
  const emailSubject = resultData.emailSubject || `Konsultasi AI Readiness Assessment - ${submission.companyName || 'Organisasi'}`;
  const whatsappNumber = (resultData.whatsappNumber || '6282337576338').replace(/[^0-9]/g, '') || '6282337576338';
  const defaultWaMsg = language === 'EN'
    ? `Hello Nortis AI Team, I would like to consult about our organization AI Readiness Assessment results for ${submission.companyName || 'our company'} (Score: ${overallScore.toFixed(2)} - ${submission.readinessLevel}).`
    : `Halo Tim Nortis AI, saya ingin berkonsultasi mengenai hasil AI Readiness Assessment ${submission.companyName ? 'untuk ' + submission.companyName : 'organisasi kami'} (Skor: ${overallScore.toFixed(2)} - ${submission.readinessLevel}).`;
  const whatsappMessage = resultData.whatsappMessage || defaultWaMsg;

  const emailBodyRaw = language === 'EN'
    ? `Hello Nortis AI Team,\n\nI would like to consult regarding the AI Readiness Assessment results for ${submission.companyName || 'our company'}.\nOverall Score: ${overallScore.toFixed(2)} / 5.00 (${submission.readinessLevel})\n\nPIC Name: ${submission.picName || '-'}\nEmail: ${submission.email || '-'}\nPhone: ${submission.phone || '-'}\n\nThank you.`
    : `Halo Tim Nortis AI,\n\nSaya ingin berkonsultasi mengenai hasil AI Readiness Assessment ${submission.companyName ? 'untuk ' + submission.companyName : 'organisasi kami'}.\nSkor Keseluruhan: ${overallScore.toFixed(2)} / 5.00 (${submission.readinessLevel})\n\nNama PIC: ${submission.picName || '-'}\nEmail: ${submission.email || '-'}\nNo. HP: ${submission.phone || '-'}\n\nTerima kasih.`;
  const emailGmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(emailTarget)}&su=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBodyRaw)}`;
  const whatsappHref = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div className="min-h-screen bg-[#F1F5F9] py-8 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="mb-8 text-center relative">
          <h1 className="text-xl md:text-2xl font-bold text-slate-900 mb-2 tracking-tight">{t('result.title')}</h1>
          <p className="text-slate-500 text-sm font-medium">{t('result.subtitle')}</p>
        </div>

        {/* Hero Score Card */}
        <div className="bg-white rounded-2xl p-6 sm:p-10 mb-8 border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex-1 w-full">
            <div className="flex items-center gap-2 text-slate-500 mb-3 font-semibold text-xs uppercase tracking-wider">
              <TrendingUp className="w-4 h-4" />
              <span>{t('result.scoreLabel')}</span>
            </div>
            <div className="text-[64px] font-bold text-slate-900 leading-none mb-4 tracking-tighter">
              {overallScore.toFixed(2)} <span className="text-xl text-slate-400 font-medium ml-1">{t('result.outOf')}</span>
            </div>
            <div className="inline-block px-4 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-sm font-bold mb-4 border border-emerald-100">
              {submission.readinessLevel}
            </div>
            <p className="text-slate-600 text-sm max-w-md leading-relaxed">
               {recShort}
            </p>
          </div>

          <div className="md:w-[450px] w-full bg-slate-50 rounded-xl p-6 border border-slate-100">
             <div className="flex items-center justify-between mb-2">
               <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{t('result.recommendationLabel')}</p>
             </div>
             <h4 className="text-lg font-bold text-slate-900 mb-3">{recTitle}</h4>
             <p className="text-slate-600 text-sm leading-relaxed">
               {recDesc}
             </p>
          </div>
        </div>

        {/* Top Mini Pillar Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          {pillarData.map((pillar, idx) => (
             <div key={idx} className="bg-white rounded-xl p-5 shadow-sm border border-slate-200 flex flex-col justify-between h-[120px]">
                <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider leading-tight line-clamp-2" title={pillar.title}>{pillar.title}</p>
                <div>
                  <p className="text-2xl font-bold text-slate-900 mb-1.5 leading-none">{pillar.score.toFixed(2)}</p>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 mb-1.5 overflow-hidden">
                    <div className={`h-full rounded-full ${getPillarColor(pillar.title)}`} style={{ width: `${(pillar.score/5)*100}%` }}></div>
                  </div>
                </div>
             </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           {/* Radar Chart ({t('result.readinessProfile')}) */}
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col items-center">
              <h3 className="text-base font-bold text-[#0F172A] self-start mb-2">{t('result.readinessProfile')}</h3>
              <div className="w-full h-[260px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                    <PolarGrid stroke="#e2e8f0" />
                    <PolarAngleAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 10 }} />
                    <PolarRadiusAxis angle={90} domain={[0, 5]} tick={false} axisLine={false} />
                    <Radar name="Your Score" dataKey="A" stroke="#60A5FA" fill="#93C5FD" fillOpacity={0.6} />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-2">
                <div className="w-3 h-3 bg-[#3B82F6] rounded-sm"></div>
                <span>{t('result.yourScore')}</span>
              </div>
           </div>

           {/* Bar Charts ({t('result.scoreDetails')}) */}
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col justify-center">
              <h3 className="text-base font-bold text-[#0F172A] mb-6">{t('result.scoreDetails')}</h3>
              <div className="space-y-6 w-full">
                {pillarData.map((pillar, idx) => {
                   return (
                      <div key={idx}>
                        <div className="flex justify-between items-end mb-1.5">
                          <span className="text-[12px] font-medium text-[#334155]">{pillar.title}</span>
                          <span className="text-[12px] font-bold text-[#0F172A]">{pillar.score.toFixed(2)}</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                           <div className={`h-full rounded-full ${getPillarColor(pillar.title)}`} style={{ width: `${(pillar.score/5)*100}%` }}></div>
                        </div>
                      </div>
                   );
                })}
              </div>
           </div>
        </div>

        {/* Ringkasan Eksekutif */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 mb-6">
           <h3 className="text-base font-bold text-[#0F172A] mb-3">{t('result.executiveSummary')}</h3>
           <p className="text-[14px] text-[#475569] leading-relaxed">
             {recExecutiveSummary}
           </p>
        </div>

        {/* {t('result.mainRisk')} & {t('result.quickWins')} */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                 <AlertTriangle className="w-4 h-4 text-rose-500" />
                 <h3 className="text-base font-bold text-[#0F172A]">{t('result.mainRisk')}</h3>
              </div>
              <ul className="space-y-3.5">
                 {(defaultRec.risikoUtama || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2.5 text-[13px] text-[#475569] leading-relaxed"><span className="text-rose-500 mt-0.5 shrink-0 text-lg leading-none">•</span> {item}</li>
                 ))}
              </ul>
           </div>
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                 <TrendingUp className="w-4 h-4 text-[#10B981]" />
                 <h3 className="text-base font-bold text-[#0F172A]">{t('result.quickWins')}</h3>
              </div>
              <ul className="space-y-3.5">
                 {(defaultRec.quickWins || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2.5 text-[13px] text-[#475569] leading-relaxed"><span className="text-[#10B981] mt-0.5 shrink-0 text-lg leading-none">•</span> {item}</li>
                 ))}
              </ul>
           </div>
        </div>
        
        {/* Hambatan & Rekomendasi 90 Hari */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                 <LockIcon className="w-4 h-4 text-[#F97316]" />
                 <h3 className="text-base font-bold text-[#0F172A]">{t('result.orgBarriers')}</h3>
              </div>
              <ul className="space-y-3.5">
                 {(defaultRec.hambatan || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2.5 text-[13px] text-[#475569] leading-relaxed"><span className="text-[#F97316] mt-0.5 shrink-0 text-lg leading-none">•</span> {item}</li>
                 ))}
              </ul>
           </div>
           <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200">
              <div className="flex items-center gap-2 mb-4">
                 <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
                 <h3 className="text-base font-bold text-[#0F172A]">{t('result.priorityRec')}</h3>
              </div>
              <div className="space-y-3">
                 {/* Fase 1 */}
                 <div className="border-l-2 border-emerald-500 pl-3 py-0.5">
                    <span className="inline-block text-[10.5px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded mb-1">
                       {t('result.phase1Tag') || (language === 'EN' ? 'Phase 1: Immediate (0 - 30 Days)' : 'Fase 1: Sekarang (0 - 30 Hari)')}
                    </span>
                    <ul className="space-y-1">
                       {((defaultRec.actionPlanPhase1 && defaultRec.actionPlanPhase1.length > 0)
                          ? defaultRec.actionPlanPhase1
                          : (defaultRec.rekomendasiPrioritas && defaultRec.rekomendasiPrioritas[0] ? [defaultRec.rekomendasiPrioritas[0]] : [])
                       ).map((item: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-[13px] text-[#475569] leading-relaxed">
                             <span className="text-emerald-600 font-bold shrink-0 mt-0.5">•</span>
                             <span>{item}</span>
                          </li>
                       ))}
                    </ul>
                 </div>

                 {/* Fase 2 */}
                 <div className="border-l-2 border-blue-500 pl-3 py-0.5">
                    <span className="inline-block text-[10.5px] font-bold text-blue-800 bg-blue-50 border border-blue-200/80 px-2 py-0.5 rounded mb-1">
                       {t('result.phase2Tag') || (language === 'EN' ? 'Phase 2: Mid-Term (1 - 3 Months)' : 'Fase 2: Berikutnya (1 - 3 Bulan)')}
                    </span>
                    <ul className="space-y-1">
                       {((defaultRec.actionPlanPhase2 && defaultRec.actionPlanPhase2.length > 0)
                          ? defaultRec.actionPlanPhase2
                          : (defaultRec.rekomendasiPrioritas && defaultRec.rekomendasiPrioritas[1] ? [defaultRec.rekomendasiPrioritas[1]] : [])
                       ).map((item: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-[13px] text-[#475569] leading-relaxed">
                             <span className="text-blue-600 font-bold shrink-0 mt-0.5">•</span>
                             <span>{item}</span>
                          </li>
                       ))}
                    </ul>
                 </div>

                 {/* Fase 3 */}
                 <div className="border-l-2 border-purple-500 pl-3 py-0.5">
                    <span className="inline-block text-[10.5px] font-bold text-purple-800 bg-purple-50 border border-purple-200/80 px-2 py-0.5 rounded mb-1">
                       {t('result.phase3Tag') || (language === 'EN' ? 'Phase 3: Long-Term (3 - 12 Months)' : 'Fase 3: Selanjutnya (3 - 12 Bulan)')}
                    </span>
                    <ul className="space-y-1">
                       {((defaultRec.actionPlanPhase3 && defaultRec.actionPlanPhase3.length > 0)
                          ? defaultRec.actionPlanPhase3
                          : (defaultRec.rekomendasiPrioritas && defaultRec.rekomendasiPrioritas[2] ? [defaultRec.rekomendasiPrioritas[2]] : [])
                       ).map((item: string, idx: number) => (
                          <li key={idx} className="flex gap-2 text-[13px] text-[#475569] leading-relaxed">
                             <span className="text-purple-600 font-bold shrink-0 mt-0.5">•</span>
                             <span>{item}</span>
                          </li>
                       ))}
                    </ul>
                 </div>
              </div>
           </div>
        </div>

        {/* Area Fokus Berdasarkan Pilar */}
        <div className="bg-[#F0FDF4] rounded-2xl p-6 sm:p-8 mb-6 border border-emerald-100">
            <h3 className="text-lg font-bold text-[#0F172A] mb-6">{t('result.focusArea')}</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {radarData.map((data, idx) => {
                    const score = data.A;
                    const isStrong = score >= 3.0;
                    return (
                        <div key={idx} className="bg-white rounded-xl p-5 border border-slate-100 relative overflow-hidden shadow-sm">
                            <div className={`absolute left-0 top-0 bottom-0 w-1 ${isStrong ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                            <div className="flex items-center gap-2 mb-2">
                                <div className={`w-2.5 h-2.5 rounded-full ${isStrong ? 'bg-emerald-500' : 'bg-rose-500'}`}></div>
                                <h4 className="text-[14px] font-bold text-[#0F172A]">{data.subject}</h4>
                            </div>
                            <p className="text-[11px] text-[#64748B] mb-2">Score: {score.toFixed(2)} · {isStrong ? (t('result.strongFoundation') || 'Fondasi Kuat') : (t('result.needsAttention') || 'Perlu Perhatian Segera')}</p>
                            <p className="text-[12px] text-[#475569]">
                                {isStrong 
                                    ? (t('result.strongFoundationDesc') || 'Manfaatkan kekuatan ini untuk mendorong inisiatif AI dan mendukung area lainnya.') 
                                    : (t('result.needsAttentionDesc') || 'Area ini memerlukan investasi prioritas dan inisiatif perbaikan yang terfokus.')}
                            </p>
                        </div>
                    );
                })}
            </div>
        </div>

        {/* Nortis Recommended Programs Section (Only rendered if programs exist) */}
        {nortisPrograms.length > 0 && (
          <div className="bg-[#F0FDF4] rounded-2xl p-6 sm:p-8 mb-6 border border-emerald-100 shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-emerald-200/60 pb-5">
                <div className="flex items-center gap-3.5">
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl bg-[#009E4F] text-white flex items-center justify-center shrink-0 shadow-sm">
                        <Sparkles className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-lg font-bold text-[#0F172A] flex items-center gap-2">
                            {t('result.recommendedProgram')}
                        </h3>
                        <p className="text-[13px] text-[#475569] mt-0.5 max-w-3xl leading-relaxed">
                            {t('result.recommendedProgramDesc')}
                        </p>
                    </div>
                </div>
            </div>

            {/* Dynamic Program Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 items-stretch">
                    {nortisPrograms.map((prog: any, idx: number) => {
                        const isCustomLink = Boolean(prog.ctaLink && prog.ctaLink.trim() !== '');
                        const targetUrl = isCustomLink
                            ? prog.ctaLink.trim()
                            : `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(
                                language === 'EN'
                                    ? `Hello Nortis AI Team, I am interested in learning more about the "${prog.title}" program for ${submission.companyName || 'our company'}.`
                                    : `Halo Tim Nortis AI, saya berminat mempelajari lebih lanjut mengenai program "${prog.title}" untuk ${submission.companyName ? submission.companyName : 'organisasi kami'}.`
                              )}`;
                        const isMailto = targetUrl.toLowerCase().startsWith('mailto:');
                        const isExternal = !isMailto;
                        const hasBadge = !!(prog.badge && prog.badge.trim() !== '') || prog.isHighestPriority === true;
                        const badgeText = prog.badge && prog.badge.trim() !== '' 
                            ? prog.badge 
                            : (language === 'EN' ? '⭐ HIGHEST PRIORITY' : '⭐ PRIORITAS TERTINGGI');

                        // Icon resolution
                        const iconType = prog.iconType || (idx === 0 ? 'chart' : idx === 1 ? 'zap' : 'training');
                        const iconBg = prog.iconBg || (idx === 0 ? 'bg-[#009E4F]' : idx === 1 ? 'bg-[#FF6A00]' : 'bg-[#2563EB]');

                        return (
                            <div 
                                key={prog.id || idx} 
                                className="bg-white rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-all flex flex-col justify-between overflow-hidden group"
                            >
                                {/* Top Badge / Ribbon */}
                                {hasBadge && (
                                    <div className="bg-[#009E4F] text-white text-[11px] sm:text-xs font-black uppercase tracking-wider py-1.5 px-4 text-center flex items-center justify-center gap-1.5 shadow-xs">
                                        <span>{badgeText}</span>
                                    </div>
                                )}

                                {/* Main Card Content */}
                                <div className="p-5 sm:p-6 flex flex-col justify-between flex-1">
                                    <div>
                                        {/* Header Row: Icon + Title & Subtitle */}
                                        <div className="flex items-start gap-3.5">
                                            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center text-white shrink-0 shadow-xs`}>
                                                {iconType === 'chart' ? (
                                                    <svg className="w-6 h-6" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <rect x="3" y="10" width="4.5" height="11" rx="1.5" fill="#86EFAC" />
                                                        <rect x="9.5" y="4" width="4.5" height="17" rx="1.5" fill="#F472B6" />
                                                        <rect x="16" y="8" width="4.5" height="13" rx="1.5" fill="#93C5FD" />
                                                    </svg>
                                                ) : iconType === 'zap' ? (
                                                    <Zap className="w-6 h-6 text-white fill-white/20" />
                                                ) : iconType === 'training' ? (
                                                    <GraduationCap className="w-6 h-6 text-white" />
                                                ) : (
                                                    <Sparkles className="w-6 h-6 text-white" />
                                                )}
                                            </div>

                                            <div className="min-w-0 flex-1">
                                                <h4 className="text-[15px] sm:text-base font-bold text-slate-900 leading-snug">
                                                    {prog.title}
                                                </h4>
                                                {prog.subtitle && (
                                                    <p className="text-[12px] sm:text-[12.5px] text-slate-500 italic mt-0.5 leading-tight">
                                                        {prog.subtitle}
                                                    </p>
                                                )}
                                            </div>
                                        </div>

                                        {/* Description */}
                                        <p className="text-slate-600 text-[13px] sm:text-[13.5px] leading-relaxed mt-4 font-normal">
                                            {prog.desc}
                                        </p>
                                    </div>

                                    {/* CTA Button */}
                                    <a
                                        href={targetUrl}
                                        target={isExternal ? '_blank' : undefined}
                                        rel={isExternal ? 'noopener noreferrer' : undefined}
                                        className="w-full mt-6 py-3 px-4 bg-[#00A854] hover:bg-[#009048] active:bg-[#007D3E] text-white rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 shadow-xs cursor-pointer"
                                    >
                                        <span>{prog.ctaText || (language === 'EN' ? 'Learn More' : 'Pelajari Lebih Lanjut')}</span>
                                        <ExternalLink className="w-4 h-4" />
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
                    {t('result.discussProgram') || (language === 'EN' ? 'Want to discuss the best program for your organization? Contact our team for a personalized consultation.' : 'Ingin mendiskusikan program terbaik untuk organisasi Anda? Hubungi tim kami untuk konsultasi yang dipersonalisasi.')}
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
                    href={whatsappHref}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2.5 bg-[#00A854] hover:bg-[#009048] active:bg-[#007D3E] text-white rounded-xl text-xs font-bold transition-all shadow-xs cursor-pointer"
                >
                    <MessageCircle className="w-4 h-4" />
                    <span>{t('result.whatsapp') || (language === 'EN' ? 'Chat on WhatsApp' : 'Hubungi via WhatsApp')}</span>
                </a>
            </div>
        </div>

        {/* Action Bottom Bar */}
        <div className="bg-white rounded-xl p-6 shadow-sm border border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-6">
           <div>
              <h3 className="text-base font-bold text-[#0F172A] mb-3">{t('result.downloadReport')}</h3>
              <div className="flex gap-2">
                  <button onClick={() => submission && exportToPDF(submission, translations[language]?.recommendations, language, translations[language])} className="flex items-center gap-2 px-5 py-2.5 bg-[#E11D48] hover:bg-[#BE123C] text-white rounded-lg text-sm font-semibold transition-all cursor-pointer shadow-sm hover:shadow">
                     <FileText className="w-4 h-4" /> {t('result.downloadPdf')}
                  </button>
               </div>
           </div>
           <button onClick={onBack} className="flex items-center gap-1.5 px-5 py-2.5 bg-white border border-slate-200 hover:bg-slate-50 text-[#475569] rounded-lg text-[13px] font-medium transition-colors sm:ml-auto whitespace-nowrap">
              <RefreshCw className="w-4 h-4" /> {t('result.startNewAssessment') || 'Mulai Assessment Baru'}
           </button>
        </div>
      </div>
    </div>
  );
}
