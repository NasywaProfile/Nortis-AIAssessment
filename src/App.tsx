import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { LandingPage } from './components/LandingPage';
import { AssessmentForm } from './components/AssessmentForm';
import { AssessmentQuestions } from './components/AssessmentQuestions';
import { AssessmentResult } from './components/AssessmentResult';
import { AdminLogin } from './components/AdminLogin';
import { AdminDashboard } from './components/AdminDashboard';
import { CMSDashboard } from './components/cms/CMSDashboard';
import { LanguageProvider } from './contexts/LanguageContext';
import { FormData, AssessmentSubmission } from './types';

function App() {
  const [currentView, setCurrentView] = useState<'landing' | 'form' | 'questions' | 'result' | 'admin-login' | 'admin-dashboard' | 'cms-dashboard'>('landing');
  const [assessmentType, setAssessmentType] = useState<'organization' | 'individual'>('organization');
  const [formData, setFormData] = useState<FormData | null>(null);
  const [submissionId, setSubmissionId] = useState<string | null>(null);
  const [activeSubmission, setActiveSubmission] = useState<AssessmentSubmission | null>(null);

  // Helper to clear URL hash without triggering unwanted hashchange loops
  const clearHash = () => {
    if (window.location.hash) {
      if (window.history.pushState) {
        window.history.pushState("", document.title, window.location.pathname + window.location.search);
      } else {
        window.location.hash = '';
      }
    }
  };

  const goToLanding = () => {
    clearHash();
    setActiveSubmission(null);
    setCurrentView('landing');
  };

  // Handle routing based on URL hash
  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      if (hash === 'admin') {
        setCurrentView('admin-login');
      } else if (hash.startsWith('result/')) {
        setSubmissionId(hash.replace('result/', ''));
        setCurrentView('result');
      } else if (hash === 'cms') {
        setCurrentView('cms-dashboard');
      } else {
        setCurrentView('landing');
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    handleHashChange(); // Initial check

    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleStart = (type: 'organization' | 'individual') => {
    setAssessmentType(type);
    setCurrentView('form');
  };

  const handleFormSubmit = (data: FormData) => {
    setFormData(data);
    setCurrentView('questions');
  };

  const handleComplete = (id: string, submission?: AssessmentSubmission) => {
    setSubmissionId(id);
    if (submission) {
      setActiveSubmission(submission);
    }
    setCurrentView('result');
    window.location.hash = `result/${id}`;
  };

  return (
    <LanguageProvider>
      <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
        <Header 
          onGoHome={goToLanding}
          onAdminLogin={() => { window.location.hash = 'admin'; }} 
        />
        
        <main className="flex-1 w-full">
          {currentView === 'landing' && <LandingPage onStart={handleStart} />}
          {currentView === 'form' && <AssessmentForm assessmentType={assessmentType} onBack={goToLanding} onSubmit={handleFormSubmit} />}
          {currentView === 'questions' && formData && (
            <AssessmentQuestions 
              assessmentType={assessmentType} 
              formData={formData} 
              onBack={() => setCurrentView('form')}
              onComplete={handleComplete}
            />
          )}
          {currentView === 'result' && submissionId && (
            <AssessmentResult 
              submissionId={submissionId}
              initialSubmission={activeSubmission}
              onBack={goToLanding} 
            />
          )}
          {currentView === 'admin-login' && <AdminLogin onBack={goToLanding} onSuccess={() => setCurrentView('admin-dashboard')} />}
          {currentView === 'admin-dashboard' && <AdminDashboard onLogout={goToLanding} onOpenCMS={() => setCurrentView('cms-dashboard')} />}
          {currentView === 'cms-dashboard' && <CMSDashboard onBack={() => setCurrentView('admin-dashboard')} />}
        </main>
      </div>
    </LanguageProvider>
  );
}

export default App;
