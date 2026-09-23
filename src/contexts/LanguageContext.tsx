import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import {
  levelStrengthInsightsDefaults,
  levelGrowthInsightsDefaults,
  levelStrengthInsightsDefaultsEN,
  levelGrowthInsightsDefaultsEN
} from '../utils/individualInsights';

type Language = 'ID' | 'EN';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  updateTranslations: (newTranslations: any) => void;
  translations: any;
  images: Record<string, string>;
  updateImage: (key: string, url: string) => void;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const defaultImages = {
  logo: '/LogoNortis.png'
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguage] = useState<Language>('ID');
  
  const [translationsState, setTranslationsState] = useState(() => {
    const CURRENT_VERSION = '2.5';
    const saved = localStorage.getItem('nortis_translations');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const merged = JSON.parse(JSON.stringify(defaultTranslations));
        const isOutdated = parsed.version !== CURRENT_VERSION;

        ['ID', 'EN'].forEach((langKey) => {
          const lang = langKey as Language;
          if (parsed[lang]) {
            // Perform a careful deep merge for specific known sections to prevent data loss
            Object.keys(parsed[lang]).forEach(section => {
              if (section === 'recommendations' || section === 'individualRecommendations') {
                if (isOutdated) {
                  // Use official PDF content from defaultTranslations
                  merged[lang][section] = JSON.parse(JSON.stringify(defaultTranslations[lang][section]));
                  return;
                }
              }
              if (typeof parsed[lang][section] === 'object' && parsed[lang][section] !== null && !Array.isArray(parsed[lang][section])) {
                 merged[lang][section] = { ...merged[lang][section], ...parsed[lang][section] };
              } else {
                 merged[lang][section] = parsed[lang][section];
              }
            });
            
            if (!parsed[lang].recommendations || isOutdated) {
              merged[lang].recommendations = JSON.parse(JSON.stringify(defaultTranslations[lang].recommendations));
            }
            if (!parsed[lang].individualRecommendations || isOutdated) {
              merged[lang].individualRecommendations = JSON.parse(JSON.stringify(defaultTranslations[lang].individualRecommendations));
            }
            if (!parsed[lang].assessmentData) {
              merged[lang].assessmentData = JSON.parse(JSON.stringify(defaultTranslations[lang].assessmentData));
            }
            if (!parsed[lang].questions || !parsed[lang].questions.pillarIndicators) {
              merged[lang].questions = merged[lang].questions || {};
              merged[lang].questions.pillarIndicators = JSON.parse(JSON.stringify(defaultTranslations[lang].questions.pillarIndicators));
            }
            if (!merged[lang].form?.industries) {
               merged[lang].form = merged[lang].form || {};
               merged[lang].form.industries = JSON.parse(JSON.stringify(defaultTranslations[lang].form.industries));
            }
            if (!merged[lang].form?.companySizes) {
               merged[lang].form = merged[lang].form || {};
               merged[lang].form.companySizes = JSON.parse(JSON.stringify(defaultTranslations[lang].form.companySizes));
            }
            if (!merged[lang].form?.timelines) {
               merged[lang].form = merged[lang].form || {};
               merged[lang].form.timelines = JSON.parse(JSON.stringify(defaultTranslations[lang].form.timelines));
            }
            if (!merged[lang].result) {
               merged[lang].result = JSON.parse(JSON.stringify(defaultTranslations[lang].result));
            } else {
               if (parsed[lang]?.result?.nortisProgramsByLevel !== undefined) {
                 merged[lang].result.nortisProgramsByLevel = parsed[lang].result.nortisProgramsByLevel;
               } else if (!merged[lang].result.nortisProgramsByLevel) {
                 merged[lang].result.nortisProgramsByLevel = JSON.parse(JSON.stringify(defaultTranslations[lang].result.nortisProgramsByLevel));
               }
               if (parsed[lang]?.result?.individualNortisProgramsByLevel !== undefined) {
                 merged[lang].result.individualNortisProgramsByLevel = parsed[lang].result.individualNortisProgramsByLevel;
               } else if (!merged[lang].result.individualNortisProgramsByLevel) {
                 merged[lang].result.individualNortisProgramsByLevel = {
                   unready: [], aware: [], ready: [], enabled: [], mature: []
                 };
               }
               if (parsed[lang]?.result?.nortisPrograms !== undefined) {
                 merged[lang].result.nortisPrograms = parsed[lang].result.nortisPrograms;
               }
            }

            // Deep merge individual recommendations to ensure all fields are populated with web defaults
            if (!merged[lang].individualRecommendations) {
              merged[lang].individualRecommendations = JSON.parse(JSON.stringify(defaultTranslations[lang].individualRecommendations));
            } else {
              const recLevels = ['mature', 'enabled', 'ready', 'aware', 'unready'] as const;
              recLevels.forEach(lvl => {
                merged[lang].individualRecommendations[lvl] = {
                  ...defaultTranslations[lang].individualRecommendations[lvl],
                  ...(merged[lang].individualRecommendations[lvl] || {})
                };
                // Ensure strengthInsights and growthInsights objects are merged
                merged[lang].individualRecommendations[lvl].strengthInsights = {
                  ...defaultTranslations[lang].individualRecommendations[lvl]?.strengthInsights,
                  ...(merged[lang].individualRecommendations[lvl]?.strengthInsights || {})
                };
                merged[lang].individualRecommendations[lvl].growthInsights = {
                  ...defaultTranslations[lang].individualRecommendations[lvl]?.growthInsights,
                  ...(merged[lang].individualRecommendations[lvl]?.growthInsights || {})
                };
                // Ensure arrays are non-empty
                (['phase1Actions', 'phase2Actions', 'phase3Actions', 'reflectionPrompts', 'strengths', 'growthAreas'] as const).forEach(arrKey => {
                  if (!merged[lang].individualRecommendations[lvl][arrKey] || merged[lang].individualRecommendations[lvl][arrKey].length === 0) {
                    merged[lang].individualRecommendations[lvl][arrKey] = JSON.parse(JSON.stringify(defaultTranslations[lang].individualRecommendations[lvl][arrKey]));
                  }
                });
                // Ensure string fields are filled
                (['whatsWorking', 'whatsAtRisk', 'focusNext', 'reflectionTip', 'title', 'desc'] as const).forEach(strKey => {
                  if (!merged[lang].individualRecommendations[lvl][strKey]) {
                    merged[lang].individualRecommendations[lvl][strKey] = defaultTranslations[lang].individualRecommendations[lvl][strKey];
                  }
                });
              });
            }

            // Deep merge individual result labels
            if (!merged[lang].individualResult) {
              merged[lang].individualResult = JSON.parse(JSON.stringify(defaultTranslations[lang].individualResult));
            } else {
              merged[lang].individualResult = {
                ...defaultTranslations[lang].individualResult,
                ...merged[lang].individualResult
              };
            }

            // Deep merge individual insights (dimension descriptions, strengths, and growth insights)
            if (!merged[lang].individualInsights) {
              merged[lang].individualInsights = JSON.parse(JSON.stringify(defaultTranslations[lang].individualInsights));
            } else {
              merged[lang].individualInsights = {
                dimensionDescriptions: {
                  ...defaultTranslations[lang].individualInsights.dimensionDescriptions,
                  ...(merged[lang].individualInsights.dimensionDescriptions || {})
                },
                strengthInsights: {
                  ...defaultTranslations[lang].individualInsights.strengthInsights,
                  ...(merged[lang].individualInsights.strengthInsights || {})
                },
                growthInsights: {
                  ...defaultTranslations[lang].individualInsights.growthInsights,
                  ...(merged[lang].individualInsights.growthInsights || {})
                }
              };
              const dimKeys = ['aiLiteracy', 'taskFraming', 'workflow', 'evaluation', 'responsibleAi', 'collaboration'];
              dimKeys.forEach(dk => {
                merged[lang].individualInsights.dimensionDescriptions[dk] = {
                  ...defaultTranslations[lang].individualInsights.dimensionDescriptions[dk],
                  ...(merged[lang].individualInsights.dimensionDescriptions[dk] || {})
                };
              });
            }
          }
        });
        return merged;
      } catch (e) {
        console.error("Error parsing saved translations:", e);
        return defaultTranslations;
      }
    }
    return defaultTranslations;
  });

  const [images, setImages] = useState<Record<string, string>>(() => {
    const saved = localStorage.getItem('nortis_images');
    return saved ? JSON.parse(saved) : defaultImages;
  });

  // Real-time synchronization across browser tabs and frames
  useEffect(() => {
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'nortis_translations' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setTranslationsState(parsed);
        } catch (err) {
          console.error("Error syncing translations across tabs:", err);
        }
      }
      if (e.key === 'nortis_images' && e.newValue) {
        try {
          const parsed = JSON.parse(e.newValue);
          setImages(parsed);
        } catch (err) {
          console.error("Error syncing images across tabs:", err);
        }
      }
    };

    const handleCustomUpdate = (e: Event) => {
      const customEvt = e as CustomEvent;
      if (customEvt.detail) {
        setTranslationsState(customEvt.detail);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('nortis_content_updated', handleCustomUpdate);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('nortis_content_updated', handleCustomUpdate);
    };
  }, []);

  const updateTranslations = (newTranslations: any) => {
    setTranslationsState(newTranslations);
    try {
      localStorage.setItem('nortis_translations', JSON.stringify(newTranslations));
      window.dispatchEvent(new CustomEvent('nortis_content_updated', { detail: newTranslations }));
    } catch (err) {
      console.warn('Error persisting translations:', err);
    }
  };

  const updateImage = (key: string, url: string) => {
    const newImages = { ...images, [key]: url };
    setImages(newImages);
    try {
      localStorage.setItem('nortis_images', JSON.stringify(newImages));
    } catch (err) {
      console.warn('Error persisting images:', err);
    }
  };

  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translationsState[language];
    for (const k of keys) {
      if (result !== undefined && result !== null && result[k] !== undefined && result[k] !== null) {
        result = result[k];
      } else {
        return key;
      }
    }
    return typeof result === 'string' ? result : (result !== undefined && result !== null ? result : key);
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, updateTranslations, translations: translationsState, images, updateImage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}

