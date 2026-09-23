import React from 'react';
import { 
  X, 
  Building2, 
  Target, 
  Users, 
  BarChart3, 
  Calendar, 
  User, 
  ExternalLink, 
  Mail, 
  MessageCircle, 
  Printer, 
  Trash2 
} from 'lucide-react';
import { AssessmentSubmission } from '../types';
import { useLanguage } from '../contexts/LanguageContext';

interface SubmissionDetailModalProps {
  submission: AssessmentSubmission;
  onClose: () => void;
  onDelete?: (id: string, name: string) => void;
}

export function SubmissionDetailModal({ submission, onClose, onDelete }: SubmissionDetailModalProps) {
  const { t, language, translations } = useLanguage();
  const isIndividual = submission.assessmentType === 'individual';

  const cleanPhone = submission.phone ? submission.phone.replace(/[^0-9]/g, '') : '';
  const waNumber = cleanPhone.startsWith('0') ? '62' + cleanPhone.slice(1) : cleanPhone;

  const getLabel = (category: string, value: string) => {
    if (!value) return "-";
    const key = `form.${category}.${value}`;
    const translated = t(key);
    return translated === key ? value : translated;
  };

  const SectionTitle = ({ icon, title }: { icon: React.ReactNode; title: string }) => (
    <div className="flex items-center gap-3 mb-6">
      <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600">
        {icon}
      </div>
      <h3 className="text-base font-semibold text-slate-800">{title}</h3>
    </div>
  );

  const Field = ({ label, value }: { label: string; value: string | number | undefined }) => (
    <div className="flex flex-col gap-1.5 mb-6 min-w-0">
      <span className="text-[12px] font-medium text-slate-500 uppercase tracking-wider truncate">{label}</span>
      <span className="text-[15px] font-medium text-slate-800 leading-relaxed break-words">{value || '-'}</span>
    </div>
  );

  const ScoreCard = ({ label, score }: { label: string; score?: number }) => (
    <div className="relative flex flex-col p-5 rounded-xl border border-slate-100 bg-white shadow-sm hover:shadow-md transition-shadow overflow-hidden group">
      <div className="absolute top-0 left-0 w-1 h-full bg-emerald-400 group-hover:bg-emerald-500 transition-colors"></div>
      <span className="text-[13px] font-medium text-slate-500 mb-3">{label}</span>
      <span className="text-3xl font-bold text-slate-800">{typeof score === 'number' ? score.toFixed(1) : '-'}</span>
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-slate-900/40 backdrop-blur-sm">
      <div className="bg-slate-50 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between px-6 sm:px-8 py-4 sm:py-5 border-b border-slate-200 bg-white sticky top-0 z-10 gap-3">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900 tracking-tight">Detail Hasil Asesmen</h2>
            <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
              isIndividual 
                ? 'bg-blue-50 text-blue-700 border-blue-200' 
                : 'bg-emerald-50 text-emerald-700 border-emerald-200'
            }`}>
              {isIndividual ? '👤 Asesmen Individu' : '🏢 Asesmen Organisasi'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <a
              href={`#result/${submission.id}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors border border-slate-200"
              title="Buka Halaman Hasil Lengkap di Tab Baru"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Halaman Hasil</span>
            </a>

            {waNumber && (
              <a
                href={`https://wa.me/${waNumber}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-700 transition-colors border border-emerald-200"
                title="Kirim Pesan WhatsApp"
              >
                <MessageCircle className="w-3.5 h-3.5 text-emerald-600" />
                <span>WhatsApp</span>
              </a>
            )}

            {submission.email && (
              <a
                href={`mailto:${submission.email}`}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors border border-blue-200"
                title="Kirim Email"
              >
                <Mail className="w-3.5 h-3.5 text-blue-600" />
                <span>Email</span>
              </a>
            )}

            <button
              onClick={() => window.print()}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200"
              title="Cetak Dokumen"
            >
              <Printer className="w-4 h-4" />
            </button>

            {onDelete && (
              <button
                onClick={() => {
                  onDelete(submission.id, submission.companyName || submission.fullName);
                }}
                className="p-1.5 text-red-500 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors border border-red-200"
                title="Hapus Data Asesmen"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}

            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-full transition-colors ml-1"
              title="Tutup Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 sm:p-8 overflow-y-auto">
          <div className="flex flex-col gap-6">
            
            {isIndividual ? (
              <>
                {/* Individual Profile */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <SectionTitle icon={<User className="w-5 h-5" />} title="Informasi Profesional & Kontak" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <Field label="Nama Lengkap" value={submission.fullName} />
                    <Field label="Email" value={submission.email} />
                    <Field label="No. Telepon / WhatsApp" value={submission.phone} />
                    <Field label="Jabatan / Peran" value={submission.jobTitle} />
                    <Field label="Perusahaan / Instansi" value={submission.companyName || '-'} />
                    <Field label="Lama Pengalaman Kerja" value={submission.experienceYears || '-'} />
                    <Field label="Frekuensi Penggunaan AI" value={submission.aiUsageFrequency || '-'} />
                    <Field label="Tools AI yang Biasa Digunakan" value={submission.aiToolsUsed || '-'} />
                  </div>
                </section>

                {/* Individual AI Needs & Goals */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <SectionTitle icon={<Target className="w-5 h-5" />} title="Target & Kebutuhan Penguasaan AI" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
                    <Field label="Tujuan Utama Penggunaan AI" value={submission.aiGoal} />
                    <Field label="Aktivitas AI yang Paling Sering" value={submission.aiFrequentUse} />
                    <Field label="Kebutuhan Belajar / Pelatihan AI" value={submission.aiLearningNeed} />
                    <Field label="Target Penguasaan AI ke Depan" value={submission.aiMasteryTarget} />
                  </div>
                </section>

                {/* Individual 6 Dimensions Scores */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <SectionTitle icon={<BarChart3 className="w-5 h-5" />} title="Skor 6 Dimensi Kesiapan AI Individu" />
                  
                  <div className="mb-8 p-6 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl text-white shadow-md flex items-center justify-between overflow-hidden relative">
                    <div className="relative z-10">
                      <span className="text-blue-100 font-medium text-xs block mb-1 uppercase tracking-wider">Tingkat Kesiapan AI Individu</span>
                      <span className="text-3xl font-bold">{submission.readinessLevel}</span>
                      <p className="text-blue-100 text-sm mt-1">Skor Keseluruhan: <span className="font-bold text-white text-lg">{submission.overallScore.toFixed(2)}</span> / 5.0</p>
                    </div>
                    <BarChart3 className="w-24 h-24 text-blue-300 opacity-20 absolute -right-4 -bottom-4 transform rotate-12" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <ScoreCard label="1. AI Literacy & Mindset" score={submission.scores.aiLiteracy} />
                    <ScoreCard label="2. Task Framing & Prompting" score={submission.scores.taskFraming} />
                    <ScoreCard label="3. Workflow & Integration" score={submission.scores.workflow} />
                    <ScoreCard label="4. Evaluation & Human Judgment" score={submission.scores.evaluation} />
                    <ScoreCard label="5. Responsible AI & Risk" score={submission.scores.responsibleAi} />
                    <ScoreCard label="6. Collaboration & AI Growth" score={submission.scores.collaboration} />
                  </div>
                </section>
              </>
            ) : (
              <>
                {/* Company Information */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <SectionTitle icon={<Building2 className="w-5 h-5" />} title="Informasi Perusahaan" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <Field label="Nama Perusahaan" value={submission.companyName} />
                    <Field label="Industri" value={getLabel('industries', submission.industry)} />
                    <Field label="Ukuran Perusahaan" value={getLabel('companySizes', submission.companySize)} />
                    <Field label="Lokasi" value={submission.location} />
                  </div>
                </section>

                {/* Person in Charge */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <SectionTitle icon={<Users className="w-5 h-5" />} title="Penanggung Jawab (PIC)" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
                    <Field label="Nama PIC" value={submission.fullName} />
                    <Field label="Jabatan" value={submission.jobTitle} />
                    <Field label="Email" value={submission.email} />
                    <Field label="No. Telepon / WhatsApp" value={submission.phone} />
                  </div>
                </section>

                {/* AI Needs & Objectives */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <SectionTitle icon={<Target className="w-5 h-5" />} title="Kebutuhan & Rencana AI Perusahaan" />
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-0">
                    <Field label="Tujuan AI" value={submission.aiGoal} />
                    <Field label="Penggunaan AI Saat Ini" value={submission.aiCurrentUse} />
                    <Field label="Use Case AI" value={submission.aiUseCase} />
                    <Field label="Aktivitas AI Paling Sering" value={submission.aiFrequentUse} />
                    <Field label="Kebutuhan Tools AI" value={submission.aiTools} />
                    <Field label="Kebutuhan Pelatihan AI" value={submission.aiLearningNeed} />
                    <Field label="Target Penguasaan AI" value={submission.aiMasteryTarget} />
                    <Field label="Timeline Implementasi" value={getLabel('timelines', submission.timeline)} />
                  </div>
                </section>

                {/* Assessment Scores */}
                <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-100 shadow-sm">
                  <SectionTitle icon={<BarChart3 className="w-5 h-5" />} title="Skor 5 Pilar Kesiapan Organisasi" />
                  
                  <div className="mb-8 p-6 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-xl text-white shadow-md flex items-center justify-between overflow-hidden relative">
                    <div className="relative z-10">
                      <span className="text-emerald-100 font-medium text-xs block mb-1 uppercase tracking-wider">Tingkat Kesiapan AI Organisasi</span>
                      <span className="text-3xl font-bold">{submission.readinessLevel}</span>
                      <p className="text-emerald-100 text-sm mt-1">Skor Keseluruhan: <span className="font-bold text-white text-lg">{submission.overallScore.toFixed(2)}</span> / 5.0</p>
                    </div>
                    <BarChart3 className="w-24 h-24 text-emerald-400 opacity-20 absolute -right-4 -bottom-4 transform rotate-12" />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    <ScoreCard label={translations[language].assessmentData[0]?.shortTitle || 'Strategy & Leadership'} score={submission.scores.strategi} />
                    <ScoreCard label={translations[language].assessmentData[1]?.shortTitle || 'Process & Workflow'} score={submission.scores.proses} />
                    <ScoreCard label="People & Capability" score={submission.scores.sdm} />
                    <ScoreCard label={translations[language].assessmentData[3]?.shortTitle || 'Data & Technology'} score={submission.scores.data} />
                    <ScoreCard label="Governance & Responsible AI" score={submission.scores.tataKelola} />
                  </div>
                </section>
              </>
            )}
          </div>
          
          <div className="mt-8 flex justify-center">
            <div className="flex items-center gap-2 text-slate-500 text-[13px] bg-white px-5 py-2.5 rounded-full border border-slate-200 shadow-sm">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Dikirim pada {new Date(submission.timestamp).toLocaleString('id-ID', {
                dateStyle: 'long',
                timeStyle: 'short'
              })}</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  );
}
