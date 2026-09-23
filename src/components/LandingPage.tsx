import React from 'react';
import { ArrowRight, CheckCircle2, Clock, Building2, UserCheck } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

interface LandingPageProps {
  onStart: (type: 'organization' | 'individual') => void;
}

export function LandingPage({ onStart }: LandingPageProps) {
  const { t, language } = useLanguage();
  
  const benefits: string[] = t('landing.benefits') as any as string[];

  const orgBtnLabel = t('landing.startOrgAssessment') !== 'landing.startOrgAssessment' && t('landing.startOrgAssessment')
    ? t('landing.startOrgAssessment')
    : (language === 'EN' ? 'Organizational AI Readiness Assessment' : 'Asesmen Kesiapan AI Organisasi');

  const indBtnLabel = t('landing.startIndAssessment') !== 'landing.startIndAssessment' && t('landing.startIndAssessment')
    ? t('landing.startIndAssessment')
    : (language === 'EN' ? 'Individual AI Readiness Assessment' : 'Asesmen Kesiapan AI Individu');

  return (
    <div className="flex flex-col items-center py-16 px-6 w-full max-w-[1400px] mx-auto min-h-[calc(100vh-6rem)] justify-center">
      {/* Header section */}
      <div className="text-center mb-10 w-full flex flex-col items-center">
        <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-5 tracking-tight">
          {t('landing.title')}
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed mb-6 max-w-2xl mx-auto">
          {t('landing.subtitle')}
        </p>
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-700 font-medium text-xs md:text-sm">
          <Clock className="w-4 h-4" />
          <span>{t('landing.duration')}</span>
        </div>
      </div>

      {/* Top CTA */}
      <div className="flex flex-col sm:flex-row gap-4 mb-14 w-full sm:w-auto px-4 justify-center">
        <button 
          onClick={() => onStart('organization')}
          className="group flex items-center justify-center gap-2 px-8 py-3 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800 shadow-md shadow-emerald-900/10 transition-all active:scale-[0.98] text-sm"
        >
          <span>{orgBtnLabel}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
        <button 
          onClick={() => onStart('individual')}
          className="group flex items-center justify-center gap-2 px-8 py-3 bg-white text-emerald-700 border border-emerald-700 font-semibold rounded-full hover:bg-emerald-50 shadow-md transition-all active:scale-[0.98] text-sm"
        >
          <span>{indBtnLabel}</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      {/* Main Info Card */}
      <div className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6 md:p-10 border border-slate-100 w-full mb-12">
        <p className="text-slate-600 mb-8 leading-relaxed text-sm md:text-base text-center max-w-3xl mx-auto font-normal">
          {t('landing.description')}
        </p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Card 1: Apa yang Anda Dapatkan */}
          <div className="bg-slate-50/80 rounded-2xl p-6 border border-slate-200/80 flex flex-col justify-between hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('landing.whatYouGet')}
                  </h3>
                  <p className="text-[11px] text-emerald-800 font-medium">Output & Benefit Utama</p>
                </div>
              </div>
              <ul className="space-y-3">
                {benefits.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-slate-700">
                    <span className="text-emerald-600 font-bold text-sm mt-0.5">✓</span>
                    <span className="text-xs md:text-sm font-medium leading-snug">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Card 2: 5 Pilar Organisasi */}
          <div className="bg-emerald-50/40 rounded-2xl p-6 border border-emerald-100/80 flex flex-col justify-between hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-emerald-700 text-white flex items-center justify-center shrink-0 shadow-sm shadow-emerald-700/20">
                  <Building2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('landing.pillarsTitle') || '5 Pilar Organisasi'}
                  </h3>
                  <p className="text-[11px] text-emerald-800 font-medium">Kesiapan AI Tingkat Organisasi</p>
                </div>
              </div>
              <ul className="space-y-3">
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-purple-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.pillars.strategy')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.pillars.process')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.pillars.people')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.pillars.data')}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.pillars.governance')}</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Card 3: 6 Dimensi Individu */}
          <div className="bg-blue-50/40 rounded-2xl p-6 border border-blue-100/80 flex flex-col justify-between hover:shadow-sm transition-all">
            <div>
              <div className="flex items-center gap-3 mb-5">
                <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-sm shadow-blue-600/20">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {t('landing.indPillarsTitle') || '6 Dimensi Individu'}
                  </h3>
                  <p className="text-[11px] text-blue-800 font-medium">Kompetensi AI Talenta Profesional</p>
                </div>
              </div>
              <ul className="space-y-2.5">
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-indigo-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.indPillars.aiLiteracy') || 'AI Literacy & Mindset'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-cyan-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.indPillars.taskFraming') || 'Task Framing & Prompting'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-teal-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.indPillars.workflow') || 'Workflow & Integration'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-orange-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.indPillars.evaluation') || 'Evaluation & Human Judgment'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-rose-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.indPillars.responsibleAi') || 'Responsible AI & Risk'}</span>
                </li>
                <li className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
                  <span className="text-slate-700 font-medium text-xs md:text-sm">{t('landing.indPillars.collaboration') || 'Collaboration & AI Growth'}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="w-full bg-emerald-800 rounded-3xl p-10 md:p-12 text-center shadow-lg shadow-emerald-900/10 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-700/50 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4" />
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-900/50 rounded-full blur-3xl translate-y-1/2 -translate-x-1/4" />
        
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold text-white mb-4">
            {t('landing.readyToMeasure')}
          </h2>
          <p className="text-emerald-100/90 mb-8 max-w-lg mx-auto text-sm md:text-base">
            {t('landing.readyDesc')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 justify-center">
            <button 
              onClick={() => onStart('organization')}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-400 text-amber-950 font-semibold rounded-full hover:bg-amber-500 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] text-sm"
            >
              <span>{orgBtnLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => onStart('individual')}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-amber-400 font-semibold rounded-full hover:bg-amber-400/10 shadow-md transition-all active:scale-[0.98] text-sm"
            >
              <span>{indBtnLabel}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
