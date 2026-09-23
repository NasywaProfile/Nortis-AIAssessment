import React from 'react';
import { Building2, Target, User, ArrowRight, ArrowLeft } from 'lucide-react';
import { FormInput, FormSelect, FormTextarea } from './FormFields';
import { useLanguage } from '../contexts/LanguageContext';

import { FormData } from '../types';

interface AssessmentFormProps {
  assessmentType: 'organization' | 'individual';
  initialData?: FormData;
  onBack: () => void;
  onSubmit: (data: FormData) => void;
}

export function AssessmentForm({ assessmentType, initialData, onBack, onSubmit }: AssessmentFormProps) {
  const [formData, setFormData] = React.useState<FormData>(initialData || {
    companyName: '',
    industry: '',
    companySize: '',
    location: '',
    aiGoal: '',
    aiUseCase: '',
    aiTools: '',
    aiCurrentUse: '',
    aiFrequentUse: '',
    aiLearningNeed: '',
    aiMasteryTarget: '',
    timeline: '',
    fullName: '',
    jobTitle: '',
    email: '',
    phone: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };
  const { t, language, translations } = useLanguage();
  const indForm = translations[language].individualForm || {};

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <>
      {/* Hero Section with Colored Background */}
      <div className="w-full bg-gradient-to-br from-emerald-950 via-emerald-900 to-emerald-950 pt-16 pb-40 px-6 relative overflow-hidden text-center">
        {/* Decorative Background Elements */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-amber-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-emerald-500/20 rounded-full blur-3xl translate-y-1/3 -translate-x-1/4" />
        
        <div className="max-w-4xl mx-auto relative z-10 flex flex-col items-center">
          <h1 className="text-3xl md:text-4xl font-bold text-white mb-5 tracking-tight">
            {assessmentType === 'organization' ? t('form.title') : (indForm.title || t('form.title'))}
          </h1>
          <p className="text-emerald-50/90 text-sm max-w-2xl leading-relaxed">
            {assessmentType === 'organization' ? t('form.subtitle') : (indForm.subtitle || t('form.subtitle'))}
          </p>
        </div>
      </div>

      <main className="max-w-[1400px] mx-auto px-4 md:px-6 -mt-24 relative z-20 pb-24">
                <form onSubmit={handleSubmit} className="space-y-8">
          
          {assessmentType === 'organization' ? (
            <>
              {/* Section 1: Data Instansi */}
              <section className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6 md:p-10 border border-slate-100">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{t('form.companyData')}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <FormInput 
                    id="companyName" 
                    label={t('form.companyName')}
                    required 
                    placeholder={t('form.companyNamePlaceholder')}
                    value={formData.companyName} onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <FormSelect 
                    id="industry" 
                    label={t('form.industry')}
                    required 
                    placeholder={t('form.industryPlaceholder')}
                    options={Object.entries(translations[language].form.industries || {}).map(([k, v]) => ({ label: v as string, value: k }))}
                    value={formData.industry} onChange={handleChange}
                  />
                  <FormSelect 
                    id="companySize" 
                    label={t('form.companySize')}
                    required 
                    placeholder={t('form.companySizePlaceholder')}
                    options={Object.entries(translations[language].form.companySizes || {}).map(([k, v]) => ({ label: v as string, value: v as string }))}
                    value={formData.companySize} onChange={handleChange}
                  />
                  <FormInput 
                    id="location" 
                    label={t('form.location')}
                    placeholder={t('form.locationPlaceholder')}
                    value={formData.location} onChange={handleChange}
                    className="md:col-span-2"
                  />
                </div>
              </section>

              {/* Section 2: Kondisi Eksisting AI */}
              <section className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6 md:p-10 border border-slate-100">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                    <Target className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{t('form.aiNeeds')}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <FormTextarea 
                    id="aiGoal" 
                    label={t('form.aiGoal')}
                    placeholder={t('form.aiGoalPlaceholder')}
                    value={formData.aiGoal} onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <FormTextarea 
                    id="aiUseCase" 
                    label={t('form.aiUseCase')}
                    placeholder={t('form.aiUseCasePlaceholder')}
                    value={formData.aiUseCase} onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <FormTextarea 
                    id="aiTools" 
                    label={t('form.aiTools')}
                    placeholder={t('form.aiToolsPlaceholder')}
                    value={formData.aiTools} onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <FormTextarea 
                    id="aiCurrentUse" 
                    label={t('form.aiCurrentUse')}
                    placeholder={t('form.aiCurrentUsePlaceholder')}
                    value={formData.aiCurrentUse} onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <FormTextarea 
                    id="aiFrequentUse" 
                    label={t('form.aiFrequentUse')}
                    placeholder={t('form.aiFrequentUsePlaceholder')}
                    value={formData.aiFrequentUse} onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <FormTextarea 
                    id="aiLearningNeed" 
                    label={t('form.aiLearningNeed')}
                    placeholder={t('form.aiLearningNeedPlaceholder')}
                    value={formData.aiLearningNeed} onChange={handleChange}
                    className="md:col-span-2"
                  />
                  <FormTextarea 
                    id="aiMasteryTarget" 
                    label={t('form.aiMasteryTarget')}
                    placeholder={t('form.aiMasteryTargetPlaceholder')}
                    value={formData.aiMasteryTarget} onChange={handleChange}
                    className="md:col-span-2"
                  />
                  
                  <div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                    <FormSelect 
                      id="timeline" 
                      label={t('form.timeline')}
                      placeholder={t('form.timelinePlaceholder')}
                      options={Object.entries(translations[language].form.timelines || {}).map(([k, v]) => ({ label: v as string, value: v as string }))}
                      value={formData.timeline} onChange={handleChange}
                      className="md:col-span-1"
                    />
                  </div>
                </div>
              </section>

              {/* Section 3: Data Pribadi */}
              <section className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6 md:p-10 border border-slate-100">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{t('form.personalContact')}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <FormInput 
                    id="fullName" 
                    label={t('form.fullName')}
                    required 
                    placeholder={t('form.fullNamePlaceholder')}
                    value={formData.fullName} onChange={handleChange}
                  />
                  <FormInput 
                    id="jobTitle" 
                    label={t('form.jobTitle')}
                    required 
                    placeholder={t('form.jobTitlePlaceholder')}
                    value={formData.jobTitle} onChange={handleChange}
                  />
                  <FormInput 
                    id="email" 
                    type="email"
                    label={t('form.email')}
                    required 
                    placeholder={t('form.emailPlaceholder')}
                    value={formData.email} onChange={handleChange}
                  />
                  <FormInput 
                    id="phone" 
                    type="tel"
                    label={t('form.phone')}
                    required 
                    placeholder={t('form.phonePlaceholder')}
                    value={formData.phone} onChange={handleChange}
                  />
                </div>
              </section>
            </>
          ) : (
            <>
              {/* Individual Form Fields */}
              <section className="bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.05)] p-6 md:p-10 border border-slate-100">
                <div className="flex items-center gap-4 mb-8 pb-4 border-b border-slate-100">
                  <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700">
                    <User className="w-5 h-5" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900">{indForm.personalData || 'Data Pribadi & Profil Profesional'}</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <FormInput 
                    id="fullName" 
                    label={indForm.fullName || 'Nama Lengkap'}
                    required 
                    placeholder={indForm.fullNamePlaceholder || 'Masukkan nama lengkap Anda'}
                    value={formData.fullName} onChange={handleChange}
                  />
                  <FormInput 
                    id="email" 
                    type="email"
                    label={indForm.email || 'Email'}
                    required 
                    placeholder={indForm.emailPlaceholder || 'Masukkan alamat email Anda'}
                    value={formData.email} onChange={handleChange}
                  />
                  <FormInput 
                    id="phone" 
                    type="tel"
                    label={indForm.phone || 'Nomor WhatsApp'}
                    required 
                    placeholder={indForm.phonePlaceholder || 'Contoh: 08123456789'}
                    value={formData.phone} onChange={handleChange}
                  />
                  <FormInput 
                    id="jobTitle" 
                    label={indForm.jobTitle || 'Jabatan / Profesi'}
                    required 
                    placeholder={indForm.jobTitlePlaceholder || 'Contoh: Data Analyst, Freelancer, Mahasiswa'}
                    value={formData.jobTitle} onChange={handleChange}
                  />
                  <FormInput 
                    id="companyName" 
                    label={indForm.companyName || 'Nama Perusahaan / Organisasi (Opsional)'}
                    placeholder={indForm.companyNamePlaceholder || 'Kosongkan jika tidak ada'}
                    value={formData.companyName} onChange={handleChange}
                  />
                  <FormSelect 
                    id="industry" 
                    label={indForm.industry || 'Industri / Bidang Pekerjaan'}
                    required 
                    placeholder={indForm.industryPlaceholder || 'Pilih industri'}
                    options={Object.entries(indForm.industries || translations[language].form.industries || {}).map(([k, v]) => ({ label: v as string, value: k }))}
                    value={formData.industry} onChange={handleChange}
                  />
                  <FormInput 
                    id="experienceYears" 
                    label={indForm.experienceYears || 'Lama Pengalaman Kerja'}
                    required 
                    placeholder={indForm.experienceYearsPlaceholder || 'Contoh: 3 tahun, Belum bekerja'}
                    value={formData.experienceYears || ''} onChange={handleChange}
                  />
                  <FormSelect 
                    id="aiUsageFrequency" 
                    label={indForm.aiUsageFrequency || 'Seberapa sering Anda menggunakan AI?'}
                    required 
                    placeholder={indForm.aiUsageFrequencyPlaceholder || 'Pilih frekuensi penggunaan AI'}
                    options={(indForm.aiUsageFrequencies || [
                      'Belum pernah',
                      'Jarang',
                      'Beberapa kali dalam sebulan',
                      'Beberapa kali dalam seminggu',
                      'Setiap hari'
                    ]).map((freq: string) => ({ label: freq, value: freq }))}
                    value={formData.aiUsageFrequency || ''} onChange={handleChange}
                  />
                  <FormTextarea 
                    id="aiToolsUsed" 
                    label={indForm.aiToolsUsed || 'Tools AI yang biasa digunakan'}
                    placeholder={indForm.aiToolsUsedPlaceholder || 'Contoh: ChatGPT, Claude, Midjourney, dll. (Kosongkan jika belum pernah)'}
                    value={formData.aiToolsUsed || ''} onChange={handleChange}
                    className="md:col-span-2"
                  />
                </div>
              </section>
            </>
          )}

          {/* Form Actions */}
          <div className="pt-2 pb-12 flex flex-col-reverse md:flex-row items-center justify-between gap-6">
            <button 
              type="button"
              onClick={onBack}
              className="group flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 text-slate-900 bg-slate-300 hover:bg-slate-400 transition-colors font-semibold text-sm rounded-full"
            >
              <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
              <span>{assessmentType === 'organization' ? t('form.back') : (indForm.back || t('form.back'))}</span>
            </button>
            <button 
              type="submit" 
              className="group flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 text-sm bg-amber-400 text-amber-950 font-bold rounded-full hover:bg-amber-500 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <span>{assessmentType === 'organization' ? t('form.next') : (indForm.next || t('form.next'))}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>
      </main>
    </>
  );
}
