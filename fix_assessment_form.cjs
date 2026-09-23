const fs = require('fs');
let content = fs.readFileSync('src/components/AssessmentForm.tsx', 'utf8');

// Update props
content = content.replace(
  "interface AssessmentFormProps {\n  initialData?: FormData;\n  onBack: () => void;\n  onSubmit: (data: FormData) => void;\n}",
  "interface AssessmentFormProps {\n  assessmentType: 'organization' | 'individual';\n  initialData?: FormData;\n  onBack: () => void;\n  onSubmit: (data: FormData) => void;\n}"
);

// Update component signature
content = content.replace(
  "export function AssessmentForm({ initialData, onBack, onSubmit }: AssessmentFormProps) {",
  "export function AssessmentForm({ assessmentType, initialData, onBack, onSubmit }: AssessmentFormProps) {"
);

// We need to inject new state defaults
const stateDefault = `const [formData, setFormData] = useState<FormData>(initialData || {
    assessmentType: assessmentType,
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
    phone: '',
    experienceYears: '',
    aiUsageFrequency: '',
    aiToolsUsed: '',
  });`;
content = content.replace(/const \[formData, setFormData\] = useState<FormData>\(initialData \|\| \{[^}]+\}\);/, stateDefault);

// Now conditional rendering of sections.
// Section 1: Data Instansi / Data Profesional
// Section 2: Kondisi Eksisting AI (only for org?) No, wait, the prompt says:
// 3. DATA DIRI ASESMEN INDIVIDU
// Gunakan field berikut:
// - Nama Lengkap
// - Email
// - Nomor WhatsApp
// - Jabatan / Profesi
// - Nama Perusahaan / Organisasi (opsional)
// - Industri / Bidang Pekerjaan
// - Lama Pengalaman Kerja
// - Seberapa sering menggunakan AI
// - Tools AI yang biasa digunakan

const renderForm = `        <form onSubmit={handleSubmit} className="space-y-8">
          
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
                  <h2 className="text-lg font-bold text-slate-900">Data Pribadi & Profil Profesional</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  <FormInput 
                    id="fullName" 
                    label="Nama Lengkap"
                    required 
                    placeholder="Masukkan nama lengkap Anda"
                    value={formData.fullName} onChange={handleChange}
                  />
                  <FormInput 
                    id="email" 
                    type="email"
                    label="Email"
                    required 
                    placeholder="Masukkan alamat email Anda"
                    value={formData.email} onChange={handleChange}
                  />
                  <FormInput 
                    id="phone" 
                    type="tel"
                    label="Nomor WhatsApp"
                    required 
                    placeholder="Contoh: 08123456789"
                    value={formData.phone} onChange={handleChange}
                  />
                  <FormInput 
                    id="jobTitle" 
                    label="Jabatan / Profesi"
                    required 
                    placeholder="Contoh: Data Analyst, Freelancer, Mahasiswa"
                    value={formData.jobTitle} onChange={handleChange}
                  />
                  <FormInput 
                    id="companyName" 
                    label="Nama Perusahaan / Organisasi (Opsional)"
                    placeholder="Kosongkan jika tidak ada"
                    value={formData.companyName} onChange={handleChange}
                  />
                  <FormSelect 
                    id="industry" 
                    label="Industri / Bidang Pekerjaan"
                    required 
                    placeholder="Pilih industri"
                    options={Object.entries(translations[language].form.industries || {}).map(([k, v]) => ({ label: v as string, value: k }))}
                    value={formData.industry} onChange={handleChange}
                  />
                  <FormInput 
                    id="experienceYears" 
                    label="Lama Pengalaman Kerja"
                    required 
                    placeholder="Contoh: 3 tahun, Belum bekerja"
                    value={formData.experienceYears || ''} onChange={handleChange}
                  />
                  <FormSelect 
                    id="aiUsageFrequency" 
                    label="Seberapa sering Anda menggunakan AI?"
                    required 
                    placeholder="Pilih frekuensi penggunaan AI"
                    options={[
                      { label: 'Belum pernah', value: 'Belum pernah' },
                      { label: 'Jarang', value: 'Jarang' },
                      { label: 'Beberapa kali dalam sebulan', value: 'Beberapa kali dalam sebulan' },
                      { label: 'Beberapa kali dalam seminggu', value: 'Beberapa kali dalam seminggu' },
                      { label: 'Setiap hari', value: 'Setiap hari' }
                    ]}
                    value={formData.aiUsageFrequency || ''} onChange={handleChange}
                  />
                  <FormTextarea 
                    id="aiToolsUsed" 
                    label="Tools AI yang biasa digunakan"
                    placeholder="Contoh: ChatGPT, Claude, Midjourney, dll. (Kosongkan jika belum pernah)"
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
              <span>{t('form.back')}</span>
            </button>
            <button 
              type="submit" 
              className="group flex items-center justify-center gap-2 w-full md:w-auto px-6 py-2.5 text-sm bg-amber-400 text-amber-950 font-bold rounded-full hover:bg-amber-500 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98]"
            >
              <span>{t('form.next')}</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>
        </form>`;

content = content.replace(/<form onSubmit=\{handleSubmit\} className="space-y-8">[\s\S]*?<\/form>/, renderForm);

fs.writeFileSync('src/components/AssessmentForm.tsx', content);
