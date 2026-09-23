import React, { useState, useEffect } from 'react';
import { ArrowLeft, ArrowRight, CheckCircle2 } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

import { FormData, AssessmentSubmission } from '../types';
import { apiService } from '../services/api';

interface AssessmentQuestionsProps {
  assessmentType: 'organization' | 'individual';
  formData: FormData;
  onBack: () => void;
  onComplete: (id: string, submission?: AssessmentSubmission) => void;
}

export function AssessmentQuestions({ assessmentType, onBack, onComplete, formData }: AssessmentQuestionsProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentStep]);
  const { t, language, translations } = useLanguage();

      const isIndividual = assessmentType === 'individual';
  const indQuestionsData = translations[language].individualQuestionsData || {};
  const rawAssessmentData = isIndividual ? (translations[language].individualAssessmentData || []) : (translations[language].assessmentData || []);
  const rawQuestionsData = isIndividual ? translations[language].individualQuestions : translations[language].questions;
  
  // Normalize assessment data so it always has questions array
  const assessmentData = (Array.isArray(rawAssessmentData) ? rawAssessmentData : []).map(cat => {
    let qs = cat.questions;
    if (!qs && rawQuestionsData) {
      qs = rawQuestionsData[cat.id];
    }
    return {
      ...cat,
      questions: qs || []
    };
  });
  
  const currentCategory = assessmentData[currentStep];
  
  const scale = rawQuestionsData?.scale || t('questions.scale');
  const scoringScale = scale as any as { score?: number, value?: number, label: string }[];
  const normalizedScale = (scoringScale || []).map((s: any) => ({ score: s.score !== undefined ? s.score : s.value, label: s.label }));

  const pillar = currentCategory || null;

  if (!pillar || !pillar.questions) {
    return (
      <div className="w-full flex flex-col items-center pt-24 pb-24 text-center">
        <h2 className="text-2xl font-bold text-red-500 mb-4">Error: Assessment Data Missing</h2>
        <p className="text-slate-600 mb-8">Data pilar atau pertanyaan tidak ditemukan. Silakan reset pengaturan CMS.</p>
        <button onClick={onBack} className="px-6 py-2 bg-slate-200 rounded-full font-semibold">Kembali</button>
      </div>
    );
  }

  const handleSelectScore = (questionId: string, score: number) => {
    setAnswers(prev => ({ ...prev, [questionId]: score }));
  };

  const handleNext = () => {
    if (currentStep < assessmentData.length - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    } else {
      
      // Calculate scores dynamically
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
      let readinessDesc = 'AI Literacy + Awareness';
      if (overallScore > 1.5 && overallScore <= 2.5) {
        readinessLevel = 'AI-Aware';
        readinessDesc = 'Readiness Program';
      } else if (overallScore > 2.5 && overallScore <= 3.5) {
        readinessLevel = 'AI-Ready';
        readinessDesc = 'Implementation Pilot';
      } else if (overallScore > 3.5 && overallScore <= 4.5) {
        readinessLevel = 'AI-Enabled';
        readinessDesc = 'Scaling & Retainer';
      } else if (overallScore > 4.5) {
        readinessLevel = 'AI-Mature';
        readinessDesc = 'Strategic Advisory';
      }

      const submission: AssessmentSubmission = {
        id: Math.random().toString(36).substring(2, 9),
        timestamp: new Date().toISOString(),
        assessmentType: assessmentType,
        ...formData,
        overallScore,
        scores: calculatedScores,
        readinessLevel,
        readinessDescription: readinessDesc,
        answers
      };

      apiService.saveSubmission(submission).then((savedId) => {
        onComplete(savedId || submission.id, submission);
      }).catch(() => {
        onComplete(submission.id, submission);
      });
    }
  };

  const handlePrev = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    } else {
      onBack();
    }
  };

  const isCurrentPillarComplete = pillar.questions.every(q => answers[q.id] !== undefined);

  // Progress logic
  const totalQuestions = assessmentData.reduce((acc, curr) => acc + (curr.questions?.length || 0), 0) || 1;
  const answeredQuestions = Object.keys(answers).length;
  const progressPercentage = Math.round((answeredQuestions / totalQuestions) * 100);

  return (
    <div className="w-full flex flex-col items-center pb-24">
      {/* Header Info */}
      <div className="w-full pt-12 pb-6 flex flex-col items-center px-4">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3 tracking-tight">
          {isIndividual ? (indQuestionsData.title || t('questions.title')) : t('questions.title')}
        </h1>
        <p className="text-slate-600 text-sm text-center max-w-2xl mb-8">
          {isIndividual ? (indQuestionsData.subtitle || t('questions.subtitle')) : t('questions.subtitle')}
        </p>

        
        
        {/* Progress Bar & Steps */}
        <div className="max-w-5xl w-full bg-white rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-100 p-6 md:p-8">
          <div className="flex justify-between text-sm font-medium text-slate-500 mb-2">
            <span>{isIndividual ? (indQuestionsData.progress || t('questions.progress')) : t('questions.progress')}</span>
            <span className="text-slate-900">{progressPercentage}%</span>
          </div>
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden mb-6">
            <div 
              className="h-full bg-emerald-500 transition-all duration-500 ease-out rounded-full" 
              style={{ width: `${progressPercentage}%` }} 
            />
          </div>
          <div className="flex justify-between px-2">
            {assessmentData.map((stepData, index) => {
              const isActive = index === currentStep;
              const isPast = index < currentStep;
              return (
                <div key={index} className="flex flex-col items-center gap-2">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-colors ${
                    isActive ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30' 
                    : isPast ? 'bg-emerald-100 text-emerald-700' 
                    : 'bg-slate-100 text-slate-400'
                  }`}>
                    {isPast ? <CheckCircle2 className="w-5 h-5" /> : (index + 1)}
                  </div>
                  <span className={`text-xs md:text-sm font-medium hidden md:block ${isActive ? 'text-slate-900' : 'text-slate-500'}`}>
                    {stepData.shortTitle}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="w-full max-w-[1400px] mx-auto px-4 md:px-6 pt-10">
        
        <div className="bg-white rounded-3xl shadow-2xl shadow-slate-200/60 border border-slate-100 p-6 md:p-10 mb-8">
          {/* Pillar Header & Scale Reference */}
          <div className="mb-10">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-700 font-medium text-xs mb-4 border border-emerald-100">
              {isIndividual 
                ? (indQuestionsData.dimensionIndicators?.[currentStep] || `Dimensi ${currentStep + 1} dari 6`)
                : (translations[language].questions.pillarIndicators?.[currentStep] || `Pillar ${currentStep + 1} of 5`)}
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-slate-900 mb-3">
              {pillar.title}
            </h2>
            <p className="text-slate-600 text-sm mb-8">
              {pillar.description}
            </p>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
              <h3 className="font-semibold text-slate-800 mb-4 text-sm">
                {isIndividual ? (indQuestionsData.scaleTitle || t('questions.scaleTitle')) : t('questions.scaleTitle')}
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-y-4 gap-x-6">
                {normalizedScale.map((scale: any) => (
                  <div key={scale.score} className="flex items-center gap-3">
                    <span className="text-emerald-600 font-bold text-base">{scale.score}</span>
                    <span className="text-sm text-slate-600 font-medium">{scale.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Questions */}
          <div className="space-y-6">
            {pillar.questions.map((q) => (
              <div key={q.id} className="rounded-2xl border border-slate-200 p-6">
                <h4 className="text-sm md:text-base font-semibold text-slate-900 mb-6">
                  {q.id}. {q.text}
                </h4>
                
                <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                  {normalizedScale.map((scale: any) => {
                    const isSelected = answers[q.id] === scale.score;
                    return (
                      <button
                        key={scale.score}
                        onClick={() => handleSelectScore(q.id, scale.score)}
                        className={`flex flex-col items-center justify-center gap-1.5 p-3 md:p-4 rounded-xl border transition-all ${
                          isSelected 
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm border-2' 
                            : 'border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:bg-slate-50'
                        }`}
                      >
                        <span className="text-base md:text-lg font-bold">{scale.score}</span>
                        <span className="text-[9px] md:text-[10px] font-medium text-center leading-tight">
                          {scale.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          {/* Form Actions */}
          <div className="mt-12 pt-8 border-t border-slate-100 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
            <button 
              type="button"
              onClick={handlePrev}
              className="group flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 text-slate-900 bg-slate-300 hover:bg-slate-400 transition-colors font-semibold text-sm rounded-full"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{isIndividual ? (indQuestionsData.prev || t('questions.prev')) : t('questions.prev')}</span>
            </button>
            
            <button 
              type="button" 
              onClick={handleNext}
              disabled={!isCurrentPillarComplete}
              className={`group flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 text-sm font-bold rounded-full transition-all ${
                isCurrentPillarComplete
                  ? 'bg-amber-400 text-amber-950 hover:bg-amber-500 shadow-md shadow-amber-500/20 active:scale-[0.98]'
                  : 'bg-slate-300 text-slate-500 cursor-not-allowed shadow-none'
              }`}
            >
              <span>{currentStep === assessmentData.length - 1 
                ? (isIndividual ? (indQuestionsData.finish || t('questions.finish')) : t('questions.finish'))
                : (isIndividual ? (indQuestionsData.next || t('questions.next')) : t('questions.next'))}
              </span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