// Translations dictionary
export const defaultTranslations = {
  ID: {
    header: {
      adminLogin: 'Admin Login',
    },
    landing: {
      title: 'Penilaian Kesiapan AI',
      subtitle: 'Ukur tingkat kesiapan organisasi Anda dalam mengadopsi teknologi Artificial Intelligence',
      duration: 'Durasi: 15-20 menit',
      startAssessment: 'Mulai Assessment',
      startOrgAssessment: 'Asesmen Kesiapan AI Organisasi',
      startIndAssessment: 'Asesmen Kesiapan AI Individu',
      description: 'Assessment komprehensif yang mengevaluasi 5 pilar utama kesiapan AI organisasi Anda: Strategi & Kepemimpinan, Proses & Alur Kerja, SDM & Kapabilitas, Data & Teknologi, serta Tata Kelola & AI yang Bertanggung Jawab.',
      whatYouGet: 'Apa yang Anda Dapatkan:',
      benefits: [
        'Skor Kesiapan AI (NORTIS Index) yang terukur',
        'Analisis mendalam untuk setiap pilar',
        'Rekomendasi strategis yang dapat ditindaklanjuti',
        'Roadmap 90 hari untuk transformasi AI',
        'Laporan lengkap yang dapat diekspor'
      ],
      pillarsTitle: '5 Pilar Assessment Organisasi:',
      pillars: {
        strategy: 'Strategi & Kepemimpinan',
        process: 'Proses & Alur Kerja',
        people: 'SDM & Kapabilitas',
        data: 'Data & Teknologi',
        governance: 'Tata Kelola & AI Bertanggung Jawab'
      },
      indPillarsTitle: '6 Dimensi Assessment Individu:',
      indPillars: {
        aiLiteracy: 'AI Literacy & Mindset',
        taskFraming: 'Task Framing & Prompting',
        workflow: 'Workflow & Integration',
        evaluation: 'Evaluation & Human Judgment',
        responsibleAi: 'Responsible AI & Risk',
        collaboration: 'Collaboration & AI Growth'
      },
      readyToMeasure: 'Siap Mengukur Kesiapan AI Anda?',
      readyDesc: 'Mulai sekarang dan dapatkan insight yang actionable untuk transformasi AI organisasi Anda'
    },
    form: {
      title: 'Nortis Assessment',
      subtitle: 'Mohon lengkapi informasi instansi dan personal Anda untuk membantu kami memahami kebutuhan AI di perusahaan Anda secara komprehensif.',
      companyData: 'Data Instansi',
      companyName: 'Nama Instansi',
      companyNamePlaceholder: 'Contoh: PT. Inovasi Teknologi',
      industry: 'Industri',
      industryPlaceholder: 'Pilih industri',
      industries: {
        finance: 'Perbankan & Keuangan',
        it: 'Teknologi & IT',
        manufacturing: 'Manufaktur',
        retail: 'Retail & E-commerce',
        healthcare: 'Healthcare',
        education: 'Pendidikan',
        telecom: 'Telekomunikasi',
        energy: 'Energi',
        logistics: 'Transportasi & Logistik',
        other: 'Lainnya'
      },
      companySize: 'Ukuran Instansi',
      companySizePlaceholder: 'Pilih ukuran instansi',
      companySizes: {
        s50: '1-50 karyawan',
        s200: '51-200 karyawan',
        s500: '201-500 karyawan',
        s1000: '501-1000 karyawan',
        splus: '1000+ karyawan'
      },
      location: 'Lokasi',
      locationPlaceholder: 'Kota, Negara',
      aiNeeds: 'Kondisi Eksisting AI di Individu',
      aiGoal: 'Tujuan Utama Adopsi AI',
      aiGoalPlaceholder: 'Contoh: Meningkatkan efisiensi operasional, customer experience, dll.',
      aiUseCase: 'Use Case AI yang Dipertimbangkan',
      aiUseCasePlaceholder: 'Contoh: Chatbot customer service, predictive analytics, automation, dll.',
      aiTools: 'Tools AI apa saja yang diperlukan?',
      aiToolsPlaceholder: 'Contoh: ChatGPT, Google Gemini, Midjourney, automation tools, dll.',
      aiCurrentUse: 'Sudah menggunakan AI untuk apa saja?',
      aiCurrentUsePlaceholder: 'Contoh: Content creation, customer service, data analysis, dll.',
      aiFrequentUse: 'AI apa yang paling sering digunakan?',
      aiFrequentUsePlaceholder: 'Contoh: ChatGPT untuk brainstorming, Gemini untuk research, Midjourney untuk design, dll.',
      aiLearningNeed: 'Kebutuhan belajar AI untuk apa?',
      aiLearningNeedPlaceholder: 'Contoh: Meningkatkan produktivitas tim, automasi proses bisnis, analisis data, dll.',
      aiMasteryTarget: 'Target bisa menguasai AI di bidang apa?',
      aiMasteryTargetPlaceholder: 'Contoh: Marketing & Sales, Operations & Automation, Product Development, Data Analytics, dll.',
      timeline: 'Timeline Implementasi yang Diharapkan',
      timelinePlaceholder: 'Pilih timeline',
      timelines: {
        m3: '0-3 Bulan',
        m6: '3-6 Bulan',
        m12: '6-12 Bulan',
        mplus: '12+ Bulan',
        none: 'Belum ada timeline'
      },
      personalContact: 'Data Pribadi',
      fullName: 'Nama Lengkap',
      fullNamePlaceholder: 'Nama lengkap Anda',
      jobTitle: 'Jabatan',
      jobTitlePlaceholder: 'Posisi Anda saat ini',
      email: 'Email Profesional',
      emailPlaceholder: 'nama@perusahaan.com',
      phone: 'Nomor Telepon',
      phonePlaceholder: '+62 812-3456-7890',
      dropdownPlaceholder: 'Pilih salah satu...',
      back: 'Kembali',
      next: 'Lanjut Assessment'
    },
    questions: {
      title: 'Penilaian Kesiapan AI',
      subtitle: 'Evaluasi kesiapan organisasi Anda dalam mengadopsi teknologi AI',
      progress: 'Progress',
      pillarIndicators: ['Pilar 1 dari 5', 'Pilar 2 dari 5', 'Pilar 3 dari 5', 'Pilar 4 dari 5', 'Pilar 5 dari 5'],
      scaleTitle: 'Skala Penilaian:',
      scale: [
        { score: 0, label: 'Tidak ada sama sekali' },
        { score: 1, label: 'Ada secara ad-hoc / sporadis' },
        { score: 2, label: 'Sudah mulai, belum konsisten' },
        { score: 3, label: 'Cukup siap, masih terbatas' },
        { score: 4, label: 'Siap & terstruktur' },
        { score: 5, label: 'Mature & scalable' },
      ],
      prev: 'Sebelumnya',
      next: 'Selanjutnya',
      finish: 'Selesai'
    },

    individualForm: {
      title: 'Formulir Asesmen Kesiapan AI Individu',
      subtitle: 'Mohon lengkapi profil profesional Anda untuk membantu kami memetakan tingkat kematangan dan kecakapan AI Anda secara personal.',
      personalData: 'Data Pribadi & Profil Profesional',
      fullName: 'Nama Lengkap',
      fullNamePlaceholder: 'Masukkan nama lengkap Anda',
      email: 'Email',
      emailPlaceholder: 'Masukkan alamat email Anda',
      phone: 'Nomor WhatsApp',
      phonePlaceholder: 'Contoh: 08123456789',
      jobTitle: 'Jabatan / Profesi',
      jobTitlePlaceholder: 'Contoh: Data Analyst, Freelancer, Mahasiswa',
      companyName: 'Nama Perusahaan / Organisasi (Opsional)',
      companyNamePlaceholder: 'Kosongkan jika tidak ada',
      industry: 'Industri / Bidang Pekerjaan',
      industryPlaceholder: 'Pilih industri',
      industries: {
        finance: 'Perbankan & Keuangan',
        it: 'Teknologi & IT',
        manufacturing: 'Manufaktur',
        retail: 'Retail & E-commerce',
        healthcare: 'Healthcare',
        education: 'Pendidikan',
        telecom: 'Telekomunikasi',
        energy: 'Energi',
        logistics: 'Transportasi & Logistik',
        creative: 'Kreatif & Media',
        consulting: 'Konsultan & Jasa Profesional',
        student: 'Mahasiswa / Akademisi',
        other: 'Lainnya'
      },
      experienceYears: 'Lama Pengalaman Kerja',
      experienceYearsPlaceholder: 'Contoh: 3 tahun, Belum bekerja',
      aiUsageFrequency: 'Seberapa sering Anda menggunakan AI?',
      aiUsageFrequencyPlaceholder: 'Pilih frekuensi penggunaan AI',
      aiUsageFrequencies: [
        'Belum pernah',
        'Jarang',
        'Beberapa kali dalam sebulan',
        'Beberapa kali dalam seminggu',
        'Setiap hari'
      ],
      aiToolsUsed: 'Tools AI yang biasa digunakan',
      aiToolsUsedPlaceholder: 'Contoh: ChatGPT, Claude, Midjourney, dll. (Kosongkan jika belum pernah)',
      back: 'Kembali',
      next: 'Lanjut ke Kuesioner'
    },

    individualQuestionsData: {
      title: 'Kuesioner Kesiapan AI Individu',
      subtitle: 'Evaluasi 6 dimensi kecakapan AI untuk memetakan profil kematangan kerja Anda',
      progress: 'Progress Kuesioner',
      dimensionIndicators: [
        'Dimensi 1 dari 6: AI Literacy & Mindset',
        'Dimensi 2 dari 6: Task Framing & Prompting',
        'Dimensi 3 dari 6: Workflow & Integration',
        'Dimensi 4 dari 6: Evaluation & Human Judgment',
        'Dimensi 5 dari 6: Responsible AI & Risk',
        'Dimensi 6 dari 6: Collaboration & AI Growth'
      ],
      scaleTitle: 'Skala Penilaian Kemahiran (0 - 5):',
      prev: 'Sebelumnya',
      next: 'Selanjutnya',
      finish: 'Selesaikan & Lihat Hasil'
    },
    
    individualAssessmentData: [
      { id: 'aiLiteracy', title: 'AI Literacy & Mindset', shortTitle: 'Literacy', description: 'Pemahaman dasar dan mindset terhadap AI' },
      { id: 'taskFraming', title: 'Task Framing & Prompting', shortTitle: 'Prompting', description: 'Kemampuan merumuskan tugas dan prompt' },
      { id: 'workflow', title: 'Workflow & Integration', shortTitle: 'Workflow', description: 'Integrasi AI ke dalam alur kerja' },
      { id: 'evaluation', title: 'Evaluation & Human Judgment', shortTitle: 'Evaluation', description: 'Evaluasi output dan penilaian manusia' },
      { id: 'responsibleAi', title: 'Responsible AI & Risk', shortTitle: 'Risk', description: 'Penggunaan AI yang bertanggung jawab dan risiko' },
      { id: 'collaboration', title: 'Collaboration & AI Growth', shortTitle: 'Growth', description: 'Kolaborasi dan pengembangan kemampuan AI' }
    ],
    individualQuestions: {
      aiLiteracy: [
        { id: 'A1', text: 'Saya memahami kemampuan utama AI generatif dan jenis pekerjaan yang cocok dibantu oleh AI.' },
        { id: 'A2', text: 'Saya memahami bahwa AI dapat menghasilkan informasi yang terdengar meyakinkan tetapi sebenarnya tidak akurat (halusinasi).' },
        { id: 'A3', text: 'Saya dapat membedakan dengan jelas tugas yang tepat untuk dibantu AI dan tugas yang membutuhkan penilaian manusia.' },
        { id: 'A4', text: 'Saya memahami keterbatasan AI seperti halusinasi (hallucination), bias, keterbatasan konteks, dan ketergantungan pada kualitas input.' },
        { id: 'A5', text: 'Saya memandang AI sebagai alat untuk meningkatkan kemampuan dan kualitas kerja, bukan sekadar menggantikan pekerjaan manual.' }
      ],
      taskFraming: [
        { id: 'B1', text: 'Sebelum menggunakan AI, saya dapat menentukan dengan jelas tujuan atau hasil spesifik yang ingin saya capai.' },
        { id: 'B2', text: 'Saya dapat memberikan konteks, instruksi, batasan, dan format luaran (output) yang jelas kepada AI.' },
        { id: 'B3', text: 'Saya dapat memecah pekerjaan kompleks menjadi beberapa sub-tugas yang lebih terstruktur untuk dikerjakan bersama AI.' },
        { id: 'B4', text: 'Saya melakukan iterasi dan menyempurnakan instruksi (prompt) ketika hasil pertama dari AI belum sesuai kebutuhan.' },
        { id: 'B5', text: 'Saya dapat memilih perangkat (tools) atau pendekatan AI yang paling sesuai untuk berbagai jenis tugas yang berbeda.' }
      ],
      workflow: [
        { id: 'C1', text: 'Saya menggunakan AI secara rutin dalam aktivitas pekerjaan sehari-hari, bukan hanya untuk bereksperimen.' },
        { id: 'C2', text: 'Saya dapat mengenali pekerjaan repetitif atau memakan waktu yang dapat diefisienkan menggunakan AI.' },
        { id: 'C3', text: 'Saya memiliki alur kerja (workflow), templat, atau pustaka prompt yang dapat digunakan kembali untuk pekerjaan tertentu.' },
        { id: 'C4', text: 'Saya dapat mengintegrasikan AI ke dalam berbagai tahapan kerja, mulai dari riset, ideasi, penyusunan draft, analisis, hingga evaluasi.' },
        { id: 'C5', text: 'Saya dapat menunjukkan dampak nyata penggunaan AI terhadap efisiensi waktu, produktivitas, dan kualitas hasil kerja saya.' }
      ],
      evaluation: [
        { id: 'D1', text: 'Saya selalu memeriksa dan memverifikasi kembali informasi penting yang dihasilkan AI sebelum menggunakannya.' },
        { id: 'D2', text: 'Saya dapat mengenali ketika jawaban AI terlihat masuk akal, namun mengandung kesalahan atau fakta yang menyesatkan.' },
        { id: 'D3', text: 'Saya membandingkan luaran AI dengan sumber data resmi, rujukan, atau referensi tepercaya saat akurasi menjadi hal krusial.' },
        { id: 'D4', text: 'Saya memahami kapan luaran AI membutuhkan tinjauan ahli (expert review), persetujuan hukum, atau keputusan manusia.' },
        { id: 'D5', text: 'Saya tidak membuat keputusan bisnis atau strategis yang penting hanya berdasarkan luaran AI tanpa validasi kontekstual.' }
      ],
      responsibleAi: [
        { id: 'E1', text: 'Saya mempertimbangkan faktor keamanan, hak cipta, dan kerahasiaan data sebelum memasukkan informasi ke dalam perangkat AI.' },
        { id: 'E2', text: 'Saya memahami bahwa data sensitif, informasi pribadi, dan rahasia perusahaan tidak boleh dimasukkan ke dalam AI publik tanpa perlindungan.' },
        { id: 'E3', text: 'Saya mempertimbangkan potensi bias, keadilan, dan dampak etis dari kesimpulan atau konten yang dihasilkan AI.' },
        { id: 'E4', text: 'Saya mematuhi pedoman hak cipta, kepemilikan intelektual, dan etika penggunaan konten berbasis AI secara bertanggung jawab.' },
        { id: 'E5', text: 'Saya menyadari bahwa manusia tetap bertanggung jawab penuh atas hasil akhir dan keputusan pekerjaan yang menggunakan AI.' }
      ],
      collaboration: [
        { id: 'F1', text: 'Saya secara aktif mempelajari perkembangan perangkat (tools), metode, dan praktik terbaik penggunaan AI yang relevan dengan bidang saya.' },
        { id: 'F2', text: 'Saya secara aktif membagikan prompt efektif, alur kerja, dan pembelajaran penggunaan AI kepada rekan kerja atau tim.' },
        { id: 'F3', text: 'Saya memanfaatkan AI sebagai mitra diskusi (sparring partner) untuk mengeksplorasi ide dan solusi, bukan sekadar pembuat jawaban instan.' },
        { id: 'F4', text: 'Saya dapat menentukan batasan yang jelas antara tugas yang dapat berjalan mandiri oleh AI dan keputusan yang membutuhkan persetujuan manusia.' },
        { id: 'F5', text: 'Saya siap mengadaptasi cara kerja secara fleksibel seiring dengan perkembangan teknologi AI dan agen cerdas (AI agents).' }
      ],
      scale: [
        { value: 0, label: '0 = Belum pernah / belum mampu melakukan ini' },
        { value: 1, label: '1 = Sangat terbatas dan masih membutuhkan banyak bantuan' },
        { value: 2, label: '2 = Sudah mulai melakukan, tetapi belum konsisten' },
        { value: 3, label: '3 = Dapat melakukan secara mandiri pada situasi yang familiar' },
        { value: 4, label: '4 = Dapat melakukan secara konsisten di berbagai situasi' },
        { value: 5, label: '5 = Sangat mahir, sistematis, dan mampu membimbing orang lain' }
      ]
    },
    assessmentData: [
      {
        id: 'strategi',
        title: 'Strategi & Kepemimpinan',
        shortTitle: 'Strategi',
        description: 'Kepemimpinan dan arahan strategis organisasi dalam adopsi AI',
        questions: [
          { id: 'S1', text: 'Apakah AI telah masuk dalam agenda strategis organisasi?' },
          { id: 'S2', text: 'Apakah jajaran pimpinan memahami manfaat dan risiko penerapan AI?' },
          { id: 'S3', text: 'Apakah terdapat sponsor atau penanggung jawab (owner) AI di tingkat manajemen?' },
          { id: 'S4', text: 'Apakah tujuan penggunaan AI dalam organisasi telah jelas dan terukur?' },
          { id: 'S5', text: 'Apakah pemanfaatan AI selaras dengan visi dan misi organisasi?' },
        ]
      },
      {
        id: 'proses',
        title: 'Proses & Alur Kerja',
        shortTitle: 'Proses',
        description: 'Kesiapan proses bisnis dan alur kerja untuk diintegrasikan dengan AI',
        questions: [
          { id: 'P1', text: 'Apakah alur dan proses kerja utama organisasi telah terdokumentasi dengan baik?' },
          { id: 'P2', text: 'Apakah kendala utama (bottleneck) dan titik masalah (pain points) proses kerja telah diidentifikasi?' },
          { id: 'P3', text: 'Apakah alur proses kerja siap diubah atau dioptimalkan menggunakan AI?' },
          { id: 'P4', text: 'Apakah Prosedur Operasional Standar (SOP) telah mendukung penggunaan teknologi digital dan AI?' },
          { id: 'P5', text: 'Apakah terdapat alur kerja (workflow) yang berpotensi untuk diotomatisasi dengan AI?' },
        ]
      },
      {
        id: 'sdm',
        title: 'SDM & Kapabilitas',
        shortTitle: 'SDM',
        description: 'Kesiapan sumber daya manusia dan budaya kerja dalam mengadopsi AI',
        questions: [
          { id: 'H1', text: 'Apakah Sumber Daya Manusia (SDM) telah memiliki literasi dasar mengenai AI?' },
          { id: 'H2', text: 'Apakah terdapat penggerak internal (AI champion) yang mendorong adopsi AI?' },
          { id: 'H3', text: 'Apakah tim dan karyawan terbuka terhadap perubahan alur kerja berbasis teknologi?' },
          { id: 'H4', text: 'Apakah SDM mampu menggunakan perangkat (tools) AI secara praktis dalam pekerjaan sehari-hari?' },
          { id: 'H5', text: 'Apakah telah terdapat rencana pelatihan dan pengembangan kompetensi AI untuk SDM?' },
        ]
      },
      {
        id: 'data',
        title: 'Data & Teknologi',
        shortTitle: 'Data',
        description: 'Ketersediaan dan kualitas data serta kesiapan infrastruktur teknologi',
        questions: [
          { id: 'D1', text: 'Apakah data organisasi telah tersedia secara terstruktur dan mudah diakses?' },
          { id: 'D2', text: 'Apakah kualitas dan keakuratan data sudah memadai untuk kebutuhan AI?' },
          { id: 'D3', text: 'Apakah organisasi telah secara aktif menggunakan perangkat (tools) digital atau AI?' },
          { id: 'D4', text: 'Apakah sistem teknologi yang ada telah saling terintegrasi satu sama lain?' },
          { id: 'D5', text: 'Apakah keamanan data, privasi, dan infrastruktur sistem telah terjamin dengan baik?' },
        ]
      },
      {
        id: 'tata-kelola',
        title: 'Tata Kelola & AI Bertanggung Jawab',
        shortTitle: 'Tata Kelola',
        description: 'Kebijakan, etika, dan kontrol terhadap implementasi AI',
        questions: [
          { id: 'G1', text: 'Apakah telah terdapat kebijakan resmi mengenai tata kelola data dan privasi?' },
          { id: 'G2', text: 'Apakah organisasi telah memahami dan memetakan potensi risiko dari penerapan AI?' },
          { id: 'G3', text: 'Apakah prinsip etika AI telah dipertimbangkan dalam setiap pemanfaatannya?' },
          { id: 'G4', text: 'Apakah terdapat mekanisme kontrol dan pengawasan (audit) terhadap penggunaan AI?' },
          { id: 'G5', text: 'Apakah organisasi siap mematuhi regulasi dan standar kebijakan AI yang berlaku?' },
        ]
      }
    ],
    result: {
      title: 'Assessment Selesai',
      subtitle: 'AI Readiness Index & Rekomendasi Anda',
      analyzing: 'Menyiapkan Analisis Strategis AI...',
      error: 'Assessment tidak ditemukan.',
      scoreLabel: 'Skor Kesiapan AI (NORTIS Index)',
      outOf: '/ 5.00',
      recommendationLabel: 'Rekomendasi Tindakan Selanjutnya',
      readinessProfile: 'Profil Kesiapan',
      scoreDetails: 'Rincian Skor',
      yourScore: 'Your Score',
      executiveSummary: 'Ringkasan Eksekutif',
      executiveSummaryPrefix: 'Organisasi Anda berada pada level "',
      executiveSummaryMid: '" dengan Skor Kesiapan AI ',
      executiveSummarySuffix: '. Prioritas strategis sekarang adalah berfokus pada langkah-langkah yang direkomendasikan untuk meningkatkan maturitas AI Anda.',
      mainRisk: 'Risiko Utama',
      quickWins: 'Quick Wins',
      orgBarriers: 'Hambatan Organisasi',
      priorityRec: 'Rekomendasi Prioritas 90 Hari',
      phase1Tag: 'Fase 1: Sekarang (0 - 30 Hari)',
      phase2Tag: 'Fase 2: Berikutnya (1 - 3 Bulan)',
      phase3Tag: 'Fase 3: Selanjutnya (3 - 12 Bulan)',
      focusArea: 'Area Fokus Berdasarkan Pilar',
      focusAreaDim: 'Area Fokus Berdasarkan Dimensi',
      strongFoundation: 'Fondasi Kuat',
      needsAttention: 'Perlu Perhatian Segera',
      strongFoundationDesc: 'Manfaatkan kekuatan ini untuk mendorong inisiatif AI dan mendukung area lainnya.',
      needsAttentionDesc: 'Area ini memerlukan investasi prioritas dan inisiatif perbaikan yang terfokus.',
      recommendedProgram: 'Program Rekomendasi Nortis AI',
      recommendedProgramDesc: 'Berdasarkan hasil AI readiness assessment Anda, berikut adalah program-program yang disesuaikan secara khusus dengan level kematangan AI organisasi Anda:',
      nortisProgramsByLevel: {
        unready: [
          {
            id: 'prog-unready-1',
            title: 'Nortis AI Camp (Literacy & Foundations)',
            subtitle: 'Build AI Foundations. Spark Adoption.',
            badge: '⭐ PRIORITAS TERTINGGI',
            isHighestPriority: true,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Bootcamp intensif dasar untuk membekali tim dan staf dengan pemahaman fundamental AI, prompt engineering dasar, serta cara kerja tools AI praktis.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-unready-2',
            title: 'Nortis B2B AI Awareness Training',
            subtitle: 'Demystifying AI for Organizations',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Pelatihan kesadaran AI interaktif untuk seluruh departemen guna membangun budaya inovasi, memitigasi resistensi teknologi, dan memahami etika dasar.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-unready-3',
            title: 'Nortis AI Readiness & Use Case Discovery',
            subtitle: 'From Scratch to AI Opportunity',
            badge: '',
            isHighestPriority: false,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'Workshop asesmen mendalam dan audit data awal untuk mengidentifikasi 3 use case prioritas pertama yang realistis dan minim risiko.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          }
        ],
        aware: [
          {
            id: 'prog-aware-1',
            title: 'Nortis AICM (AI Strategy & Roadmap Sprint)',
            subtitle: 'From Strategy to AI Roadmap',
            badge: '⭐ PRIORITAS TERTINGGI',
            isHighestPriority: true,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'Pendampingan intensif perumusan AI Masterplan 1-3 tahun, audit kelayakan infrastruktur data, standarisasi tata kelola, dan pemetaan ROI prioritas.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-aware-2',
            title: 'Nortis B2B AI Applied Training',
            subtitle: 'Practical AI for Business Teams',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Program pelatihan aplikatif bagi manajemen dan staf lintas divisi untuk mengintegrasikan alat AI ke dalam alur kerja harian guna mendongkrak efisiensi.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-aware-3',
            title: 'Nortis AI Camp (Practitioner Cohort)',
            subtitle: 'Build Hands-on AI Capability',
            badge: '',
            isHighestPriority: false,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Program akselerasi keterampilan teknis dan prompting terstruktur bagi individu dan calon AI champion internal di perusahaan.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          }
        ],
        ready: [
          {
            id: 'prog-ready-1',
            title: 'Nortis AICM (Implementation Pilot & Proof-of-Value)',
            subtitle: 'From Concept to Live AI Pilot',
            badge: '⭐ PRIORITAS TERTINGGI',
            isHighestPriority: true,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'Pendampingan end-to-end pembangunan dan pengujian solusi pilot AI pada 1-2 use case prioritas untuk memvalidasi kelayakan teknis dan dampak bisnis nyata.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-ready-2',
            title: 'Nortis B2B AI Technical Masterclass',
            subtitle: 'Upskilling Technical & Analytical Teams',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Pelatihan teknis lanjutan seputar integrasi API AI, data preparation pipeline, dan pengembangan solusi otomasi alur kerja tingkat lanjut.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-ready-3',
            title: 'Nortis AI Champion Bootcamp',
            subtitle: 'Empowering Internal AI Leaders',
            badge: '',
            isHighestPriority: false,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Pembekalan mendalam bagi kader AI internal agar mampu memandu adopsi alat, melakukan troubleshooting, dan menjaga momentum transformasi divisi.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          }
        ],
        enabled: [
          {
            id: 'prog-enabled-1',
            title: 'Nortis AICM (Scaling & MLOps Retainer)',
            subtitle: 'Enterprise AI Scale & Continuous Monitoring',
            badge: '⭐ PRIORITAS TERTINGGI',
            isHighestPriority: true,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'Layanan retainer pendampingan scale-up solusi AI ke lintas departemen, pemantauan performa model berkelanjutan, serta optimasi efisiensi biaya infrastruktur.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-enabled-2',
            title: 'Nortis B2B AI Governance & Security Masterclass',
            subtitle: 'Responsible AI & Enterprise Risk Control',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Pelatihan manajemen risiko, keamanan siber sistem AI, dan kepatuhan regulasi privasi data untuk memastikan operasional AI yang aman dan bertanggung jawab.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-enabled-3',
            title: 'Nortis AI Camp (Advanced Automation & Agents)',
            subtitle: 'Mastering Autonomous AI Systems',
            badge: '',
            isHighestPriority: false,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Bootcamp tingkat mahir membangun agen AI mandiri (AI Agents), multi-agent workflows, dan orkestrasi model untuk otomasi proses kompleks.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          }
        ],
        mature: [
          {
            id: 'prog-mature-1',
            title: 'Nortis AICM (Commercialization & Custom AI Innovation)',
            subtitle: 'From Internal Capability to Market Leadership',
            badge: '⭐ PRIORITAS TERTINGGI',
            isHighestPriority: true,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'Advisory strategis untuk memonetisasi kapabilitas AI internal menjadi lini produk baru (AI-as-a-Service), ekspansi kemitraan, dan inovasi eksklusif.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-mature-2',
            title: 'Nortis B2B Executive AI Leadership & ISO 42001',
            subtitle: 'Global Standards & Thought Leadership',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Program pendampingan jajaran eksekutif untuk sertifikasi Tata Kelola AI Internasional (ISO/IEC 42001) dan pemantapan posisi sebagai pemimpin industri AI.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          },
          {
            id: 'prog-mature-3',
            title: 'Nortis AI Camp (Frontier AI Research & Incubation)',
            subtitle: 'Next-Gen AI Labs & Proprietary Models',
            badge: '',
            isHighestPriority: false,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Workshop riset dan inkubasi model mutakhir (fine-tuning, SLM, multimodal edge AI) bagi tim R&D dan arsitek teknologi organisasi.',
            features: [],
            ctaText: 'Pelajari Lebih Lanjut',
            ctaLink: ''
          }
        ]
      },
      nortisPrograms: [
        {
          id: 'prog-1',
          title: 'Nortis AICM (AI Consulting & Monitoring)',
          subtitle: 'From Strategy to AI Impact',
          badge: '⭐ PRIORITAS TERTINGGI',
          iconType: 'chart',
          iconBg: 'bg-[#009E4F]',
          highlightBorder: false,
          desc: 'Layanan konsultasi dan pendampingan implementasi AI end-to-end, dirancang untuk menghasilkan dampak bisnis yang terukur dan berkelanjutan.',
          features: [],
          ctaText: 'Pelajari Lebih Lanjut',
          ctaLink: ''
        },
        {
          id: 'prog-2',
          title: 'Nortis AI Camp',
          subtitle: 'Build AI Skills. Create Real Impact.',
          badge: '',
          iconType: 'zap',
          iconBg: 'bg-[#FF6A00]',
          highlightBorder: false,
          desc: 'Bootcamp intensif berbayar untuk individu dan profesional yang ingin menguasai keterampilan AI praktis dan siap diterapkan di dunia kerja.',
          features: [],
          ctaText: 'Pelajari Lebih Lanjut',
          ctaLink: ''
        },
        {
          id: 'prog-3',
          title: 'Nortis B2B AI Training',
          subtitle: 'Practical AI for Business Performance',
          badge: '',
          iconType: 'training',
          iconBg: 'bg-[#2563EB]',
          highlightBorder: true,
          desc: 'Program pelatihan AI aplikatif untuk perusahaan dan institusi guna meningkatkan produktivitas, efisiensi, dan pengambilan keputusan berbasis AI.',
          features: [],
          ctaText: 'Pelajari Lebih Lanjut',
          ctaLink: ''
        }
      ],
      individualNortisProgramsByLevel: {
        unready: [],
        aware: [],
        ready: [],
        enabled: [],
        mature: []
      },
      discussProgram: 'Ingin mendiskusikan program terbaik untuk organisasi Anda? Hubungi tim kami untuk konsultasi yang dipersonalisasi.',
      downloadReport: 'Unduh Laporan Lengkap',
      downloadPdf: 'Unduh PDF',
      downloadExcel: 'Unduh Excel',
      downloadSlide: 'Ringkasan Slide',
      startNewAssessment: 'Mulai Assessment Baru',
      emailUs: 'Kirim Email',
      emailTarget: 'hai@nortis.ai',
      emailSubject: 'Konsultasi AI Readiness Assessment Organisasi',
      whatsapp: 'Hubungi via WhatsApp',
      whatsappNumber: '6282337576338',
      whatsappMessage: 'Halo Tim Nortis AI, saya ingin berkonsultasi mengenai hasil AI Readiness Assessment organisasi kami serta program rekomendasi yang sesuai.'
    },
    individualResult: {
      reportTitle: 'Laporan Hasil Asesmen AI Individu',
      downloadPdf: 'Download PDF',
      back: 'Kembali',
      backToHome: 'Kembali ke Beranda',
      analyzingWithAi: 'Dianalisis dengan Gemini AI',
      connectingAi: 'Menghubungkan Gemini AI...',
      analyzingBadge: 'AI Sedang Menganalisis Kesiapan Anda...',
      readinessStatus: 'Status Kesiapan',
      individualMaturityScore: 'Skor Kematangan AI Individu',
      readinessProfileLabel: 'Profil Kesiapan',
      dimensionsEvaluatedLabel: 'Dimensi Dievaluasi',
      executiveSummaryTitle: 'Ringkasan Eksekutif & Analisis Profil',
      maturityScore: 'Skor Kematangan',
      outOf: 'dari 5.00',
      dimensionsEvaluated: '6 Dimensi Dievaluasi',
      profilePrefix: 'Profil: ',
      whatsWorkingTitle: "What's Working",
      whatsWorkingDesc: 'Analisis kekuatan utama dan keunggulan saat ini',
      whatsAtRiskTitle: "What's At Risk",
      whatsAtRiskDesc: 'Analisis celah atau kelemahan terbesar yang berisiko',
      focusNextTitle: 'Focus Next',
      focusNextDesc: 'Aksi prioritas paling mendesak dan berdampak tinggi',
      radarTitle: 'Grafik Radar Kesiapan AI Individu',
      radarScale: 'Skala 0–5',
      radarScaleLabel: 'Skala 0 - 5',
      radarYourScore: 'Skor Anda',
      radarDesc: 'Peta distribusi kematangan 6 dimensi kompetensi.',
      radarLegendScore: 'Skor Hasil Asesmen',
      radarLegendIdeal: 'Target Ideal: 5.00',
      dimensionBreakdownTitle: 'Rincian Skor 6 Dimensi Kompetensi',
      dimensionBreakdownBadge: '6 Dimensi Dievaluasi',
      dimensionBreakdownDesc: 'Analisis mendalam pencapaian per dimensi kompetensi AI individu.',
      dimensionsDetailTitle: 'Rincian 6 Dimensi',
      dimensionsDetailBadge: 'Diurutkan dari evaluasi lengkap',
      dimensionsDetailDesc: 'Tingkat penguasaan pada masing-masing pilar kerja harian.',
      strengthsTitle: 'Kekuatan Utama Anda',
      strengthsSubtitle: '3 dimensi dengan pencapaian tertinggi',
      growthAreasTitle: 'Area Pengembangan',
      growthAreasSubtitle: '3 dimensi prioritas peningkatan',
      roadmapTitle: 'Rencana Aksi & Roadmap Pengembangan',
      roadmapDesc: 'Panduan bertahap untuk meningkatkan kecakapan AI Anda dari taktis hingga kepemimpinan.',
      roadmapBadge: '3 Fase Terstruktur',
      phase1Title: 'Sekarang',
      phase1Range: '0–30 Hari',
      phase2Title: 'Berikutnya',
      phase2Range: '1–3 Bulan',
      phase3Title: 'Selanjutnya',
      phase3Range: '3–12 Bulan',
      reflectionTitle: 'Pertanyaan Refleksi Profesional',
      reflectionSubtitle: 'Bahan perenungan kritis untuk memperdalam kedewasaan berpikir AI',
      reflectionTip: 'Tip: Diskusikan pertanyaan ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
      downloadFullPdf: 'Download Laporan Lengkap (PDF)'
    },

    individualInsights: {
      dimensionDescriptions: {
        aiLiteracy: {
          Advanced: "Pemahaman komprehensif Anda tentang AI memungkinkan Anda membedakan dengan presisi kapan harus menggunakan AI dan kapan mengandalkan human judgment.",
          Strong: "Anda memiliki pemahaman yang kuat terhadap kemampuan dan keterbatasan AI serta cukup mampu menentukan penggunaannya secara tepat.",
          Established: "Pemahaman dasar Anda sudah memadai, namun Anda perlu lebih kritis dalam menilai kemampuan dan keterbatasan AI dalam kasus yang lebih kompleks.",
          Developing: "Anda mulai memahami AI, tetapi masih perlu membedakan lebih jelas antara kapabilitas nyata AI dan persepsi umum.",
          "Needs Foundation": "Pemahaman terhadap cara kerja dan kapabilitas AI masih sangat minim. Dibutuhkan edukasi dasar tentang apa itu AI generatif."
        },
        taskFraming: {
          Advanced: "Anda ahli dalam merumuskan instruksi dan konteks yang sangat presisi, menghasilkan output AI yang langsung dapat digunakan.",
          Strong: "Anda konsisten memberikan konteks dan batasan yang jelas saat melakukan prompting, sehingga output yang dihasilkan relevan.",
          Established: "Kemampuan prompting Anda sudah cukup untuk tugas sehari-hari, namun masih bisa lebih dioptimalkan dengan instruksi yang terstruktur.",
          Developing: "Anda mulai mencoba membuat prompt, tetapi hasilnya masih sering meleset karena kurangnya konteks dan spesifisitas instruksi.",
          "Needs Foundation": "Belum terbiasa memberikan instruksi terstruktur kepada AI. Output yang didapatkan seringkali tidak sesuai dengan kebutuhan."
        },
        workflow: {
          Advanced: "AI telah menjadi tulang punggung efisiensi Anda, terintegrasi mulus dalam workflow dengan berbagai otomatisasi cerdas.",
          Strong: "AI telah menjadi bagian rutin dari alur kerja Anda dan terbukti memberikan peningkatan produktivitas yang terukur.",
          Established: "Anda sudah menggunakan AI dalam rutinitas, tetapi pendekatannya belum sepenuhnya sistematis di semua proses kerja.",
          Developing: "Penggunaan AI masih sporadis dan belum menjadi bagian terpadu dari workflow pekerjaan sehari-hari.",
          "Needs Foundation": "Sama sekali belum ada integrasi AI ke dalam alur kerja rutin. Anda masih melakukan sebagian besar pekerjaan secara konvensional."
        },
        evaluation: {
          Advanced: "Anda memiliki intuisi tajam dan standar evaluasi yang ketat dalam memvalidasi, menyunting, dan meningkatkan hasil dari AI.",
          Strong: "Anda terbiasa memeriksa dan mengkritisi output AI, tidak serta merta menerima informasi mentah tanpa proses validasi.",
          Established: "Anda melakukan evaluasi output AI, tetapi terkadang masih luput dalam mengidentifikasi bias atau kesalahan konteks.",
          Developing: "Anda menyadari perlunya evaluasi, namun seringkali masih bergantung pada output AI karena kurang terbiasa mengkritisinya.",
          "Needs Foundation": "Kecenderungan untuk menerima mentah-mentah hasil dari AI masih tinggi. Human judgment belum secara aktif dilibatkan."
        },
        responsibleAi: {
          Advanced: "Anda selalu mengedepankan etika, kepatuhan, dan manajemen risiko yang ketat sebelum mengimplementasikan solusi AI.",
          Strong: "Kesadaran Anda terhadap etika dan keamanan data sangat baik, selalu mempertimbangkan risiko sebelum berinteraksi dengan AI.",
          Established: "Anda memahami konsep etika AI, tetapi penerapannya dalam memitigasi risiko keamanan data masih belum konsisten.",
          Developing: "Kesadaran akan risiko dan etika penggunaan AI masih parsial, membutuhkan panduan lebih jelas tentang standar keamanan.",
          "Needs Foundation": "Risiko terkait keamanan data dan privasi dalam penggunaan AI belum menjadi pertimbangan dalam keseharian Anda."
        },
        collaboration: {
          Advanced: "Anda berperan sebagai katalis dan mentor, memimpin inisiatif AI dan aktif meningkatkan kemampuan rekan-rekan di sekitar Anda.",
          Strong: "Anda aktif berkolaborasi dan membagikan praktik terbaik penggunaan AI, mendukung terciptanya budaya inovasi di tim.",
          Established: "Anda terbuka untuk berkolaborasi menggunakan AI, namun belum secara proaktif membagikan insight atau inisiatif baru kepada tim.",
          Developing: "Penggunaan AI masih terisolasi untuk kebutuhan personal dan belum ada inisiatif untuk belajar atau berkolaborasi dengan orang lain.",
          "Needs Foundation": "Belum ada interaksi, diskusi, atau kolaborasi dengan tim terkait bagaimana AI dapat membantu memecahkan masalah bersama."
        }
      },
      strengthInsights: {
        aiLiteracy: "Anda memiliki pondasi literasi AI yang kuat, membedakan kapabilitas nyata dari sekadar tren, dan tahu kapan intervensi manusia dibutuhkan.",
        taskFraming: "Keahlian Anda merumuskan konteks (prompting) membuat interaksi dengan AI lebih efektif dan relevan dengan kebutuhan bisnis.",
        workflow: "Anda unggul dalam menemukan peluang integrasi AI ke dalam alur kerja, sehingga meningkatkan efisiensi dan menghemat waktu.",
        evaluation: "Kemampuan human judgment Anda menonjol; Anda memvalidasi dan menyempurnakan hasil AI alih-alih menerimanya secara mentah.",
        responsibleAi: "Anda memprioritaskan keamanan data dan pertimbangan etis, menjadikan penggunaan AI Anda aman dan profesional.",
        collaboration: "Anda mampu menginspirasi rekan kerja dan berkolaborasi secara efektif dalam mengadopsi teknologi AI di lingkungan kerja."
      },
      growthInsights: {
        aiLiteracy: "Kurangnya pemahaman terhadap mekanisme dasar AI dapat menghambat pemanfaatannya. Fokuslah pada membangun pondasi literasi terlebih dahulu.",
        taskFraming: "Instruksi yang kurang jelas akan menghasilkan output yang tidak relevan. Belajar menstrukturkan prompt akan sangat membantu meningkatkan efektivitas.",
        workflow: "Penggunaan AI yang belum konsisten membatasi potensi produktivitas Anda. Fokus berikutnya adalah menjadikan AI bagian permanen dari workflow Anda.",
        evaluation: "Terlalu mengandalkan AI tanpa validasi yang kuat berisiko menimbulkan kesalahan. Latih kemampuan evaluasi dan critical thinking terhadap output mesin.",
        responsibleAi: "Mengabaikan aspek privasi dan risiko bisa berdampak negatif. Anda perlu lebih peduli terhadap pedoman etika dan keamanan data saat menggunakan AI.",
        collaboration: "Penggunaan AI secara terisolasi mengurangi dampak positifnya. Mulailah berbagi knowledge dan berkolaborasi dengan rekan kerja."
      }
    },



    recommendations: {
      mature: {
        title: 'Mengoptimalkan, Menjaga Tata Kelola, dan Mendorong Inovasi',
        desc: 'AI sudah menjadi kemampuan organisasi yang matang. Strategi, proses, SDM, data, teknologi, dan tata kelola sudah saling mendukung dan terus diperbaiki.',
        shortDesc: 'AI sudah menjadi kemampuan organisasi yang matang dan terhubung dengan strategi, proses, SDM, data, teknologi, serta tata kelola.',
        executiveSummary: 'AI sudah menjadi kemampuan organisasi yang matang dan terhubung dengan strategi, proses, SDM, data, teknologi, serta tata kelola. Organisasi mampu mengukur manfaat, mengelola risiko, dan memperbaiki sistem secara rutin. Fokus berikutnya bukan lagi sekadar meningkatkan penggunaan, tetapi memilih inovasi yang paling bernilai dan menjaga organisasi tetap siap menghadapi perubahan teknologi dan regulasi.',
        risikoUtama: [
          'Keberhasilan saat ini dapat membuat organisasi terlalu nyaman dan terlambat memperbarui kontrol.',
          'Ketergantungan pada satu model, platform, atau vendor dapat menjadi risiko strategis.',
          'Otomatisasi berlebihan dapat mengurangi peran manusia pada keputusan yang seharusnya tetap membutuhkan tanggung jawab manusia.'
        ],
        hambatan: [
          'Hambatan mulai bergeser ke kasus yang tidak biasa dan sistem yang semakin kompleks.',
          'Aturan, hak kekayaan intelektual, asal-usul data, dan evaluasi model harus terus diperbarui.',
          'Inovasi perlu dipilih berdasarkan nilai strategis, bukan hanya karena dapat menghemat waktu.'
        ],
        quickWins: [
          'Tinjau seluruh penerapan AI berdasarkan nilai, risiko, ketergantungan, dan pembeda strategis.',
          'Lakukan simulasi untuk perubahan regulasi, perubahan penyedia AI, dan kemungkinan insiden data.',
          'Identifikasi kemampuan AI yang menjadi keunggulan khas organisasi dan perlu dilindungi.',
          'Tetapkan uji coba lanjutan dengan aturan dan kriteria penghentian yang jelas.'
        ],
        rekomendasiPrioritas: [
          'Tinjau seluruh penerapan AI berdasarkan nilai strategis, risiko, ketergantungan, dan keunggulan organisasi.',
          'Optimalkan arsitektur, evaluasi model, kontrol etika, dan mekanisme eskalasi keputusan manusia.',
          'Jalankan inovasi terpilih dan ukur kontribusinya terhadap keunggulan bersaing organisasi.'
        ],
        actionPlanPhase1: [
          'Tinjau seluruh penerapan AI, ketergantungan, risiko, dan kemampuan yang paling strategis.'
        ],
        actionPlanPhase2: [
          'Optimalkan arsitektur, evaluasi model, kontrol, dan mekanisme eskalasi ke manusia.'
        ],
        actionPlanPhase3: [
          'Jalankan inovasi terpilih dan ukur kontribusinya terhadap keunggulan organisasi, bukan hanya efisiensi.'
        ],
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
        title: 'Menyamakan Standar, Menghubungkan Sistem, dan Memperluas dengan Aman',
        desc: 'AI sudah digunakan dalam beberapa proses kerja. Fokus berikutnya adalah menyamakan standar, menghubungkan sistem, dan memperluas penerapan yang berhasil.',
        shortDesc: 'Menyamakan cara kerja antar bagian, memperkuat hubungan data dan sistem, serta memperluas AI dengan aman.',
        executiveSummary: 'AI sudah memberi manfaat nyata dan digunakan dalam beberapa proses kerja. Organisasi sudah memiliki sponsor atau penanggung jawab, tim cukup mampu menggunakan AI, dan aturan dasar sudah tersedia. Fokus berikutnya adalah menyamakan cara kerja antar bagian, memperkuat hubungan data dan sistem, serta memastikan penggunaan AI yang lebih luas tetap aman dan terkontrol.',
        risikoUtama: [
          'Perluasan yang terlalu cepat dapat menambah beban teknis dan membuat cara kerja antar tim semakin berbeda.',
          'Jumlah penggunaan AI dapat meningkat lebih cepat daripada kemampuan organisasi untuk memantau dan mengauditnya.',
          'Standar yang berbeda antar divisi dapat menimbulkan perbedaan kualitas dan risiko data.'
        ],
        hambatan: [
          'Hubungan antar sistem dan sumber data belum sepenuhnya konsisten.',
          'Standar untuk prompt, alur kerja, evaluasi, dan alat AI belum sama di seluruh organisasi.',
          'Pemantauan hasil dan risiko masih banyak dilakukan per proyek, belum secara menyeluruh.'
        ],
        quickWins: [
          'Buat daftar terpusat tentang penerapan AI, alat yang dipakai, penanggung jawab, sumber data, dan tingkat risikonya.',
          'Samakan alat AI yang disetujui, templat alur kerja, tahap pemeriksaan, dan dokumentasi minimum.',
          'Tetapkan indikator kinerja dan indikator risiko untuk penerapan AI yang sudah berjalan rutin.',
          'Buat panduan perluasan agar tim baru tidak perlu mengulang percobaan dari awal.'
        ],
        rekomendasiPrioritas: [
          'Rapikan daftar penerapan AI, standar kerja, penanggung jawab, dan ukuran hasil antar divisi.',
          'Perkuat integrasi data dan sistem serta pemantauan berkelanjutan pada proyek bernilai tinggi.',
          'Perluas penerapan yang terbukti berhasil dan tinjau tata kelola secara berkala.'
        ],
        actionPlanPhase1: [
          'Rapikan daftar penerapan AI, standar, penanggung jawab, dan ukuran hasil antar tim.'
        ],
        actionPlanPhase2: [
          'Perkuat hubungan data dan sistem serta pemantauan pada penerapan AI yang paling bernilai.'
        ],
        actionPlanPhase3: [
          'Perluas penerapan yang terbukti berhasil, tinjau tata kelola antar divisi, dan hentikan penerapan yang tidak memberi nilai.'
        ],
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
        title: 'Mengubah Uji Coba Menjadi Alur Kerja yang Konsisten',
        desc: 'Organisasi sudah memiliki dasar yang cukup untuk menjalankan AI secara lebih terarah, terukur, dan aman.',
        shortDesc: 'Memastikan penerapan AI masuk ke alur kerja yang jelas, terukur, dan aman.',
        executiveSummary: 'Organisasi sudah memiliki fondasi yang cukup untuk menggunakan AI secara lebih serius. Tujuan penggunaan mulai terkait dengan kebutuhan bisnis, proses utama cukup terdokumentasi, sebagian SDM sudah mampu memakai AI, dan data mulai tersedia. Tantangan utamanya adalah memastikan penerapan AI tidak berhenti sebagai uji coba, tetapi benar-benar masuk ke alur kerja yang jelas, terukur, dan aman.',
        risikoUtama: [
          'Uji coba yang berhasil dapat berhenti tanpa masuk ke proses kerja sehari-hari.',
          'Cara pemeriksaan hasil AI dapat berbeda antar tim sehingga kualitas tidak konsisten.',
          'Manfaat AI sulit dibuktikan jika organisasi tidak mencatat kondisi awal dan hasil sesudah penerapan.'
        ],
        hambatan: [
          'Sistem dan data belum sepenuhnya terhubung dari awal sampai akhir proses.',
          'Kemampuan AI masih terkumpul pada beberapa orang atau tim tertentu.',
          'Kontrol, audit, dan evaluasi risiko belum dilakukan secara rutin.'
        ],
        quickWins: [
          'Pilih 2-3 penerapan AI yang paling siap untuk dimasukkan ke proses kerja rutin.',
          'Buat SOP yang menjelaskan kapan hasil AI harus diperiksa manusia.',
          'Catat ukuran seperti waktu, kualitas, tingkat penggunaan, biaya, dan risiko.',
          'Buat rencana belajar yang berbeda untuk pengguna, penggerak AI, dan penanggung jawab.'
        ],
        rekomendasiPrioritas: [
          'Pilih prioritas, tentukan penanggung jawab, catat kondisi awal, dan tetapkan kriteria keberhasilan.',
          'Masukkan penerapan AI terpilih ke proses kerja nyata dan uji pada pekerjaan rutin.',
          'Ukur dampaknya, perbaiki kontrol, dan tetapkan syarat yang harus dipenuhi sebelum diperluas.'
        ],
        actionPlanPhase1: [
          'Pilih prioritas, tentukan penanggung jawab, catat kondisi awal, dan tetapkan kriteria keberhasilan.'
        ],
        actionPlanPhase2: [
          'Masukkan penerapan AI terpilih ke proses kerja nyata dan uji pada pekerjaan rutin.'
        ],
        actionPlanPhase3: [
          'Ukur dampaknya, perbaiki kontrol, dan tetapkan syarat yang harus dipenuhi sebelum diperluas.'
        ],
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
        title: 'Membuat Eksperimen Lebih Terarah dan Terkoordinasi',
        desc: 'Organisasi sudah mulai mengenal dan mencoba AI, tetapi penggunaannya belum konsisten dan belum dikelola secara terarah.',
        shortDesc: 'Membuat eksperimen AI lebih terarah, terkoordinasi, dan mudah dievaluasi.',
        executiveSummary: 'Organisasi sudah memahami potensi AI dan beberapa tim mulai mencoba menggunakannya. Namun, penggunaan masih terpisah-pisah dan belum memiliki standar yang sama. Pimpinan mulai melihat manfaat AI, tetapi prioritas, penanggung jawab, ukuran keberhasilan, dan aturan penggunaan belum konsisten. Fokus berikutnya adalah membuat eksperimen lebih terarah dan mudah dievaluasi.',
        risikoUtama: [
          'Penggunaan AI tanpa pengawasan dapat berkembang lebih cepat daripada aturan yang ada.',
          'Beberapa tim dapat menguji hal yang sama sehingga waktu dan biaya terbuang.',
          'Kualitas hasil AI dapat berbeda antar tim karena cara pemeriksaan belum seragam.'
        ],
        hambatan: [
          'Penerapan AI belum diprioritaskan berdasarkan dampak dan kemudahan pelaksanaan.',
          'Belum ada pola kerja atau templat yang dapat digunakan bersama.',
          'Kualitas dan akses data masih membatasi penggunaan AI di beberapa bagian.'
        ],
        quickWins: [
          'Tetapkan sponsor dan penggerak AI internal dengan peran yang jelas.',
          'Buat daftar kebutuhan AI dan urutkan berdasarkan dampak, kemudahan, risiko, dan kesiapan data.',
          'Buat aturan dasar untuk privasi, data sensitif, alat AI yang disetujui, dan pemeriksaan manusia.',
          'Gunakan catatan penilaian yang membandingkan kondisi sebelum dan sesudah memakai AI.'
        ],
        rekomendasiPrioritas: [
          'Tetapkan penanggung jawab, catat penggunaan AI yang berjalan, dan pilih 2-3 prioritas.',
          'Jalankan uji coba terarah dengan SOP, aturan, dan ukuran hasil yang sama.',
          'Bandingkan hasil uji coba, pertahankan praktik efektif, dan susun rencana peningkatan kemampuan tim.'
        ],
        actionPlanPhase1: [
          'Tetapkan penanggung jawab, catat penggunaan AI yang sudah berjalan, dan pilih 2-3 prioritas.'
        ],
        actionPlanPhase2: [
          'Jalankan uji coba terarah dengan SOP, aturan, dan ukuran hasil yang sama.'
        ],
        actionPlanPhase3: [
          'Bandingkan hasil uji coba, pertahankan praktik yang efektif, dan susun rencana peningkatan kemampuan tim.'
        ],
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
        title: 'Membangun Fondasi dan Uji Coba yang Aman',
        desc: 'AI belum menjadi bagian dari cara kerja organisasi. Fokus awal adalah membangun pemahaman bersama, aturan dasar, dan uji coba yang aman.',
        shortDesc: 'Membangun pemahaman bersama, aturan dasar, dan uji coba AI yang aman.',
        executiveSummary: 'Organisasi masih berada pada tahap awal. AI belum masuk ke agenda strategis secara jelas dan belum ada penanggung jawab khusus. Proses kerja, kesiapan SDM, data, teknologi, serta aturan penggunaan AI juga belum terbentuk dengan baik. Prioritas utama saat ini adalah memahami kebutuhan organisasi sebelum melakukan penerapan yang lebih luas.',
        risikoUtama: [
          'Karyawan dapat mencoba AI tanpa aturan yang jelas sehingga data sensitif berisiko ikut dibagikan.',
          'Organisasi dapat membeli alat AI karena mengikuti tren, bukan karena kebutuhan yang nyata.',
          'Hasil dari AI sulit dijaga kualitasnya karena belum ada aturan pemeriksaan dan tanggung jawab yang jelas.'
        ],
        hambatan: [
          'Belum ada penanggung jawab yang mengarahkan penggunaan AI.',
          'Masalah utama dalam proses kerja belum dipetakan dengan jelas.',
          'Literasi AI, kesiapan data, dan aturan privasi masih rendah.'
        ],
        quickWins: [
          'Tunjuk satu PIC untuk mengoordinasikan eksplorasi AI.',
          'Pilih 1-2 tugas sederhana yang berisiko rendah untuk diuji dengan AI.',
          'Buat aturan singkat tentang data yang boleh dan tidak boleh dimasukkan ke alat AI.',
          'Catat kondisi awal proses kerja agar hasil uji coba dapat dibandingkan.'
        ],
        rekomendasiPrioritas: [
          'Samakan pemahaman pimpinan, petakan masalah proses, dan buat aturan dasar penggunaan AI.',
          'Jalankan satu uji coba kecil dengan ukuran keberhasilan yang jelas (waktu, kualitas, atau biaya).',
          'Evaluasi hasil uji coba dan tentukan apakah penerapan perlu dihentikan, diperbaiki, atau dilanjutkan.'
        ],
        actionPlanPhase1: [
          'Samakan pemahaman pimpinan, petakan masalah proses, dan buat aturan dasar penggunaan AI.'
        ],
        actionPlanPhase2: [
          'Jalankan satu uji coba kecil dengan ukuran keberhasilan yang jelas, misalnya waktu, kualitas, atau biaya.'
        ],
        actionPlanPhase3: [
          'Evaluasi hasil uji coba dan tentukan apakah penerapan tersebut perlu dihentikan, diperbaiki, atau dilanjutkan.'
        ],
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
    },
    individualRecommendations: {
      mature: {
        title: 'Siap Memimpin dan Mengembangkan',
        levelName: 'AI-Mature',
        desc: 'Anda memiliki praktik AI yang matang, sistematis, dan dapat dipertanggungjawabkan. Tantangan berikutnya bukan lagi belajar menggunakan AI, tetapi meningkatkan skala, kualitas, dan kemampuan membimbing orang lain.',
        whatsWorking: 'Anda menunjukkan pondasi yang solid di seluruh dimensi. Anda berani bereksperimen, merefleksikan hasil, dan beradaptasi. Anda tidak hanya menggunakan AI — Anda berpikir kritis tentang cara dan waktu penggunaannya serta memimpin adopsi tim.',
        whatsAtRisk: 'Di level ini, risikonya adalah rasa cepat puas atau terisolasi. Jika Anda melesat jauh di depan rekan-rekan, Anda mungkin berjalan sendiri tanpa mengangkat kompetensi tim secara keseluruhan.',
        focusNext: 'Mengoptimalkan dan memimpin: skalakan praktik yang sudah matang tanpa kehilangan kualitas, keamanan, dan penilaian manusia.',
        phase1Actions: [
          'Audit workflow AI yang sudah berjalan dan tandai bagian yang masih bergantung pada keputusan manual berulang.',
          'Dokumentasikan aturan eskalasi untuk kasus berisiko tinggi, ambigu, atau membutuhkan keahlian khusus.',
          'Tinjau kebijakan data dan ketentuan tools yang digunakan untuk memastikan praktik tetap aman.'
        ],
        phase2Actions: [
          'Bangun library praktik terbaik yang dapat digunakan atau diajarkan kepada orang lain.',
          'Uji automasi atau AI agent pada workflow yang sudah stabil dengan monitoring dan human approval yang jelas.',
          'Gunakan metrik dampak untuk membandingkan kualitas, waktu, dan efisiensi sebelum dan sesudah AI.'
        ],
        phase3Actions: [
          'Berperan sebagai mentor atau champion untuk membantu orang lain membangun kemampuan AI yang sehat.',
          'Buat siklus evaluasi berkala agar prompt, workflow, dan aturan risiko terus diperbarui.',
          'Fokus pada diferensiasi: tentukan bagian pekerjaan yang menjadi keahlian manusia dan tidak seharusnya dikomoditaskan oleh AI.'
        ],
        reflectionPrompts: [
          'Bagaimana cara terbaik Anda dapat membagikan keahlian AI Anda saat ini untuk membantu meningkatkan produktivitas tim?',
          'Aktivitas apa dalam pekerjaan Anda yang paling berpotensi ditingkatkan efisiensinya dengan AI tingkat lanjut?',
          'Inisiatif inovasi AI apa yang dapat Anda pimpin dalam 6 bulan ke depan?',
          'Bagaimana Anda memastikan tim tetap mengutamakan etika dan privasi data saat berinovasi?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Pemahaman Arsitektur & Strategi AI: Keahlian mendalam dalam memadukan kapabilitas model generatif mutakhir ke strategi bisnis.',
          'Human Judgment & Validasi Tingkat Tinggi: Standar evaluasi ketat dan intuisi tajam dalam mengeliminasi bias dan risiko halusinasi.',
          'AI Leadership & Mentoring Budaya: Berperan sebagai penggerak inovasi yang aktif membimbing rekan dan membagikan praktik terbaik.'
        ],
        growthAreas: [
          'Otomatisasi Autonomous Multi-Agent: Perluas eksplorasi ke arsitektur AI agentik mandiri untuk proses kerja kompleks.',
          'Penyebaran Skalabilitas Organisasi: Hindari keahlian terisolasi; dorong kodifikasi pengetahuan ke standar SOP perusahaan.',
          'Audit Kepatuhan & Tata Kelola Lanjutan: Terus perbarui kerangka kerja etika dan kepatuhan terhadap regulasi AI global.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.mature,
        growthInsights: levelGrowthInsightsDefaults.mature
      },
      enabled: {
        title: 'Terintegrasi dan Konsisten',
        levelName: 'AI-Enabled',
        desc: 'AI sudah menjadi bagian nyata dari cara Anda bekerja. Anda tidak hanya bisa menggunakan tools, tetapi juga mampu memilih pendekatan, mengatur alur kerja, mengevaluasi hasil, dan menjaga batasan penggunaan.',
        whatsWorking: 'Anda sudah menemukan ritme penggunaan AI yang konsisten. Keterampilan Anda terbukti nyata dalam mempercepat penyelesaian tugas rutin dan analitis dengan evaluasi kritis yang baik.',
        whatsAtRisk: 'Pemanfaatan AI berisiko berhenti pada level produktivitas individual tanpa adanya standarisasi alur kerja dan otomasi yang lebih dalam.',
        focusNext: 'Meningkatkan leverage: sistematiskan workflow, ukur dampak, dan gunakan automasi dengan batas human review yang jelas.',
        phase1Actions: [
          'Pilih satu workflow bernilai tinggi dan petakan bagian yang bisa diotomatisasi tanpa mengurangi kualitas.',
          'Rapikan prompt, template, dan checklist menjadi sistem yang mudah digunakan kembali.',
          'Tambahkan metrik sederhana untuk melihat dampak AI terhadap waktu, kualitas, atau jumlah revisi.'
        ],
        phase2Actions: [
          'Uji penggunaan AI agent atau automasi ringan pada pekerjaan yang berulang dan berisiko rendah.',
          'Buat klasifikasi tugas: dapat diotomatisasi, perlu review, dan harus dikerjakan manusia.',
          'Dokumentasikan aturan penggunaan data dan hak cipta untuk tools yang paling sering digunakan.'
        ],
        phase3Actions: [
          'Bangun sistem berbagi praktik AI dengan rekan, misalnya sesi singkat atau library bersama.',
          'Tinjau workflow secara berkala untuk menemukan bottleneck baru setelah automasi diterapkan.',
          'Gunakan data dampak untuk menentukan investasi tools dan pengembangan kemampuan berikutnya.'
        ],
        reflectionPrompts: [
          'Di bagian mana Anda merasa masih terlalu bergantung pada output AI tanpa melakukan evaluasi kritis secara mendalam?',
          'Workflow pekerjaan apa yang dapat Anda sederhanakan dengan otomatisasi AI bulan ini?',
          'Skill spesifik terkait AI apa yang paling krusial untuk Anda kuasai dalam 90 hari ke depan?',
          'Bagaimana Anda memastikan kepatuhan etika dan kerahasiaan data dalam penggunaan AI harian?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Konsistensi Alur Kerja Harian: Rutin mengintegrasikan tools AI untuk memangkas waktu kerja dan meningkatkan ketelitian output.',
          'Prompting Terstruktur & Presisi: Menguasai teknik perumusan prompt kaya konteks yang langsung menghasilkan solusi relevan.',
          'Validasi Kritis Sebelum Rilis: Disiplin melakukan kurasi dan verifikasi mandiri sebelum output AI digunakan dalam pekerjaan.'
        ],
        growthAreas: [
          'Eksplorasi Otomatisasi Antar-Tools: Hubungkan berbagai alat AI menggunakan otomasi alur kerja (seperti integrasi API/Zapier).',
          'Pengembangan Personal Prompt Library: Dokumentasikan template prompt terbaik agar dapat digunakan kembali secara konsisten.',
          'Inisiatif Berbagi Pengetahuan: Mulai adakan sesi berbagi singkat kepada rekan setim mengenai cara penggunaan AI yang efektif.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.enabled,
        growthInsights: levelGrowthInsightsDefaults.enabled
      },
      ready: {
        title: 'Siap dan Mandiri',
        levelName: 'AI-Ready',
        desc: 'Anda sudah mampu menggunakan AI secara mandiri pada pekerjaan yang familiar. Fondasi sudah cukup kuat, tetapi manfaatnya belum selalu konsisten karena workflow dan dokumentasi masih bisa diperkuat.',
        whatsWorking: 'Anda memiliki pemahaman dasar yang baik dan antusiasme tinggi untuk bereksperimen dengan AI di pekerjaan harian.',
        whatsAtRisk: 'Kemajuan Anda bisa terhenti menjadi sekadar teori jika tidak diiringi dengan praktik rutin dan integrasi sistematis ke alur kerja nyata.',
        focusNext: 'Membuat penggunaan AI dapat diulang: dokumentasikan workflow, ukur manfaat, dan tetapkan review yang konsisten.',
        phase1Actions: [
          'Dokumentasikan tiga workflow AI yang paling sering digunakan, lengkap dengan prompt dan langkah review.',
          'Tetapkan checklist sederhana sebelum output AI digunakan untuk pekerjaan penting.',
          'Identifikasi satu tugas repetitif yang bisa dibuat lebih cepat dengan template atau automasi ringan.'
        ],
        phase2Actions: [
          'Integrasikan AI ke lebih dari satu tahap kerja, misalnya riset, ideasi, produksi, lalu evaluasi.',
          'Catat satu indikator dampak seperti waktu yang dihemat, kecepatan revisi, atau kualitas output.',
          'Tentukan kondisi kapan AI boleh membantu secara mandiri dan kapan wajib mendapat review manusia.'
        ],
        phase3Actions: [
          'Bangun library prompt dan workflow yang terorganisasi berdasarkan jenis pekerjaan.',
          'Eksperimen dengan tools atau pendekatan AI yang berbeda untuk tugas yang lebih kompleks.',
          'Mulai membagikan praktik yang terbukti efektif kepada rekan atau tim kecil.'
        ],
        reflectionPrompts: [
          'Hambatan terbesar apa yang mencegah Anda menjadikan AI sebagai kebiasaan kerja sehari-hari?',
          'Tugas rutin apa yang jika dibantu AI dapat menghemat minimal 3 jam kerja Anda setiap minggu?',
          'Bagaimana Anda dapat memvalidasi kebenaran informasi yang dihasilkan oleh AI secara mandiri?',
          'Langkah konkret apa yang akan Anda ambil minggu ini untuk mulai membangun kebiasaan menggunakan AI?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Antusiasme Eksplorasi Tools: Cepat beradaptasi mencoba fitur-fitur baru pada berbagai platform kecerdasan buatan.',
          'Pemanfaatan AI untuk Brainstorming: Efektif menggunakan asisten AI sebagai rekan berdiskusi dan perumus draf awal tugas.',
          'Kehati-hatian Privasi Dasar: Memiliki kesadaran awal yang baik tentang perlindungan data saat berinteraksi dengan AI.'
        ],
        growthAreas: [
          'Standarisasi Struktur Instruksi (Prompting): Hindari instruksi terlalu umum; pelajari framework Konteks, Peran, Tugas, & Batasan.',
          'Membangun Rutinitas Harian AI: Tentukan minimal 2 tugas harian tetap yang secara disiplin diselesaikan dengan bantuan AI.',
          'Peningkatan Kritis Human Judgment: Tingkatkan ketelitian memverifikasi data dan angka dari AI agar tidak terjadi kesalahan fakta.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.ready,
        growthInsights: levelGrowthInsightsDefaults.ready
      },
      aware: {
        title: 'Mulai Bereksperimen',
        levelName: 'AI-Aware',
        desc: 'Anda sudah mengenal AI dan mulai mencoba beberapa cara penggunaan. Tantangannya adalah mengubah eksperimen yang terpisah menjadi kebiasaan yang lebih terarah dan konsisten.',
        whatsWorking: 'Keinginan dan rasa ingin tahu Anda untuk mengeksplorasi AI sudah terbentuk, menjadi modal awal yang sangat berharga.',
        whatsAtRisk: 'Kurangnya pemahaman komprehensif dan keterbatasan praktik berpotensi menyebabkan keraguan atau penggunaan yang kurang optimal.',
        focusNext: 'Mengubah eksperimen menjadi praktik: membangun prompt yang dapat dipakai ulang dan penggunaan AI yang lebih konsisten.',
        phase1Actions: [
          'Pilih tiga tugas yang paling sering Anda lakukan dan uji AI pada tugas tersebut selama dua minggu.',
          'Simpan prompt yang menghasilkan output baik agar dapat digunakan kembali.',
          'Buat aturan sederhana tentang informasi apa yang boleh dan tidak boleh dimasukkan ke tools AI.'
        ],
        phase2Actions: [
          'Bangun toolkit pribadi berisi 2-3 tools AI dengan fungsi yang jelas untuk masing-masing tugas.',
          'Gunakan struktur prompt yang konsisten: tujuan, konteks, batasan, dan format output.',
          'Bandingkan hasil AI dengan sumber atau referensi lain pada pekerjaan yang membutuhkan akurasi.'
        ],
        phase3Actions: [
          'Pilih satu workflow kerja untuk dibuat lebih terstruktur dengan bantuan AI dari awal sampai akhir.',
          'Mulai mencatat manfaat AI, misalnya waktu yang dihemat atau jumlah revisi yang berkurang.',
          'Bagikan satu praktik atau prompt yang efektif kepada rekan ketika relevan.'
        ],
        reflectionPrompts: [
          'Apa kekhawatiran terbesar Anda saat menggunakan alat bantu AI dalam pekerjaan?',
          'Aktivitas apa yang paling ingin Anda selesaikan lebih cepat dengan bantuan teknologi?',
          'Bagaimana cara Anda membedakan tugas yang cocok untuk AI versus tugas yang memerlukan intuisi penuh Anda?',
          'Siapa rekan kerja yang bisa menjadi teman belajar dan bertukar ide AI bagi Anda?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Keterbukaan terhadap Teknologi Baru: Memiliki rasa ingin tahu positif untuk mulai mengenal peran AI di lingkungan kerja.',
          'Mengenali Potensi Efisiensi: Menyadari peluang penghematan waktu yang bisa didapatkan melalui adopsi tools AI.',
          'Kesiapan Mengikuti Pembelajaran: Sangat responsif terhadap pelatihan dan arahan peningkatan keterampilan digital.'
        ],
        growthAreas: [
          'Pemahaman Dasar Mekanisme AI: Pelajari konsep dasar Generative AI agar ekspektasi hasil sesuai dengan kapabilitas riil.',
          'Latihan Mandiri 15 Menit Sehari: Luangkan waktu singkat setiap hari untuk mencoba perintah sederhana pada asisten AI.',
          'Pencegahan Ketergantungan Mentah: Selalu baca ulang dan periksa kebenaran jawaban AI sebelum menyebarkannya ke pihak lain.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.aware,
        growthInsights: levelGrowthInsightsDefaults.aware
      },
      unready: {
        title: 'Baru Memulai',
        levelName: 'AI-Unready',
        desc: 'Anda masih berada pada tahap awal. Fokus utama saat ini bukan menggunakan banyak tools, tetapi membangun pemahaman dasar dan kebiasaan penggunaan AI yang aman.',
        whatsWorking: 'Anda memiliki ruang pertumbuhan dan potensi akselerasi produktivitas yang sangat besar dengan mulai mengenal teknologi AI.',
        whatsAtRisk: 'Risiko tertinggal dalam efisiensi kerja jika tidak segera memulai langkah awal mengenal dan mengadopsi alat bantu modern.',
        focusNext: 'Membangun dasar: memahami AI, mencoba dengan aman, dan menemukan 1-2 penggunaan yang benar-benar bermanfaat.',
        phase1Actions: [
          'Pilih satu tools AI yang paling relevan dengan pekerjaan Anda dan gunakan untuk satu tugas sederhana.',
          'Pelajari tiga batasan dasar AI: hasil bisa salah, bisa bias, dan kualitas output sangat bergantung pada input.',
          'Hindari memasukkan data pribadi, rahasia perusahaan, atau informasi sensitif saat masih belajar.'
        ],
        phase2Actions: [
          'Latih cara menulis prompt sederhana dengan tujuan, konteks, dan format hasil yang jelas.',
          'Coba AI pada 2-3 jenis tugas berulang, lalu catat tugas mana yang benar-benar membantu.',
          'Biasakan memeriksa ulang fakta atau informasi penting sebelum menggunakan hasil AI.'
        ],
        phase3Actions: [
          'Bangun kebiasaan penggunaan AI yang konsisten untuk beberapa tugas yang sudah terbukti bermanfaat.',
          'Mulai menyimpan prompt atau cara kerja yang berhasil agar tidak selalu memulai dari awal.',
          'Lakukan asesmen ulang setelah 2-3 bulan untuk melihat perkembangan kemampuan dan kebiasaan.'
        ],
        reflectionPrompts: [
          'Apa yang membuat Anda belum banyak menggunakan teknologi AI hingga saat ini?',
          'Jika ada satu tugas pekerjaan yang bisa diselesaikan 2x lebih cepat, tugas apa yang Anda pilih?',
          'Bantuan atau bimbingan seperti apa yang paling Anda butuhkan untuk mulai belajar AI?',
          'Bagaimana Anda bisa menyisihkan 15 menit minggu ini untuk memulai eksplorasi pertama Anda?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Potensi Transformasi Signifikan: Peluang akselerasi produktivitas yang sangat besar karena masih berada di awal kurva adopsi.',
          'Pengalaman Konvensional yang Kaya: Memiliki pemahaman proses kerja riil yang kuat sebagai modal penerapan solusi AI nantinya.',
          'Kehati-hatian Alami: Sikap waspada alami yang bermanfaat sebagai pondasi kepatuhan tata kelola risiko AI.'
        ],
        growthAreas: [
          'Pondasi AI Literacy Mendasar: Ikuti program pengenalan AI dasar untuk memahami apa yang bisa dan tidak bisa dilakukan AI.',
          'Mencoba Interaksi Pertama: Mulai coba ajukan pertanyaan sederhana atau minta bantuan ringkasan teks pada AI gratis/resmi.',
          'Menghilangkan Hambatan Psikologis: Bangun keyakinan bahwa AI adalah asisten penunjang kerja, bukan ancaman pengganti profesi.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.unready,
        growthInsights: levelGrowthInsightsDefaults.unready
      }
    },
    admin: {
      dashboardTitle: 'Dashboard Admin',
      dashboardSubtitle: 'Manajemen & Analisis Asesmen Kesiapan AI',
      companyDashboard: 'Dashboard Perusahaan',
      individualDashboard: 'Dashboard Individu',
      manageContent: 'Manage Content (CMS)',
      logout: 'Keluar',

      orgHistoryTitle: 'Riwayat Asesmen Kesiapan AI Organisasi',
      orgHistorySubtitle: 'Analisis 5 pilar transformasi AI untuk enterprise & institusi bisnis.',
      indHistoryTitle: 'Riwayat Asesmen Kesiapan AI Individu & Profesional',
      indHistorySubtitle: 'Analisis 6 dimensi kompetensi dan workflow AI untuk talenta profesional.',

      totalOrgSubmissions: 'Total Asesmen Organisasi',
      totalIndSubmissions: 'Total Asesmen Individu',
      last7Days: '7 hari terakhir',
      avgScore: 'Rata-rata Skor Kesiapan',
      outOf5: 'Skala 0.0 - 5.0',
      industries: 'Sektor Industri',
      differentSectors: 'Kategori industri unik',
      jobRoles: 'Ragam Jabatan & Peran',
      uniqueProfessions: 'Profesi unik terdaftar',
      aiMatureOrgs: 'Organisasi AI-Mature',
      aiMatureInds: 'Praktisi AI-Mature',
      topPerformers: 'Skor tinggi (≥ 3.6)',

      searchPlaceholderOrg: 'Cari perusahaan, nama PIC, email, atau industri...',
      searchPlaceholderInd: 'Cari nama, email, jabatan, perusahaan, atau tools AI...',
      filters: 'Filter Data',
      exportCsv: 'CSV',
      exportExcel: 'Excel',
      readinessLevel: 'Tingkat Kesiapan AI',
      allLevels: 'Semua Tingkat Kesiapan',
      levelUnready: 'AI-Unready',
      levelAware: 'AI-Aware',
      levelReady: 'AI-Ready',
      levelEnabled: 'AI-Enabled',
      levelMature: 'AI-Mature',
      industryLabel: 'Sektor Industri',
      allIndustries: 'Semua Industri',
      experienceLabel: 'Lama Pengalaman Kerja',
      allExperience: 'Semua Pengalaman',
      expUnder1: '< 1 tahun',
      exp1to3: '1-3 tahun',
      exp3to5: '3-5 tahun',
      expOver5: '> 5 tahun',

      showing: 'Menampilkan',
      of: 'dari',
      companySubmissionsText: 'asesmen perusahaan',
      individualSubmissionsText: 'asesmen individu',
      noSubmissions: 'Belum ada riwayat asesmen',
      noSubmissionsOrgDesc: 'Belum ada perusahaan yang mengisi asesmen kesiapan AI.',
      noSubmissionsIndDesc: 'Belum ada individu yang mengisi asesmen kesiapan AI profesional.',

      thNo: 'No.',
      thCompanyLocation: 'Perusahaan & Lokasi',
      thPicContact: 'PIC & Kontak',
      thIndustry: 'Industri',
      thScore: 'Skor',
      thLevel: 'Level',
      thDate: 'Tanggal',
      thActions: 'Aksi',
      thNameContact: 'Nama & Kontak',
      thRoleCompany: 'Jabatan & Instansi',
      thExpTools: 'Pengalaman & AI Tools',

      loginTitle: 'Admin Dashboard',
      loginSubtitle: 'AI Readiness Assessment',
      loginHeader: 'Login sebagai Admin',
      password: 'Password Admin',
      passwordPlaceholder: 'Masukkan password',
      wrongPassword: 'Password salah',
      loginBtn: 'Masuk',
      backHome: 'Kembali ke Beranda'
    }
  },
  EN: {
    header: {
      adminLogin: 'Admin Login',
    },
    landing: {
      title: 'AI Readiness Assessment',
      subtitle: 'Measure your organization\'s readiness level in adopting Artificial Intelligence technology',
      duration: 'Duration: 15-20 minutes',
      startAssessment: 'Start Assessment',
      startOrgAssessment: 'Organizational AI Readiness Assessment',
      startIndAssessment: 'Individual AI Readiness Assessment',
      description: 'A comprehensive assessment evaluating 5 key pillars of your organization\'s AI readiness: Strategy & Leadership, Process & Workflow, People & Capabilities, Data & Technology, and Governance & Responsible AI.',
      whatYouGet: 'What You\'ll Get:',
      benefits: [
        'Measurable AI Readiness Score (NORTIS Index)',
        'In-depth analysis for each pillar',
        'Actionable strategic recommendations',
        '90-day roadmap for AI transformation',
        'Fully exportable comprehensive report'
      ],
      pillarsTitle: '5 Organization Assessment Pillars:',
      pillars: {
        strategy: 'Strategy & Leadership',
        process: 'Process & Workflow',
        people: 'People & Capabilities',
        data: 'Data & Technology',
        governance: 'Governance & Responsible AI'
      },
      indPillarsTitle: '6 Individual Assessment Dimensions:',
      indPillars: {
        aiLiteracy: 'AI Literacy & Mindset',
        taskFraming: 'Task Framing & Prompting',
        workflow: 'Workflow & Integration',
        evaluation: 'Evaluation & Human Judgment',
        responsibleAi: 'Responsible AI & Risk',
        collaboration: 'Collaboration & AI Growth'
      },
      readyToMeasure: 'Ready to Measure Your AI Readiness?',
      readyDesc: 'Start now and get actionable insights for your organization\'s AI transformation'
    },
    form: {
      title: 'Nortis Assessment',
      subtitle: 'Please complete your company and personal information to help us comprehensively understand your company\'s AI needs.',
      companyData: 'Company Data',
      companyName: 'Company Name',
      companyNamePlaceholder: 'Example: Tech Innovation Inc.',
      industry: 'Industry',
      industryPlaceholder: 'Select industry',
      industries: {
        finance: 'Banking & Finance',
        it: 'Technology & IT',
        manufacturing: 'Manufacturing',
        retail: 'Retail & E-commerce',
        healthcare: 'Healthcare',
        education: 'Education',
        telecom: 'Telecommunications',
        energy: 'Energy',
        logistics: 'Transportation & Logistics',
        other: 'Other'
      },
      companySize: 'Company Size',
      companySizePlaceholder: 'Select company size',
      companySizes: {
        s50: '1-50 employees',
        s200: '51-200 employees',
        s500: '201-500 employees',
        s1000: '501-1000 employees',
        splus: '1000+ employees'
      },
      location: 'Location',
      locationPlaceholder: 'City, Country',
      aiNeeds: 'Individual AI Existing Conditions',
      aiGoal: 'Main Goal of AI Adoption',
      aiGoalPlaceholder: 'Example: Improve operational efficiency, customer experience, etc.',
      aiUseCase: 'AI Use Cases Considered',
      aiUseCasePlaceholder: 'Example: Customer service chatbot, predictive analytics, automation, etc.',
      aiTools: 'What AI tools are needed?',
      aiToolsPlaceholder: 'Example: ChatGPT, Google Gemini, Midjourney, automation tools, etc.',
      aiCurrentUse: 'What have you used AI for?',
      aiCurrentUsePlaceholder: 'Example: Content creation, customer service, data analysis, etc.',
      aiFrequentUse: 'What AI is most frequently used?',
      aiFrequentUsePlaceholder: 'Example: ChatGPT for brainstorming, Gemini for research, Midjourney for design, etc.',
      aiLearningNeed: 'What do you need to learn AI for?',
      aiLearningNeedPlaceholder: 'Example: Improve team productivity, business process automation, data analysis, etc.',
      aiMasteryTarget: 'In what area do you target to master AI?',
      aiMasteryTargetPlaceholder: 'Example: Marketing & Sales, Operations & Automation, Product Development, Data Analytics, etc.',
      timeline: 'Expected Implementation Timeline',
      timelinePlaceholder: 'Select timeline',
      timelines: {
        m3: '0-3 Months',
        m6: '3-6 Months',
        m12: '6-12 Months',
        mplus: '12+ Months',
        none: 'No timeline yet'
      },
      personalContact: 'Personal Data',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Your full name',
      jobTitle: 'Job Title',
      jobTitlePlaceholder: 'Your current position',
      email: 'Professional Email',
      emailPlaceholder: 'name@company.com',
      phone: 'Phone Number',
      phonePlaceholder: '+62 812-3456-7890',
      dropdownPlaceholder: 'Select an option...',
      back: 'Back',
      next: 'Continue Assessment'
    },
    questions: {
      title: 'AI Readiness Assessment',
      subtitle: 'Evaluate your organization\'s readiness in adopting AI technology',
      progress: 'Progress',
      pillarIndicators: ['Pillar 1 of 5', 'Pillar 2 of 5', 'Pillar 3 of 5', 'Pillar 4 of 5', 'Pillar 5 of 5'],
      scaleTitle: 'Scoring Scale:',
      scale: [
        { score: 0, label: 'None at all' },
        { score: 1, label: 'Ad-hoc / sporadic' },
        { score: 2, label: 'Started, but inconsistent' },
        { score: 3, label: 'Fairly ready, still limited' },
        { score: 4, label: 'Ready & structured' },
        { score: 5, label: 'Mature & scalable' },
      ],
      prev: 'Previous',
      next: 'Next',
      finish: 'Finish'
    },

    individualForm: {
      title: 'Individual AI Readiness Assessment Form',
      subtitle: 'Please complete your professional profile to help us map your personalized AI maturity and competency level.',
      personalData: 'Personal Data & Professional Profile',
      fullName: 'Full Name',
      fullNamePlaceholder: 'Enter your full name',
      email: 'Email',
      emailPlaceholder: 'Enter your email address',
      phone: 'WhatsApp Number',
      phonePlaceholder: 'Example: +62 812-3456-7890',
      jobTitle: 'Job Title / Profession',
      jobTitlePlaceholder: 'Example: Data Analyst, Freelancer, Student',
      companyName: 'Company / Organization Name (Optional)',
      companyNamePlaceholder: 'Leave blank if none',
      industry: 'Industry / Field of Work',
      industryPlaceholder: 'Select industry',
      industries: {
        finance: 'Banking & Finance',
        it: 'Technology & IT',
        manufacturing: 'Manufacturing',
        retail: 'Retail & E-commerce',
        healthcare: 'Healthcare',
        education: 'Education',
        telecom: 'Telecommunications',
        energy: 'Energy',
        logistics: 'Transportation & Logistics',
        creative: 'Creative & Media',
        consulting: 'Consulting & Professional Services',
        student: 'Student / Academia',
        other: 'Other'
      },
      experienceYears: 'Work Experience Duration',
      experienceYearsPlaceholder: 'Example: 3 years, Not working yet',
      aiUsageFrequency: 'How often do you use AI?',
      aiUsageFrequencyPlaceholder: 'Select AI usage frequency',
      aiUsageFrequencies: [
        'Never',
        'Rarely',
        'A few times a month',
        'A few times a week',
        'Every day'
      ],
      aiToolsUsed: 'AI Tools commonly used',
      aiToolsUsedPlaceholder: 'Example: ChatGPT, Claude, Midjourney, etc. (Leave blank if never)',
      back: 'Back',
      next: 'Continue to Questionnaire'
    },

    individualQuestionsData: {
      title: 'Individual AI Readiness Questionnaire',
      subtitle: 'Evaluate 6 dimensions of AI proficiency to map your personal professional maturity profile',
      progress: 'Questionnaire Progress',
      dimensionIndicators: [
        'Dimension 1 of 6: AI Literacy & Mindset',
        'Dimension 2 of 6: Task Framing & Prompting',
        'Dimension 3 of 6: Workflow & Integration',
        'Dimension 4 of 6: Evaluation & Human Judgment',
        'Dimension 5 of 6: Responsible AI & Risk',
        'Dimension 6 of 6: Collaboration & AI Growth'
      ],
      scaleTitle: 'Proficiency Scoring Scale (0 - 5):',
      prev: 'Previous',
      next: 'Next',
      finish: 'Finish & View Results'
    },
    
    individualAssessmentData: [
      { id: 'aiLiteracy', title: 'AI Literacy & Mindset', shortTitle: 'Literacy', description: 'Core understanding and mindset toward AI' },
      { id: 'taskFraming', title: 'Task Framing & Prompting', shortTitle: 'Prompting', description: 'Ability to frame tasks and structure effective prompts' },
      { id: 'workflow', title: 'Workflow & Integration', shortTitle: 'Workflow', description: 'Integrating AI into personal and team workflows' },
      { id: 'evaluation', title: 'Evaluation & Human Judgment', shortTitle: 'Evaluation', description: 'Critical evaluation of AI output with human discernment' },
      { id: 'responsibleAi', title: 'Responsible AI & Risk', shortTitle: 'Risk', description: 'Ethical, compliant, and risk-aware AI usage' },
      { id: 'collaboration', title: 'Collaboration & AI Growth', shortTitle: 'Growth', description: 'Collaborative problem solving and continuous AI upskilling' }
    ],
    individualQuestions: {
      aiLiteracy: [
        { id: 'A1', text: 'I understand the core capabilities of generative AI and which types of tasks are best assisted by AI.' },
        { id: 'A2', text: 'I understand that AI can produce convincing yet inaccurate or fabricated outputs (hallucinations).' },
        { id: 'A3', text: 'I can clearly distinguish tasks suitable for AI assistance from those requiring human judgment and oversight.' },
        { id: 'A4', text: 'I understand AI limitations including hallucinations, bias, context windows, and input dependency.' },
        { id: 'A5', text: 'I view AI as a capability-multiplier and quality booster rather than just a manual task replacement.' }
      ],
      taskFraming: [
        { id: 'B1', text: 'Before using AI, I clearly define the specific objective and target outcome I want to achieve.' },
        { id: 'B2', text: 'I can provide precise context, clear instructions, operational constraints, and desired output formats to AI.' },
        { id: 'B3', text: 'I can decompose complex workflows into structured sub-tasks suitable for AI-assisted execution.' },
        { id: 'B4', text: 'I iteratively refine and adjust my prompts when initial AI outputs do not fully meet requirements.' },
        { id: 'B5', text: 'I can select appropriate AI tools and paradigms tailored to different task requirements.' }
      ],
      workflow: [
        { id: 'C1', text: 'I routinely leverage AI in daily work tasks rather than solely for ad-hoc experimentation.' },
        { id: 'C2', text: 'I actively identify repetitive, time-consuming tasks that can be streamlined or automated with AI.' },
        { id: 'C3', text: 'I maintain reusable workflows, prompt templates, and standardized procedures for recurring tasks.' },
        { id: 'C4', text: 'I integrate AI across multiple phases of work from research and ideation to drafting, analysis, and review.' },
        { id: 'C5', text: 'I can demonstrate tangible productivity, speed, and quality gains from adopting AI in my work.' }
      ],
      evaluation: [
        { id: 'D1', text: 'I systematically verify critical information produced by AI before utilizing or publishing it.' },
        { id: 'D2', text: 'I can identify when AI answers seem plausible but contain subtle errors or misleading details.' },
        { id: 'D3', text: 'I cross-reference AI outputs against authoritative data sources when accuracy is paramount.' },
        { id: 'D4', text: 'I understand when AI outputs require mandatory expert review, legal checks, or human approval.' },
        { id: 'D5', text: 'I do not make pivotal business decisions based solely on AI outputs without contextual validation.' }
      ],
      responsibleAi: [
        { id: 'E1', text: 'I evaluate data privacy, intellectual property, and confidentiality before submitting inputs to AI.' },
        { id: 'E2', text: 'I understand that proprietary corporate data and personally identifiable information must not be exposed to public AI models.' },
        { id: 'E3', text: 'I consider potential bias, fairness, and ethical implications in AI-generated conclusions.' },
        { id: 'E4', text: 'I adhere to copyright guidelines and responsible usage policies for AI-created assets.' },
        { id: 'E5', text: 'I take full personal accountability for the final deliverables and outcomes produced with AI support.' }
      ],
      collaboration: [
        { id: 'F1', text: 'I continuously stay informed on emerging AI tools, methodologies, and best practices relevant to my domain.' },
        { id: 'F2', text: 'I actively share effective prompts, workflows, and AI learnings with team members and peers.' },
        { id: 'F3', text: 'I use AI as a sparring partner to brainstorm ideas and explore diverse solutions rather than just an answer bot.' },
        { id: 'F4', text: 'I determine clear delegation boundaries between autonomous AI tasks and human-in-the-loop decisions.' },
        { id: 'F5', text: 'I adapt my working style effectively as AI capabilities and autonomous agents advance.' }
      ],
      scale: [
        { value: 0, label: '0 = Never / Not capable yet' },
        { value: 1, label: '1 = Very limited, requires substantial guidance' },
        { value: 2, label: '2 = Started applying, but inconsistent' },
        { value: 3, label: '3 = Independent in familiar situations' },
        { value: 4, label: '4 = Consistently proficient across various scenarios' },
        { value: 5, label: '5 = Highly proficient, systematic, able to mentor others' }
      ]
    },
    assessmentData: [{ id: 'strategi', title: 'Strategy & Leadership',
        shortTitle: 'Strategy',
        description: 'Organizational leadership and strategic direction in AI adoption',
        questions: [
          { id: 'S1', text: 'Is AI included in the organization\'s strategic agenda?' },
          { id: 'S2', text: 'Do leaders understand the benefits and risks of AI adoption?' },
          { id: 'S3', text: 'Is there an executive sponsor or AI owner at the management level?' },
          { id: 'S4', text: 'Are the goals and metrics for AI usage clear and measurable?' },
          { id: 'S5', text: 'Is AI utilization aligned with the organization\'s vision and mission?' },
        ]
      },
      {
        id: 'proses',
        title: 'Process & Workflow',
        shortTitle: 'Process',
        description: 'Readiness of business processes and workflows to be integrated with AI',
        questions: [
          { id: 'P1', text: 'Are core work processes and workflows well-documented?' },
          { id: 'P2', text: 'Have key process bottlenecks and pain points been identified?' },
          { id: 'P3', text: 'Are work processes ready to be optimized or automated with AI?' },
          { id: 'P4', text: 'Do Standard Operating Procedures (SOPs) support digital and AI adoption?' },
          { id: 'P5', text: 'Are there repetitive workflows with high potential for automation?' },
        ]
      },
      {
        id: 'sdm',
        title: 'People & Capabilities',
        shortTitle: 'People',
        description: 'Readiness of human resources and work culture in adopting AI',
        questions: [
          { id: 'H1', text: 'Do employees possess foundational AI literacy and awareness?' },
          { id: 'H2', text: 'Is there an active AI champion or internal driver leading adoption?' },
          { id: 'H3', text: 'Is the team open and receptive to technology-driven changes?' },
          { id: 'H4', text: 'Are employees capable of using practical AI tools in daily work?' },
          { id: 'H5', text: 'Is there a structured plan for AI competency development?' },
        ]
      },
      {
        id: 'data',
        title: 'Data & Technology',
        shortTitle: 'Data',
        description: 'Availability and quality of data as well as technological infrastructure readiness',
        questions: [
          { id: 'D1', text: 'Is organizational data structured, available, and easily accessible?' },
          { id: 'D2', text: 'Is overall data quality and accuracy adequate for AI models?' },
          { id: 'D3', text: 'Has the organization actively deployed digital or AI-powered tools?' },
          { id: 'D4', text: 'Are existing technology systems seamlessly integrated with each other?' },
          { id: 'D5', text: 'Are data security, privacy, and system infrastructure safeguards maintained?' },
        ]
      },
      {
        id: 'tata-kelola',
        title: 'Governance & Responsible AI',
        shortTitle: 'Governance',
        description: 'Policies, ethics, and control over AI implementation',
        questions: [
          { id: 'G1', text: 'Is there an established official policy for data governance and privacy?' },
          { id: 'G2', text: 'Does the organization actively assess and manage potential AI risks?' },
          { id: 'G3', text: 'Are ethical AI principles considered throughout implementation?' },
          { id: 'G4', text: 'Are control mechanisms and audit procedures in place for AI usage?' },
          { id: 'G5', text: 'Is the organization prepared to comply with evolving AI regulations?' },
        ]
      }
    ],
    result: {
      title: 'Assessment Completed',
      subtitle: 'AI Readiness Index & Your Recommendations',
      analyzing: 'Preparing Strategic AI Analysis...',
      error: 'Assessment not found.',
      scoreLabel: 'AI Readiness Score (NORTIS Index)',
      outOf: '/ 5.00',
      recommendationLabel: 'Next Action Recommendations',
      readinessProfile: 'Readiness Profile',
      scoreDetails: 'Score Details',
      yourScore: 'Your Score',
      executiveSummary: 'Executive Summary',
      executiveSummaryPrefix: 'Your organization is at the "',
      executiveSummaryMid: '" level with an AI Readiness Score of ',
      executiveSummarySuffix: '. The strategic priority now is to focus on recommended steps to increase your AI maturity.',
      mainRisk: 'Main Risks',
      quickWins: 'Quick Wins',
      orgBarriers: 'Organizational Barriers',
      priorityRec: '90-Day Priority Recommendations',
      phase1Tag: 'Phase 1: Immediate (0 - 30 Days)',
      phase2Tag: 'Phase 2: Mid-Term (1 - 3 Months)',
      phase3Tag: 'Phase 3: Long-Term (3 - 12 Months)',
      focusArea: 'Focus Areas by Pillar',
      focusAreaDim: 'Focus Areas by Dimension',
      strongFoundation: 'Strong Foundation',
      needsAttention: 'Needs Immediate Attention',
      strongFoundationDesc: 'Leverage this strength to drive AI initiatives and support other areas.',
      needsAttentionDesc: 'This area requires priority investment and focused improvement initiatives.',
      recommendedProgram: 'Recommended Nortis AI Programs',
      recommendedProgramDesc: 'Based on your AI readiness assessment results, here are the programs specifically tailored to your organization’s AI maturity level:',
      nortisProgramsByLevel: {
        unready: [
          {
            id: 'prog-unready-1',
            title: 'Nortis AI Camp (Literacy & Foundations)',
            subtitle: 'Build AI Foundations. Spark Adoption.',
            badge: '⭐ HIGHEST PRIORITY',
            isHighestPriority: true,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Intensive foundational bootcamp to equip teams and staff with fundamental AI literacy, basic prompt engineering, and everyday AI tool mastery.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-unready-2',
            title: 'Nortis B2B AI Awareness Training',
            subtitle: 'Demystifying AI for Organizations',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Interactive enterprise AI awareness training across departments to build an innovation culture, reduce tech resistance, and learn basic ethics.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-unready-3',
            title: 'Nortis AI Readiness & Use Case Discovery',
            subtitle: 'From Scratch to AI Opportunity',
            badge: '',
            isHighestPriority: false,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'In-depth workshop and initial data readiness audit to discover and prioritize your organization\'s first 3 realistic, low-risk AI use cases.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          }
        ],
        aware: [
          {
            id: 'prog-aware-1',
            title: 'Nortis AICM (AI Strategy & Roadmap Sprint)',
            subtitle: 'From Strategy to AI Roadmap',
            badge: '⭐ HIGHEST PRIORITY',
            isHighestPriority: true,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'Strategic advisory to formulate a 1-3 year AI Masterplan, data infrastructure audit, governance baseline, and prioritized business ROI roadmap.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-aware-2',
            title: 'Nortis B2B AI Applied Training',
            subtitle: 'Practical AI for Business Teams',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Hands-on training for management and departmental teams to integrate AI productivity tools directly into everyday operational workflows.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-aware-3',
            title: 'Nortis AI Camp (Practitioner Cohort)',
            subtitle: 'Build Hands-on AI Capability',
            badge: '',
            isHighestPriority: false,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Accelerated technical and structured prompting bootcamp for individuals and internal AI champions driving adoption.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          }
        ],
        ready: [
          {
            id: 'prog-ready-1',
            title: 'Nortis AICM (Implementation Pilot & Proof-of-Value)',
            subtitle: 'From Concept to Live AI Pilot',
            badge: '⭐ HIGHEST PRIORITY',
            isHighestPriority: true,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'End-to-end guidance to build, test, and deploy priority AI pilot solutions, validating technical feasibility and measurable business impact.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-ready-2',
            title: 'Nortis B2B AI Technical Masterclass',
            subtitle: 'Upskilling Technical & Analytical Teams',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Advanced technical training covering AI API integration, robust data pipelines, and intelligent workflow automation systems.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-ready-3',
            title: 'Nortis AI Champion Bootcamp',
            subtitle: 'Empowering Internal AI Leaders',
            badge: '',
            isHighestPriority: false,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Intensive mentoring for internal departmental AI champions to lead adoption, troubleshoot workflows, and maintain innovation momentum.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          }
        ],
        enabled: [
          {
            id: 'prog-enabled-1',
            title: 'Nortis AICM (Scaling & MLOps Retainer)',
            subtitle: 'Enterprise AI Scale & Continuous Monitoring',
            badge: '⭐ HIGHEST PRIORITY',
            isHighestPriority: true,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'Dedicated retainer advisory to scale AI across business units, implement continuous model monitoring, and optimize infrastructure cost efficiency.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-enabled-2',
            title: 'Nortis B2B AI Governance & Security Masterclass',
            subtitle: 'Responsible AI & Enterprise Risk Control',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Enterprise risk management, AI cybersecurity, and privacy compliance masterclass ensuring secure, responsible, and compliant AI operations.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-enabled-3',
            title: 'Nortis AI Camp (Advanced Automation & Agents)',
            subtitle: 'Mastering Autonomous AI Systems',
            badge: '',
            isHighestPriority: false,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Advanced bootcamp on engineering autonomous AI agents, multi-agent workflows, and complex process orchestration.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          }
        ],
        mature: [
          {
            id: 'prog-mature-1',
            title: 'Nortis AICM (Commercialization & Custom AI Innovation)',
            subtitle: 'From Internal Capability to Market Leadership',
            badge: '⭐ HIGHEST PRIORITY',
            isHighestPriority: true,
            iconType: 'chart',
            iconBg: 'bg-[#009E4F]',
            desc: 'Strategic advisory to commercialize proprietary AI models into new business verticals (AIaaS), external monetization, and frontier innovation.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-mature-2',
            title: 'Nortis B2B Executive AI Leadership & ISO 42001',
            subtitle: 'Global Standards & Thought Leadership',
            badge: '',
            isHighestPriority: false,
            iconType: 'training',
            iconBg: 'bg-[#2563EB]',
            desc: 'Executive advisory for International AI Governance Certification (ISO/IEC 42001) and cementing corporate industry thought leadership.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          },
          {
            id: 'prog-mature-3',
            title: 'Nortis AI Camp (Frontier AI Research & Incubation)',
            subtitle: 'Next-Gen AI Labs & Proprietary Models',
            badge: '',
            isHighestPriority: false,
            iconType: 'zap',
            iconBg: 'bg-[#FF6A00]',
            desc: 'Frontier research and incubation lab covering fine-tuning, SLMs, and custom multimodal architectures for corporate R&D teams.',
            features: [],
            ctaText: 'Learn More',
            ctaLink: ''
          }
        ]
      },
      nortisPrograms: [
        {
          id: 'prog-1',
          title: 'Nortis AICM (AI Consulting & Monitoring)',
          subtitle: 'From Strategy to AI Impact',
          badge: '⭐ HIGHEST PRIORITY',
          iconType: 'chart',
          iconBg: 'bg-[#009E4F]',
          highlightBorder: false,
          desc: 'End-to-end AI consulting and implementation guidance designed to generate measurable and sustainable business impact.',
          features: [],
          ctaText: 'Learn More',
          ctaLink: ''
        },
        {
          id: 'prog-2',
          title: 'Nortis AI Camp',
          subtitle: 'Build AI Skills. Create Real Impact.',
          badge: '',
          iconType: 'zap',
          iconBg: 'bg-[#FF6A00]',
          highlightBorder: false,
          desc: 'Intensive paid bootcamp for individuals and professionals seeking practical, ready-to-deploy AI skills for the modern workplace.',
          features: [],
          ctaText: 'Learn More',
          ctaLink: ''
        },
        {
          id: 'prog-3',
          title: 'Nortis B2B AI Training',
          subtitle: 'Practical AI for Business Performance',
          badge: '',
          iconType: 'training',
          iconBg: 'bg-[#2563EB]',
          highlightBorder: true,
          desc: 'Applied AI training program for companies and institutions to enhance productivity, efficiency, and data-driven decision-making.',
          features: [],
          ctaText: 'Learn More',
          ctaLink: ''
        }
      ],
      individualNortisProgramsByLevel: {
        unready: [],
        aware: [],
        ready: [],
        enabled: [],
        mature: []
      },
      discussProgram: 'Want to discuss the best program for your organization? Contact our team for a personalized consultation.',
      downloadReport: 'Download Full Report',
      downloadPdf: 'Download PDF',
      downloadExcel: 'Download Excel',
      downloadSlide: 'Slide Summary',
      startNewAssessment: 'Start New Assessment',
      emailUs: 'Send Email',
      emailTarget: 'hai@nortis.ai',
      emailSubject: 'AI Readiness Assessment Consultation',
      whatsapp: 'Chat on WhatsApp',
      whatsappNumber: '6282337576338',
      whatsappMessage: 'Hello Nortis AI Team, I would like to consult about our organization AI Readiness Assessment results and suitable programs.'
    },
    individualResult: {
      reportTitle: 'Individual AI Readiness Assessment Report',
      downloadPdf: 'Download PDF',
      back: 'Back',
      backToHome: 'Back to Home',
      analyzingWithAi: 'Analyzed with Gemini AI',
      connectingAi: 'Connecting Gemini AI...',
      analyzingBadge: 'AI is Analyzing Your Readiness...',
      readinessStatus: 'Readiness Status',
      individualMaturityScore: 'Individual AI Maturity Score',
      readinessProfileLabel: 'Readiness Profile',
      dimensionsEvaluatedLabel: 'Dimensions Evaluated',
      executiveSummaryTitle: 'Executive Summary & Profile Analysis',
      maturityScore: 'Maturity Score',
      outOf: 'out of 5.00',
      dimensionsEvaluated: '6 Dimensions Evaluated',
      profilePrefix: 'Profile: ',
      whatsWorkingTitle: "What's Working",
      whatsWorkingDesc: 'Analysis of key strengths and current advantages',
      whatsAtRiskTitle: "What's At Risk",
      whatsAtRiskDesc: 'Analysis of major gaps or vulnerabilities',
      focusNextTitle: 'Focus Next',
      focusNextDesc: 'Most urgent and high-impact priority action',
      radarTitle: 'Individual AI Readiness Radar Chart',
      radarScale: 'Scale 0–5',
      radarScaleLabel: 'Scale 0 - 5',
      radarYourScore: 'Your Score',
      radarDesc: 'Maturity distribution map of 6 competency dimensions.',
      radarLegendScore: 'Assessment Score',
      radarLegendIdeal: 'Ideal Target: 5.00',
      dimensionBreakdownTitle: '6 Competency Dimensions Score Breakdown',
      dimensionBreakdownBadge: '6 Dimensions Evaluated',
      dimensionBreakdownDesc: 'In-depth analysis of achievements across each individual AI competency dimension.',
      dimensionsDetailTitle: '6 Dimensions Breakdown',
      dimensionsDetailBadge: 'Sorted from full evaluation',
      dimensionsDetailDesc: 'Mastery level across each daily work pillar.',
      strengthsTitle: 'Your Key Strengths',
      strengthsSubtitle: 'Top 3 highest performing dimensions',
      growthAreasTitle: 'Growth Areas',
      growthAreasSubtitle: 'Top 3 priority dimensions for development',
      roadmapTitle: 'Action Plan & Development Roadmap',
      roadmapDesc: 'Step-by-step guidance to level up your AI proficiency from tactical execution to strategic leadership.',
      roadmapBadge: '3 Structured Phases',
      phase1Title: 'Now',
      phase1Range: '0–30 Days',
      phase2Title: 'Next',
      phase2Range: '1–3 Months',
      phase3Title: 'Later',
      phase3Range: '3–12 Months',
      reflectionTitle: 'Professional Reflection Questions',
      reflectionSubtitle: 'Critical reflection prompts to deepen your AI maturity and critical thinking',
      reflectionTip: 'Tip: Discuss these reflection prompts during 1-on-1s with your mentor, peers, or manager.',
      downloadFullPdf: 'Download Full Report (PDF)'
    },

    individualInsights: {
      dimensionDescriptions: {
        aiLiteracy: {
          Advanced: "Your comprehensive understanding of AI allows you to precisely discern when to utilize AI and when to rely on human judgment.",
          Strong: "You have a solid understanding of AI capabilities and limitations and can apply it effectively.",
          Established: "Your foundational understanding is adequate, though you need to be more critical when evaluating complex cases.",
          Developing: "You are beginning to grasp AI, but still need to distinguish real capabilities from general hype.",
          "Needs Foundation": "Understanding of generative AI mechanics is minimal. Foundational education is recommended."
        },
        taskFraming: {
          Advanced: "You excel at formulating precise instructions and context, producing directly usable AI outputs.",
          Strong: "You consistently provide clear context and boundaries when prompting, yielding relevant outputs.",
          Established: "Your prompting skills are sufficient for daily tasks, but can be structured more systematically.",
          Developing: "You have started prompting, but outputs frequently miss the mark due to lack of context and specificity.",
          "Needs Foundation": "Not yet accustomed to providing structured instructions to AI, often resulting in unaligned outputs."
        },
        workflow: {
          Advanced: "AI has become the backbone of your efficiency, seamlessly integrated into your workflows with smart automations.",
          Strong: "AI is a routine part of your workflow, delivering measurable productivity gains.",
          Established: "You use AI in routines, but your approach is not yet systematically applied across all workflows.",
          Developing: "AI usage is sporadic and not yet an integrated part of your day-to-day workflow.",
          "Needs Foundation": "No AI integration into routine workflows yet. Most tasks are conducted conventionally."
        },
        evaluation: {
          Advanced: "You possess sharp intuition and rigorous evaluation standards to validate, refine, and elevate AI outputs.",
          Strong: "You routinely inspect and critique AI output, avoiding blind acceptance of raw information.",
          Established: "You evaluate AI outputs, but occasionally overlook subtle biases or contextual inaccuracies.",
          Developing: "You recognize the need to verify, but still frequently rely on raw outputs without critical scrutiny.",
          "Needs Foundation": "Tendency to accept AI outputs at face value remains high. Human judgment is rarely exercised."
        },
        responsibleAi: {
          Advanced: "You consistently champion ethics, compliance, and strict risk management before deploying AI solutions.",
          Strong: "Your awareness of data security and ethics is excellent, always weighing risks before interacting with AI.",
          Established: "You understand AI ethics concepts, but risk mitigation and data safety practices remain inconsistent.",
          Developing: "Awareness of AI risks and ethics is partial, requiring clearer guidance on security standards.",
          "Needs Foundation": "Data privacy and risk considerations are not yet part of your daily AI habits."
        },
        collaboration: {
          Advanced: "You act as a catalyst and mentor, leading AI initiatives and actively elevating peers around you.",
          Strong: "You actively collaborate and share AI best practices, fostering an innovative culture in your team.",
          Established: "You are open to collaborating with AI, but have not proactively shared insights or initiatives with peers.",
          Developing: "AI usage is isolated to personal needs with no current initiatives to learn or collaborate with others.",
          "Needs Foundation": "No discussions or collaboration with teammates on leveraging AI to solve collective challenges."
        }
      },
      strengthInsights: {
        aiLiteracy: "You have a strong AI literacy foundation, discerning real capability from trends and knowing when human intervention is necessary.",
        taskFraming: "Your context-framing and prompting expertise makes AI interactions efficient and closely aligned with business needs.",
        workflow: "You excel at identifying AI integration opportunities within workflows, maximizing efficiency and saving time.",
        evaluation: "Your human judgment stands out; you actively validate and enhance AI outputs rather than accepting them raw.",
        responsibleAi: "You prioritize data privacy and ethical standards, ensuring safe, professional AI adoption.",
        collaboration: "You inspire colleagues and collaborate effectively in embracing AI technologies within the workplace."
      },
      growthInsights: {
        aiLiteracy: "Gaps in understanding fundamental AI mechanisms can hinder progress. Focus on solidifying conceptual literacy first.",
        taskFraming: "Imprecise instructions lead to suboptimal outputs. Structuring prompts with clear context and constraints will elevate effectiveness.",
        workflow: "Inconsistent AI usage limits productivity potential. Focus on embedding AI permanently into daily workflows.",
        evaluation: "Over-relying on AI without rigorous validation invites errors. Strengthen critical review and verification habits.",
        responsibleAi: "Overlooking privacy and security poses risks. Prioritize compliance, ethical guidelines, and confidential data protection.",
        collaboration: "Isolated AI usage diminishes overall impact. Start sharing discoveries and collaborating with peers."
      }
    },



    recommendations: {
      mature: {
        title: 'AI Commercialization and Scalability',
        desc: 'The main strategic focus right now is to exploit AI advantages for business expansion, monetize internal capabilities, and maintain operational resilience and key talent.',
        shortDesc: 'The main strategic focus is to exploit AI advantages for business expansion, monetize internal capabilities, and maintain operational resilience.',
        executiveSummary: 'The main strategic focus right now is to exploit AI advantages for business expansion, monetize internal capabilities, and maintain operational resilience and key talent.',
        risikoUtama: [
          'High dependence on a few key talents due to lean organizational size.',
          'Risk of technological complacency from feeling having reached the highest maturity level.',
          'Increasingly strict global telecommunications data privacy regulations evolution.',
          'Increasingly complex cybersecurity threats targeting the company\'s AI infrastructure.'
        ],
        quickWins: [
          'Launch an internal AI API catalog to commercialize to B2B telecommunications sector partners.',
          'Implement fully automated MLOps to accelerate AI model iteration cycles.',
          'Publish AI leadership case studies or whitepapers for industry reputation.',
          'Optimize AI infrastructure costs through model pruning and edge processing techniques.',
          'Integrate full generative AI assistants to support team operational efficiency.'
        ],
        hambatan: [
          'Limited HR capacity to handle the scale of new external project demands.',
          'Rising computational processing (GPU) costs alongside increased AI workloads.',
          'Complexity of AI integration with legacy systems of external partners or operators.',
          'Challenges in maintaining AI model efficiency standards without increasing network latency.'
        ],
        rekomendasiPrioritas: [
          'Build a specialized AI-as-a-Service (AIaaS) product line for the telecommunications industry.',
          'Strengthen AI talent retention programs and perform knowledge succession to ensure sustainability.',
          'Obtain international certification for AI Governance (such as ISO/IEC 42001) to build a competitive advantage.',
          'Form strategic partnerships with cloud infrastructure providers to secure long-term computing capacity.'
        ],
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
        desc: 'The organization needs to focus on scaling successful AI solutions to other areas, with retainer support for continuous optimization.',
        shortDesc: 'Scaling successful AI solutions to additional business units and operational workflows.',
        executiveSummary: 'The organization needs to focus on scaling successful AI solutions to other areas, with retainer support for continuous optimization.',
        risikoUtama: [
          'Cross-department coordination bottlenecks when scaling specialized AI models.',
          'Technical debt accumulation resulting from rapid pilot stage implementations.',
          'Data readiness and talent capability disparity in non-AI business units.',
          'Escalating computing infrastructure and model maintenance costs.'
        ],
        quickWins: [
          'Standardize MLOps deployment pipelines across engineering teams.',
          'Replicate proven AI use cases to 2 new priority business units.',
          'Conduct advanced prompt engineering and AI tool workshops for business teams.',
          'Perform model performance audits and cloud compute cost optimizations.'
        ],
        hambatan: [
          'Departmental data silos hindering cross-functional data sharing.',
          'Limited bandwidth of internal technical talent amid routine operations.',
          'Lack of formalized internal SLAs for enterprise AI service integrations.',
          'Uneven executive adoption across different departmental divisions.'
        ],
        rekomendasiPrioritas: [
          'Establish a cross-functional AI Center of Excellence (CoE) for standard governance.',
          'Deploy a centralized data catalog for secure cross-business asset access.',
          'Implement continuous model monitoring and automated drift detection.',
          'Formulate an ongoing retainer and advisory program for performance optimization.'
        ],
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
        desc: 'Focus on implementing an AI pilot project on a priority use case to prove business value and technical feasibility.',
        shortDesc: 'Deploying high-impact priority pilot projects with measurable business ROI.',
        executiveSummary: 'Focus on implementing an AI pilot project on a priority use case to prove business value and technical feasibility.',
        risikoUtama: [
          'Unrealistic stakeholder expectations lacking clear, quantifiable ROI metrics.',
          'Heavy reliance on external vendors without adequate internal knowledge transfer.',
          'Risk of pilots getting stuck in Proof-of-Concept (PoC) phase without production transition.',
          'Data security and governance vulnerabilities during pilot experimentation.'
        ],
        quickWins: [
          'Select 1-2 high-impact pilot use cases with rapid 6-8 week execution cycles.',
          'Form an agile cross-functional AI working group linking business and IT.',
          'Publish enterprise AI acceptable use and security guidelines for all employees.',
          'Automate high-friction manual operational tasks to demonstrate fast value.'
        ],
        hambatan: [
          'Constrained or unallocated budgets for exploratory AI pilot initiatives.',
          'Disorganized historical data dispersed across fragmented spreadsheets.',
          'Employee apprehensions regarding automation and changing job descriptions.',
          'Unstandardized operational processes lacking clear documentation.'
        ],
        rekomendasiPrioritas: [
          'Execute priority pilot projects with rigorous baseline metric benchmarking.',
          'Conduct hands-on technical training for internal developers and business analysts.',
          'Perform objective partner evaluations and technology vendor selections.',
          'Design enterprise architecture integration blueprints before scaling up.'
        ],
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
        desc: 'Build the foundation of data infrastructure, governance, and team capabilities in preparation for AI implementation.',
        shortDesc: 'Building core data infrastructure, literacy, and governance foundations.',
        executiveSummary: 'Build the foundation of data infrastructure, governance, and team capabilities in preparation for AI implementation.',
        risikoUtama: [
          'Uncontrolled shadow AI usage exposing proprietary company data.',
          'Widening competitive lag due to delayed digital and data modernization.',
          'Cultural resistance against automation and technological process changes.',
          'Misallocated technology investments resulting from a lack of strategic AI literacy.'
        ],
        quickWins: [
          'Deliver executive AI literacy workshops for leadership and senior managers.',
          'Execute a comprehensive data asset and system readiness audit.',
          'Draft foundational AI ethical guidelines and data protection policies.',
          'Pinpoint high-friction operational pain points prime for AI enablement.'
        ],
        hambatan: [
          'Limited executive comprehension regarding the tangible business value of AI.',
          'Fragmented, manual data records lacking central organization.',
          'Absence of dedicated data engineering talent or technical compute resources.',
          'No designated budget line items for technological innovation.'
        ],
        rekomendasiPrioritas: [
          'Identify and prioritize high-value AI use cases aligned with corporate goals.',
          'Establish a centralized data foundation and governance framework.',
          'Secure committed executive leadership sponsorship and seed budget.',
          'Formulate an actionable 6-month roadmap leading to initial pilot rollout.'
        ],
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
        desc: 'Build basic understanding of AI and its potential for the business through training and workshops for the team.',
        shortDesc: 'Establishing digital fluency and foundational AI awareness across the organization.',
        executiveSummary: 'Build basic understanding of AI and its potential for the business through training and workshops for the team.',
        risikoUtama: [
          'Severe competitive disadvantage against technology-driven market peers.',
          'Vulnerability to data compromise through unsanctioned consumer AI tools.',
          'Operational margin erosion from sustaining labor-intensive manual workflows.',
          'Loss of market opportunities caused by inertia in data-driven decisions.'
        ],
        quickWins: [
          'Host engaging "AI for Business 101" sessions for department leads.',
          'Identify top 3 manual bottlenecks suitable for immediate digitization.',
          'Standardize basic digital productivity software to organize work records.',
          'Appoint cross-departmental digital champions to inspire modern ways of working.'
        ],
        hambatan: [
          'Minimal tech and AI awareness across all organizational levels.',
          'Over-reliance on paper-based or disjointed manual processes.',
          'Misconception that AI is prohibitively complex or irrelevant for the industry.',
          'Absence of fundamental server or cloud data infrastructure.'
        ],
        rekomendasiPrioritas: [
          'Conduct structured AI and digital literacy programs for executive management.',
          'Undertake an operational audit to transition critical records into electronic formats.',
          'Align leadership on the strategic urgency of organizational modernization.',
          'Establish a digital transformation task force to spearhead initial modernization steps.'
        ],
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
    },
    individualRecommendations: {
      mature: {
        title: 'Advanced AI Practitioner',
        levelName: 'AI-Mature',
        desc: 'Penggunaan AI Anda sangat matang dan menjadi bagian strategis dari cara Anda bekerja. Anda ahli mengombinasikan AI, human judgment, workflow, dan responsible AI, serta mampu memandu orang lain. Fokus Anda kini adalah leadership, inovasi, otomatisasi tingkat lanjut, dan knowledge sharing.',
        whatsWorking: 'Anda menunjukkan pondasi yang solid di seluruh dimensi. Anda berani bereksperimen, merefleksikan hasil, dan beradaptasi. Anda tidak hanya menggunakan AI — Anda berpikir kritis tentang cara dan waktu penggunaannya serta memimpin adopsi tim.',
        whatsAtRisk: 'Di level ini, risikonya adalah rasa cepat puas atau terisolasi. Jika Anda melesat jauh di depan rekan-rekan, Anda mungkin berjalan sendiri tanpa mengangkat kompetensi tim secara keseluruhan.',
        focusNext: 'Beralih dari kesiapan personal menuju mode multiplier: jadilah mentor, role model, dan penggerak inisiatif penggunaan AI yang cerdas di tim atau organisasi Anda.',
        phase1Actions: [
          'Bangun pustaka prompt dan workflow pribadi tingkat lanjut untuk dibagikan kepada anggota tim.',
          'Identifikasi proses bisnis lintas departemen yang dapat diotomatisasi dengan alur kerja AI.',
          'Terapkan tata kelola mandiri dan audit data etis sebelum men-deploy solusi AI baru.'
        ],
        phase2Actions: [
          'Integrasikan AI secara murni ke dalam alur kerja operasional harian tanpa mengorbankan standar kualitas.',
          'Rancang sesi berbagi pengetahuan bulanan atau workshop AI internal untuk meningkatkan kemampuan rekan kerja.',
          'Evaluasi tools AI mutakhir (autonomous agents, multimodal) untuk riset dan analisis tingkat lanjut.'
        ],
        phase3Actions: [
          'Bangun alur kerja AI terotomatisasi (misalnya Zapier/Make atau AI Agents) untuk tugas-tugas organisasi yang berulang.',
          'Bagikan praktik terbaik AI dengan pimpinan dan dorong standardisasi di seluruh departemen.',
          'Posisikan diri Anda sebagai penasihat AI internal dan katalis inovasi dalam organisasi Anda.'
        ],
        reflectionPrompts: [
          'Bagaimana cara terbaik Anda dapat membagikan keahlian AI Anda saat ini untuk membantu meningkatkan produktivitas tim?',
          'Alur kerja inti mana yang memiliki potensi terbesar untuk direvolusi oleh AI tingkat lanjut dalam 6 bulan ke depan?',
          'Inisiatif AI inovatif apa yang dapat Anda pimpin atau sponsori di dalam departemen Anda?',
          'Bagaimana Anda memastikan tim Anda secara ketat menjunjung tinggi standar etika dan privasi data saat berinovasi?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan refleksi ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Penguasaan Arsitektur & Strategi AI: Kemampuan mendalam untuk mengintegrasikan model generatif mutakhir secara strategis ke dalam alur kerja bisnis.',
          'Human Judgment & Validasi Tingkat Tinggi: Standar evaluasi yang ketat dan intuisi tajam untuk mengeliminasi risiko bias dan halusinasi.',
          'Kepemimpinan AI & Mentoring Budaya: Aktif menjadi champion inovasi yang memandu rekan kerja dan membagikan praktik terbaik di seluruh tim.'
        ],
        growthAreas: [
          'Otomatisasi Multi-Agent Mandiri: Perluas eksplorasi ke arsitektur agentic AI untuk menangani alur kerja kompleks multi-langkah.',
          'Skalabilitas Organisasi: Hindari keahlian terisolasi; kodifikasikan pengetahuan ke dalam kerangka kerja praktik terbaik dan SOP perusahaan.',
          'Audit Tata Kelola & Kepatuhan Lanjutan: Perbarui secara berkala standar etika dan keselarasan dengan regulasi tata kelola AI global.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.mature,
        growthInsights: levelGrowthInsightsDefaults.mature
      },
      enabled: {
        title: 'AI-Enabled Professional',
        levelName: 'AI-Enabled',
        desc: 'AI sudah terintegrasi dalam pekerjaan Anda. Anda mampu mengevaluasi hasil AI, memahami risiko serta keterbatasannya, dan penggunaannya telah terbukti meningkatkan produktivitas Anda. Fokus berikutnya adalah optimasi workflow, otomatisasi, dan eksplorasi penggunaan AI yang lebih advanced.',
        whatsWorking: 'Anda sudah menemukan ritme penggunaan AI di beberapa area. Keterampilan Anda memberikan kecepatan dan presisi nyata di seluruh tugas rutin dan analitis yang didukung evaluasi kritis.',
        whatsAtRisk: 'Penggunaan AI berisiko stagnan di tingkat produktivitas individu tanpa standardisasi alur kerja yang lebih dalam dan otomatisasi sistematis.',
        focusNext: 'Sistematiskan penggunaan AI Anda. Dokumentasikan prompt yang paling berhasil, bangun personal toolkit yang solid, dan mulailah berbagi knowledge tersebut ke lingkungan terdekat.',
        phase1Actions: [
          'Gunakan kerangka prompt terstruktur (Konteks, Instruksi, Format) di seluruh tugas harian.',
          'Simpan template prompt terverifikasi yang konsisten memberikan hasil presisi tinggi.',
          'Terapkan validasi ganda pada semua output AI sebelum dimasukkan ke dalam hasil kerja akhir.'
        ],
        phase2Actions: [
          'Integrasikan 2–3 tools AI utama secara mulus ke dalam alur kerja harian Anda.',
          'Bermitra dengan rekan belajar untuk bereksperimen dengan use case departemen yang baru.',
          'Tinjau efisiensi tools secara rutin; eliminasi aplikasi yang redundan dan fokus pada tools berdampak tinggi.'
        ],
        phase3Actions: [
          'Eksplorasi otomatisasi alur kerja sederhana antar tools AI untuk menghilangkan transfer data manual.',
          'Dokumentasikan panduan singkat praktik terbaik AI dan presentasikan poin penting kepada tim Anda.',
          'Lakukan asesmen ulang ini dalam 3–6 bulan untuk melacak pertumbuhan kematangan Anda yang berkelanjutan.'
        ],
        reflectionPrompts: [
          'Di area mana Anda mungkin masih terlalu mengandalkan output AI tanpa verifikasi kritis yang ketat?',
          'Alur kerja rutin mana yang dapat Anda sederhanakan dengan otomatisasi AI bulan ini?',
          'Keterampilan AI spesifik apa yang paling krusial untuk Anda kuasai dalam 90 hari ke depan?',
          'Bagaimana Anda secara aktif menjaga kepatuhan privasi data dalam interaksi tools AI harian Anda?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan refleksi ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Integrasi Alur Kerja Harian: Secara konsisten memanfaatkan tools AI untuk mempercepat siklus kerja dan meningkatkan kualitas hasil kerja.',
          'Prompting Terstruktur & Presisi: Mahir dalam teknik prompting kaya konteks yang menghasilkan output sangat relevan.',
          'Disiplin Validasi Kritis: Rajin memeriksa fakta dan mengurasi output sebelum memfinalisasi hasil kerja.'
        ],
        growthAreas: [
          'Otomatisasi Alur Kerja Lintas Tools: Hubungkan aplikasi AI yang terpisah menggunakan otomatisasi workflow (seperti integrasi API atau Zapier).',
          'Repositori Prompt Pribadi: Dokumentasikan secara sistematis prompt yang telah teruji untuk tugas berulang.',
          'Inisiatif Berbagi Pengetahuan: Mulai sesi belajar bersama rekan kerja untuk mentransfer teknik AI teruji ke anggota tim terdekat.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.enabled,
        growthInsights: levelGrowthInsightsDefaults.enabled
      },
      ready: {
        title: 'Ready to Integrate',
        levelName: 'AI-Ready',
        desc: 'Anda sudah cukup memahami AI dan mampu menggunakannya secara mandiri. Penggunaan AI mulai memberikan manfaat, meski masih terdapat gap pada beberapa dimensi. Fokus Anda selanjutnya adalah meningkatkan kualitas penggunaan dan membangun workflow yang lebih sistematis.',
        whatsWorking: 'Anda memiliki pemahaman dasar yang solid dan antusiasme nyata untuk bereksperimen dengan tools AI dalam tugas-tugas harian.',
        whatsAtRisk: 'Kemajuan Anda bisa terhenti menjadi sekadar teori jika tidak diiringi dengan praktik yang konsisten, terutama di area yang masih membutuhkan peningkatan.',
        focusNext: 'Fokus pada konsistensi. Paksakan diri untuk mempraktikkan penggunaan AI pada tugas-tugas rutin harian hingga hal tersebut menjadi kebiasaan tak terpisahkan dari workflow Anda.',
        phase1Actions: [
          'Identifikasi 3 tugas rutin yang memakan waktu yang dapat dibantu secara signifikan oleh AI.',
          'Gunakan satu tool AI secara konsisten selama dua minggu pada satu alur kerja spesifik.',
          'Kuasai teknik prompting dasar yang menekankan kejelasan, peran, dan konteks.'
        ],
        phase2Actions: [
          'Bangun personal AI toolkit berisi 2–3 tools teruji yang disesuaikan dengan peran Anda.',
          'Dokumentasikan variasi prompt dan catat mana yang paling berhasil untuk bidang Anda.',
          'Pilih satu proyek rutin untuk dioptimalkan secara end-to-end menggunakan bantuan AI.'
        ],
        phase3Actions: [
          'Perluas penggunaan AI dari tugas klerikal dasar ke pembuatan draf analitis atau kreatif tingkat menengah.',
          'Bagikan wawasan menarik dan temuan prompt dengan rekan tim.',
          'Lakukan asesmen ulang ini dalam 3 bulan untuk mengevaluasi perkembangan keterampilan Anda.'
        ],
        reflectionPrompts: [
          'Hambatan terbesar apa yang mencegah Anda menjadikan AI sebagai kebiasaan kerja sehari-hari?',
          'Tugas berulang mana yang dapat menghemat 3+ jam mingguan jika dibantu oleh AI secara efektif?',
          'Bagaimana Anda dapat memverifikasi keakuratan faktual dari jawaban yang dihasilkan AI secara mandiri?',
          'Langkah konkret apa yang akan Anda ambil minggu ini untuk membangun rutinitas AI yang permanen?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan refleksi ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Eksplorasi Digital yang Antusias: Adaptif dan bersemangat untuk menemukan fitur dan kapabilitas baru AI generatif.',
          'Curah Pendapat Ide yang Efektif: Memanfaatkan AI konversasional secara produktif untuk menyusun draf awal dan ideasi.',
          'Kesadaran Privasi Dasar: Memperhatikan perlindungan data dan menghindari pembagian informasi sensitif di public tools.'
        ],
        growthAreas: [
          'Kerangka Prompt Terstandar: Bergerak melampaui pertanyaan umum dengan menerapkan Konteks, Peran, Tugas, dan Batasan.',
          'Membangun Kebiasaan AI Harian: Sediakan setidaknya 2 tugas berulang secara konsisten setiap hari untuk memperkuat produktivitas.',
          'Pertajam Human Judgment Kritis: Perdalam protokol pemeriksaan fakta untuk memverifikasi klaim mesin dan data numerik.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.ready,
        growthInsights: levelGrowthInsightsDefaults.ready
      },
      aware: {
        title: 'Building AI Confidence',
        levelName: 'AI-Aware',
        desc: 'Anda sudah mengenal AI dan mulai mencoba beberapa tools, namun penggunaannya belum konsisten dan belum menjadi bagian rutin dari workflow Anda. Fokus utama Anda adalah membangun kebiasaan dan menemukan use case AI yang relevan dengan pekerjaan harian.',
        whatsWorking: 'Rasa ingin tahu dan kesediaan Anda untuk mengeksplorasi teknologi AI modern memberikan fondasi awal yang sangat baik.',
        whatsAtRisk: 'Pemahaman konseptual yang belum utuh dan penggunaan yang sporadis dapat menyebabkan skeptisisme atau hasil yang kurang optimal.',
        focusNext: 'Tingkatkan rasa ingin tahu (curiosity). Lakukan eksperimen sederhana dengan tools AI yang aman selama 10-15 menit setiap hari untuk melihat kemampuannya secara langsung.',
        phase1Actions: [
          'Tonton video pengantar atau baca panduan tentang cara kerja AI generatif yang sebenarnya.',
          'Identifikasi 3 jenis tugas yang BISA dan TIDAK BISA dilakukan AI secara andal di posisi Anda.',
          'Gunakan asisten AI konversasional untuk curah pendapat awal atau penyusunan kerangka tulisan.'
        ],
        phase2Actions: [
          'Pilih satu use case harian sederhana (misalnya merangkum artikel panjang atau menyusun draf email).',
          'Luangkan waktu 15 menit setiap hari untuk berinteraksi dengan AI dan menyempurnakan instruksi Anda.',
          'Tanyakan kepada rekan kerja tools AI apa yang paling berguna bagi mereka dan pelajari tekniknya.'
        ],
        phase3Actions: [
          'Rancang alur kerja kecil di mana AI mendukung pembuatan draf pertama dari proyek Anda.',
          'Kembangkan kebiasaan untuk selalu memeriksa ulang fakta, tanggal, dan angka yang dihasilkan oleh AI.',
          'Ikuti webinar literasi digital dasar atau pengenalan AI.'
        ],
        reflectionPrompts: [
          'Apa kekhawatiran atau keraguan terbesar Anda terkait penggunaan tools AI di tempat kerja?',
          'Aktivitas kerja mana yang paling ingin Anda selesaikan lebih cepat dengan bantuan teknologi?',
          'Bagaimana Anda membedakan tugas yang cocok untuk AI dari tugas yang membutuhkan 100% intuisi manusia?',
          'Siapa di lingkungan kerja Anda yang dapat menjadi rekan belajar untuk eksperimen AI?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan refleksi ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Keterbukaan terhadap Teknologi Baru: Keingintahuan positif dalam memahami peran praktis AI di tempat kerja modern.',
          'Mengenali Potensi Produktivitas: Kesadaran yang baik tentang potensi penghematan waktu dan peningkatan kualitas yang dapat dicapai.',
          'Reseptif terhadap Pembelajaran Terarah: Sangat terbuka untuk mengikuti program pelatihan, workshop praktis, dan panduan keterampilan.'
        ],
        growthAreas: [
          'Memahami Kapabilitas AI: Pelajari konsep inti GenAI untuk mengkalibrasi ekspektasi dengan kekuatan teknis yang realistis.',
          'Latihan Harian 15 Menit: Komitmenkan 15 menit fokus setiap hari untuk berlatih prompting konversasional dasar.',
          'Mitigasi Penerimaan Tanpa Kritis: Selalu tinjau dan periksa silang respons mesin sebelum membagikan hasil kerja.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.aware,
        growthInsights: levelGrowthInsightsDefaults.aware
      },
      unready: {
        title: 'Discovering AI Potential',
        levelName: 'AI-Unready',
        desc: 'Penggunaan AI Anda masih sangat terbatas dan pemahaman terhadap kemampuannya masih perlu ditingkatkan. Saat ini, belum ada workflow AI yang konsisten. Fokus utama Anda sekarang adalah membangun pemahaman dasar dan mulai melakukan eksperimen sederhana.',
        whatsWorking: 'Anda memiliki potensi pertumbuhan dan peningkatan produktivitas yang sangat besar saat Anda mulai mengeksplorasi tools AI modern.',
        whatsAtRisk: 'Risiko tertinggal dalam efisiensi operasional tanpa mengambil langkah awal untuk memahami tools produktivitas digital modern.',
        focusNext: 'Mulai dengan langkah paling sederhana. Buka asisten AI konversasional, ajukan pertanyaan umum seputar industri Anda, dan amati bagaimana AI merespons.',
        phase1Actions: [
          'Pelajari konsep dasar AI melalui tutorial video pemula atau artikel ringkas.',
          'Pahami aturan keamanan mendasar: jangan pernah memasukkan data rahasia atau sensitif perusahaan ke tools publik.',
          'Coba tool AI untuk tugas-tugas ringan seperti mengecek tata bahasa atau mencari ide sinonim kata.'
        ],
        phase2Actions: [
          'Sediakan waktu 10 menit dua kali seminggu untuk mencoba prompt dasar dengan AI.',
          'Amati bagaimana rekan kerja dan profesional industri memanfaatkan tools digital dalam peran mereka.',
          'Catat satu tugas manual yang sangat berulang untuk dieksplorasi solusi digitalnya di masa mendatang.'
        ],
        phase3Actions: [
          'Ikuti workshop keterampilan digital atau kesadaran AI tingkat dasar di organisasi Anda.',
          'Terapkan bantuan AI untuk penulisan draf pertama yang sederhana atau ideasi kreatif.',
          'Lakukan asesmen ulang ini dalam 3 bulan untuk merayakan peningkatan rasa percaya diri dan literasi Anda.'
        ],
        reflectionPrompts: [
          'Apa yang menahan Anda dari mengeksplorasi teknologi AI hingga saat ini?',
          'Jika satu tugas kerja yang menjengkelkan dapat diselesaikan 2x lebih cepat, mana yang akan Anda pilih?',
          'Bimbingan atau pelatihan seperti apa yang paling mendukung perjalanan belajar AI awal Anda?',
          'Bagaimana Anda dapat meluangkan waktu 15 menit minggu ini untuk memulai eksperimen AI pertama Anda?'
        ],
        reflectionTip: 'Tip: Diskusikan pertanyaan refleksi ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.',
        strengths: [
          'Potensi Pertumbuhan Tinggi: Ruang besar untuk lompatan produktivitas eksponensial dimulai dari tingkat adopsi awal.',
          'Pengetahuan Domain yang Kaya: Pemahaman kuat tentang proses bisnis inti yang menjadi bedrock ideal untuk alur kerja AI masa depan.',
          'Kehati-hatian Alami: Kewaspadaan alami yang dapat disalurkan menjadi praktik kepatuhan dan tata kelola yang kuat.'
        ],
        growthAreas: [
          'Literasi AI Mendasar: Ikuti pelatihan pengantar untuk memahami apa yang dapat dan tidak dapat dilakukan GenAI secara andal.',
          'Langkah Praktis Pertama Terarah: Eksperimen dengan pemangkasan teks sederhana atau Q&A dasar menggunakan asisten AI resmi.',
          'Mengatasi Hambatan Psikologis: Bangun rasa percaya diri bahwa AI adalah co-pilot kolaboratif yang dirancang untuk memperkuat kerja manusia.'
        ],
        strengthInsights: levelStrengthInsightsDefaults.unready,
        growthInsights: levelGrowthInsightsDefaults.unready
      }
    },
    admin: {
      dashboardTitle: 'Admin Dashboard',
      dashboardSubtitle: 'AI Readiness Assessment Management & Analytics',
      companyDashboard: 'Company Dashboard',
      individualDashboard: 'Individual Dashboard',
      manageContent: 'Manage Content (CMS)',
      logout: 'Logout',

      orgHistoryTitle: 'Organization AI Readiness Assessment History',
      orgHistorySubtitle: 'Analysis of 5 AI transformation pillars for enterprise & business institutions.',
      indHistoryTitle: 'Individual & Professional AI Readiness Assessment History',
      indHistorySubtitle: 'Analysis of 6 AI competency dimensions and workflows for professional talent.',

      totalOrgSubmissions: 'Total Organization Assessments',
      totalIndSubmissions: 'Total Individual Assessments',
      last7Days: 'last 7 days',
      avgScore: 'Average Readiness Score',
      outOf5: 'Scale 0.0 - 5.0',
      industries: 'Industry Sectors',
      differentSectors: 'Unique industry categories',
      jobRoles: 'Job Titles & Roles',
      uniqueProfessions: 'Unique registered professions',
      aiMatureOrgs: 'AI-Mature Organizations',
      aiMatureInds: 'AI-Mature Practitioners',
      topPerformers: 'High score (≥ 3.6)',

      searchPlaceholderOrg: 'Search by company, PIC name, email, or industry...',
      searchPlaceholderInd: 'Search by name, email, job title, company, or AI tools...',
      filters: 'Filter Data',
      exportCsv: 'CSV',
      exportExcel: 'Excel',
      readinessLevel: 'AI Readiness Level',
      allLevels: 'All Readiness Levels',
      levelUnready: 'AI-Unready',
      levelAware: 'AI-Aware',
      levelReady: 'AI-Ready',
      levelEnabled: 'AI-Enabled',
      levelMature: 'AI-Mature',
      industryLabel: 'Industry Sector',
      allIndustries: 'All Industries',
      experienceLabel: 'Work Experience Duration',
      allExperience: 'All Experience Levels',
      expUnder1: '< 1 year',
      exp1to3: '1-3 years',
      exp3to5: '3-5 years',
      expOver5: '> 5 years',

      showing: 'Showing',
      of: 'of',
      companySubmissionsText: 'company assessments',
      individualSubmissionsText: 'individual assessments',
      noSubmissions: 'No assessment history yet',
      noSubmissionsOrgDesc: 'No companies have completed the AI readiness assessment yet.',
      noSubmissionsIndDesc: 'No individuals have completed the professional AI readiness assessment yet.',

      thNo: 'No.',
      thCompanyLocation: 'Company & Location',
      thPicContact: 'PIC & Contact',
      thIndustry: 'Industry',
      thScore: 'Score',
      thLevel: 'Level',
      thDate: 'Date',
      thActions: 'Actions',
      thNameContact: 'Name & Contact',
      thRoleCompany: 'Role & Institution',
      thExpTools: 'Experience & AI Tools',

      loginTitle: 'Admin Dashboard',
      loginSubtitle: 'AI Readiness Assessment',
      loginHeader: 'Login as Admin',
      password: 'Admin Password',
      passwordPlaceholder: 'Enter password',
      wrongPassword: 'Wrong password',
      loginBtn: 'Login',
      backHome: 'Back to Home'
    }
  }
};
