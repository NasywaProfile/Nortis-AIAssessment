import React, { useState } from 'react';
import { useLanguage, defaultTranslations } from '../../contexts/LanguageContext';
import { 
  Save, 
  Image as ImageIcon, 
  LayoutTemplate, 
  FileText, 
  HelpCircle, 
  ListTodo, 
  CheckCircle, 
  Upload, 
  CheckCircle2, 
  RefreshCcw, 
  LogOut, 
  AlertCircle, 
  Menu, 
  X,
  Award,
  PhoneCall,
  Download,
  AlertTriangle,
  Zap,
  ShieldAlert,
  Target,
  FileSpreadsheet,
  Presentation,
  RefreshCw,
  Sparkles,
  UserCheck,
  User,
  Building2,
  Plus,
  Trash2,
  Mail,
  MessageSquare,
  Clock,
  ArrowRight,
  BarChart2,
  Activity,
  Compass,
  Layers,
  PieChart
} from 'lucide-react';

import { apiService } from '../../services/api';
import { levelGrowthInsightsDefaults, levelStrengthInsightsDefaults } from '../../utils/individualInsights';

const humanize = (str: string) => {
  const result = str.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const ensureCompleteDraft = (raw: any) => {
  const cloned = JSON.parse(JSON.stringify(raw || defaultTranslations));
  (['ID', 'EN'] as const).forEach((lang) => {
    if (!cloned[lang]) cloned[lang] = JSON.parse(JSON.stringify(defaultTranslations[lang]));
    if (!cloned[lang].result) cloned[lang].result = JSON.parse(JSON.stringify(defaultTranslations[lang].result));
    if (!cloned[lang].result.nortisProgramsByLevel) {
      cloned[lang].result.nortisProgramsByLevel = JSON.parse(JSON.stringify(defaultTranslations[lang].result.nortisProgramsByLevel || {}));
    }
    if (!cloned[lang].result.individualNortisProgramsByLevel) {
      cloned[lang].result.individualNortisProgramsByLevel = JSON.parse(JSON.stringify(defaultTranslations[lang].result.individualNortisProgramsByLevel || {}));
    }
    const levels = ['unready', 'aware', 'ready', 'enabled', 'mature'];
    levels.forEach((lvl) => {
      if (!cloned[lang].result.nortisProgramsByLevel[lvl] || !Array.isArray(cloned[lang].result.nortisProgramsByLevel[lvl])) {
        const fallback =
          defaultTranslations[lang]?.result?.nortisProgramsByLevel?.[lvl] ||
          cloned[lang]?.result?.nortisPrograms ||
          defaultTranslations[lang]?.result?.nortisPrograms ||
          [];
        cloned[lang].result.nortisProgramsByLevel[lvl] = JSON.parse(JSON.stringify(fallback));
      }
      if (!cloned[lang].result.individualNortisProgramsByLevel[lvl] || !Array.isArray(cloned[lang].result.individualNortisProgramsByLevel[lvl])) {
        cloned[lang].result.individualNortisProgramsByLevel[lvl] = [];
      }
    });
  });
  return cloned;
};

export function CMSDashboard({ onBack }: { onBack: () => void }) {
  const { translations, updateTranslations, images, updateImage } = useLanguage();
  const [activeTab, setActiveTab] = useState<string>('landing_flow');
  const [draftTranslations, setDraftTranslations] = useState<any>(() => ensureCompleteDraft(translations));
  const [draftImages, setDraftImages] = useState<Record<string, string>>({ ...images });
  const [isSaved, setIsSaved] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [resultSubTab, setResultSubTab] = useState<'levels' | 'headers' | 'programs' | 'actions'>('levels');
  const [selectedResultLevel, setSelectedResultLevel] = useState<'mature' | 'enabled' | 'ready' | 'aware' | 'unready'>('mature');
  const [selectedProgramLevel, setSelectedProgramLevel] = useState<'unready' | 'aware' | 'ready' | 'enabled' | 'mature'>('unready');
  const [indResultSubTab, setIndResultSubTab] = useState<'levels' | 'labels' | 'actions' | 'programs'>('levels');
  const [selectedIndProgramLevel, setSelectedIndProgramLevel] = useState<'unready' | 'aware' | 'ready' | 'enabled' | 'mature'>('unready');
  const [selectedIndInsightDim, setSelectedIndInsightDim] = useState<string>('aiLiteracy');
  const [selectedIndDimStatus, setSelectedIndDimStatus] = useState<string | null>(null);
  const [selectedIndResultLevel, setSelectedIndResultLevel] = useState<'mature' | 'enabled' | 'ready' | 'aware' | 'unready'>('mature');
  const [selectedIndDimStep, setSelectedIndDimStep] = useState<number>(0);
  const [adminSubTab, setAdminSubTab] = useState<'org' | 'ind' | 'general'>('org');

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  } | null>(null);

  const [promptModal, setPromptModal] = useState<{
    isOpen: boolean;
    title: string;
    placeholder: string;
    onConfirm: (val: string) => void;
  } | null>(null);
  const [promptInput, setPromptInput] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 3000);
  };

  const tabCategories = [
    {
      category: '1. Halaman Beranda',
      tabs: [
        { id: 'landing_flow', label: '1. Beranda (Landing Page)', icon: LayoutTemplate, desc: 'Logo, Hero, Manfaat, 5 Pilar & CTA' },
      ]
    },
    {
      category: '2. Asesmen Organisasi',
      tabs: [
        { id: 'form_org', label: '2. Formulir Data Organisasi', icon: Building2, desc: 'Profil Instansi, Kondisi AI & Kontak PIC' },
        { id: 'questions_org', label: '3. Pertanyaan & Skala Organisasi', icon: ListTodo, desc: 'Skala 0-5 & 5 Pilar Pertanyaan S1-G5' },
        { id: 'result_org', label: '4. Hasil & Rekomendasi Organisasi', icon: CheckCircle, desc: 'Teks Hasil, 5 Level & Rekomendasi' },
      ]
    },
    {
      category: '3. Asesmen Individu (Talenta)',
      tabs: [
        { id: 'form_ind', label: '5. Formulir Data Individu', icon: User, desc: 'Data Pribadi & Profil Profesional' },
        { id: 'questions_ind', label: '6. Pertanyaan & Skala Individu', icon: ListTodo, desc: 'Skala 0-5 & 6 Dimensi Pertanyaan A1-F5' },
        { id: 'result_ind', label: '7. Hasil & Rekomendasi Individu', icon: Sparkles, desc: '5 Level Kesiapan & Rekomendasi Aksi' }
      ]
    },
    {
      category: '4. Dashboard Admin',
      tabs: [
        { id: 'admin_org', label: '8. Dashboard Admin (Organisasi)', icon: Building2, desc: 'Metrik, Filter, Tabel & Status Perusahaan' },
        { id: 'admin_ind', label: '9. Dashboard Admin (Individu / Website)', icon: User, desc: 'Metrik, Filter, Tabel & Status Individu' },
        { id: 'admin_general', label: '10. Header, Navigasi & Login Admin', icon: FileSpreadsheet, desc: 'Judul Utama, Tab Mode & Form Login' }
      ]
    }
  ];

  const tabs = tabCategories.flatMap(c => c.tabs);

  const handleSave = () => {
    updateTranslations(draftTranslations);
    Object.entries(draftImages).forEach(([key, url]) => {
      updateImage(key, url);
    });

    apiService.saveCMSData({
      questions: draftTranslations.ID?.assessmentData?.[0]?.questions || [],
      categories: draftTranslations.ID?.assessmentData?.map((a: any) => ({ id: a.id, title: a.title, icon: a.icon, description: a.description })) || [],
      industries: draftTranslations.ID?.form?.industries ? Object.values(draftTranslations.ID.form.industries) : [],
    });

    setIsSaved(true);
    showToast('Seluruh perubahan CMS berhasil disimpan!');
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleReset = () => {
    setDeleteModal({
      isOpen: true,
      title: 'Reset Semua Konten ke Default',
      message: 'Apakah Anda yakin ingin mereset seluruh konten CMS ke pengaturan awal bawaan? Perubahan kustom Anda akan dikembalikan.',
      onConfirm: () => {
        setDraftTranslations(JSON.parse(JSON.stringify(defaultTranslations)));
        setDraftImages({ logo: '/LogoNortis.png' });
        setDeleteModal(null);
        showToast('Konten CMS berhasil di-reset ke default.');
      }
    });
  };

  const updateDraftText = (lang: 'ID' | 'EN', section: string, path: string[], value: any) => {
    const newDraft = JSON.parse(JSON.stringify(draftTranslations));
    if (!newDraft[lang]) newDraft[lang] = {};
    if (!newDraft[lang][section]) newDraft[lang][section] = {};
    let current = newDraft[lang][section];
    for (let i = 0; i < path.length - 1; i++) {
      const segment = path[i];
      const nextSegment = path[i + 1];
      const nextIsNum = !isNaN(Number(nextSegment));
      if (current[segment] === undefined) {
        current[segment] = nextIsNum ? [] : {};
      }
      current = current[segment];
    }
    current[path[path.length - 1]] = value;
    setDraftTranslations(newDraft);
  };

  
  const handleAddOption = (section: string, path: string[]) => {
    setPromptInput('');
    setPromptModal({
      isOpen: true,
      title: 'Tambah Opsi Baru',
      placeholder: "Masukkan ID unik (contoh: 'education')",
      onConfirm: (newKey) => {
        const newKeyClean = newKey.trim().replace(/\s+/g, '').toLowerCase();
        if (!newKeyClean) return;

        const newDraft = JSON.parse(JSON.stringify(draftTranslations));
        let currentID = newDraft['ID']?.[section];
        let currentEN = newDraft['EN']?.[section];
        for (let i = 0; i < path.length; i++) {
          if (!currentID[path[i]]) currentID[path[i]] = {};
          if (currentEN && !currentEN[path[i]]) currentEN[path[i]] = {};
          currentID = currentID[path[i]];
          currentEN = currentEN?.[path[i]];
        }

        if (currentID && currentID[newKeyClean] !== undefined) {
          showToast('ID opsi tersebut sudah ada.');
          return;
        }

        if (currentID) currentID[newKeyClean] = newKeyClean;
        if (currentEN) currentEN[newKeyClean] = newKeyClean;
        setDraftTranslations(newDraft);
        setPromptModal(null);
        showToast(`Opsi '${newKeyClean}' berhasil ditambahkan.`);
      }
    });
  };

  const handleRemoveOption = (section: string, path: string[], keyToRemove: string) => {
    setDeleteModal({
      isOpen: true,
      title: 'Hapus Opsi',
      message: `Apakah Anda yakin ingin menghapus opsi '${keyToRemove}'?`,
      onConfirm: () => {
        const newDraft = JSON.parse(JSON.stringify(draftTranslations));
        let currentID = newDraft['ID']?.[section];
        let currentEN = newDraft['EN']?.[section];
        for (let i = 0; i < path.length; i++) {
          currentID = currentID?.[path[i]];
          currentEN = currentEN?.[path[i]];
        }
        if (currentID) delete currentID[keyToRemove];
        if (currentEN) delete currentEN[keyToRemove];
        setDraftTranslations(newDraft);
        setDeleteModal(null);
        showToast(`Opsi '${keyToRemove}' berhasil dihapus.`);
      }
    });
  };

  const renderInputField = (lang: 'ID' | 'EN', section: string, path: string[], value: string, label: string) => {
    const isTextArea = value.length > 60 || path[path.length - 1].toLowerCase().includes('desc');
    return (
      <div className="flex-1">
        <label className="block text-[11px] font-bold text-slate-400 mb-1.5 uppercase tracking-wider">{lang === 'ID' ? 'Bahasa Indonesia' : 'English'}</label>
        {isTextArea ? (
          <textarea 
            className="w-full px-4 py-3 border border-slate-200 bg-slate-50/50 rounded-xl text-[13px] min-h-[90px] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
            value={value}
            onChange={(e) => updateDraftText(lang, section, path, e.target.value)}
          />
        ) : (
          <input 
            type="text" 
            className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl text-[13px] focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-sm"
            value={value}
            onChange={(e) => updateDraftText(lang, section, path, e.target.value)}
          />
        )}
      </div>
    );
  };

  const renderFieldGroup = (section: string, path: string[], valID: any, valEN: any, titleOverride?: string) => {
    const title = titleOverride || humanize(path[path.length - 1]);
    
    // Array of Strings (like benefits or instructions)
    if (Array.isArray(valID) && (valID.length === 0 || typeof valID[0] === 'string')) {
      return (
        <div key={path.join('.')} className="mb-6 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
            <div className="flex gap-2 items-center">
              <span className="text-[11px] font-medium text-slate-400 bg-white px-2 py-1 rounded-md border border-slate-100 shadow-sm">List items</span>
              <button 
                type="button"
                onClick={() => {
                  const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                  let currentID = newDraft['ID'][section];
                  let currentEN = newDraft['EN'][section];
                  for (let i = 0; i < path.length; i++) {
                    if (!currentID[path[i]]) currentID[path[i]] = [];
                    if (currentEN && !currentEN[path[i]]) currentEN[path[i]] = [];
                    currentID = currentID[path[i]];
                    currentEN = currentEN?.[path[i]];
                  }
                  currentID.push('New item');
                  if (currentEN) currentEN.push('New item');
                  setDraftTranslations(newDraft);
                  showToast('Item list berhasil ditambahkan.');
                }}
                className="text-xs px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors font-semibold cursor-pointer"
              >
                + Tambah Item
              </button>
            </div>
          </div>
          <div className="p-5 space-y-4">
            {valID.length === 0 ? (
              <p className="text-xs text-slate-400 italic py-2">Belum ada item list. Klik "+ Tambah Item" di atas untuk menambahkan.</p>
            ) : (
              valID.map((item: string, idx: number) => (
                <div key={idx} className="flex flex-col md:flex-row gap-5 p-5 bg-white rounded-xl border border-slate-100 shadow-sm relative group">
                  <div className="flex-none flex flex-col gap-3 items-center">
                    <div className="w-8 h-8 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center text-xs font-bold border border-emerald-100">{idx + 1}</div>
                    <button 
                      type="button"
                      onClick={() => {
                        setDeleteModal({
                          isOpen: true,
                          title: 'Hapus Item List',
                          message: 'Apakah Anda yakin ingin menghapus item ini?',
                          onConfirm: () => {
                            const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                            let currentID = newDraft['ID'][section];
                            let currentEN = newDraft['EN'][section];
                            for (let i = 0; i < path.length; i++) {
                              currentID = currentID?.[path[i]];
                              currentEN = currentEN?.[path[i]];
                            }
                            if (Array.isArray(currentID)) currentID.splice(idx, 1);
                            if (Array.isArray(currentEN)) currentEN.splice(idx, 1);
                            setDraftTranslations(newDraft);
                            setDeleteModal(null);
                            showToast('Item list berhasil dihapus.');
                          }
                        });
                      }}
                      className="text-[10px] text-red-500 hover:text-red-600 font-bold cursor-pointer"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="flex-1 flex flex-col md:flex-row gap-5">
                    {renderInputField('ID', section, [...path, idx.toString()], item, 'ID')}
                    {renderInputField('EN', section, [...path, idx.toString()], valEN?.[idx] || '', 'EN')}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      );
    }
    
    // Array of Objects (like scale: [{score: 0, label: ''}])
    if (Array.isArray(valID) && typeof valID[0] === 'object') {
      return (
        <div key={path.join('.')} className="mb-6 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
            <button
              type="button"
              onClick={() => {
                const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                let currentID = newDraft['ID'][section];
                let currentEN = newDraft['EN'][section];
                for (let i = 0; i < path.length; i++) {
                  currentID = currentID[path[i]];
                  currentEN = currentEN[path[i]];
                }
                const newScore = currentID.length;
                currentID.push({ score: newScore, label: 'New label' });
                if (currentEN) currentEN.push({ score: newScore, label: 'New label' });
                setDraftTranslations(newDraft);
                showToast('Skala baru berhasil ditambahkan.');
              }}
              className="text-xs px-3 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-600 rounded-lg transition-colors font-semibold cursor-pointer"
            >
              + Tambah Skala
            </button>
          </div>
          <div className="p-5 space-y-4">
            {valID.map((item: any, idx: number) => (
              <div key={idx} className="flex flex-col md:flex-row gap-5 items-start p-5 bg-white rounded-xl border border-slate-100 shadow-sm relative group">
                <div className="flex-none flex flex-col gap-2">
                  <div className="bg-emerald-50 text-emerald-700 px-4 py-2 rounded-lg text-sm font-bold border border-emerald-100 text-center">
                    Score: {item.score}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setDeleteModal({
                        isOpen: true,
                        title: 'Hapus Skala',
                        message: `Apakah Anda yakin ingin menghapus skala skor ${item.score}?`,
                        onConfirm: () => {
                          const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                          let currentID = newDraft['ID'][section];
                          let currentEN = newDraft['EN'][section];
                          for (let i = 0; i < path.length; i++) {
                            currentID = currentID[path[i]];
                            currentEN = currentEN?.[path[i]];
                          }
                          if (Array.isArray(currentID)) {
                            currentID.splice(idx, 1);
                            currentID.forEach((s: any, i: number) => (s.score = i));
                          }
                          if (Array.isArray(currentEN)) {
                            currentEN.splice(idx, 1);
                            currentEN.forEach((s: any, i: number) => (s.score = i));
                          }
                          setDraftTranslations(newDraft);
                          setDeleteModal(null);
                          showToast('Skala penilaian berhasil dihapus.');
                        }
                      });
                    }}
                    className="text-[10px] text-red-500 hover:text-red-600 font-bold text-center mt-1 cursor-pointer"
                  >
                    Hapus
                  </button>
                </div>
                <div className="flex-1 flex flex-col md:flex-row gap-5 w-full">
                  {renderInputField('ID', section, [...path, idx.toString(), 'label'], item.label, 'ID')}
                  {renderInputField('EN', section, [...path, idx.toString(), 'label'], valEN?.[idx]?.label || '', 'EN')}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    // Standard String Field
    if (typeof valID === 'string') {
      return (
        <div key={path.join('.')} className="mb-4 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm hover:border-emerald-200 transition-colors">
          <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
          </div>
          <div className="p-5 flex flex-col md:flex-row gap-5">
            {renderInputField('ID', section, path, valID, 'ID')}
            {renderInputField('EN', section, path, valEN || '', 'EN')}
          </div>
        </div>
      );
    }

    // Nested Object (like industries, pillars, companySizes)
    if (typeof valID === 'object' && valID !== null) {
      return (
        <div key={path.join('.')} className="mb-6 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
          <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100">
            <h3 className="font-semibold text-slate-800 text-sm">{title}</h3>
          </div>
          <div className="p-5 grid grid-cols-1 gap-4">
            {Object.keys(valID).map(key => (
               <div key={key} className="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden">
                 {typeof valID[key] === 'object' && valID[key] !== null ? (
                   renderFieldGroup(section, [...path, key], valID[key], valEN?.[key], humanize(key))
                 ) : (
                   <div className="p-5 flex-1 flex flex-col md:flex-row gap-5">
                     {renderInputField('ID', section, [...path, key], valID[key], 'ID')}
                     {renderInputField('EN', section, [...path, key], valEN?.[key] || '', 'EN')}
                   </div>
                 )}
               </div>
            ))}
          </div>
        </div>
      );
    }

    return null;
  };

  const renderSection = (sectionId: string) => {
    let idData = draftTranslations['ID'][sectionId];
    let enData = draftTranslations['EN'][sectionId];
    
    // Only render fields that exist in defaultTranslations
    const defaultIdData = defaultTranslations['ID'][sectionId as keyof typeof defaultTranslations['ID']];
    if (idData && defaultIdData) {
      const filteredIdData: any = {};
      Object.keys(defaultIdData).forEach(key => {
        if (idData[key] !== undefined) {
          filteredIdData[key] = idData[key];
        }
      });
      
      // Exclusions based on requests
      if (sectionId === 'questions') {
        delete filteredIdData['pillarIndicator']; // hide legacy field
      }
      if (sectionId === 'form') {
        delete filteredIdData['dropdownPlaceholder'];
      }
      if (sectionId === 'admin') {
        delete filteredIdData['loginTitle'];
        delete filteredIdData['loginSubtitle'];
        delete filteredIdData['loginHeader'];
        delete filteredIdData['password'];
        delete filteredIdData['passwordPlaceholder'];
        delete filteredIdData['wrongPassword'];
        delete filteredIdData['loginBtn'];
        delete filteredIdData['backHome'];

        delete filteredIdData['readinessLevel'];
        delete filteredIdData['allLevels'];
        delete filteredIdData['level1'];
        delete filteredIdData['level2'];
        delete filteredIdData['level3'];
        delete filteredIdData['level4'];
        delete filteredIdData['level5'];

        delete filteredIdData['industryLabel'];
        delete filteredIdData['allIndustries'];
      }

      idData = filteredIdData;
    }

    if (sectionId === 'assessmentData') {
      const idPillars = draftTranslations['ID'].assessmentData || [];
      const enPillars = draftTranslations['EN'].assessmentData || [];
      
      return (
        <div className="space-y-8">
          <div className="flex justify-end mb-4">
            <button 
              type="button"
              onClick={() => {
                const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                const newId = 'pillar_' + Date.now();
                const newPillarID = { id: newId, title: 'Pillar Baru', description: '', shortTitle: 'Pillar Baru', questions: [{ id: newId + '_1', text: 'Pertanyaan Baru' }] };
                const newPillarEN = { id: newId, title: 'New Pillar', description: '', shortTitle: 'New Pillar', questions: [{ id: newId + '_1', text: 'New Question' }] };
                if (!Array.isArray(newDraft['ID'].assessmentData)) newDraft['ID'].assessmentData = [];
                if (!Array.isArray(newDraft['EN'].assessmentData)) newDraft['EN'].assessmentData = [];
                newDraft['ID'].assessmentData.push(newPillarID);
                newDraft['EN'].assessmentData.push(newPillarEN);
                setDraftTranslations(newDraft);
                showToast('Pillar baru berhasil ditambahkan.');
              }}
              className="px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm font-semibold hover:bg-emerald-700 cursor-pointer shadow-xs"
            >
              + Tambah Pillar
            </button>
          </div>
          {idPillars.map((pillar: any, pIndex: number) => (
            <div key={pIndex} className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden">
              <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100 flex justify-between items-center">
                <h3 className="font-bold text-slate-800 text-lg">Pillar {pIndex + 1}: {pillar.title}</h3>
                <button
                  type="button"
                  onClick={() => {
                    setDeleteModal({
                      isOpen: true,
                      title: 'Hapus Pillar Asesmen',
                      message: `Apakah Anda yakin ingin menghapus Pillar "${pillar.title || pIndex + 1}" beserta seluruh pertanyaan di dalamnya?`,
                      onConfirm: () => {
                        const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                        if (Array.isArray(newDraft['ID']?.assessmentData)) {
                          newDraft['ID'].assessmentData.splice(pIndex, 1);
                        }
                        if (Array.isArray(newDraft['EN']?.assessmentData)) {
                          newDraft['EN'].assessmentData.splice(pIndex, 1);
                        }
                        setDraftTranslations(newDraft);
                        setDeleteModal(null);
                        showToast('Pillar berhasil dihapus.');
                      }
                    });
                  }}
                  className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                >
                  Hapus Pillar
                </button>
              </div>
              <div className="p-5 space-y-6">
                
                {/* Pillar Info */}
                <div className="space-y-4 border-b border-slate-100 pb-6">
                  <h4 className="font-semibold text-sm text-slate-700">Pillar Details</h4>

                  <div className="flex flex-col md:flex-row gap-5">
                    {renderInputField('ID', 'assessmentData', [pIndex.toString(), 'title'], pillar.title, 'Full Title')}
                    {renderInputField('EN', 'assessmentData', [pIndex.toString(), 'title'], enPillars[pIndex]?.title || '', 'Full Title')}
                  </div>

                  <div className="flex flex-col md:flex-row gap-5">
                    {renderInputField('ID', 'assessmentData', [pIndex.toString(), 'description'], pillar.description, 'Description')}
                    {renderInputField('EN', 'assessmentData', [pIndex.toString(), 'description'], enPillars[pIndex]?.description || '', 'Description')}
                  </div>
                </div>

                {/* Questions */}
                <div>
                  <div className="flex justify-between items-center mb-4">
                    <h4 className="font-semibold text-sm text-slate-700">Questions</h4>
                    <button
                      type="button"
                      onClick={() => {
                        const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                        const newQId = pillar.id + '_' + Date.now();
                        if (!Array.isArray(newDraft['ID'].assessmentData[pIndex].questions)) {
                          newDraft['ID'].assessmentData[pIndex].questions = [];
                        }
                        if (!Array.isArray(newDraft['EN'].assessmentData[pIndex].questions)) {
                          newDraft['EN'].assessmentData[pIndex].questions = [];
                        }
                        newDraft['ID'].assessmentData[pIndex].questions.push({ id: newQId, text: 'Pertanyaan Baru' });
                        newDraft['EN'].assessmentData[pIndex].questions.push({ id: newQId, text: 'New Question' });
                        setDraftTranslations(newDraft);
                        showToast('Pertanyaan baru berhasil ditambahkan.');
                      }}
                      className="text-xs px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg hover:bg-emerald-100 font-semibold cursor-pointer"
                    >
                      + Tambah Pertanyaan
                    </button>
                  </div>
                  <div className="space-y-4">
                    {pillar.questions.map((q: any, qIndex: number) => (
                      <div key={qIndex} className="p-4 bg-slate-50 rounded-xl border border-slate-100 relative">
                        <div className="flex justify-between items-center mb-2">
                          <div className="text-xs font-bold text-slate-500">Question {qIndex + 1} (ID: {q.id})</div>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteModal({
                                isOpen: true,
                                title: 'Hapus Pertanyaan',
                                message: `Apakah Anda yakin ingin menghapus pertanyaan ini (ID: ${q.id})?`,
                                onConfirm: () => {
                                  const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                  if (Array.isArray(newDraft['ID']?.assessmentData?.[pIndex]?.questions)) {
                                    newDraft['ID'].assessmentData[pIndex].questions.splice(qIndex, 1);
                                  }
                                  if (Array.isArray(newDraft['EN']?.assessmentData?.[pIndex]?.questions)) {
                                    newDraft['EN'].assessmentData[pIndex].questions.splice(qIndex, 1);
                                  }
                                  setDraftTranslations(newDraft);
                                  setDeleteModal(null);
                                  showToast('Pertanyaan berhasil dihapus.');
                                }
                              });
                            }}
                            className="text-xs text-red-500 hover:text-red-700 font-bold cursor-pointer"
                          >
                            Hapus
                          </button>
                        </div>
                        <div className="flex flex-col md:flex-row gap-5">
                           {renderInputField('ID', 'assessmentData', [pIndex.toString(), 'questions', qIndex.toString(), 'text'], q.text, 'Question text')}
                           {renderInputField('EN', 'assessmentData', [pIndex.toString(), 'questions', qIndex.toString(), 'text'], enPillars[pIndex]?.questions[qIndex]?.text || '', 'Question text')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>
      );
    }

    if (!idData) {
      return (
        <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200 border-dashed">
          <AlertCircle className="w-8 h-8 mx-auto mb-3 text-slate-300" />
          <p className="text-sm">No content fields available for this section.</p>
        </div>
      );
    }

    const rawIdData = draftTranslations['ID'][sectionId] || {};
    const rawEnData = draftTranslations['EN'][sectionId] || {};
    const rawIdFormIndustries = draftTranslations['ID']?.form?.industries || {};
    const rawEnFormIndustries = draftTranslations['EN']?.form?.industries || {};

    return (
      <div className="space-y-4">
        {Object.keys(idData).sort((a, b) => {
          if (sectionId === 'recommendations') {
            const order = ['unready', 'aware', 'ready', 'enabled', 'mature'];
            const idxA = order.indexOf(a);
            const idxB = order.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          }
          return 0;
        }).map(key => {
          let titleOverride = undefined;
          if (sectionId === 'admin' && key === 'industryLabel') {
            titleOverride = 'Label Industri';
          }
          if (sectionId === 'form' && key === 'industries') {
            titleOverride = 'Pilihan Industri (Sektor)';
          }
          if (sectionId === 'form' && key === 'companySizes') {
            titleOverride = 'Pilihan Ukuran Perusahaan';
          }
          if (sectionId === 'form' && key === 'timelines') {
            titleOverride = 'Pilihan Estimasi Waktu';
          }
          if (sectionId === 'recommendations') {
            if (key === 'mature') titleOverride = 'Rentang Skor 4.6 – 5.0 (AI-Mature)';
            if (key === 'enabled') titleOverride = 'Rentang Skor 3.6 – 4.5 (AI-Enabled)';
            if (key === 'ready') titleOverride = 'Rentang Skor 2.6 – 3.5 (AI-Ready)';
            if (key === 'aware') titleOverride = 'Rentang Skor 1.6 – 2.5 (AI-Aware)';
            if (key === 'unready') titleOverride = 'Rentang Skor 0 – 1.5 (AI-Unready)';
          }
          
          const fieldGroup = renderFieldGroup(sectionId, [key], idData[key], enData?.[key], titleOverride);

          if (sectionId === 'admin' && key === 'exportExcel') {
            return (
              <React.Fragment key={key}>
                {fieldGroup}
                
                {/* Readiness Level Group Card */}
                <div className="my-6 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                  <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800 text-sm">Readiness Level</h3>
                  </div>
                  <div className="p-5 space-y-6">
                    {/* Readiness Level Main Label */}
                    <div className="flex flex-col md:flex-row gap-5">
                      {renderInputField('ID', 'admin', ['readinessLevel'], rawIdData.readinessLevel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['readinessLevel'], rawEnData.readinessLevel || '', 'EN')}
                    </div>

                    {/* Sub Kolom: All Levels */}
                    <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200/80 space-y-5">
                      <div className="border-b border-slate-200/60 pb-3">
                        <h4 className="font-semibold text-xs text-slate-600 uppercase tracking-wider">Sub Kolom: All Levels</h4>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-5">
                        {renderInputField('ID', 'admin', ['allLevels'], rawIdData.allLevels || '', 'ID')}
                        {renderInputField('EN', 'admin', ['allLevels'], rawEnData.allLevels || '', 'EN')}
                      </div>

                      {/* Sub Kolom: Level 1 - 5 */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200/60 space-y-4">
                        <h5 className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider mb-2">Sub Kolom: Level 1 - 5</h5>
                        
                        {[
                          { key: 'level1', label: 'Level 1' },
                          { key: 'level2', label: 'Level 2' },
                          { key: 'level3', label: 'Level 3' },
                          { key: 'level4', label: 'Level 4' },
                          { key: 'level5', label: 'Level 5' },
                        ].map(({ key: lvlKey, label: lvlLabel }) => (
                          <div key={lvlKey} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="text-xs font-bold text-slate-600 mb-2">{lvlLabel}</div>
                            <div className="flex flex-col md:flex-row gap-4">
                              {renderInputField('ID', 'admin', [lvlKey], rawIdData[lvlKey] || '', 'ID')}
                              {renderInputField('EN', 'admin', [lvlKey], rawEnData[lvlKey] || '', 'EN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Label Industri Group Card */}
                <div className="my-6 bg-white rounded-2xl border border-slate-200/60 overflow-hidden shadow-sm">
                  <div className="bg-slate-50/50 px-5 py-4 border-b border-slate-100">
                    <h3 className="font-semibold text-slate-800 text-sm">Label Industri</h3>
                  </div>
                  <div className="p-5 space-y-6">
                    {/* Label Industri Main Field */}
                    <div className="flex flex-col md:flex-row gap-5">
                      {renderInputField('ID', 'admin', ['industryLabel'], rawIdData.industryLabel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['industryLabel'], rawEnData.industryLabel || '', 'EN')}
                    </div>

                    {/* Sub Kolom: All Industries */}
                    <div className="p-5 bg-slate-50/50 rounded-xl border border-slate-200/80 space-y-5">
                      <div className="border-b border-slate-200/60 pb-3">
                        <h4 className="font-semibold text-xs text-slate-600 uppercase tracking-wider">Sub Kolom: All Industries</h4>
                      </div>
                      
                      <div className="flex flex-col md:flex-row gap-5">
                        {renderInputField('ID', 'admin', ['allIndustries'], rawIdData.allIndustries || '', 'ID')}
                        {renderInputField('EN', 'admin', ['allIndustries'], rawEnData.allIndustries || '', 'EN')}
                      </div>

                      {/* Sub Kolom: Daftar Pilihan Industri */}
                      <div className="p-4 bg-white rounded-xl border border-slate-200/60 space-y-4">
                        <h5 className="font-semibold text-[11px] text-slate-500 uppercase tracking-wider mb-2">Sub Kolom: Daftar Pilihan Industri</h5>
                        
                        {Object.keys(rawIdFormIndustries).map(indKey => (
                          <div key={indKey} className="p-4 bg-slate-50 rounded-xl border border-slate-100">
                            <div className="flex flex-col md:flex-row gap-4">
                              {renderInputField('ID', 'form', ['industries', indKey], rawIdFormIndustries[indKey] || '', 'ID')}
                              {renderInputField('EN', 'form', ['industries', indKey], rawEnFormIndustries[indKey] || '', 'EN')}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

              </React.Fragment>
            );
          }

          return fieldGroup;
        })}
      </div>
    );
  };

  const renderResultFlow = () => {
    const recID = draftTranslations['ID']?.recommendations || {};
    const recEN = draftTranslations['EN']?.recommendations || {};
    const resID = draftTranslations['ID']?.result || {};
    const resEN = draftTranslations['EN']?.result || {};

    const levelConfigs = [
      {
        id: 'mature',
        name: 'AI-Mature',
        range: 'Skor 4.6 – 5.0',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/60',
        desc: 'Untuk organisasi yang telah matang menerapkan AI di seluruh proses, siap melakukan komersialisasi dan skalabilitas ekosistem.'
      },
      {
        id: 'enabled',
        name: 'AI-Enabled',
        range: 'Skor 3.6 – 4.5',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
        activeBorder: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/60',
        desc: 'Untuk organisasi yang telah sukses menguji pilot project dan siap memperluas (scaling) adopsi AI ke unit bisnis lain.'
      },
      {
        id: 'ready',
        name: 'AI-Ready',
        range: 'Skor 2.6 – 3.5',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/60',
        desc: 'Untuk organisasi yang telah memiliki kesiapan data & fondasi dasar, siap mengeksekusi pilot project pertama.'
      },
      {
        id: 'aware',
        name: 'AI-Aware',
        range: 'Skor 1.6 – 2.5',
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-300',
        activeBorder: 'border-orange-500 ring-2 ring-orange-500/20 bg-orange-50/60',
        desc: 'Untuk organisasi yang menyadari potensi AI dan memerlukan program kesiapan fondasi data, tata kelola, serta literasi tim.'
      },
      {
        id: 'unready',
        name: 'AI-Unready',
        range: 'Skor 0 – 1.5',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        activeBorder: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/60',
        desc: 'Untuk organisasi yang baru memulai eksplorasi awal dan membutuhkan edukasi kesadaran AI serta digitalisasi dasar.'
      },
    ];

    const currentLevelConf = levelConfigs.find(c => c.id === selectedResultLevel) || levelConfigs[0];
    const currentRecID = recID[selectedResultLevel] || {};
    const currentRecEN = recEN[selectedResultLevel] || {};

    const handleAddListItem = (levelKey: string, arrayKey: string, defaultText = 'Poin baru') => {
      const newDraft = JSON.parse(JSON.stringify(draftTranslations));
      if (!newDraft.ID) newDraft.ID = {};
      if (!newDraft.ID.recommendations) newDraft.ID.recommendations = {};
      if (!newDraft.ID.recommendations[levelKey]) newDraft.ID.recommendations[levelKey] = {};
      if (!Array.isArray(newDraft.ID.recommendations[levelKey][arrayKey])) {
        newDraft.ID.recommendations[levelKey][arrayKey] = [];
      }
      if (!newDraft.EN) newDraft.EN = {};
      if (!newDraft.EN.recommendations) newDraft.EN.recommendations = {};
      if (!newDraft.EN.recommendations[levelKey]) newDraft.EN.recommendations[levelKey] = {};
      if (!Array.isArray(newDraft.EN.recommendations[levelKey][arrayKey])) {
        newDraft.EN.recommendations[levelKey][arrayKey] = [];
      }
      newDraft.ID.recommendations[levelKey][arrayKey].push(defaultText);
      newDraft.EN.recommendations[levelKey][arrayKey].push(defaultText);
      setDraftTranslations(newDraft);
      showToast('Poin rekomendasi baru berhasil ditambahkan.');
    };

    const handleRemoveListItem = (levelKey: string, arrayKey: string, index: number) => {
      setDeleteModal({
        isOpen: true,
        title: 'Hapus Poin Rekomendasi',
        message: 'Apakah Anda yakin ingin menghapus butir poin rekomendasi ini?',
        onConfirm: () => {
          const newDraft = JSON.parse(JSON.stringify(draftTranslations));
          if (newDraft.ID?.recommendations?.[levelKey]?.[arrayKey]) {
            newDraft.ID.recommendations[levelKey][arrayKey].splice(index, 1);
          }
          if (newDraft.EN?.recommendations?.[levelKey]?.[arrayKey]) {
            newDraft.EN.recommendations[levelKey][arrayKey].splice(index, 1);
          }
          setDraftTranslations(newDraft);
          setDeleteModal(null);
          showToast('Poin rekomendasi berhasil dihapus.');
        }
      });
    };

    const renderArrayCard = (
      title: string,
      badgeText: string,
      explanation: string,
      levelKey: string,
      arrayKey: string,
      itemsID: string[],
      itemsEN: string[],
      addLabel: string
    ) => (
      <div className="bg-slate-50/90 rounded-2xl border border-slate-200 p-5 space-y-4 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200/70 pb-3">
          <div>
            <div className="flex items-center gap-2">
              <h5 className="font-bold text-slate-800 text-sm">{title}</h5>
              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/80 text-slate-700">
                {badgeText}
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">{explanation}</p>
          </div>
          <button
            type="button"
            onClick={() => handleAddListItem(levelKey, arrayKey)}
            className="self-start sm:self-auto text-xs px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold transition-colors shadow-xs flex items-center gap-1.5"
          >
            + {addLabel}
          </button>
        </div>

        <div className="space-y-3">
          {itemsID && itemsID.map((item: string, idx: number) => (
            <div key={idx} className="flex flex-col md:flex-row gap-3.5 p-4 bg-white rounded-xl border border-slate-200 shadow-xs relative">
              <div className="flex items-center md:flex-col justify-between md:justify-start gap-2 shrink-0">
                <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 font-bold text-xs flex items-center justify-center border border-slate-200">
                  {idx + 1}
                </span>
                <button
                  type="button"
                  onClick={() => handleRemoveListItem(levelKey, arrayKey, idx)}
                  className="text-[11px] text-red-500 hover:text-red-700 font-bold hover:underline"
                >
                  Hapus
                </button>
              </div>
              <div className="flex-1 flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'recommendations', [levelKey, arrayKey, idx.toString()], item, 'ID')}
                {renderInputField('EN', 'recommendations', [levelKey, arrayKey, idx.toString()], itemsEN?.[idx] || '', 'EN')}
              </div>
            </div>
          ))}
          {(!itemsID || itemsID.length === 0) && (
            <div className="text-center py-4 bg-white rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
              Belum ada poin dalam daftar ini. Klik <strong className="text-emerald-600">{`"+ ${addLabel}"`}</strong> untuk menambahkan.
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div className="space-y-8">
        {/* Banner Penjelasan */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/30 border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                Pengaturan Konten Halaman Hasil (Results Page)
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                Halaman ini telah disesuaikan agar persis dengan konten yang dilihat pengguna setelah menyelesaikan asesmen. Anda dapat mengedit teks umum, label grafik, banner program Nortis, serta rekomendasi terperinci untuk masing-masing dari <strong>5 Tingkat Kematangan Skor AI</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-Navigasi 4 Bagian */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setResultSubTab('levels')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              resultSubTab === 'levels'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Award className="w-4 h-4 text-emerald-600" />
            1. Rekomendasi per Level Skor (5 Tingkat)
          </button>
          <button
            type="button"
            onClick={() => setResultSubTab('headers')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              resultSubTab === 'headers'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutTemplate className="w-4 h-4 text-slate-500" />
            2. Header Halaman & Label Grafik
          </button>
          <button
            type="button"
            onClick={() => setResultSubTab('programs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              resultSubTab === 'programs'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <PhoneCall className="w-4 h-4 text-blue-500" />
            3. Program Nortis & Konsultasi
          </button>
          <button
            type="button"
            onClick={() => setResultSubTab('actions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              resultSubTab === 'actions'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-4 h-4 text-amber-500" />
            4. Tombol Download & Navigasi
          </button>
        </div>

        {/* SUBTAB 1: LEVELS */}
        {resultSubTab === 'levels' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Pilih Tingkat Kematangan Skor untuk Diedit:</h4>
              <p className="text-xs text-slate-500 mb-3">Klik tombol level di bawah untuk menyesuaikan judul, deskripsi, dan 4 kotak analisis yang akan tampil bagi pengguna di rentang skor tersebut.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {levelConfigs.map(lvl => {
                  const isSelected = selectedResultLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => setSelectedResultLevel(lvl.id as any)}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? lvl.activeBorder
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900">{lvl.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${lvl.badgeBg}`}>
                          {lvl.range.replace('Skor ', '')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{lvl.range}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level Editor Box */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 border-b border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${currentLevelConf.badgeBg}`}>
                      {currentLevelConf.name} ({currentLevelConf.range})
                    </span>
                    <span className="text-xs font-semibold text-slate-700">Editor Konten Hasil</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{currentLevelConf.desc}</p>
                </div>
              </div>

              <div className="p-6 space-y-8">
                {/* 1. Judul & Deskripsi Singkat */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">A. Judul & Ringkasan Kartu Skor</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Teks yang tampil pada kartu skor utama paling atas halaman hasil.</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">Judul Rekomendasi (Action Title)</label>
                      <span className="text-[10px] text-slate-400">Tampil di kartu rekomendasi atas</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'recommendations', [selectedResultLevel, 'title'], currentRecID.title || '', 'ID')}
                      {renderInputField('EN', 'recommendations', [selectedResultLevel, 'title'], currentRecEN.title || '', 'EN')}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">Deskripsi Singkat (Short Description)</label>
                      <span className="text-[10px] text-slate-400">Tampil di bawah skor indeks kesiapan</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'recommendations', [selectedResultLevel, 'shortDesc'], currentRecID.shortDesc || '', 'ID')}
                      {renderInputField('EN', 'recommendations', [selectedResultLevel, 'shortDesc'], currentRecEN.shortDesc || '', 'EN')}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">Deskripsi Kartu Rekomendasi (Action Description)</label>
                      <span className="text-[10px] text-slate-400">Tampil di kotak kanan kartu rekomendasi atas</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'recommendations', [selectedResultLevel, 'desc'], currentRecID.desc || '', 'ID')}
                      {renderInputField('EN', 'recommendations', [selectedResultLevel, 'desc'], currentRecEN.desc || '', 'EN')}
                    </div>
                  </div>
                </div>

                {/* 2. Ringkasan Eksekutif */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">B. Ringkasan Eksekutif (Executive Summary)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Teks narasi lengkap yang tampil di kotak Ringkasan Eksekutif di bawah grafik radar/batang.</p>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">Teks Ringkasan Eksekutif (Executive Summary)</label>
                      <span className="text-[10px] text-slate-400">Tampil persis di kotak Ringkasan Eksekutif pada website</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'recommendations', [selectedResultLevel, 'executiveSummary'], currentRecID.executiveSummary || currentRecID.desc || '', 'ID')}
                      {renderInputField('EN', 'recommendations', [selectedResultLevel, 'executiveSummary'], currentRecEN.executiveSummary || currentRecEN.desc || '', 'EN')}
                    </div>
                  </div>
                </div>

                {/* 3. 4 Kotak Analisis Kualitatif */}
                <div className="space-y-5">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">C. 4 Kotak Analisis Kualitatif (Tampil di Layar Hasil)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Empat kotak analisis yang tampil di bawah grafik radar dan grafik batang.</p>
                  </div>

                  {renderArrayCard(
                    '1. Risiko Utama',
                    'Main Risk Box',
                    'Daftar risiko utama dan ancaman potensial bagi organisasi pada level ini.',
                    selectedResultLevel,
                    'risikoUtama',
                    currentRecID.risikoUtama || [],
                    currentRecEN.risikoUtama || [],
                    'Tambah Risiko'
                  )}

                  {renderArrayCard(
                    '2. Quick Wins',
                    'Quick Wins Box',
                    'Inisiatif cepat berdampak tinggi yang direkomendasikan untuk segera dieksekusi.',
                    selectedResultLevel,
                    'quickWins',
                    currentRecID.quickWins || [],
                    currentRecEN.quickWins || [],
                    'Tambah Quick Win'
                  )}

                  {renderArrayCard(
                    '3. Hambatan Organisasi',
                    'Barriers Box',
                    'Tantangan struktural, budaya, anggaran, atau kesiapan SDM.',
                    selectedResultLevel,
                    'hambatan',
                    currentRecID.hambatan || [],
                    currentRecEN.hambatan || [],
                    'Tambah Hambatan'
                  )}
                </div>

                {/* 4. Plan Kedepannya / Peta Jalan Aksi 90 Hari (Action Plan) */}
                <div className="space-y-5 pt-4 border-t border-slate-100">
                  <div className="border-b border-slate-100 pb-2">
                    <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">4. Plan Kedepannya / Peta Jalan Aksi 90 Hari (Action Plan)</h4>
                    <p className="text-xs text-slate-500 mt-0.5">Tiga fase rencana aksi strategis organisasi untuk diikutsertakan dalam laporan PDF dan analisis hasil.</p>
                  </div>

                  {renderArrayCard(
                    'Fase 1: Sekarang (0 - 30 Hari)',
                    'Phase 1 - Immediate',
                    'Aksi prioritas mendesak dan quick wins untuk 30 hari pertama.',
                    selectedResultLevel,
                    'actionPlanPhase1',
                    currentRecID.actionPlanPhase1 || [],
                    currentRecEN.actionPlanPhase1 || [],
                    'Tambah Aksi Fase 1'
                  )}

                  {renderArrayCard(
                    'Fase 2: Berikutnya (1 - 3 Bulan)',
                    'Phase 2 - Mid Term',
                    'Inisiatif pengembangan sistem, pelatihan, dan integrasi skala menengah.',
                    selectedResultLevel,
                    'actionPlanPhase2',
                    currentRecID.actionPlanPhase2 || [],
                    currentRecEN.actionPlanPhase2 || [],
                    'Tambah Aksi Fase 2'
                  )}

                  {renderArrayCard(
                    'Fase 3: Selanjutnya (3 - 12 Bulan)',
                    'Phase 3 - Long Term',
                    'Strategi scaling, otomasi MLOps, dan transformasi budaya jangka panjang.',
                    selectedResultLevel,
                    'actionPlanPhase3',
                    currentRecID.actionPlanPhase3 || [],
                    currentRecEN.actionPlanPhase3 || [],
                    'Tambah Aksi Fase 3'
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 2: HEADERS & LABELS */}
        {resultSubTab === 'headers' && (
          <div className="space-y-6">
            {/* Header Halaman & Status */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-800">Judul Halaman & Status Analisis</h4>
                <p className="text-xs text-slate-500 mt-0.5">Teks utama yang tampil di bagian paling atas halaman hasil asesmen.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama Halaman Hasil</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['title'], resID.title || '', 'ID')}
                    {renderInputField('EN', 'result', ['title'], resEN.title || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul Halaman Hasil</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['subtitle'], resID.subtitle || '', 'ID')}
                    {renderInputField('EN', 'result', ['subtitle'], resEN.subtitle || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Teks Status Saat AI Menyiapkan Analisis</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['analyzing'], resID.analyzing || '', 'ID')}
                    {renderInputField('EN', 'result', ['analyzing'], resEN.analyzing || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Pesan Error Saat Asesmen Tidak Ditemukan</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['error'], resID.error || '', 'ID')}
                    {renderInputField('EN', 'result', ['error'], resEN.error || '', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Label Kartu Skor */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-800">Label Kartu Skor Utama</h4>
                <p className="text-xs text-slate-500 mt-0.5">Label pada kartu skor di bagian atas halaman.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Label Skor Kesiapan AI</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['scoreLabel'], resID.scoreLabel || '', 'ID')}
                    {renderInputField('EN', 'result', ['scoreLabel'], resEN.scoreLabel || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Satuan Nilai Skor</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['outOf'], resID.outOf || '', 'ID')}
                    {renderInputField('EN', 'result', ['outOf'], resEN.outOf || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Label Box Rekomendasi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['recommendationLabel'], resID.recommendationLabel || '', 'ID')}
                    {renderInputField('EN', 'result', ['recommendationLabel'], resEN.recommendationLabel || '', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Label Visualisasi & Grafik */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-800">Label Grafik & Visualisasi</h4>
                <p className="text-xs text-slate-500 mt-0.5">Label pada grafik radar dan diagram batang.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Grafik Radar</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['readinessProfile'], resID.readinessProfile || '', 'ID')}
                    {renderInputField('EN', 'result', ['readinessProfile'], resEN.readinessProfile || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Label Legenda Skor Anda</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['yourScore'], resID.yourScore || '', 'ID')}
                    {renderInputField('EN', 'result', ['yourScore'], resEN.yourScore || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Grafik Batang Rincian Skor</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['scoreDetails'], resID.scoreDetails || '', 'ID')}
                    {renderInputField('EN', 'result', ['scoreDetails'], resEN.scoreDetails || '', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Label Kotak Analisis & Ringkasan */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-sm font-bold text-slate-800">Judul Kotak Ringkasan & Analisis</h4>
                <p className="text-xs text-slate-500 mt-0.5">Judul untuk masing-masing kotak kartu analisis kualitatif.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Ringkasan Eksekutif</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['executiveSummary'], resID.executiveSummary || '', 'ID')}
                    {renderInputField('EN', 'result', ['executiveSummary'], resEN.executiveSummary || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kotak Risiko Utama</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['mainRisk'], resID.mainRisk || '', 'ID')}
                    {renderInputField('EN', 'result', ['mainRisk'], resEN.mainRisk || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kotak Quick Wins</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['quickWins'], resID.quickWins || '', 'ID')}
                    {renderInputField('EN', 'result', ['quickWins'], resEN.quickWins || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kotak Hambatan Organisasi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['orgBarriers'], resID.orgBarriers || '', 'ID')}
                    {renderInputField('EN', 'result', ['orgBarriers'], resEN.orgBarriers || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kotak Rekomendasi Prioritas</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['priorityRec'], resID.priorityRec || '', 'ID')}
                    {renderInputField('EN', 'result', ['priorityRec'], resEN.priorityRec || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Area Fokus Organisasi (Pilar)</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['focusArea'], resID.focusArea || '', 'ID')}
                    {renderInputField('EN', 'result', ['focusArea'], resEN.focusArea || '', 'EN')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 3: NORTIS PROGRAMS & CONTACT API */}
        {resultSubTab === 'programs' && (
          <div className="space-y-8">
            {/* 1. Header Banner */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">A. Banner Program Nortis (Header)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Judul dan pengantar rekomendasi program Nortis di bagian bawah halaman hasil asesmen.</p>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Banner Program Nortis</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['recommendedProgram'], resID.recommendedProgram || '', 'ID')}
                    {renderInputField('EN', 'result', ['recommendedProgram'], resEN.recommendedProgram || '', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Banner Program</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'result', ['recommendedProgramDesc'], resID.recommendedProgramDesc || '', 'ID')}
                    {renderInputField('EN', 'result', ['recommendedProgramDesc'], resEN.recommendedProgramDesc || '', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Kartu Rekomendasi Program Nortis (Card Builder per Level) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                <div>
                  <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">B. Kartu Rekomendasi Program Nortis per Level Kematangan</h4>
                  <p className="text-xs text-slate-500 mt-0.5">Atur penawaran program Nortis AI yang tampil sesuai level skor asesmen responden.</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                    if (!newDraft.ID.result.nortisProgramsByLevel) {
                      newDraft.ID.result.nortisProgramsByLevel = {};
                    }
                    if (!newDraft.EN.result.nortisProgramsByLevel) {
                      newDraft.EN.result.nortisProgramsByLevel = {};
                    }
                    const levels = ['unready', 'aware', 'ready', 'enabled', 'mature'];
                    levels.forEach((lvl) => {
                      if (!Array.isArray(newDraft.ID.result.nortisProgramsByLevel[lvl])) {
                        newDraft.ID.result.nortisProgramsByLevel[lvl] = JSON.parse(
                          JSON.stringify(
                            draftTranslations.ID?.result?.nortisProgramsByLevel?.[lvl] ||
                            draftTranslations.ID?.result?.nortisPrograms ||
                            []
                          )
                        );
                      }
                      if (!Array.isArray(newDraft.EN.result.nortisProgramsByLevel[lvl])) {
                        newDraft.EN.result.nortisProgramsByLevel[lvl] = JSON.parse(
                          JSON.stringify(
                            draftTranslations.EN?.result?.nortisProgramsByLevel?.[lvl] ||
                            draftTranslations.EN?.result?.nortisPrograms ||
                            []
                          )
                        );
                      }
                    });
                    
                    const newId = `prog-${selectedProgramLevel}-${Date.now()}`;
                    newDraft.ID.result.nortisProgramsByLevel[selectedProgramLevel].push({
                      id: newId,
                      title: 'Program Baru Nortis AI',
                      subtitle: 'Tagline Singkat Program',
                      badge: '',
                      iconType: 'chart',
                      iconBg: 'bg-[#009E4F]',
                      highlightBorder: false,
                      desc: 'Deskripsi lengkap fokus program dan nilai tambah bagi transformasi AI organisasi.',
                      features: [],
                      ctaText: 'Pelajari Lebih Lanjut',
                      ctaLink: ''
                    });
                    newDraft.EN.result.nortisProgramsByLevel[selectedProgramLevel].push({
                      id: newId,
                      title: 'New Nortis AI Program',
                      subtitle: 'Short Program Tagline',
                      badge: '',
                      iconType: 'chart',
                      iconBg: 'bg-[#009E4F]',
                      highlightBorder: false,
                      desc: 'Comprehensive program description and unique value proposition for enterprise AI transformation.',
                      features: [],
                      ctaText: 'Learn More',
                      ctaLink: ''
                    });
                    setDraftTranslations(newDraft);
                    showToast('Kartu program baru berhasil ditambahkan.');
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 rounded-lg text-xs font-bold transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" /> Tambah Kartu untuk Level Ini
                </button>
              </div>

              {/* Level Selector Pills */}
              <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-slate-100">
                {[
                  { key: 'unready', label: 'Level 1: AI Literacy (0.0 - 1.5)', color: 'border-red-200 text-red-700 bg-red-50' },
                  { key: 'aware', label: 'Level 2: Readiness Program (1.6 - 2.5)', color: 'border-amber-200 text-amber-700 bg-amber-50' },
                  { key: 'ready', label: 'Level 3: Implementation Pilot (2.6 - 3.5)', color: 'border-blue-200 text-blue-700 bg-blue-50' },
                  { key: 'enabled', label: 'Level 4: Scaling & Retainer (3.6 - 4.5)', color: 'border-indigo-200 text-indigo-700 bg-indigo-50' },
                  { key: 'mature', label: 'Level 5: Strategic Advisory (4.6 - 5.0)', color: 'border-emerald-200 text-emerald-700 bg-emerald-50' },
                ].map((lvl) => {
                  const isActive = selectedProgramLevel === lvl.key;
                  return (
                    <button
                      key={lvl.key}
                      type="button"
                      onClick={() => setSelectedProgramLevel(lvl.key as any)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all border cursor-pointer ${
                        isActive
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow-sm ring-2 ring-emerald-600/20'
                          : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {lvl.label}
                    </button>
                  );
                })}
              </div>

              {(() => {
                const levelProgsID = Array.isArray(resID.nortisProgramsByLevel?.[selectedProgramLevel])
                  ? resID.nortisProgramsByLevel[selectedProgramLevel]
                  : (Array.isArray(resID.nortisPrograms) ? resID.nortisPrograms : []);
                const levelProgsEN = Array.isArray(resEN.nortisProgramsByLevel?.[selectedProgramLevel])
                  ? resEN.nortisProgramsByLevel[selectedProgramLevel]
                  : (Array.isArray(resEN.nortisPrograms) ? resEN.nortisPrograms : []);

                if (levelProgsID.length === 0) {
                  return (
                    <div className="p-8 text-center bg-slate-50 rounded-xl border border-dashed border-slate-300">
                      <Sparkles className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                      <p className="text-sm font-semibold text-slate-600">Belum ada kartu program untuk level ini.</p>
                      <p className="text-xs text-slate-400 mt-1">Klik tombol "+ Tambah Kartu untuk Level Ini" di atas untuk menambahkan penawaran.</p>
                    </div>
                  );
                }

                return (
                  <div className="space-y-6">
                    {levelProgsID.map((prog: any, pIdx: number) => {
                      const progEN = levelProgsEN[pIdx] || {};
                      return (
                        <div key={prog.id || pIdx} className="bg-slate-50/80 rounded-xl border border-slate-200 p-5 space-y-4">
                          <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center justify-center">
                                {pIdx + 1}
                              </span>
                              <span className="text-xs font-bold text-slate-800">
                                {prog.title || `Program #${pIdx + 1}`}
                              </span>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setDeleteModal({
                                  isOpen: true,
                                  title: 'Hapus Kartu Program Nortis',
                                  message: `Apakah Anda yakin ingin menghapus kartu program "${prog.title || `Program #${pIdx + 1}`}" dari level ${selectedProgramLevel.toUpperCase()}?`,
                                  onConfirm: () => {
                                    const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                    if (!newDraft.ID.result.nortisProgramsByLevel) {
                                      newDraft.ID.result.nortisProgramsByLevel = {};
                                    }
                                    if (!newDraft.EN.result.nortisProgramsByLevel) {
                                      newDraft.EN.result.nortisProgramsByLevel = {};
                                    }
                                    const levels = ['unready', 'aware', 'ready', 'enabled', 'mature'];
                                    levels.forEach((lvl) => {
                                      if (!Array.isArray(newDraft.ID.result.nortisProgramsByLevel[lvl])) {
                                        newDraft.ID.result.nortisProgramsByLevel[lvl] = JSON.parse(
                                          JSON.stringify(
                                            draftTranslations.ID?.result?.nortisProgramsByLevel?.[lvl] ||
                                            draftTranslations.ID?.result?.nortisPrograms ||
                                            []
                                          )
                                        );
                                      }
                                      if (!Array.isArray(newDraft.EN.result.nortisProgramsByLevel[lvl])) {
                                        newDraft.EN.result.nortisProgramsByLevel[lvl] = JSON.parse(
                                          JSON.stringify(
                                            draftTranslations.EN?.result?.nortisProgramsByLevel?.[lvl] ||
                                            draftTranslations.EN?.result?.nortisPrograms ||
                                            []
                                          )
                                        );
                                      }
                                    });

                                    if (Array.isArray(newDraft.ID.result.nortisProgramsByLevel[selectedProgramLevel])) {
                                      newDraft.ID.result.nortisProgramsByLevel[selectedProgramLevel].splice(pIdx, 1);
                                    }
                                    if (Array.isArray(newDraft.EN.result.nortisProgramsByLevel[selectedProgramLevel])) {
                                      newDraft.EN.result.nortisProgramsByLevel[selectedProgramLevel].splice(pIdx, 1);
                                    }
                                    setDraftTranslations(newDraft);
                                    setDeleteModal(null);
                                    showToast('Kartu program berhasil dihapus.');
                                  }
                                });
                              }}
                              className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" /> Hapus
                            </button>
                          </div>

                          {/* Title & Subtitle */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-700">Judul Program</label>
                              <div className="flex flex-col sm:flex-row gap-2">
                                {renderInputField('ID', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'title'], prog.title || '', 'ID')}
                                {renderInputField('EN', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'title'], progEN.title || '', 'EN')}
                              </div>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-700">Subjudul / Tagline (cth: From Strategy to AI Impact)</label>
                              <div className="flex flex-col sm:flex-row gap-2">
                                {renderInputField('ID', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'subtitle'], prog.subtitle || '', 'ID')}
                                {renderInputField('EN', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'subtitle'], progEN.subtitle || '', 'EN')}
                              </div>
                            </div>
                          </div>

                          {/* Priority Badge Toggle & CTA Text */}
                          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                            <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                              <div>
                                <span className="block text-xs font-bold text-slate-800">Badge Prioritas Tertinggi</span>
                                <span className="text-[11px] text-slate-500">Tampilkan pita ribbon "⭐ PRIORITAS TERTINGGI"</span>
                              </div>
                              <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                  type="checkbox"
                                  checked={Boolean(prog.badge && prog.badge.trim() !== '') || prog.isHighestPriority === true}
                                  onChange={(e) => {
                                    const isChecked = e.target.checked;
                                    const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                    if (!newDraft.ID.result.nortisProgramsByLevel) newDraft.ID.result.nortisProgramsByLevel = {};
                                    if (!newDraft.EN.result.nortisProgramsByLevel) newDraft.EN.result.nortisProgramsByLevel = {};
                                    if (newDraft.ID.result.nortisProgramsByLevel?.[selectedProgramLevel]?.[pIdx]) {
                                      newDraft.ID.result.nortisProgramsByLevel[selectedProgramLevel][pIdx].badge = isChecked ? '⭐ PRIORITAS TERTINGGI' : '';
                                      newDraft.ID.result.nortisProgramsByLevel[selectedProgramLevel][pIdx].isHighestPriority = isChecked;
                                    }
                                    if (newDraft.EN.result.nortisProgramsByLevel?.[selectedProgramLevel]?.[pIdx]) {
                                      newDraft.EN.result.nortisProgramsByLevel[selectedProgramLevel][pIdx].badge = isChecked ? '⭐ HIGHEST PRIORITY' : '';
                                      newDraft.EN.result.nortisProgramsByLevel[selectedProgramLevel][pIdx].isHighestPriority = isChecked;
                                    }
                                    setDraftTranslations(newDraft);
                                  }}
                                  className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 cursor-pointer"
                                />
                              </label>
                            </div>
                            <div className="space-y-2">
                              <label className="block text-xs font-bold text-slate-700">Label Tombol CTA (cth: Pelajari Lebih Lanjut)</label>
                              <div className="flex flex-col sm:flex-row gap-2">
                                {renderInputField('ID', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'ctaText'], prog.ctaText || '', 'ID')}
                                {renderInputField('EN', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'ctaText'], progEN.ctaText || '', 'EN')}
                              </div>
                            </div>
                          </div>

                          {/* Icon Type & Color Selector */}
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-lg border border-slate-200">
                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Ikon</label>
                              <select
                                value={prog.iconType || 'chart'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                  if (newDraft.ID.result.nortisProgramsByLevel?.[selectedProgramLevel]?.[pIdx]) {
                                    newDraft.ID.result.nortisProgramsByLevel[selectedProgramLevel][pIdx].iconType = val;
                                  }
                                  if (newDraft.EN.result.nortisProgramsByLevel?.[selectedProgramLevel]?.[pIdx]) {
                                    newDraft.EN.result.nortisProgramsByLevel[selectedProgramLevel][pIdx].iconType = val;
                                  }
                                  setDraftTranslations(newDraft);
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                              >
                                <option value="chart">Chart / Grafik Bars</option>
                                <option value="zap">Zap / Lightning (AI Camp)</option>
                                <option value="training">Graduation Cap (Training)</option>
                                <option value="sparkles">Sparkles / Bintang Inovasi</option>
                              </select>
                            </div>

                            <div>
                              <label className="block text-xs font-bold text-slate-700 mb-1">Warna Background Ikon</label>
                              <select
                                value={prog.iconBg || 'bg-[#009E4F]'}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                  if (newDraft.ID.result.nortisProgramsByLevel?.[selectedProgramLevel]?.[pIdx]) {
                                    newDraft.ID.result.nortisProgramsByLevel[selectedProgramLevel][pIdx].iconBg = val;
                                  }
                                  if (newDraft.EN.result.nortisProgramsByLevel?.[selectedProgramLevel]?.[pIdx]) {
                                    newDraft.EN.result.nortisProgramsByLevel[selectedProgramLevel][pIdx].iconBg = val;
                                  }
                                  setDraftTranslations(newDraft);
                                }}
                                className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                              >
                                <option value="bg-[#009E4F]">Hijau Nortis (#009E4F)</option>
                                <option value="bg-[#FF6A00]">Oranye Hangat (#FF6A00)</option>
                                <option value="bg-[#2563EB]">Biru Vibrant (#2563EB)</option>
                                <option value="bg-[#7C3AED]">Ungu Royal (#7C3AED)</option>
                              </select>
                            </div>
                          </div>

                          {/* Program Description */}
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">Deskripsi Singkat Program</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {renderInputField('ID', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'desc'], prog.desc || '', 'ID')}
                              {renderInputField('EN', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'desc'], progEN.desc || '', 'EN')}
                            </div>
                          </div>

                          {/* Custom CTA Link (Optional) */}
                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <label className="block text-xs font-bold text-slate-700">Tautan Kustom Tombol CTA (Opsional)</label>
                              <span className="text-[10px] text-slate-500">Kosongkan jika ingin langsung membuka WhatsApp konsultasi program ini</span>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {renderInputField('ID', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'ctaLink'], prog.ctaLink || '', 'ID')}
                              {renderInputField('EN', 'result', ['nortisProgramsByLevel', selectedProgramLevel, pIdx.toString(), 'ctaLink'], progEN.ctaLink || '', 'EN')}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                );
              })()}
            </div>

            {/* 3. API & Kontak Integrasi (Email & WhatsApp) */}
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-5">
              <div className="border-b border-slate-100 pb-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">C. Pengaturan Kontak & API Integrasi (Email & WhatsApp)</h4>
                <p className="text-xs text-slate-500 mt-0.5">Konfigurasi endpoint email, nomor WhatsApp API, subjek serta pesan otomatis saat tombol di website diklik.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teks Ajakan Diskusi / Konsultasi</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'result', ['discussProgram'], resID.discussProgram || '', 'ID')}
                  {renderInputField('EN', 'result', ['discussProgram'], resEN.discussProgram || '', 'EN')}
                </div>
              </div>

              {/* Email Integration */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span>Konfigurasi Integrasi Email</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Label Tombol Email di Website</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {renderInputField('ID', 'result', ['emailUs'], resID.emailUs || '', 'ID')}
                      {renderInputField('EN', 'result', ['emailUs'], resEN.emailUs || '', 'EN')}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Alamat Email Tujuan (Target Email API / Mailto)</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {renderInputField('ID', 'result', ['emailTarget'], resID.emailTarget || 'hai@nortis.ai', 'ID')}
                      {renderInputField('EN', 'result', ['emailTarget'], resEN.emailTarget || 'hai@nortis.ai', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Template Subjek Email Otomatis</label>
                  <div className="flex flex-col md:flex-row gap-2">
                    {renderInputField('ID', 'result', ['emailSubject'], resID.emailSubject || '', 'ID')}
                    {renderInputField('EN', 'result', ['emailSubject'], resEN.emailSubject || '', 'EN')}
                  </div>
                </div>
              </div>

              {/* WhatsApp Integration */}
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 space-y-4">
                <div className="flex items-center gap-2 text-slate-800 font-bold text-xs">
                  <MessageSquare className="w-4 h-4 text-emerald-600" />
                  <span>Konfigurasi Integrasi WhatsApp API</span>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Label Tombol WhatsApp di Website</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {renderInputField('ID', 'result', ['whatsapp'], resID.whatsapp || '', 'ID')}
                      {renderInputField('EN', 'result', ['whatsapp'], resEN.whatsapp || '', 'EN')}
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold text-slate-700">Nomor WhatsApp API (Format Internasional tanpa +, cth: 6282337576338)</label>
                    <div className="flex flex-col sm:flex-row gap-2">
                      {renderInputField('ID', 'result', ['whatsappNumber'], resID.whatsappNumber || '6282337576338', 'ID')}
                      {renderInputField('EN', 'result', ['whatsappNumber'], resEN.whatsappNumber || '6282337576338', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-slate-700">Template Pesan Chat Otomatis WhatsApp</label>
                  <div className="flex flex-col md:flex-row gap-2">
                    {renderInputField('ID', 'result', ['whatsappMessage'], resID.whatsappMessage || '', 'ID')}
                    {renderInputField('EN', 'result', ['whatsappMessage'], resEN.whatsappMessage || '', 'EN')}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: DOWNLOADS & ACTIONS */}
        {resultSubTab === 'actions' && (
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-6">
            <div className="border-b border-slate-100 pb-3">
              <h4 className="text-sm font-bold text-slate-800">Tombol Unduh Laporan PDF & Navigasi</h4>
              <p className="text-xs text-slate-500 mt-0.5">Label pada tombol unduh berkas PDF dan tombol untuk memulai asesmen baru.</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bagian Unduh Laporan</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'result', ['downloadReport'], resID.downloadReport || '', 'ID')}
                  {renderInputField('EN', 'result', ['downloadReport'], resEN.downloadReport || '', 'EN')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Tombol Download PDF</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'result', ['downloadPdf'], resID.downloadPdf || '', 'ID')}
                  {renderInputField('EN', 'result', ['downloadPdf'], resEN.downloadPdf || '', 'EN')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Tombol Mulai Assessment Baru</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'result', ['startNewAssessment'], resID.startNewAssessment || '', 'ID')}
                  {renderInputField('EN', 'result', ['startNewAssessment'], resEN.startNewAssessment || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const renderFormIndFlow = () => {
    const indFormID = draftTranslations['ID']?.individualForm || {};
    const indFormEN = draftTranslations['EN']?.individualForm || {};

    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">5. Formulir Data Individu</h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                Atur judul formulir, subjudul petunjuk, label Data Pribadi & Profil Profesional, industri, pengalaman kerja, penggunaan AI, dan tombol navigasi.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Header Formulir */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">1. Header & Instruksi Formulir</h3>
            <p className="text-xs text-slate-500 mt-0.5">Judul banner atas dan petunjuk pengisian formulir asesmen individu.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Formulir</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'individualForm', ['title'], indFormID.title || '', 'ID')}
                {renderInputField('EN', 'individualForm', ['title'], indFormEN.title || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul / Petunjuk Pengisian</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'individualForm', ['subtitle'], indFormID.subtitle || '', 'ID')}
                {renderInputField('EN', 'individualForm', ['subtitle'], indFormEN.subtitle || '', 'EN')}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Data Pribadi & Profil Profesional */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">2. Data Pribadi & Profil Profesional</h3>
            <p className="text-xs text-slate-500 mt-0.5">Label kolom biodata, kontak, profesi, industri, dan pengalaman kerja talenta.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Seksi Data Pribadi & Profil Profesional</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'individualForm', ['personalData'], indFormID.personalData || '', 'ID')}
                {renderInputField('EN', 'individualForm', ['personalData'], indFormEN.personalData || '', 'EN')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Nama Lengkap</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['fullName'], indFormID.fullName || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['fullName'], indFormEN.fullName || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Nama Lengkap</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['fullNamePlaceholder'], indFormID.fullNamePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['fullNamePlaceholder'], indFormEN.fullNamePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Email</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['email'], indFormID.email || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['email'], indFormEN.email || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Email</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['emailPlaceholder'], indFormID.emailPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['emailPlaceholder'], indFormEN.emailPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Nomor WhatsApp</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['phone'], indFormID.phone || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['phone'], indFormEN.phone || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Nomor WhatsApp</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['phonePlaceholder'], indFormID.phonePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['phonePlaceholder'], indFormEN.phonePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Jabatan / Profesi</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['jobTitle'], indFormID.jobTitle || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['jobTitle'], indFormEN.jobTitle || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Jabatan / Profesi</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['jobTitlePlaceholder'], indFormID.jobTitlePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['jobTitlePlaceholder'], indFormEN.jobTitlePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Nama Perusahaan (Opsional)</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['companyName'], indFormID.companyName || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['companyName'], indFormEN.companyName || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Nama Perusahaan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['companyNamePlaceholder'], indFormID.companyNamePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['companyNamePlaceholder'], indFormEN.companyNamePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Industri / Bidang Pekerjaan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['industry'], indFormID.industry || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['industry'], indFormEN.industry || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Industri</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['industryPlaceholder'], indFormID.industryPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['industryPlaceholder'], indFormEN.industryPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            {/* Pilihan Industri */}
            <div className="pt-3 border-t border-slate-100">
              {renderFieldGroup('individualForm', ['industries'], indFormID.industries, indFormEN.industries, 'Daftar Pilihan Industri (Sektor)')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Lama Pengalaman Kerja</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['experienceYears'], indFormID.experienceYears || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['experienceYears'], indFormEN.experienceYears || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Lama Pengalaman Kerja</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['experienceYearsPlaceholder'], indFormID.experienceYearsPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['experienceYearsPlaceholder'], indFormEN.experienceYearsPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Frekuensi Penggunaan AI</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['aiUsageFrequency'], indFormID.aiUsageFrequency || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['aiUsageFrequency'], indFormEN.aiUsageFrequency || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Frekuensi Penggunaan AI</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['aiUsageFrequencyPlaceholder'], indFormID.aiUsageFrequencyPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['aiUsageFrequencyPlaceholder'], indFormEN.aiUsageFrequencyPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            {/* Opsi Frekuensi Penggunaan AI */}
            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700">Daftar Pilihan Frekuensi Penggunaan AI</label>
              <div className="space-y-3">
                {(indFormID.aiUsageFrequencies || []).map((freq: string, fIdx: number) => {
                  const freqEN = indFormEN.aiUsageFrequencies?.[fIdx] || '';
                  return (
                    <div key={fIdx} className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex flex-col md:flex-row gap-4 items-center">
                      <span className="text-xs font-mono font-bold text-slate-500 w-8">{fIdx + 1}.</span>
                      <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
                        {renderInputField('ID', 'individualForm', ['aiUsageFrequencies', fIdx.toString()], freq, 'ID')}
                        {renderInputField('EN', 'individualForm', ['aiUsageFrequencies', fIdx.toString()], freqEN, 'EN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Tools AI yang Digunakan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['aiToolsUsed'], indFormID.aiToolsUsed || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['aiToolsUsed'], indFormEN.aiToolsUsed || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Tools AI yang Digunakan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['aiToolsUsedPlaceholder'], indFormID.aiToolsUsedPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['aiToolsUsedPlaceholder'], indFormEN.aiToolsUsedPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Tombol Navigasi Formulir */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">3. Tombol Navigasi Formulir</h3>
            <p className="text-xs text-slate-500 mt-0.5">Label pada tombol bagian bawah formulir asesmen individu.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tombol "Kembali"</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['back'], indFormID.back || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['back'], indFormEN.back || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tombol "Lanjut"</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualForm', ['next'], indFormID.next || '', 'ID')}
                  {renderInputField('EN', 'individualForm', ['next'], indFormEN.next || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionsIndFlow = () => {
    const rawDimensions = draftTranslations['ID']?.individualAssessmentData || [];
    const rawDimensionsEN = draftTranslations['EN']?.individualAssessmentData || [];
    const rawQuestionsID = draftTranslations['ID']?.individualQuestions || {};
    const rawQuestionsEN = draftTranslations['EN']?.individualQuestions || {};
    const indQDataID = draftTranslations['ID']?.individualQuestionsData || {};
    const indQDataEN = draftTranslations['EN']?.individualQuestionsData || {};

    const filteredDimensions = rawDimensions.filter((_: any, idx: number) => idx === selectedIndDimStep);
    const displayDimensions = filteredDimensions.length > 0 ? filteredDimensions : (rawDimensions.length > 0 ? [rawDimensions[0]] : []);

    return (
      <div className="space-y-8">
        {/* Banner Penjelasan */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                6. Pertanyaan & Skala Asesmen Individu
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                Struktur halaman ini diurutkan persis dari atas ke bawah sesuai alur kuesioner pada website: dimulai dari <strong>Header & Progres</strong>, <strong>Panduan Skala Penilaian (0–5)</strong>, <strong>6 Dimensi & Butir Pertanyaan Terpadu (A1–F5)</strong>, hingga <strong>Tombol Navigasi Bawah</strong>.
              </p>
            </div>
          </div>
        </div>

        {/* 1. HEADER HALAMAN & INDIKATOR PROGRES */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">1. Header Halaman & Indikator Progres</h3>
              <p className="text-xs text-slate-500 mt-0.5">Teks yang tampil di bagian paling atas halaman kuesioner individu</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Bagian Atas Website
            </span>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kuesioner (H1)</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'individualQuestionsData', ['title'], indQDataID.title || '', 'ID')}
                {renderInputField('EN', 'individualQuestionsData', ['title'], indQDataEN.title || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul / Petunjuk Pengisian Kuesioner</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'individualQuestionsData', ['subtitle'], indQDataID.subtitle || '', 'ID')}
                {renderInputField('EN', 'individualQuestionsData', ['subtitle'], indQDataEN.subtitle || '', 'EN')}
              </div>
            </div>
            <div className="pt-3 border-t border-slate-100">
              <label className="block text-xs font-bold text-slate-700 mb-1">Label Indikator Progres (Progress Bar)</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'individualQuestionsData', ['progress'], indQDataID.progress || '', 'ID')}
                {renderInputField('EN', 'individualQuestionsData', ['progress'], indQDataEN.progress || '', 'EN')}
              </div>
            </div>
          </div>
        </div>

        {/* 2. PANDUAN SKALA PENILAIAN LIKERT (NILAI 0 S/D 5) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">2. Panduan Skala Penilaian Likert (Nilai 0 s/d 5)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Kotak referensi skala penilaian yang tampil tepat di atas butir pertanyaan</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Skala 0 - 5
            </span>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kotak Panduan Skala Penilaian</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'individualQuestionsData', ['scaleTitle'], indQDataID.scaleTitle || '', 'ID')}
                {renderInputField('EN', 'individualQuestionsData', ['scaleTitle'], indQDataEN.scaleTitle || '', 'EN')}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-700">Daftar Pilihan Skala & Label Kemahiran (Nilai 0 s/d 5):</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {(rawQuestionsID.scale || []).map((s: any, sIdx: number) => {
                  const sEN = rawQuestionsEN?.scale?.[sIdx] || {};
                  return (
                    <div key={sIdx} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200/60">
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-emerald-100 text-emerald-800 font-bold text-xs">
                          Skor {s.value ?? s.score ?? sIdx}
                        </span>
                        <span className="text-[11px] text-slate-500 font-medium">Pilihan #{sIdx + 1}</span>
                      </div>
                      <div className="flex flex-col gap-2">
                        {renderInputField('ID', 'individualQuestions', ['scale', sIdx.toString(), 'label'], s.label || '', 'ID')}
                        {renderInputField('EN', 'individualQuestions', ['scale', sIdx.toString(), 'label'], sEN.label || '', 'EN')}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        {/* 3. 6 DIMENSI & BUTIR PERTANYAAN TERPADU (A1–F5) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-slate-800 text-base">3. 6 Dimensi & Butir Pertanyaan Terpadu (A1–F5)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Pilih dimensi untuk mengedit detail dimensi serta 5 butir pertanyaan evaluasinya secara terpisah</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 self-start sm:self-auto">
              6 Dimensi & 30 Soal
            </span>
          </div>

          {/* Quick Filter Tabs for Dimensions (Tanpa "Semua Dimensi" agar fokus terpisah per dimensi) */}
          <div className="p-6 pb-0">
            <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-xl border border-slate-200/80">
              {rawDimensions.map((dim: any, dIdx: number) => {
                const isSelected = selectedIndDimStep === dIdx;
                const letter = String.fromCharCode(65 + dIdx);
                return (
                  <button
                    key={dim.id || dIdx}
                    type="button"
                    onClick={() => setSelectedIndDimStep(dIdx)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
                      isSelected
                        ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/20'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60 bg-white/70 border border-slate-200/60'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-md text-[11px] flex items-center justify-center font-bold ${isSelected ? 'bg-white/20 text-white' : 'bg-emerald-100 text-emerald-800'}`}>
                      {letter}
                    </span>
                    <span>{dim.title || `Dimensi ${dIdx + 1}`}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dimension Cards with their 5 questions embedded */}
          <div className="p-6 space-y-8">
            {displayDimensions.map((dim: any) => {
              const actualIdx = rawDimensions.findIndex((d: any) => d.id === dim.id);
              const dIdx = actualIdx !== -1 ? actualIdx : 0;
              const dimEN = rawDimensionsEN?.[dIdx] || {};
              const dimKey = dim.id;
              const qListID = rawQuestionsID[dimKey] || [];
              const qListEN = rawQuestionsEN[dimKey] || [];
              const letter = String.fromCharCode(65 + dIdx);
              const indicatorID = indQDataID.dimensionIndicators?.[dIdx] || `Dimensi ${dIdx + 1} dari 6`;
              const indicatorEN = indQDataEN.dimensionIndicators?.[dIdx] || `Dimension ${dIdx + 1} of 6`;

              return (
                <div key={dimKey} className="rounded-2xl border-2 border-slate-200 overflow-hidden bg-white shadow-sm">
                  {/* Card Header - Hijau Terang */}
                  <div className="bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 text-white px-6 py-4 flex items-center justify-between shadow-xs">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-white text-emerald-700 font-bold flex items-center justify-center text-sm shadow-sm">
                        {letter}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm md:text-base text-white">
                          Dimensi {dIdx + 1}: {dim.title}
                        </h4>
                        <p className="text-[11px] text-emerald-100 font-mono">ID Dimensi: {dimKey}</p>
                      </div>
                    </div>
                    <span className="text-xs px-3 py-1.5 rounded-full bg-white/20 text-white font-bold border border-white/30 backdrop-blur-xs shadow-xs">
                      5 Pertanyaan ({letter}1–{letter}5)
                    </span>
                  </div>

                  <div className="p-6 space-y-6">
                    {/* Dimension Details */}
                    <div className="p-5 bg-slate-50/80 rounded-xl border border-slate-200 space-y-4">
                      <div className="border-b border-slate-200/60 pb-2 flex items-center justify-between">
                        <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                          A. Informasi & Label Dimensi {dIdx + 1}
                        </h5>
                        <span className="text-[11px] text-slate-500">Tampil pada bar langkah & header langkah</span>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Badge Indikator Langkah (cth: "Dimensi {dIdx + 1} dari 6")</label>
                        <div className="flex flex-col md:flex-row gap-4">
                          {renderInputField('ID', 'individualQuestionsData', ['dimensionIndicators', dIdx.toString()], indicatorID, 'ID')}
                          {renderInputField('EN', 'individualQuestionsData', ['dimensionIndicators', dIdx.toString()], indicatorEN, 'EN')}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Judul Lengkap Dimensi</label>
                        <div className="flex flex-col md:flex-row gap-4">
                          {renderInputField('ID', 'individualAssessmentData', [dIdx.toString(), 'title'], dim.title || '', 'ID')}
                          {renderInputField('EN', 'individualAssessmentData', [dIdx.toString(), 'title'], dimEN.title || '', 'EN')}
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lengkap Dimensi</label>
                        <div className="flex flex-col md:flex-row gap-4">
                          {renderInputField('ID', 'individualAssessmentData', [dIdx.toString(), 'description'], dim.description || '', 'ID')}
                          {renderInputField('EN', 'individualAssessmentData', [dIdx.toString(), 'description'], dimEN.description || '', 'EN')}
                        </div>
                      </div>
                    </div>

                    {/* 5 Questions for this Dimension */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                        <h5 className="font-bold text-xs text-slate-700 uppercase tracking-wider">
                          B. 5 Butir Pertanyaan Evaluasi ({letter}1 – {letter}5)
                        </h5>
                        <span className="text-[11px] text-slate-500">Responden memilih skala 0–5 untuk setiap butir soal ini</span>
                      </div>

                      <div className="space-y-4">
                        {qListID.map((q: any, qIdx: number) => {
                          const qEN = qListEN?.[qIdx] || {};
                          const qNumber = qIdx + 1;
                          const qCode = `${letter}${qNumber}`;

                          return (
                            <div key={q.id || qIdx} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 space-y-2.5">
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                  <span className="px-2.5 py-1 rounded-md bg-emerald-600 text-white font-mono text-xs font-bold shadow-xs">
                                    {qCode}
                                  </span>
                                  <span className="text-xs font-bold text-slate-800">
                                    Pertanyaan {qNumber} dari 5
                                  </span>
                                </div>
                                <span className="text-[10px] text-slate-400 font-mono">ID: {q.id || qCode}</span>
                              </div>

                              <div className="flex flex-col md:flex-row gap-4">
                                {renderInputField('ID', 'individualQuestions', [dimKey, qIdx.toString(), 'text'], q.text || '', 'ID')}
                                {renderInputField('EN', 'individualQuestions', [dimKey, qIdx.toString(), 'text'], qEN.text || '', 'EN')}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 4. TOMBOL NAVIGASI BAWAH */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">4. Tombol Navigasi Bawah</h3>
              <p className="text-xs text-slate-500 mt-0.5">Label pada tombol navigasi di bagian paling bawah kuesioner</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
              Bagian Bawah Website
            </span>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tombol "Kembali"</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualQuestionsData', ['prev'], indQDataID.prev || '', 'ID')}
                  {renderInputField('EN', 'individualQuestionsData', ['prev'], indQDataEN.prev || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tombol "Lanjut"</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualQuestionsData', ['next'], indQDataID.next || '', 'ID')}
                  {renderInputField('EN', 'individualQuestionsData', ['next'], indQDataEN.next || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tombol "Selesai & Lihat Hasil"</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'individualQuestionsData', ['finish'], indQDataID.finish || '', 'ID')}
                  {renderInputField('EN', 'individualQuestionsData', ['finish'], indQDataEN.finish || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderIndividualResultFlow = () => {
    const recID = draftTranslations['ID']?.individualRecommendations || {};
    const recEN = draftTranslations['EN']?.individualRecommendations || {};
    const resID = draftTranslations['ID']?.individualResult || {};
    const resEN = draftTranslations['EN']?.individualResult || {};
    const insightsID = draftTranslations['ID']?.individualInsights || (defaultTranslations['ID'] as any)?.individualInsights || {};
    const insightsEN = draftTranslations['EN']?.individualInsights || (defaultTranslations['EN'] as any)?.individualInsights || {};

    const indDimensionOptions = [
      { id: 'aiLiteracy', name: '1. AI Literacy & Mindset', subtitle: 'Pondasi literasi AI, pemahaman kapabilitas & human judgment' },
      { id: 'taskFraming', name: '2. Task Framing & Prompting', subtitle: 'Perumusan instruksi, konteks presisi & batasan' },
      { id: 'workflow', name: '3. Workflow & Integration', subtitle: 'Integrasi AI rutin & efisiensi alur kerja harian' },
      { id: 'evaluation', name: '4. Evaluation & Human Judgment', subtitle: 'Validasi, standar kritis & kurasi hasil AI' },
      { id: 'responsibleAi', name: '5. Responsible AI & Risk', subtitle: 'Etika, kepatuhan, privasi data & manajemen risiko' },
      { id: 'collaboration', name: '6. Collaboration & AI Growth', subtitle: 'Mentoring, berbagi best practice & budaya tim' },
    ];

    const statusLevels = [
      { key: 'Advanced', label: 'Advanced', range: 'Skor 4.6 – 5.0', badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
      { key: 'Strong', label: 'Strong', range: 'Skor 3.6 – 4.5', badgeBg: 'bg-blue-100 text-blue-800 border-blue-300' },
      { key: 'Established', label: 'Established', range: 'Skor 2.6 – 3.5', badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300' },
      { key: 'Developing', label: 'Developing', range: 'Skor 1.6 – 2.5', badgeBg: 'bg-amber-100 text-amber-800 border-amber-300' },
      { key: 'Needs Foundation', label: 'Needs Foundation', range: 'Skor 0.0 – 1.5', badgeBg: 'bg-rose-100 text-rose-800 border-rose-300' },
    ];

    const levelConfigs = [
      {
        id: 'mature',
        name: 'AI-Mature',
        range: 'Skor 4.6 – 5.0',
        badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
        activeBorder: 'border-emerald-500 ring-2 ring-emerald-500/20 bg-emerald-50/60',
        desc: 'Untuk talenta yang sangat matang memanfaatkan AI secara strategis dalam pekerjaan harian.'
      },
      {
        id: 'enabled',
        name: 'AI-Enabled',
        range: 'Skor 3.6 – 4.5',
        badgeBg: 'bg-blue-100 text-blue-800 border-blue-300',
        activeBorder: 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/60',
        desc: 'Untuk talenta yang rutin mengintegrasikan AI dengan efisiensi tinggi pada pekerjaan.'
      },
      {
        id: 'ready',
        name: 'AI-Ready',
        range: 'Skor 2.6 – 3.5',
        badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-300',
        activeBorder: 'border-indigo-500 ring-2 ring-indigo-500/20 bg-indigo-50/60',
        desc: 'Untuk talenta yang cukup memahami AI dan siap membangun alur kerja mandiri.'
      },
      {
        id: 'aware',
        name: 'AI-Aware',
        range: 'Skor 1.6 – 2.5',
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-300',
        activeBorder: 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/60',
        desc: 'Untuk talenta yang mengenal AI namun penggunaannya masih sporadis.'
      },
      {
        id: 'unready',
        name: 'AI-Unready',
        range: 'Skor 0.0 – 1.5',
        badgeBg: 'bg-rose-100 text-rose-800 border-rose-300',
        activeBorder: 'border-rose-500 ring-2 ring-rose-500/20 bg-rose-50/60',
        desc: 'Untuk talenta yang baru memulai eksplorasi AI dan membutuhkan pengenalan dasar terarah.'
      }
    ];

    const currentLevelConf = levelConfigs.find(c => c.id === selectedIndResultLevel) || levelConfigs[0];
    const currentRecID = recID[selectedIndResultLevel] || {};
    const currentRecEN = recEN[selectedIndResultLevel] || {};

    const selectedDimObj = indDimensionOptions.find(d => d.id === selectedIndInsightDim) || indDimensionOptions[0];
    const currentDimDescID = insightsID?.dimensionDescriptions?.[selectedIndInsightDim] || {};
    const currentDimDescEN = insightsEN?.dimensionDescriptions?.[selectedIndInsightDim] || {};
    
    // Level-specific growth & strength insights configured per score level
    const currentGrowthID = currentRecID?.growthInsights?.[selectedIndInsightDim]
      ?? levelGrowthInsightsDefaults[selectedIndResultLevel]?.[selectedIndInsightDim]
      ?? insightsID?.growthInsights?.[selectedIndInsightDim]
      ?? '';

    const currentGrowthEN = currentRecEN?.growthInsights?.[selectedIndInsightDim]
      ?? (defaultTranslations['EN'] as any)?.individualRecommendations?.[selectedIndResultLevel]?.growthInsights?.[selectedIndInsightDim]
      ?? insightsEN?.growthInsights?.[selectedIndInsightDim]
      ?? '';

    const currentStrengthID = currentRecID?.strengthInsights?.[selectedIndInsightDim]
      ?? levelStrengthInsightsDefaults[selectedIndResultLevel]?.[selectedIndInsightDim]
      ?? insightsID?.strengthInsights?.[selectedIndInsightDim]
      ?? '';

    const currentStrengthEN = currentRecEN?.strengthInsights?.[selectedIndInsightDim]
      ?? (defaultTranslations['EN'] as any)?.individualRecommendations?.[selectedIndResultLevel]?.strengthInsights?.[selectedIndInsightDim]
      ?? insightsEN?.strengthInsights?.[selectedIndInsightDim]
      ?? '';

    const levelToStatusMap: Record<string, string> = {
      mature: 'Advanced',
      enabled: 'Strong',
      ready: 'Established',
      aware: 'Developing',
      unready: 'Needs Foundation',
    };
    const currentStatusKey = selectedIndDimStatus || levelToStatusMap[selectedIndResultLevel] || 'Advanced';

    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/30 border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-3">
            <div className="p-2 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">
                7. Hasil & Rekomendasi Asesmen Individu
              </h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                Seluruh pengaturan teks, tingkatan kematangan, visualisasi radar, serta tombol ekspor disusun <strong>URUT SESUAI TAMPILAN WEBSITE</strong> dari atas ke bawah agar mudah dipahami dan dikelola.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tabs Navigation */}
        <div className="flex flex-wrap gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => setIndResultSubTab('levels')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              indResultSubTab === 'levels'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-emerald-600" />
            1. 5 Tingkat Skor Kematangan & Rincian Konten
          </button>
          <button
            type="button"
            onClick={() => setIndResultSubTab('labels')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              indResultSubTab === 'labels'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <LayoutTemplate className="w-4 h-4 text-slate-500" />
            2. Label Antarmuka & Visualisasi (Urut Sesuai Website)
          </button>
          <button
            type="button"
            onClick={() => setIndResultSubTab('actions')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              indResultSubTab === 'actions'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Download className="w-4 h-4 text-emerald-600" />
            3. Tombol Ekspor Hasil & Navigasi (Bagian Bawah)
          </button>
          <button
            type="button"
            onClick={() => setIndResultSubTab('programs')}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
              indResultSubTab === 'programs'
                ? 'bg-white text-emerald-800 shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            4. Rekomendasi Program Nortis (Individu)
          </button>
        </div>

        {/* SUBTAB 1: 5 LEVELS */}
        {indResultSubTab === 'levels' && (
          <div className="space-y-6">
            <div>
              <h4 className="text-sm font-bold text-slate-800 mb-1">Pilih Tingkat Kematangan Skor untuk Diedit:</h4>
              <p className="text-xs text-slate-500 mb-3">Klik tombol level di bawah untuk menyesuaikan judul profil, ringkasan, analisis cepat, rincian 6 dimensi, analisis kekuatan/pengembangan, rencana aksi, dan pertanyaan refleksi.</p>
              
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                {levelConfigs.map(lvl => {
                  const isSelected = selectedIndResultLevel === lvl.id;
                  return (
                    <button
                      key={lvl.id}
                      type="button"
                      onClick={() => {
                        setSelectedIndResultLevel(lvl.id as any);
                        setSelectedIndDimStatus(null);
                      }}
                      className={`p-3.5 rounded-xl text-left border transition-all ${
                        isSelected
                          ? lvl.activeBorder
                          : 'bg-white border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-xs font-bold text-slate-900">{lvl.name}</span>
                        <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded border ${lvl.badgeBg}`}>
                          {lvl.range.replace('Skor ', '')}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 font-medium">{lvl.range}</p>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Level Editor Box */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2.5">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-md border ${currentLevelConf.badgeBg}`}>
                      {currentLevelConf.name} ({currentLevelConf.range})
                    </span>
                    <span className="text-xs font-semibold text-slate-700">Editor Profil Kematangan</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-1">{currentLevelConf.desc}</p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Judul & Ringkasan Eksekutif */}
                <div className="space-y-4">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Judul & Ringkasan Profil Kesiapan (Bagian 1 Atas)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Teks yang tampil pada kartu skor utama profil kematangan di bagian atas halaman hasil individu.</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded">
                      Bagian 1 (Atas)
                    </span>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">Judul Profil Kesiapan (Profile Title)</label>
                      <span className="text-[10px] text-slate-400">Contoh: Advanced AI Practitioner</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'individualRecommendations', [selectedIndResultLevel, 'title'], currentRecID.title || '', 'ID')}
                      {renderInputField('EN', 'individualRecommendations', [selectedIndResultLevel, 'title'], currentRecEN.title || '', 'EN')}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">Deskripsi Lengkap Hasil Evaluasi (Executive Summary)</label>
                      <span className="text-[10px] text-slate-400">Teks narasi profil mendalam pada website</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'individualRecommendations', [selectedIndResultLevel, 'desc'], currentRecID.desc || '', 'ID')}
                      {renderInputField('EN', 'individualRecommendations', [selectedIndResultLevel, 'desc'], currentRecEN.desc || '', 'EN')}
                    </div>
                  </div>
                </div>

                {/* Bagian 2: 3 Kartu Fokus Cepat (What's Working, What's At Risk, Focus Next) */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Isi 3 Kartu Analisis Cepat (Bagian 2 Website)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Konten analisis spesifik tingkat kematangan untuk 3 kartu snapshot (Kekuatan, Risiko, & Aksi Fokus).</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-700 border border-blue-200 rounded">
                      Bagian 2 (Fokus Cepat)
                    </span>
                  </div>

                  {/* What's Working */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">1. Analisis Kekuatan & Keunggulan (What's Working)</label>
                      <span className="text-[10px] text-emerald-600 font-semibold">Kartu Hijau</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'individualRecommendations', [selectedIndResultLevel, 'whatsWorking'], currentRecID.whatsWorking || '', 'ID')}
                      {renderInputField('EN', 'individualRecommendations', [selectedIndResultLevel, 'whatsWorking'], currentRecEN.whatsWorking || '', 'EN')}
                    </div>
                  </div>

                  {/* What's At Risk */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">2. Analisis Celah & Risiko Kritis (What's At Risk)</label>
                      <span className="text-[10px] text-amber-600 font-semibold">Kartu Kuning/Oranye</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'individualRecommendations', [selectedIndResultLevel, 'whatsAtRisk'], currentRecID.whatsAtRisk || '', 'ID')}
                      {renderInputField('EN', 'individualRecommendations', [selectedIndResultLevel, 'whatsAtRisk'], currentRecEN.whatsAtRisk || '', 'EN')}
                    </div>
                  </div>

                  {/* Focus Next */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">3. Aksi Prioritas Mendesak (Focus Next)</label>
                      <span className="text-[10px] text-teal-600 font-semibold">Kartu Teal/Arah</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'individualRecommendations', [selectedIndResultLevel, 'focusNext'], currentRecID.focusNext || '', 'ID')}
                      {renderInputField('EN', 'individualRecommendations', [selectedIndResultLevel, 'focusNext'], currentRecEN.focusNext || '', 'EN')}
                    </div>
                  </div>
                </div>

                {/* Bagian 3: Rincian 6 Dimensi Kompetensi (Bagian 3 Website) */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Compass className="w-4 h-4 text-emerald-600" />
                        Rincian 6 Dimensi Kompetensi (Bagian 3 Website)
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Deskripsi status kemahiran 6 pilar kerja harian untuk tingkat kematangan <strong>{currentLevelConf.name}</strong> ({currentLevelConf.range}).
                      </p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 rounded self-start sm:self-auto">
                      Bagian 3 (6 Dimensi)
                    </span>
                  </div>

                  {/* Status switcher pills */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                      <span className="text-xs font-bold text-slate-700">Tingkat Kemahiran Dimensi yang Ditampilkan:</span>
                      <span className="text-[10px] text-slate-400">Default otomatis sesuai level skor ({currentLevelConf.name})</span>
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {statusLevels.map((lvl) => {
                        const isActive = currentStatusKey === lvl.key;
                        return (
                          <button
                            key={lvl.key}
                            type="button"
                            onClick={() => setSelectedIndDimStatus(lvl.key)}
                            className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all border ${
                              isActive
                                ? `${lvl.badgeBg} ring-2 ring-emerald-500/20 shadow-2xs font-extrabold`
                                : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-100'
                            }`}
                          >
                            {lvl.label} ({lvl.range})
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* 6 Dimensions Inputs */}
                  <div className="space-y-4">
                    {indDimensionOptions.map((dim) => (
                      <div key={dim.id} className="p-4 rounded-xl bg-slate-50/70 border border-slate-200/80 space-y-2.5">
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-xs font-bold text-slate-800">
                              {dim.name}
                            </span>
                            <p className="text-[11px] text-slate-500">{dim.subtitle}</p>
                          </div>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded border bg-emerald-50 text-emerald-700 border-emerald-200">
                            Status: {currentStatusKey}
                          </span>
                        </div>
                        <div className="flex flex-col md:flex-row gap-4">
                          {renderInputField(
                            'ID',
                            'individualInsights',
                            ['dimensionDescriptions', dim.id, currentStatusKey],
                            insightsID?.dimensionDescriptions?.[dim.id]?.[currentStatusKey] || '',
                            'ID'
                          )}
                          {renderInputField(
                            'EN',
                            'individualInsights',
                            ['dimensionDescriptions', dim.id, currentStatusKey],
                            insightsEN?.dimensionDescriptions?.[dim.id]?.[currentStatusKey] || '',
                            'EN'
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Bagian 4: Analisis Kekuatan Utama & Area Pengembangan (6 Dimensi Kompetensi AI) */}
                <div className="space-y-6 pt-4 border-t border-slate-100">
                  <div className="border-b border-slate-100 pb-2 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Analisis Kekuatan Utama & Area Pengembangan (6 Dimensi Kompetensi AI)
                      </h4>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Kelola narasi analisis untuk 6 dimensi kompetensi pada level <strong>{currentLevelConf.name} ({currentLevelConf.range})</strong>. 3 dimensi pencapaian tertinggi pengguna otomatis menjadi <strong>Kekuatan Utama</strong> dan 3 terendah menjadi <strong>Area Pengembangan</strong>.
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 self-start sm:self-auto">
                      <span className={`text-[11px] font-bold px-2.5 py-1 rounded-full border ${currentLevelConf.badgeBg}`}>
                        Level Aktif: {currentLevelConf.name}
                      </span>
                    </div>
                  </div>

                  {/* Context Info Box */}
                  <div className="p-3.5 bg-emerald-50/70 border border-emerald-200/80 rounded-xl flex items-start gap-2.5 text-xs text-emerald-950">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Analisis Berbasis 6 Dimensi Kompetensi:</span>
                      <p className="text-emerald-800 text-[11px] mt-0.5 leading-relaxed">
                        Pilih dimensi di bawah ini untuk mengedit deskripsi analisis yang akan muncul di kartu <strong>Kekuatan Utama Anda</strong> (apabila dimensi tersebut masuk top 3) dan di <strong>Area Pengembangan</strong> (apabila dimensi tersebut masuk 3 terendah) pada hasil asesmen pengguna level {currentLevelConf.name}.
                      </p>
                    </div>
                  </div>

                  {/* 6 Dimension Selector Pills & Input Forms */}
                  <div className="space-y-4">
                    <label className="block text-xs font-bold text-slate-700">Pilih Dimensi Kompetensi untuk Dikelola:</label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                      {indDimensionOptions.map((dim) => {
                        const isSelected = selectedIndInsightDim === dim.id;
                        return (
                          <button
                            key={dim.id}
                            type="button"
                            onClick={() => setSelectedIndInsightDim(dim.id)}
                            className={`p-2.5 rounded-xl text-center border transition-all text-xs font-bold ${
                              isSelected
                                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs ring-2 ring-emerald-500/20'
                                : 'bg-white border-slate-200 text-slate-700 hover:border-emerald-300 hover:bg-emerald-50/50'
                            }`}
                          >
                            {dim.name.split('. ')[1] || dim.name}
                          </button>
                        );
                      })}
                    </div>

                    {/* Inputs for selected dimension */}
                    <div className="space-y-4 pt-2">
                      {/* Kekuatan Utama */}
                      <div className="p-4 rounded-xl bg-white border border-emerald-200 space-y-2 shadow-xs">
                        <div className="flex items-center justify-between border-b border-emerald-100 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
                            <span className="text-xs font-bold text-emerald-900">
                              Analisis Kekuatan Utama: {selectedDimObj.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-emerald-600 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            Level {currentLevelConf.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Teks ini tampil saat <strong>{selectedDimObj.name}</strong> masuk dalam 3 pencapaian tertinggi pengguna.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 pt-1">
                          {renderInputField(
                            'ID',
                            'individualRecommendations',
                            [selectedIndResultLevel, 'strengthInsights', selectedIndInsightDim],
                            currentStrengthID,
                            'ID'
                          )}
                          {renderInputField(
                            'EN',
                            'individualRecommendations',
                            [selectedIndResultLevel, 'strengthInsights', selectedIndInsightDim],
                            currentStrengthEN,
                            'EN'
                          )}
                        </div>
                      </div>

                      {/* Area Pengembangan */}
                      <div className="p-4 rounded-xl bg-white border border-slate-300 space-y-2 shadow-xs">
                        <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-slate-700"></span>
                            <span className="text-xs font-bold text-slate-900">
                              Analisis Area Pengembangan: {selectedDimObj.name}
                            </span>
                          </div>
                          <span className="text-[10px] text-slate-600 font-semibold bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            Level {currentLevelConf.name}
                          </span>
                        </div>
                        <p className="text-[11px] text-slate-500">
                          Teks ini tampil saat <strong>{selectedDimObj.name}</strong> masuk dalam 3 prioritas peningkatan pengguna.
                        </p>
                        <div className="flex flex-col md:flex-row gap-4 pt-1">
                          {renderInputField(
                            'ID',
                            'individualRecommendations',
                            [selectedIndResultLevel, 'growthInsights', selectedIndInsightDim],
                            currentGrowthID,
                            'ID'
                          )}
                          {renderInputField(
                            'EN',
                            'individualRecommendations',
                            [selectedIndResultLevel, 'growthInsights', selectedIndInsightDim],
                            currentGrowthEN,
                            'EN'
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bagian 5: Roadmap Rencana Aksi 3 Fase */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Rencana Aksi & Roadmap 3 Fase (Bagian 5 Website)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Daftar item aksi langkah demi langkah per fase yang spesifik untuk tingkat kematangan {currentLevelConf.name}.</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 border border-purple-200 rounded">
                      Bagian 5 (Roadmap)
                    </span>
                  </div>

                  {/* Fase 1 */}
                  {renderFieldGroup(
                    'individualRecommendations',
                    [selectedIndResultLevel, 'phase1Actions'],
                    currentRecID.phase1Actions || [],
                    currentRecEN.phase1Actions || [],
                    'Daftar Aksi Fase 1: Sekarang (0–30 Hari)'
                  )}

                  {/* Fase 2 */}
                  {renderFieldGroup(
                    'individualRecommendations',
                    [selectedIndResultLevel, 'phase2Actions'],
                    currentRecID.phase2Actions || [],
                    currentRecEN.phase2Actions || [],
                    'Daftar Aksi Fase 2: Berikutnya (1–3 Bulan)'
                  )}

                  {/* Fase 3 */}
                  {renderFieldGroup(
                    'individualRecommendations',
                    [selectedIndResultLevel, 'phase3Actions'],
                    currentRecID.phase3Actions || [],
                    currentRecEN.phase3Actions || [],
                    'Daftar Aksi Fase 3: Selanjutnya (3–12 Bulan)'
                  )}
                </div>

                {/* Bagian 6: Pertanyaan Refleksi Profesional & Tip 1-on-1 */}
                <div className="space-y-4 pt-4 border-t border-slate-100">
                  <div className="border-b border-slate-100 pb-2 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Pertanyaan Refleksi Profesional & Tip (Bagian 6 Website)</h4>
                      <p className="text-xs text-slate-500 mt-0.5">Daftar pertanyaan refleksi kritis dan teks petunjuk diskusi 1-on-1 untuk level {currentLevelConf.name}.</p>
                    </div>
                    <span className="text-[10px] font-bold px-2 py-0.5 bg-indigo-50 text-indigo-700 border border-indigo-200 rounded">
                      Bagian 6 (Refleksi)
                    </span>
                  </div>

                  {/* reflectionPrompts */}
                  {renderFieldGroup(
                    'individualRecommendations',
                    [selectedIndResultLevel, 'reflectionPrompts'],
                    currentRecID.reflectionPrompts || [],
                    currentRecEN.reflectionPrompts || [],
                    'Daftar Pertanyaan Refleksi Kritis'
                  )}

                  {/* reflectionTip */}
                  <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/80 space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="block text-xs font-bold text-slate-700">Teks Petunjuk / Tip Diskusi 1-on-1</label>
                      <span className="text-[10px] text-slate-400">Contoh: "Tip: Diskusikan pertanyaan ini saat 1-on-1..."</span>
                    </div>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'individualRecommendations', [selectedIndResultLevel, 'reflectionTip'], currentRecID.reflectionTip || '', 'ID')}
                      {renderInputField('EN', 'individualRecommendations', [selectedIndResultLevel, 'reflectionTip'], currentRecEN.reflectionTip || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {indResultSubTab === 'labels' && (
          <div className="space-y-8">
            
            {/* 1. Bagian 1 Website: Header Atas & Kartu Profil Utama */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">1. Bagian 1 Website: Header Atas & Kartu Profil Snapshot</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Label pada bilah navigasi atas, lingkaran dial skor, satuan nilai, dan identitas profil.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Bagian 1 (Atas)
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Laporan Hasil (Header Bar)</label>
                    {renderInputField('ID', 'individualResult', ['reportTitle'], resID.reportTitle || '', 'ID')}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Laporan (EN)</label>
                    {renderInputField('EN', 'individualResult', ['reportTitle'], resEN.reportTitle || '', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol Kembali (Bilah Atas)</label>
                    {renderInputField('ID', 'individualResult', ['back'], resID.back || 'Kembali', 'ID')}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol Kembali (EN)</label>
                    {renderInputField('EN', 'individualResult', ['back'], resEN.back || 'Back', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Satuan Nilai Skor (Contoh: "dari 5.00")</label>
                    {renderInputField('ID', 'individualResult', ['outOf'], resID.outOf || 'dari 5.00', 'ID')}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Satuan Nilai Skor (EN)</label>
                    {renderInputField('EN', 'individualResult', ['outOf'], resEN.outOf || 'out of 5.00', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Skor Kematangan AI</label>
                    {renderInputField('ID', 'individualResult', ['maturityScore'], resID.maturityScore || 'Skor Kematangan', 'ID')}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Skor Kematangan AI (EN)</label>
                    {renderInputField('EN', 'individualResult', ['maturityScore'], resEN.maturityScore || 'Maturity Score', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Awalan Profil Kesiapan</label>
                    {renderInputField('ID', 'individualResult', ['profilePrefix'], resID.profilePrefix || 'Profil: ', 'ID')}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Awalan Profil Kesiapan (EN)</label>
                    {renderInputField('EN', 'individualResult', ['profilePrefix'], resEN.profilePrefix || 'Profile: ', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag Evaluasi (Contoh: 6 Dimensi Dievaluasi)</label>
                    {renderInputField('ID', 'individualResult', ['dimensionsEvaluated'], resID.dimensionsEvaluated || '6 Dimensi Dievaluasi', 'ID')}
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Badge Tag Evaluasi (EN)</label>
                    {renderInputField('EN', 'individualResult', ['dimensionsEvaluated'], resEN.dimensionsEvaluated || '6 Dimensions Evaluated', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* 2. Bagian 2 Website: 3 Kartu Fokus Cepat */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">2. Bagian 2 Website: Judul 3 Kartu Fokus Cepat</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Judul untuk ketiga kartu sorotan analisis cepat di bawah kartu profil.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-50 text-amber-700 border border-amber-200">
                  Bagian 2
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 1: What's Working (Kekuatan Utama)</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['whatsWorkingTitle'], resID.whatsWorkingTitle || "What's Working", 'ID')}
                    {renderInputField('EN', 'individualResult', ['whatsWorkingTitle'], resEN.whatsWorkingTitle || "What's Working", 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 2: What's At Risk (Perlu Perhatian)</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['whatsAtRiskTitle'], resID.whatsAtRiskTitle || "What's At Risk", 'ID')}
                    {renderInputField('EN', 'individualResult', ['whatsAtRiskTitle'], resEN.whatsAtRiskTitle || "What's At Risk", 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 3: Focus Next (Prioritas Aksi Berikutnya)</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['focusNextTitle'], resID.focusNextTitle || 'Focus Next', 'ID')}
                    {renderInputField('EN', 'individualResult', ['focusNextTitle'], resEN.focusNextTitle || 'Focus Next', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* 3. Bagian 3 Website: Grafik Radar & Rincian 6 Dimensi */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">3. Bagian 3 Website: Grafik Radar & Rincian 6 Dimensi</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Judul, skala, legenda radar, dan diagram batang 6 pilar dimensi kerja harian.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                  Bagian 3
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Grafik Radar Kesiapan AI</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['radarTitle'], resID.radarTitle || 'Radar Kesiapan AI', 'ID')}
                    {renderInputField('EN', 'individualResult', ['radarTitle'], resEN.radarTitle || 'AI Readiness Radar', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Skala Radar</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'individualResult', ['radarScale'], resID.radarScale || 'Skala 0–5', 'ID')}
                      {renderInputField('EN', 'individualResult', ['radarScale'], resEN.radarScale || 'Scale 0–5', 'EN')}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Grafik Radar</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'individualResult', ['radarDesc'], resID.radarDesc || 'Peta distribusi kematangan 6 dimensi kompetensi.', 'ID')}
                      {renderInputField('EN', 'individualResult', ['radarDesc'], resEN.radarDesc || 'Distribution map of 6 competency dimensions.', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Legenda: Skor Anda</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'individualResult', ['radarLegendScore'], resID.radarLegendScore || 'Skor Hasil Asesmen', 'ID')}
                      {renderInputField('EN', 'individualResult', ['radarLegendScore'], resEN.radarLegendScore || 'Assessment Score', 'EN')}
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Legenda: Target Ideal</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'individualResult', ['radarLegendIdeal'], resID.radarLegendIdeal || 'Target Ideal: 5.00', 'ID')}
                      {renderInputField('EN', 'individualResult', ['radarLegendIdeal'], resEN.radarLegendIdeal || 'Ideal Target: 5.00', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Rincian Skor 6 Dimensi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['dimensionsDetailTitle'], resID.dimensionsDetailTitle || 'Rincian 6 Dimensi', 'ID')}
                    {renderInputField('EN', 'individualResult', ['dimensionsDetailTitle'], resEN.dimensionsDetailTitle || '6 Dimensions Breakdown', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Rincian Dimensi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['dimensionsDetailBadge'], resID.dimensionsDetailBadge || 'Diurutkan dari evaluasi lengkap', 'ID')}
                    {renderInputField('EN', 'individualResult', ['dimensionsDetailBadge'], resEN.dimensionsDetailBadge || 'Sorted from comprehensive evaluation', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Rincian Dimensi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['dimensionsDetailDesc'], resID.dimensionsDetailDesc || 'Tingkat penguasaan pada masing-masing pilar kerja harian.', 'ID')}
                    {renderInputField('EN', 'individualResult', ['dimensionsDetailDesc'], resEN.dimensionsDetailDesc || 'Proficiency level across daily work pillars.', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* 4. Bagian 4 Website: Kekuatan Utama & Area Pengembangan */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">4. Bagian 4 Website: Kekuatan Utama & Area Pengembangan</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Judul dan subjudul untuk kotak 3 kekuatan tertinggi dan 3 area prioritas perbaikan.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-purple-50 text-purple-700 border border-purple-200">
                  Bagian 4
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kotak Kekuatan Utama</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['strengthsTitle'], resID.strengthsTitle || 'Kekuatan Utama Anda', 'ID')}
                    {renderInputField('EN', 'individualResult', ['strengthsTitle'], resEN.strengthsTitle || 'Your Key Strengths', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul Kotak Kekuatan Utama</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['strengthsSubtitle'], resID.strengthsSubtitle || '3 dimensi dengan pencapaian tertinggi', 'ID')}
                    {renderInputField('EN', 'individualResult', ['strengthsSubtitle'], resEN.strengthsSubtitle || '3 highest achieving dimensions', 'EN')}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kotak Area Pengembangan</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['growthAreasTitle'], resID.growthAreasTitle || 'Area Pengembangan', 'ID')}
                    {renderInputField('EN', 'individualResult', ['growthAreasTitle'], resEN.growthAreasTitle || 'Growth & Focus Areas', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul Kotak Area Pengembangan</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['growthAreasSubtitle'], resID.growthAreasSubtitle || '3 dimensi prioritas peningkatan', 'ID')}
                    {renderInputField('EN', 'individualResult', ['growthAreasSubtitle'], resEN.growthAreasSubtitle || '3 priority improvement dimensions', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* 5. Bagian 5 Website: Rencana Aksi & Roadmap 3 Fase */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">5. Bagian 5 Website: Rencana Aksi & Roadmap 3 Fase</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Judul, deskripsi, serta judul dan rentang waktu 3 fase roadmap pengembangan talenta.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-teal-50 text-teal-700 border border-teal-200">
                  Bagian 5
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Roadmap</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['roadmapTitle'], resID.roadmapTitle || 'Rencana Aksi & Roadmap Pengembangan', 'ID')}
                    {renderInputField('EN', 'individualResult', ['roadmapTitle'], resEN.roadmapTitle || 'Action Plan & Development Roadmap', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Roadmap</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['roadmapDesc'], resID.roadmapDesc || 'Panduan bertahap untuk meningkatkan kecakapan AI Anda dari taktis hingga kepemimpinan.', 'ID')}
                    {renderInputField('EN', 'individualResult', ['roadmapDesc'], resEN.roadmapDesc || 'Step-by-step guidance to level up your AI capability from tactical to leadership.', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Badge Roadmap</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['roadmapBadge'], resID.roadmapBadge || '3 Fase Terstruktur', 'ID')}
                    {renderInputField('EN', 'individualResult', ['roadmapBadge'], resEN.roadmapBadge || '3 Structured Phases', 'EN')}
                  </div>
                </div>

                {/* 3 Fase */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-100 space-y-3">
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Fase 1</span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Judul Fase 1</label>
                      {renderInputField('ID', 'individualResult', ['phase1Title'], resID.phase1Title || 'Sekarang', 'ID')}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rentang Waktu Fase 1</label>
                      {renderInputField('ID', 'individualResult', ['phase1Range'], resID.phase1Range || '0–30 Hari', 'ID')}
                    </div>
                  </div>

                  <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-100 space-y-3">
                    <span className="text-xs font-bold text-blue-800 uppercase tracking-wide">Fase 2</span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Judul Fase 2</label>
                      {renderInputField('ID', 'individualResult', ['phase2Title'], resID.phase2Title || 'Berikutnya', 'ID')}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rentang Waktu Fase 2</label>
                      {renderInputField('ID', 'individualResult', ['phase2Range'], resID.phase2Range || '1–3 Bulan', 'ID')}
                    </div>
                  </div>

                  <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-100 space-y-3">
                    <span className="text-xs font-bold text-purple-800 uppercase tracking-wide">Fase 3</span>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Judul Fase 3</label>
                      {renderInputField('ID', 'individualResult', ['phase3Title'], resID.phase3Title || 'Selanjutnya', 'ID')}
                    </div>
                    <div>
                      <label className="block text-[11px] font-semibold text-slate-600 mb-1">Rentang Waktu Fase 3</label>
                      {renderInputField('ID', 'individualResult', ['phase3Range'], resID.phase3Range || '3–12 Bulan', 'ID')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* 6. Bagian 6 Website: Pertanyaan Refleksi Profesional */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-slate-800 text-base">6. Bagian 6 Website: Pertanyaan Refleksi Profesional</h3>
                  <p className="text-xs text-slate-500 mt-0.5">Judul, subjudul, dan tips panduan diskusi refleksi bersama mentor atau manajer.</p>
                </div>
                <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  Bagian 6
                </span>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bagian Refleksi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['reflectionTitle'], resID.reflectionTitle || 'Pertanyaan Refleksi Profesional', 'ID')}
                    {renderInputField('EN', 'individualResult', ['reflectionTitle'], resEN.reflectionTitle || 'Professional Reflection Questions', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul Bagian Refleksi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['reflectionSubtitle'], resID.reflectionSubtitle || 'Bahan perenungan kritis untuk memperdalam kedewasaan berpikir AI', 'ID')}
                    {renderInputField('EN', 'individualResult', ['reflectionSubtitle'], resEN.reflectionSubtitle || 'Critical reflection points to deepen AI maturity', 'EN')}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Tip Diskusi Mentor di Bawah Refleksi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'individualResult', ['reflectionTip'], resID.reflectionTip || 'Tip: Diskusikan pertanyaan ini saat 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.', 'ID')}
                    {renderInputField('EN', 'individualResult', ['reflectionTip'], resEN.reflectionTip || 'Tip: Discuss these questions during 1-on-1 with your mentor or manager.', 'EN')}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* SUBTAB 3: ACTION BUTTONS & NAVIGATION */}
        {indResultSubTab === 'actions' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
            <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base">7. Bagian 7 Website: Tombol Ekspor Hasil & Navigasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Label pada tombol unduh berkas (PDF, Excel, Slide) dan tombol untuk memulai asesmen baru di bilah bawah.</p>
              </div>
              <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">
                Bagian 7 (Bawah)
              </span>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bagian Ekspor Hasil</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'result', ['downloadReport'], draftTranslations['ID']?.result?.downloadReport || 'Ekspor Hasil', 'ID')}
                  {renderInputField('EN', 'result', ['downloadReport'], draftTranslations['EN']?.result?.downloadReport || 'Export Results', 'EN')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Tombol Ekspor PDF</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'result', ['downloadPdf'], draftTranslations['ID']?.result?.downloadPdf || 'Ekspor PDF', 'ID')}
                  {renderInputField('EN', 'result', ['downloadPdf'], draftTranslations['EN']?.result?.downloadPdf || 'Export PDF', 'EN')}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Tombol Mulai Assessment Baru</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'result', ['startNewAssessment'], draftTranslations['ID']?.result?.startNewAssessment || 'Mulai Assessment Baru', 'ID')}
                  {renderInputField('EN', 'result', ['startNewAssessment'], draftTranslations['EN']?.result?.startNewAssessment || 'Start New Assessment', 'EN')}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* SUBTAB 4: REKOMENDASI PROGRAM NORTIS INDIVIDU */}
        {indResultSubTab === 'programs' && (
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden p-6 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div>
                <h3 className="font-bold text-slate-800 text-base flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-emerald-600" />
                  Rekomendasi Program Nortis (Individu per Level)
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Kelola kartu penawaran program Nortis AI yang direkomendasikan untuk responden individu berdasarkan 5 level kematangan.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                  if (!newDraft.ID.result.individualNortisProgramsByLevel) {
                    newDraft.ID.result.individualNortisProgramsByLevel = {};
                  }
                  if (!newDraft.EN.result.individualNortisProgramsByLevel) {
                    newDraft.EN.result.individualNortisProgramsByLevel = {};
                  }
                  const levels = ['unready', 'aware', 'ready', 'enabled', 'mature'];
                  levels.forEach((lvl) => {
                    if (!Array.isArray(newDraft.ID.result.individualNortisProgramsByLevel[lvl])) {
                      newDraft.ID.result.individualNortisProgramsByLevel[lvl] = [];
                    }
                    if (!Array.isArray(newDraft.EN.result.individualNortisProgramsByLevel[lvl])) {
                      newDraft.EN.result.individualNortisProgramsByLevel[lvl] = [];
                    }
                  });

                  const newId = `ind-prog-${selectedIndProgramLevel}-${Date.now()}`;
                  newDraft.ID.result.individualNortisProgramsByLevel[selectedIndProgramLevel].push({
                    id: newId,
                    title: 'Program Baru Nortis AI (Individu)',
                    subtitle: 'Tagline Singkat Program',
                    badge: '',
                    iconType: 'zap',
                    iconBg: 'bg-[#FF6A00]',
                    desc: 'Deskripsi lengkap mengenai program pengembangan kemampuan AI profesional ini.',
                    ctaText: 'Pelajari Lebih Lanjut',
                    ctaLink: ''
                  });
                  newDraft.EN.result.individualNortisProgramsByLevel[selectedIndProgramLevel].push({
                    id: newId,
                    title: 'New Nortis AI Program (Individual)',
                    subtitle: 'Short Program Tagline',
                    badge: '',
                    iconType: 'zap',
                    iconBg: 'bg-[#FF6A00]',
                    desc: 'Full description of this professional AI development and mentorship program.',
                    ctaText: 'Learn More',
                    ctaLink: ''
                  });
                  setDraftTranslations(newDraft);
                  showToast('Kartu program individu baru berhasil ditambahkan.');
                }}
                className="px-4 py-2.5 bg-[#00A854] hover:bg-[#009048] active:bg-[#007D3E] text-white rounded-xl text-xs font-bold transition-all shadow-xs flex items-center gap-2 shrink-0 cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>+ Tambah Program Nortis untuk Level Ini</span>
              </button>
            </div>

            {/* Level Selector Buttons */}
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'unready', label: '1. Belum Siap (Unready)' },
                { key: 'aware', label: '2. Mulai (Aware)' },
                { key: 'ready', label: '3. Cukup Siap (Ready)' },
                { key: 'enabled', label: '4. Siap & Terstruktur (Enabled)' },
                { key: 'mature', label: '5. Sangat Siap (Mature)' }
              ].map((lvl) => (
                <button
                  key={lvl.key}
                  type="button"
                  onClick={() => setSelectedIndProgramLevel(lvl.key as any)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    selectedIndProgramLevel === lvl.key
                      ? 'bg-[#009E4F] text-white shadow-xs'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {lvl.label}
                </button>
              ))}
            </div>

            {/* Programs List */}
            {(() => {
              const progsID = draftTranslations['ID']?.result?.individualNortisProgramsByLevel?.[selectedIndProgramLevel] || [];
              const progsEN = draftTranslations['EN']?.result?.individualNortisProgramsByLevel?.[selectedIndProgramLevel] || [];

              if (!Array.isArray(progsID) || progsID.length === 0) {
                return (
                  <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200 p-6">
                    <Sparkles className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                    <p className="text-xs font-semibold text-slate-600">Belum ada kartu program Nortis untuk level ini.</p>
                    <p className="text-[11px] text-slate-400 mt-1">Klik tombol "+ Tambah Program Nortis untuk Level Ini" di atas untuk menambahkan rekomendasi program baru.</p>
                  </div>
                );
              }

              return (
                <div className="space-y-6">
                  {progsID.map((prog: any, pIdx: number) => {
                    const progEN = progsEN[pIdx] || {};
                    return (
                      <div key={prog.id || pIdx} className="border border-slate-200 rounded-2xl p-5 bg-slate-50/50 space-y-4">
                        <div className="flex items-center justify-between border-b border-slate-200/80 pb-3">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-full bg-[#009E4F] text-white text-xs font-bold flex items-center justify-center">
                              {pIdx + 1}
                            </span>
                            <span className="text-xs font-bold text-slate-800">
                              {prog.title || `Program #${pIdx + 1}`}
                            </span>
                          </div>
                          <button
                            type="button"
                            onClick={() => {
                              setDeleteModal({
                                isOpen: true,
                                title: 'Hapus Kartu Program Nortis (Individu)',
                                message: `Apakah Anda yakin ingin menghapus kartu program "${prog.title || `Program #${pIdx + 1}`}" dari level ${selectedIndProgramLevel.toUpperCase()}?`,
                                onConfirm: () => {
                                  const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                  if (!newDraft.ID.result.individualNortisProgramsByLevel) {
                                    newDraft.ID.result.individualNortisProgramsByLevel = {};
                                  }
                                  if (!newDraft.EN.result.individualNortisProgramsByLevel) {
                                    newDraft.EN.result.individualNortisProgramsByLevel = {};
                                  }
                                  if (Array.isArray(newDraft.ID?.result?.individualNortisProgramsByLevel?.[selectedIndProgramLevel])) {
                                    newDraft.ID.result.individualNortisProgramsByLevel[selectedIndProgramLevel].splice(pIdx, 1);
                                  }
                                  if (Array.isArray(newDraft.EN?.result?.individualNortisProgramsByLevel?.[selectedIndProgramLevel])) {
                                    newDraft.EN.result.individualNortisProgramsByLevel[selectedIndProgramLevel].splice(pIdx, 1);
                                  }
                                  setDraftTranslations(newDraft);
                                  setDeleteModal(null);
                                  showToast('Kartu program Nortis berhasil dihapus.');
                                }
                              });
                            }}
                            className="inline-flex items-center gap-1 text-xs text-rose-600 hover:text-rose-700 font-semibold px-2 py-1 rounded hover:bg-rose-50 transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Hapus
                          </button>
                        </div>

                        {/* Judul & Subtitle */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">Judul Program</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {renderInputField('ID', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'title'], prog.title || '', 'ID')}
                              {renderInputField('EN', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'title'], progEN.title || '', 'EN')}
                            </div>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">Subjudul / Tagline Singkat</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {renderInputField('ID', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'subtitle'], prog.subtitle || '', 'ID')}
                              {renderInputField('EN', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'subtitle'], progEN.subtitle || '', 'EN')}
                            </div>
                          </div>
                        </div>

                        {/* Priority Badge & CTA Text */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-center">
                          <div className="bg-white p-3.5 rounded-lg border border-slate-200 flex items-center justify-between">
                            <div>
                              <span className="block text-xs font-bold text-slate-800">Badge Rekomendasi Khusus</span>
                              <span className="text-[11px] text-slate-500">Tampilkan pita ribbon "⭐ DIREKOMENDASIKAN"</span>
                            </div>
                            <label className="relative inline-flex items-center cursor-pointer">
                              <input
                                type="checkbox"
                                checked={Boolean(prog.badge && prog.badge.trim() !== '') || prog.isHighestPriority === true}
                                onChange={(e) => {
                                  const isChecked = e.target.checked;
                                  const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                  if (!newDraft.ID.result.individualNortisProgramsByLevel) newDraft.ID.result.individualNortisProgramsByLevel = {};
                                  if (!newDraft.EN.result.individualNortisProgramsByLevel) newDraft.EN.result.individualNortisProgramsByLevel = {};
                                  if (newDraft.ID.result.individualNortisProgramsByLevel?.[selectedIndProgramLevel]?.[pIdx]) {
                                    newDraft.ID.result.individualNortisProgramsByLevel[selectedIndProgramLevel][pIdx].badge = isChecked ? '⭐ DIREKOMENDASIKAN' : '';
                                    newDraft.ID.result.individualNortisProgramsByLevel[selectedIndProgramLevel][pIdx].isHighestPriority = isChecked;
                                  }
                                  if (newDraft.EN.result.individualNortisProgramsByLevel?.[selectedIndProgramLevel]?.[pIdx]) {
                                    newDraft.EN.result.individualNortisProgramsByLevel[selectedIndProgramLevel][pIdx].badge = isChecked ? '⭐ RECOMMENDED' : '';
                                    newDraft.EN.result.individualNortisProgramsByLevel[selectedIndProgramLevel][pIdx].isHighestPriority = isChecked;
                                  }
                                  setDraftTranslations(newDraft);
                                }}
                                className="w-4 h-4 text-emerald-600 rounded focus:ring-emerald-500 border-slate-300 cursor-pointer"
                              />
                            </label>
                          </div>
                          <div className="space-y-2">
                            <label className="block text-xs font-bold text-slate-700">Label Tombol CTA</label>
                            <div className="flex flex-col sm:flex-row gap-2">
                              {renderInputField('ID', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'ctaText'], prog.ctaText || '', 'ID')}
                              {renderInputField('EN', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'ctaText'], progEN.ctaText || '', 'EN')}
                            </div>
                          </div>
                        </div>

                        {/* Icon Type & Color Selector */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-white p-3.5 rounded-lg border border-slate-200">
                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Tipe Ikon</label>
                            <select
                              value={prog.iconType || 'zap'}
                              onChange={(e) => {
                                const val = e.target.value;
                                const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                if (newDraft.ID.result.individualNortisProgramsByLevel?.[selectedIndProgramLevel]?.[pIdx]) {
                                  newDraft.ID.result.individualNortisProgramsByLevel[selectedIndProgramLevel][pIdx].iconType = val;
                                }
                                if (newDraft.EN.result.individualNortisProgramsByLevel?.[selectedIndProgramLevel]?.[pIdx]) {
                                  newDraft.EN.result.individualNortisProgramsByLevel[selectedIndProgramLevel][pIdx].iconType = val;
                                }
                                setDraftTranslations(newDraft);
                              }}
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                            >
                              <option value="zap">Zap / Lightning (AI Camp / Bootcamp)</option>
                              <option value="training">Graduation Cap (Masterclass / Training)</option>
                              <option value="chart">Chart / Grafik Bars (Strategy / Upskilling)</option>
                              <option value="sparkles">Sparkles / Bintang Inovasi</option>
                            </select>
                          </div>

                          <div>
                            <label className="block text-xs font-bold text-slate-700 mb-1">Warna Background Ikon</label>
                            <select
                              value={prog.iconBg || 'bg-[#FF6A00]'}
                              onChange={(e) => {
                                const val = e.target.value;
                                const newDraft = JSON.parse(JSON.stringify(draftTranslations));
                                if (newDraft.ID.result.individualNortisProgramsByLevel?.[selectedIndProgramLevel]?.[pIdx]) {
                                  newDraft.ID.result.individualNortisProgramsByLevel[selectedIndProgramLevel][pIdx].iconBg = val;
                                }
                                if (newDraft.EN.result.individualNortisProgramsByLevel?.[selectedIndProgramLevel]?.[pIdx]) {
                                  newDraft.EN.result.individualNortisProgramsByLevel[selectedIndProgramLevel][pIdx].iconBg = val;
                                }
                                setDraftTranslations(newDraft);
                              }}
                              className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-slate-50"
                            >
                              <option value="bg-[#FF6A00]">Oranye Hangat (#FF6A00)</option>
                              <option value="bg-[#009E4F]">Hijau Nortis (#009E4F)</option>
                              <option value="bg-[#2563EB]">Biru Vibrant (#2563EB)</option>
                              <option value="bg-[#7C3AED]">Ungu Royal (#7C3AED)</option>
                            </select>
                          </div>
                        </div>

                        {/* Program Description */}
                        <div className="space-y-2">
                          <label className="block text-xs font-bold text-slate-700">Deskripsi Singkat Program</label>
                          <div className="flex flex-col sm:flex-row gap-2">
                            {renderInputField('ID', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'desc'], prog.desc || '', 'ID')}
                            {renderInputField('EN', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'desc'], progEN.desc || '', 'EN')}
                          </div>
                        </div>

                        {/* Custom CTA Link (Optional) */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="block text-xs font-bold text-slate-700">Tautan Kustom Tombol CTA (Opsional)</label>
                            <span className="text-[10px] text-slate-500">Kosongkan jika ingin langsung membuka WhatsApp konsultasi program ini</span>
                          </div>
                          <div className="flex flex-col sm:flex-row gap-2">
                            {renderInputField('ID', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'ctaLink'], prog.ctaLink || '', 'ID')}
                            {renderInputField('EN', 'result', ['individualNortisProgramsByLevel', selectedIndProgramLevel, pIdx.toString(), 'ctaLink'], progEN.ctaLink || '', 'EN')}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              );
            })()}
          </div>
        )}
      </div>
    );
  };

  const renderLandingFlow = () => {
    const landingID = draftTranslations['ID']?.landing || {};
    const landingEN = draftTranslations['EN']?.landing || {};
    const headerID = draftTranslations['ID']?.header || {};
    const headerEN = draftTranslations['EN']?.header || {};

    const benefitsID: string[] = landingID.benefits || [];
    const benefitsEN: string[] = landingEN.benefits || [];

    const handleAddBenefit = () => {
      const newDraft = JSON.parse(JSON.stringify(draftTranslations));
      if (!newDraft.ID.landing.benefits) newDraft.ID.landing.benefits = [];
      if (!newDraft.EN.landing.benefits) newDraft.EN.landing.benefits = [];
      newDraft.ID.landing.benefits.push('Manfaat baru');
      newDraft.EN.landing.benefits.push('New benefit');
      setDraftTranslations(newDraft);
      showToast('Butir manfaat baru berhasil ditambahkan.');
    };

    const handleRemoveBenefit = (idx: number) => {
      setDeleteModal({
        isOpen: true,
        title: 'Hapus Butir Manfaat',
        message: 'Apakah Anda yakin ingin menghapus butir manfaat ini?',
        onConfirm: () => {
          const newDraft = JSON.parse(JSON.stringify(draftTranslations));
          if (Array.isArray(newDraft.ID?.landing?.benefits)) {
            newDraft.ID.landing.benefits.splice(idx, 1);
          }
          if (Array.isArray(newDraft.EN?.landing?.benefits)) {
            newDraft.EN.landing.benefits.splice(idx, 1);
          }
          setDraftTranslations(newDraft);
          setDeleteModal(null);
          showToast('Butir manfaat berhasil dihapus.');
        }
      });
    };

    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <LayoutTemplate className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">1. Kelola Konten Halaman Beranda (Landing Page)</h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                Atur logo website, teks header, banner utama hero, penjelasan asesmen, 5 poin manfaat, 5 pilar kesiapan AI, dan ajakan penutup.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Logo Website */}
        <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-200/80 shadow-sm">
          <div className="border-b border-slate-100 pb-4 mb-6">
            <h3 className="font-bold text-slate-800 text-base">1. Logo Website (Header Navigasi)</h3>
            <p className="text-xs text-slate-500 mt-1">Logo ini tampil di sudut kiri atas bilah navigasi di seluruh halaman.</p>
          </div>
          
          <div className="flex flex-col md:flex-row gap-6 items-start">
            <div className="w-48 h-36 bg-slate-50 rounded-2xl border-2 border-dashed border-slate-200 flex flex-col items-center justify-center p-4 shrink-0 overflow-hidden relative group">
              {draftImages.logo ? (
                <>
                  <img src={draftImages.logo} alt="Logo Preview" className="max-w-full max-h-full object-contain" />
                  <div className="absolute inset-0 bg-white/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                    <ImageIcon className="w-8 h-8 text-slate-600" />
                  </div>
                </>
              ) : (
                <div className="text-center text-slate-400">
                  <ImageIcon className="w-10 h-10 mx-auto mb-2 opacity-30" />
                  <span className="text-[13px] font-medium">Belum ada logo</span>
                </div>
              )}
            </div>
            
            <div className="flex-1 space-y-4 w-full">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-2">Unggah File Logo Baru</label>
                <label className="cursor-pointer flex items-center justify-center gap-2 px-5 py-3 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 rounded-xl text-xs font-bold transition-colors border-2 border-emerald-200 border-dashed w-full">
                  <Upload className="w-4 h-4" />
                  <span>Pilih file dari perangkat Anda</span>
                  <input 
                    type="file" 
                    accept="image/*" 
                    className="hidden" 
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => {
                          setDraftImages({ ...draftImages, logo: reader.result as string });
                        };
                        reader.readAsDataURL(file);
                      }
                    }}
                  />
                </label>
                <p className="text-[11px] text-slate-400 mt-1.5 font-medium">Disarankan PNG transparan atau SVG. Ukuran proporsional.</p>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">Atau Gunakan URL Gambar Langsung</label>
                <input 
                  type="text"
                  value={draftImages.logo || ''}
                  onChange={(e) => setDraftImages({ ...draftImages, logo: e.target.value })}
                  className="w-full px-4 py-2.5 border border-slate-200 bg-slate-50/50 rounded-xl focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white text-xs shadow-sm transition-all"
                  placeholder="https://domain.com/logo.png"
                />
              </div>
            </div>
          </div>
        </div>

        {/* 2. Tombol Navigasi Header */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">2. Tombol Navigasi Header</h3>
            <p className="text-xs text-slate-500 mt-0.5">Teks tombol akses admin di sudut kanan atas.</p>
          </div>
          <div className="p-6">
            <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol Login Admin</label>
            <div className="flex flex-col md:flex-row gap-4">
              {renderInputField('ID', 'header', ['adminLogin'], headerID.adminLogin || 'Admin Login', 'ID')}
              {renderInputField('EN', 'header', ['adminLogin'], headerEN.adminLogin || 'Admin Login', 'EN')}
            </div>
          </div>
        </div>

        {/* 3. Bagian Utama (Hero Banner) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">3. Bagian Utama (Hero Banner)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Judul utama, subjudul deskriptif, dan durasi estimasi di halaman beranda.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama (Headline)</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['title'], landingID.title || '', 'ID')}
                {renderInputField('EN', 'landing', ['title'], landingEN.title || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul (Deskripsi Ringkas)</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['subtitle'], landingID.subtitle || '', 'ID')}
                {renderInputField('EN', 'landing', ['subtitle'], landingEN.subtitle || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Keterangan Estimasi Waktu Asesmen</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['duration'], landingID.duration || '', 'ID')}
                {renderInputField('EN', 'landing', ['duration'], landingEN.duration || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol Asesmen Kesiapan AI Organisasi</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['startOrgAssessment'], landingID.startOrgAssessment || 'Asesmen Kesiapan AI Organisasi', 'ID')}
                {renderInputField('EN', 'landing', ['startOrgAssessment'], landingEN.startOrgAssessment || 'Organizational AI Readiness Assessment', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol Asesmen Kesiapan AI Individu</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['startIndAssessment'], landingID.startIndAssessment || 'Asesmen Kesiapan AI Individu', 'ID')}
                {renderInputField('EN', 'landing', ['startIndAssessment'], landingEN.startIndAssessment || 'Individual AI Readiness Assessment', 'EN')}
              </div>
            </div>
          </div>
        </div>

        {/* 4. Penjelasan Evaluasi Asesmen */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">4. Penjelasan Evaluasi Asesmen</h3>
            <p className="text-xs text-slate-500 mt-0.5">Teks paragraf penjelasan komprehensif mengenai asesmen kesiapan AI.</p>
          </div>
          <div className="p-6">
            <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Lengkap Asesmen</label>
            <div className="flex flex-col md:flex-row gap-4">
              {renderInputField('ID', 'landing', ['description'], landingID.description || '', 'ID')}
              {renderInputField('EN', 'landing', ['description'], landingEN.description || '', 'EN')}
            </div>
          </div>
        </div>

        {/* 5. Manfaat yang Didapatkan (What You Get) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">5. Manfaat yang Didapatkan ("Apa yang Anda Dapatkan:")</h3>
              <p className="text-xs text-slate-500 mt-0.5">Judul dan daftar poin manfaat yang diperoleh pengguna setelah asesmen.</p>
            </div>
            <button
              onClick={handleAddBenefit}
              className="px-3 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold hover:bg-emerald-700 flex items-center gap-1.5 shadow-sm"
            >
              + Tambah Manfaat
            </button>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bagian Manfaat</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['whatYouGet'], landingID.whatYouGet || '', 'ID')}
                {renderInputField('EN', 'landing', ['whatYouGet'], landingEN.whatYouGet || '', 'EN')}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              <label className="block text-xs font-bold text-slate-600 uppercase tracking-wider">Daftar Poin Manfaat ({benefitsID.length} Butir)</label>
              {benefitsID.map((benefit: string, bIdx: number) => (
                <div key={bIdx} className="p-4 bg-slate-50/80 rounded-xl border border-slate-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-700">Poin Manfaat #{bIdx + 1}</span>
                    <button
                      onClick={() => handleRemoveBenefit(bIdx)}
                      className="text-xs text-rose-500 hover:text-rose-700 font-bold"
                    >
                      Hapus
                    </button>
                  </div>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'landing', ['benefits', bIdx.toString()], benefit, 'ID')}
                    {renderInputField('EN', 'landing', ['benefits', bIdx.toString()], benefitsEN[bIdx] || '', 'EN')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 6. 5 Pilar Kesiapan AI Organisasi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">6. 5 Pilar Assessment Organisasi</h3>
            <p className="text-xs text-slate-500 mt-0.5">Judul bagian dan nama dari ke-5 pilar kesiapan AI Organisasi yang diukur.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bagian Pilar Organisasi</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['pillarsTitle'], landingID.pillarsTitle || '', 'ID')}
                {renderInputField('EN', 'landing', ['pillarsTitle'], landingEN.pillarsTitle || '', 'EN')}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilar 1: Strategi & Kepemimpinan</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['pillars', 'strategy'], landingID.pillars?.strategy || '', 'ID')}
                  {renderInputField('EN', 'landing', ['pillars', 'strategy'], landingEN.pillars?.strategy || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilar 2: Proses & Alur Kerja</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['pillars', 'process'], landingID.pillars?.process || '', 'ID')}
                  {renderInputField('EN', 'landing', ['pillars', 'process'], landingEN.pillars?.process || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilar 3: SDM & Kapabilitas</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['pillars', 'people'], landingID.pillars?.people || '', 'ID')}
                  {renderInputField('EN', 'landing', ['pillars', 'people'], landingEN.pillars?.people || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilar 4: Data & Teknologi</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['pillars', 'data'], landingID.pillars?.data || '', 'ID')}
                  {renderInputField('EN', 'landing', ['pillars', 'data'], landingEN.pillars?.data || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Pilar 5: Tata Kelola & AI Bertanggung Jawab</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['pillars', 'governance'], landingID.pillars?.governance || '', 'ID')}
                  {renderInputField('EN', 'landing', ['pillars', 'governance'], landingEN.pillars?.governance || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 6b. 6 Dimensi Assessment Individu */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">6b. 6 Dimensi Assessment Individu</h3>
            <p className="text-xs text-slate-500 mt-0.5">Judul bagian dan nama dari ke-6 dimensi kompetensi AI Individu yang diukur.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Bagian Dimensi Individu</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['indPillarsTitle'], landingID.indPillarsTitle || '', 'ID')}
                {renderInputField('EN', 'landing', ['indPillarsTitle'], landingEN.indPillarsTitle || '', 'EN')}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dimensi 1: AI Literacy & Mindset</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['indPillars', 'aiLiteracy'], landingID.indPillars?.aiLiteracy || '', 'ID')}
                  {renderInputField('EN', 'landing', ['indPillars', 'aiLiteracy'], landingEN.indPillars?.aiLiteracy || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dimensi 2: Task Framing & Prompting</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['indPillars', 'taskFraming'], landingID.indPillars?.taskFraming || '', 'ID')}
                  {renderInputField('EN', 'landing', ['indPillars', 'taskFraming'], landingEN.indPillars?.taskFraming || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dimensi 3: Workflow & Integration</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['indPillars', 'workflow'], landingID.indPillars?.workflow || '', 'ID')}
                  {renderInputField('EN', 'landing', ['indPillars', 'workflow'], landingEN.indPillars?.workflow || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dimensi 4: Evaluation & Human Judgment</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['indPillars', 'evaluation'], landingID.indPillars?.evaluation || '', 'ID')}
                  {renderInputField('EN', 'landing', ['indPillars', 'evaluation'], landingEN.indPillars?.evaluation || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dimensi 5: Responsible AI & Risk</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['indPillars', 'responsibleAi'], landingID.indPillars?.responsibleAi || '', 'ID')}
                  {renderInputField('EN', 'landing', ['indPillars', 'responsibleAi'], landingEN.indPillars?.responsibleAi || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Dimensi 6: Collaboration & AI Growth</label>
                <div className="flex flex-col md:flex-row gap-4">
                  {renderInputField('ID', 'landing', ['indPillars', 'collaboration'], landingID.indPillars?.collaboration || '', 'ID')}
                  {renderInputField('EN', 'landing', ['indPillars', 'collaboration'], landingEN.indPillars?.collaboration || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 7. Bagian Penutup (Call to Action) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">7. Bagian Penutup (Call to Action Bawah)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Teks kartu ajakan di bagian paling bawah halaman beranda.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Ajakan (CTA)</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['readyToMeasure'], landingID.readyToMeasure || '', 'ID')}
                {renderInputField('EN', 'landing', ['readyToMeasure'], landingEN.readyToMeasure || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Ajakan</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'landing', ['readyDesc'], landingID.readyDesc || '', 'ID')}
                {renderInputField('EN', 'landing', ['readyDesc'], landingEN.readyDesc || '', 'EN')}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderFormOrgFlow = () => {
    const formID = draftTranslations['ID']?.form || {};
    const formEN = draftTranslations['EN']?.form || {};

    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">2. Formulir Data Organisasi</h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                Atur judul formulir, label kolom profil instansi, kondisi eksisting AI, kontak PIC, dan tombol navigasi.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Header Formulir */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">1. Header & Instruksi Formulir</h3>
            <p className="text-xs text-slate-500 mt-0.5">Judul banner atas dan petunjuk pengisian formulir organisasi.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Formulir</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'form', ['title'], formID.title || '', 'ID')}
                {renderInputField('EN', 'form', ['title'], formEN.title || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul / Petunjuk Pengisian</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'form', ['subtitle'], formID.subtitle || '', 'ID')}
                {renderInputField('EN', 'form', ['subtitle'], formEN.subtitle || '', 'EN')}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Data Instansi */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">2. Data Instansi / Perusahaan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Label input nama instansi, sektor industri, ukuran, dan lokasi.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Seksi Data Instansi</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'form', ['companyData'], formID.companyData || '', 'ID')}
                {renderInputField('EN', 'form', ['companyData'], formEN.companyData || '', 'EN')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Nama Instansi</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['companyName'], formID.companyName || '', 'ID')}
                  {renderInputField('EN', 'form', ['companyName'], formEN.companyName || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Nama Instansi</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['companyNamePlaceholder'], formID.companyNamePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['companyNamePlaceholder'], formEN.companyNamePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Industri</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['industry'], formID.industry || '', 'ID')}
                  {renderInputField('EN', 'form', ['industry'], formEN.industry || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Dropdown Industri</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['industryPlaceholder'], formID.industryPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['industryPlaceholder'], formEN.industryPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            {/* Pilihan Industri */}
            <div className="pt-3 border-t border-slate-100">
              {renderFieldGroup('form', ['industries'], formID.industries, formEN.industries, 'Daftar Pilihan Industri (Sektor)')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Ukuran Perusahaan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['companySize'], formID.companySize || '', 'ID')}
                  {renderInputField('EN', 'form', ['companySize'], formEN.companySize || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Dropdown Ukuran</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['companySizePlaceholder'], formID.companySizePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['companySizePlaceholder'], formEN.companySizePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            {/* Pilihan Ukuran Perusahaan */}
            <div className="pt-3 border-t border-slate-100">
              {renderFieldGroup('form', ['companySizes'], formID.companySizes, formEN.companySizes, 'Daftar Pilihan Ukuran Perusahaan')}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Lokasi</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['location'], formID.location || '', 'ID')}
                  {renderInputField('EN', 'form', ['location'], formEN.location || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Lokasi</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['locationPlaceholder'], formID.locationPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['locationPlaceholder'], formEN.locationPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 3. Kebutuhan & Kondisi Eksisting AI */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">3. Kebutuhan & Kondisi Eksisting AI</h3>
            <p className="text-xs text-slate-500 mt-0.5">Pertanyaan terkait tujuan AI, use case, tools, pembelajaran, dan timeline.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Seksi Kebutuhan AI</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'form', ['aiNeeds'], formID.aiNeeds || '', 'ID')}
                {renderInputField('EN', 'form', ['aiNeeds'], formEN.aiNeeds || '', 'EN')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label: Tujuan Utama Adopsi AI</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiGoal'], formID.aiGoal || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiGoal'], formEN.aiGoal || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Tujuan Adopsi AI</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiGoalPlaceholder'], formID.aiGoalPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiGoalPlaceholder'], formEN.aiGoalPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label: Use Case AI yang Dipertimbangkan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiUseCase'], formID.aiUseCase || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiUseCase'], formEN.aiUseCase || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Use Case</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiUseCasePlaceholder'], formID.aiUseCasePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiUseCasePlaceholder'], formEN.aiUseCasePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label: Tools AI yang Diperlukan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiTools'], formID.aiTools || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiTools'], formEN.aiTools || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Tools AI</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiToolsPlaceholder'], formID.aiToolsPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiToolsPlaceholder'], formEN.aiToolsPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label: Penggunaan AI Saat Ini</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiCurrentUse'], formID.aiCurrentUse || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiCurrentUse'], formEN.aiCurrentUse || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Penggunaan AI Saat Ini</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiCurrentUsePlaceholder'], formID.aiCurrentUsePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiCurrentUsePlaceholder'], formEN.aiCurrentUsePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label: AI yang Paling Sering Digunakan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiFrequentUse'], formID.aiFrequentUse || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiFrequentUse'], formEN.aiFrequentUse || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder AI Sering Digunakan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiFrequentUsePlaceholder'], formID.aiFrequentUsePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiFrequentUsePlaceholder'], formEN.aiFrequentUsePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label: Kebutuhan Belajar AI</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiLearningNeed'], formID.aiLearningNeed || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiLearningNeed'], formEN.aiLearningNeed || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Kebutuhan Belajar</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiLearningNeedPlaceholder'], formID.aiLearningNeedPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiLearningNeedPlaceholder'], formEN.aiLearningNeedPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label: Target Penguasaan AI</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiMasteryTarget'], formID.aiMasteryTarget || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiMasteryTarget'], formEN.aiMasteryTarget || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Target Penguasaan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['aiMasteryTargetPlaceholder'], formID.aiMasteryTargetPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['aiMasteryTargetPlaceholder'], formEN.aiMasteryTargetPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label: Timeline Implementasi</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['timeline'], formID.timeline || '', 'ID')}
                  {renderInputField('EN', 'form', ['timeline'], formEN.timeline || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Timeline</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['timelinePlaceholder'], formID.timelinePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['timelinePlaceholder'], formEN.timelinePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            {/* Pilihan Timeline */}
            <div className="pt-3 border-t border-slate-100">
              {renderFieldGroup('form', ['timelines'], formID.timelines, formEN.timelines, 'Daftar Pilihan Timeline')}
            </div>
          </div>
        </div>

        {/* 4. Data Pribadi PIC */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">4. Data Pribadi PIC / Pengisi</h3>
            <p className="text-xs text-slate-500 mt-0.5">Label kolom nama lengkap, jabatan, email bisnis, dan nomor kontak.</p>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Seksi Data Kontak</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'form', ['personalContact'], formID.personalContact || '', 'ID')}
                {renderInputField('EN', 'form', ['personalContact'], formEN.personalContact || '', 'EN')}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Nama Lengkap</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['fullName'], formID.fullName || '', 'ID')}
                  {renderInputField('EN', 'form', ['fullName'], formEN.fullName || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Nama Lengkap</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['fullNamePlaceholder'], formID.fullNamePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['fullNamePlaceholder'], formEN.fullNamePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Jabatan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['jobTitle'], formID.jobTitle || '', 'ID')}
                  {renderInputField('EN', 'form', ['jobTitle'], formEN.jobTitle || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Jabatan</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['jobTitlePlaceholder'], formID.jobTitlePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['jobTitlePlaceholder'], formEN.jobTitlePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Email Profesional</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['email'], formID.email || '', 'ID')}
                  {renderInputField('EN', 'form', ['email'], formEN.email || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Email</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['emailPlaceholder'], formID.emailPlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['emailPlaceholder'], formEN.emailPlaceholder || '', 'EN')}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Label Nomor Telepon / WhatsApp</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['phone'], formID.phone || '', 'ID')}
                  {renderInputField('EN', 'form', ['phone'], formEN.phone || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Nomor Telepon</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['phonePlaceholder'], formID.phonePlaceholder || '', 'ID')}
                  {renderInputField('EN', 'form', ['phonePlaceholder'], formEN.phonePlaceholder || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 5. Tombol Formulir */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">5. Tombol Navigasi Formulir</h3>
            <p className="text-xs text-slate-500 mt-0.5">Teks tombol kembali dan tombol lanjut ke pertanyaan asesmen.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol Kembali</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['back'], formID.back || '', 'ID')}
                  {renderInputField('EN', 'form', ['back'], formEN.back || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Teks Tombol Lanjut</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'form', ['next'], formID.next || '', 'ID')}
                  {renderInputField('EN', 'form', ['next'], formEN.next || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderQuestionsOrgFlow = () => {
    const qID = draftTranslations['ID']?.questions || {};
    const qEN = draftTranslations['EN']?.questions || {};

    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <ListTodo className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">3. Pertanyaan & Skala Asesmen Organisasi</h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                Atur judul halaman pertanyaan, skala Likert 0–5, 5 pilar kesiapan AI, serta butir pertanyaan S1 s/d G5.
              </p>
            </div>
          </div>
        </div>

        {/* 1. Header Halaman Pertanyaan */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">1. Header Halaman Pertanyaan</h3>
            <p className="text-xs text-slate-500 mt-0.5">Judul utama, subjudul, dan indikator kemajuan pilar.</p>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Halaman Soal</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'questions', ['title'], qID.title || '', 'ID')}
                {renderInputField('EN', 'questions', ['title'], qEN.title || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul Halaman Soal</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'questions', ['subtitle'], qID.subtitle || '', 'ID')}
                {renderInputField('EN', 'questions', ['subtitle'], qEN.subtitle || '', 'EN')}
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Label Indikator Progress</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'questions', ['progress'], qID.progress || '', 'ID')}
                {renderInputField('EN', 'questions', ['progress'], qEN.progress || '', 'EN')}
              </div>
            </div>
          </div>
        </div>

        {/* 2. Skala Penilaian Likert Organisasi (Nilai 0 s/d 5) */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-800 text-base">2. Skala Penilaian Likert (Nilai 0 s/d 5)</h3>
              <p className="text-xs text-slate-500 mt-0.5">Teks panduan skala kematangan yang dipilih pengisi asesmen.</p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-700 border border-emerald-200">
              Skala 0 - 5
            </span>
          </div>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">Judul Panduan Skala</label>
              <div className="flex flex-col md:flex-row gap-4">
                {renderInputField('ID', 'questions', ['scaleTitle'], qID.scaleTitle || '', 'ID')}
                {renderInputField('EN', 'questions', ['scaleTitle'], qEN.scaleTitle || '', 'EN')}
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 space-y-3">
              {(qID.scale || []).map((s: any, sIdx: number) => {
                const sEN = qEN?.scale?.[sIdx] || {};
                return (
                  <div key={sIdx} className="p-4 bg-slate-50/70 rounded-xl border border-slate-200/80 flex flex-col md:flex-row gap-4 items-center">
                    <div className="w-10 h-10 rounded-lg bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center shrink-0">
                      {s.score ?? sIdx}
                    </div>
                    <div className="flex-1 flex flex-col md:flex-row gap-4 w-full">
                      {renderInputField('ID', 'questions', ['scale', sIdx.toString(), 'label'], s.label || '', 'ID')}
                      {renderInputField('EN', 'questions', ['scale', sIdx.toString(), 'label'], sEN.label || '', 'EN')}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* 3. 5 Pilar & Soal Asesmen */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">3. 5 Pilar & Daftar Soal Asesmen Organisasi</h3>
            <p className="text-xs text-slate-500 mt-0.5">Kelola judul pilar, deskripsi, serta pertanyaan di tiap pilar (S1–G5).</p>
          </div>
          <div className="p-6">
            {renderSection('assessmentData')}
          </div>
        </div>

        {/* 4. Tombol Navigasi Soal */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
          <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800 text-base">4. Tombol Navigasi Soal</h3>
            <p className="text-xs text-slate-500 mt-0.5">Teks tombol sebelumnya, selanjutnya, dan selesai.</p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tombol Sebelumnya</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'questions', ['prev'], qID.prev || '', 'ID')}
                  {renderInputField('EN', 'questions', ['prev'], qEN.prev || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tombol Selanjutnya</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'questions', ['next'], qID.next || '', 'ID')}
                  {renderInputField('EN', 'questions', ['next'], qEN.next || '', 'EN')}
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Tombol Selesai</label>
                <div className="flex flex-col gap-2">
                  {renderInputField('ID', 'questions', ['finish'], qID.finish || '', 'ID')}
                  {renderInputField('EN', 'questions', ['finish'], qEN.finish || '', 'EN')}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  const renderAdminFlow = () => {
    const adminID = draftTranslations['ID']?.admin || {};
    const adminEN = draftTranslations['EN']?.admin || {};
    const formID = draftTranslations['ID']?.form || {};
    const formEN = draftTranslations['EN']?.form || {};
    const formIndustriesID = formID.industries || {};
    const formIndustriesEN = formEN.industries || {};

    const currentMode = activeTab === 'admin_org' ? 'org' : activeTab === 'admin_ind' ? 'ind' : activeTab === 'admin_general' ? 'general' : adminSubTab;

    return (
      <div className="space-y-8">
        {/* Banner */}
        <div className="bg-gradient-to-r from-emerald-50 via-teal-50 to-emerald-50/40 border border-emerald-200/80 rounded-2xl p-6 shadow-xs">
          <div className="flex items-start gap-3.5">
            <div className="p-2.5 bg-emerald-600 text-white rounded-xl shrink-0 mt-0.5 shadow-xs">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base mb-1">Kelola Teks & Label Dashboard Admin</h3>
              <p className="text-slate-600 text-xs leading-relaxed max-w-3xl">
                Atur label metrik, pencarian, filter, header kolom tabel, serta teks header dan login secara terpisah untuk Mode Organisasi dan Mode Individu.
              </p>
            </div>
          </div>
        </div>

        {/* Sub-tab Navigation */}
        <div className="flex flex-wrap items-center gap-2 p-1.5 bg-slate-100/80 rounded-2xl border border-slate-200/60 shadow-xs">
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin_org');
              setAdminSubTab('org');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentMode === 'org'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Building2 className="w-4 h-4" />
            1. Dashboard Admin Organisasi
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin_ind');
              setAdminSubTab('ind');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentMode === 'ind'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <User className="w-4 h-4" />
            2. Dashboard Admin Individu
          </button>
          <button
            type="button"
            onClick={() => {
              setActiveTab('admin_general');
              setAdminSubTab('general');
            }}
            className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold transition-all ${
              currentMode === 'general'
                ? 'bg-emerald-600 text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            3. Header, Navigasi Tab & Login
          </button>
        </div>

        {/* MODE ORGANISASI */}
        {currentMode === 'org' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Judul Mode Organisasi */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-emerald-50/70 px-6 py-4 border-b border-emerald-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-emerald-900 text-base">Header Judul Mode Organisasi</h3>
                  <p className="text-xs text-emerald-700/80 mt-0.5">Judul header saat Mode Organisasi / Perusahaan aktif.</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Mode Organisasi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'admin', ['orgHistoryTitle'], adminID.orgHistoryTitle || '', 'ID')}
                    {renderInputField('EN', 'admin', ['orgHistoryTitle'], adminEN.orgHistoryTitle || '', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Metrik Organisasi */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Kartu Metrik & Statistik Organisasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Label pada 4 kartu ringkasan untuk data perusahaan.</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 1: Total Asesmen Organisasi</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['totalOrgSubmissions'], adminID.totalOrgSubmissions || '', 'ID')}
                      {renderInputField('EN', 'admin', ['totalOrgSubmissions'], adminEN.totalOrgSubmissions || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sublabel Periode (mis. 7 Hari Terakhir)</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['last7Days'], adminID.last7Days || '', 'ID')}
                      {renderInputField('EN', 'admin', ['last7Days'], adminEN.last7Days || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 2: Rata-rata Skor Kesiapan</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['avgScore'], adminID.avgScore || '', 'ID')}
                      {renderInputField('EN', 'admin', ['avgScore'], adminEN.avgScore || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sublabel Skala Maksimal (mis. dari 5.0)</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['outOf5'], adminID.outOf5 || '', 'ID')}
                      {renderInputField('EN', 'admin', ['outOf5'], adminEN.outOf5 || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 3: Sektor Industri Terwakili</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['industries'], adminID.industries || '', 'ID')}
                      {renderInputField('EN', 'admin', ['industries'], adminEN.industries || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sublabel Kategori Unik</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['differentSectors'], adminID.differentSectors || '', 'ID')}
                      {renderInputField('EN', 'admin', ['differentSectors'], adminEN.differentSectors || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 4: Organisasi AI-Mature</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['aiMatureOrgs'], adminID.aiMatureOrgs || '', 'ID')}
                      {renderInputField('EN', 'admin', ['aiMatureOrgs'], adminEN.aiMatureOrgs || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sublabel Skor Tinggi (Top Performers)</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['topPerformers'], adminID.topPerformers || '', 'ID')}
                      {renderInputField('EN', 'admin', ['topPerformers'], adminEN.topPerformers || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pencarian, Filter & Ekspor Organisasi */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Bilah Pencarian, Filter & Ekspor Organisasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Placeholder pencarian, opsi dropdown filter industri, dan tombol ekspor.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Pencarian Organisasi</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'admin', ['searchPlaceholderOrg'], adminID.searchPlaceholderOrg || '', 'ID')}
                    {renderInputField('EN', 'admin', ['searchPlaceholderOrg'], adminEN.searchPlaceholderOrg || '', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Filter Industri</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['industryLabel'], adminID.industryLabel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['industryLabel'], adminEN.industryLabel || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi "Semua Industri"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['allIndustries'], adminID.allIndustries || '', 'ID')}
                      {renderInputField('EN', 'admin', ['allIndustries'], adminEN.allIndustries || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Filter Tingkat Kesiapan</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['readinessLevel'], adminID.readinessLevel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['readinessLevel'], adminEN.readinessLevel || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi "Semua Tingkat Kesiapan"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['allLevels'], adminID.allLevels || '', 'ID')}
                      {renderInputField('EN', 'admin', ['allLevels'], adminEN.allLevels || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Tombol Filter</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['filters'], adminID.filters || '', 'ID')}
                      {renderInputField('EN', 'admin', ['filters'], adminEN.filters || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tombol Ekspor CSV</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['exportCsv'], adminID.exportCsv || '', 'ID')}
                      {renderInputField('EN', 'admin', ['exportCsv'], adminEN.exportCsv || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tombol Ekspor Excel</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['exportExcel'], adminID.exportExcel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['exportExcel'], adminEN.exportExcel || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Opsi Filter Dropdown Tingkat Kesiapan AI (Organisasi) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Opsi Dropdown Filter Tingkat Kesiapan AI</h3>
                <p className="text-xs text-slate-500 mt-0.5">Kelola teks pilihan level pada dropdown filter (AI-Unready, AI-Aware, AI-Ready, AI-Enabled, AI-Mature).</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 1: AI-Unready</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelUnready'], adminID.levelUnready || 'AI-Unready', 'ID')}
                      {renderInputField('EN', 'admin', ['levelUnready'], adminEN.levelUnready || 'AI-Unready', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 2: AI-Aware</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelAware'], adminID.levelAware || 'AI-Aware', 'ID')}
                      {renderInputField('EN', 'admin', ['levelAware'], adminEN.levelAware || 'AI-Aware', 'EN')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 3: AI-Ready</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelReady'], adminID.levelReady || 'AI-Ready', 'ID')}
                      {renderInputField('EN', 'admin', ['levelReady'], adminEN.levelReady || 'AI-Ready', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 4: AI-Enabled</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelEnabled'], adminID.levelEnabled || 'AI-Enabled', 'ID')}
                      {renderInputField('EN', 'admin', ['levelEnabled'], adminEN.levelEnabled || 'AI-Enabled', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 5: AI-Mature</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelMature'], adminID.levelMature || 'AI-Mature', 'ID')}
                      {renderInputField('EN', 'admin', ['levelMature'], adminEN.levelMature || 'AI-Mature', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Opsi Filter Dropdown Sektor Industri */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Opsi Dropdown Filter Sektor Industri</h3>
                <p className="text-xs text-slate-500 mt-0.5">Kelola teks daftar industri yang tersedia pada dropdown filter.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">1. Perbankan & Keuangan</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'finance'], formIndustriesID.finance || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'finance'], formIndustriesEN.finance || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">2. Teknologi & IT</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'it'], formIndustriesID.it || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'it'], formIndustriesEN.it || '', 'EN')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">3. Manufaktur</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'manufacturing'], formIndustriesID.manufacturing || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'manufacturing'], formIndustriesEN.manufacturing || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">4. Retail & E-commerce</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'retail'], formIndustriesID.retail || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'retail'], formIndustriesEN.retail || '', 'EN')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">5. Healthcare</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'healthcare'], formIndustriesID.healthcare || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'healthcare'], formIndustriesEN.healthcare || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">6. Pendidikan</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'education'], formIndustriesID.education || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'education'], formIndustriesEN.education || '', 'EN')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">7. Telekomunikasi</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'telecom'], formIndustriesID.telecom || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'telecom'], formIndustriesEN.telecom || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">8. Energi</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'energy'], formIndustriesID.energy || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'energy'], formIndustriesEN.energy || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">9. Transportasi & Logistik</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'form', ['industries', 'logistics'], formIndustriesID.logistics || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'logistics'], formIndustriesEN.logistics || '', 'EN')}
                    </div>
                  </div>
                </div>
                <div className="pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">10. Lainnya</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'form', ['industries', 'other'], formIndustriesID.other || '', 'ID')}
                      {renderInputField('EN', 'form', ['industries', 'other'], formIndustriesEN.other || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Data & Empty State Organisasi */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Status Counter & Pesan Kosong Organisasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Teks hitungan data dan pesan ketika belum ada pengajuan dari perusahaan.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teks "Menampilkan"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['showing'], adminID.showing || '', 'ID')}
                      {renderInputField('EN', 'admin', ['showing'], adminEN.showing || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teks "dari"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['of'], adminID.of || '', 'ID')}
                      {renderInputField('EN', 'admin', ['of'], adminEN.of || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Suffix Teks Mode Organisasi</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['companySubmissionsText'], adminID.companySubmissionsText || '', 'ID')}
                      {renderInputField('EN', 'admin', ['companySubmissionsText'], adminEN.companySubmissionsText || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Belum Ada Data</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'admin', ['noSubmissions'], adminID.noSubmissions || '', 'ID')}
                      {renderInputField('EN', 'admin', ['noSubmissions'], adminEN.noSubmissions || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Belum Ada Data (Organisasi)</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'admin', ['noSubmissionsOrgDesc'], adminID.noSubmissionsOrgDesc || '', 'ID')}
                      {renderInputField('EN', 'admin', ['noSubmissionsOrgDesc'], adminEN.noSubmissionsOrgDesc || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Kolom Tabel Organisasi */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Judul Kolom Tabel Organisasi</h3>
                <p className="text-xs text-slate-500 mt-0.5">Label header untuk 8 kolom tabel data perusahaan.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kolom 1: Nomor</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thNo'], adminID.thNo || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thNo'], adminEN.thNo || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kolom 2: Perusahaan & Lokasi</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thCompanyLocation'], adminID.thCompanyLocation || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thCompanyLocation'], adminEN.thCompanyLocation || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kolom 3: PIC & Kontak</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thPicContact'], adminID.thPicContact || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thPicContact'], adminEN.thPicContact || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kolom 4: Industri</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thIndustry'], adminID.thIndustry || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thIndustry'], adminEN.thIndustry || '', 'EN')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 pt-2 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kolom 5: Skor</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thScore'], adminID.thScore || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thScore'], adminEN.thScore || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kolom 6: Level</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thLevel'], adminID.thLevel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thLevel'], adminEN.thLevel || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kolom 7: Tanggal</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thDate'], adminID.thDate || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thDate'], adminEN.thDate || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Kolom 8: Aksi</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thActions'], adminID.thActions || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thActions'], adminEN.thActions || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MODE INDIVIDU & WEBSITE */}
        {currentMode === 'ind' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header Judul Mode Individu */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-blue-50/70 px-6 py-4 border-b border-blue-100 flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-blue-900 text-base">Header Judul Mode Individu</h3>
                  <p className="text-xs text-blue-700/80 mt-0.5">Judul header saat Mode Individu & Profesional aktif.</p>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Mode Individu</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'admin', ['indHistoryTitle'], adminID.indHistoryTitle || '', 'ID')}
                    {renderInputField('EN', 'admin', ['indHistoryTitle'], adminEN.indHistoryTitle || '', 'EN')}
                  </div>
                </div>
              </div>
            </div>

            {/* Kartu Metrik Individu */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Kartu Metrik & Statistik Individu</h3>
                <p className="text-xs text-slate-500 mt-0.5">Label pada 4 kartu ringkasan untuk data praktisi & talenta individu.</p>
              </div>
              <div className="p-6 space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 1: Total Asesmen Individu</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['totalIndSubmissions'], adminID.totalIndSubmissions || '', 'ID')}
                      {renderInputField('EN', 'admin', ['totalIndSubmissions'], adminEN.totalIndSubmissions || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sublabel Periode (mis. 7 Hari Terakhir)</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['last7Days'], adminID.last7Days || '', 'ID')}
                      {renderInputField('EN', 'admin', ['last7Days'], adminEN.last7Days || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 2: Rata-rata Skor Kesiapan</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['avgScore'], adminID.avgScore || '', 'ID')}
                      {renderInputField('EN', 'admin', ['avgScore'], adminEN.avgScore || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sublabel Skala Maksimal (mis. dari 5.0)</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['outOf5'], adminID.outOf5 || '', 'ID')}
                      {renderInputField('EN', 'admin', ['outOf5'], adminEN.outOf5 || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 3: Ragam Jabatan / Profesi</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['jobRoles'], adminID.jobRoles || '', 'ID')}
                      {renderInputField('EN', 'admin', ['jobRoles'], adminEN.jobRoles || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sublabel Profesi Unik</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['uniqueProfessions'], adminID.uniqueProfessions || '', 'ID')}
                      {renderInputField('EN', 'admin', ['uniqueProfessions'], adminEN.uniqueProfessions || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Kartu 4: Praktisi AI-Mature</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['aiMatureInds'], adminID.aiMatureInds || '', 'ID')}
                      {renderInputField('EN', 'admin', ['aiMatureInds'], adminEN.aiMatureInds || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Sublabel High Performers</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['topPerformers'], adminID.topPerformers || '', 'ID')}
                      {renderInputField('EN', 'admin', ['topPerformers'], adminEN.topPerformers || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Pencarian, Filter & Ekspor Individu */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Bilah Pencarian, Filter & Ekspor Individu</h3>
                <p className="text-xs text-slate-500 mt-0.5">Placeholder pencarian, opsi dropdown filter pengalaman, dan tombol ekspor.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Pencarian Individu</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'admin', ['searchPlaceholderInd'], adminID.searchPlaceholderInd || '', 'ID')}
                    {renderInputField('EN', 'admin', ['searchPlaceholderInd'], adminEN.searchPlaceholderInd || '', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Filter Pengalaman</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['experienceLabel'], adminID.experienceLabel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['experienceLabel'], adminEN.experienceLabel || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi "Semua Pengalaman"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['allExperience'], adminID.allExperience || '', 'ID')}
                      {renderInputField('EN', 'admin', ['allExperience'], adminEN.allExperience || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Filter Tingkat Kesiapan</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['readinessLevel'], adminID.readinessLevel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['readinessLevel'], adminEN.readinessLevel || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi "Semua Tingkat Kesiapan"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['allLevels'], adminID.allLevels || '', 'ID')}
                      {renderInputField('EN', 'admin', ['allLevels'], adminEN.allLevels || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Tombol Filter</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['filters'], adminID.filters || '', 'ID')}
                      {renderInputField('EN', 'admin', ['filters'], adminEN.filters || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tombol Ekspor CSV</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['exportCsv'], adminID.exportCsv || '', 'ID')}
                      {renderInputField('EN', 'admin', ['exportCsv'], adminEN.exportCsv || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tombol Ekspor Excel</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['exportExcel'], adminID.exportExcel || '', 'ID')}
                      {renderInputField('EN', 'admin', ['exportExcel'], adminEN.exportExcel || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Opsi Filter Dropdown Tingkat Kesiapan AI (Individu) */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Opsi Dropdown Filter Tingkat Kesiapan AI (Individu)</h3>
                <p className="text-xs text-slate-500 mt-0.5">Kelola teks pilihan level pada dropdown filter individu.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 1: AI-Unready</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelUnready'], adminID.levelUnready || 'AI-Unready', 'ID')}
                      {renderInputField('EN', 'admin', ['levelUnready'], adminEN.levelUnready || 'AI-Unready', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 2: AI-Aware</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelAware'], adminID.levelAware || 'AI-Aware', 'ID')}
                      {renderInputField('EN', 'admin', ['levelAware'], adminEN.levelAware || 'AI-Aware', 'EN')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 3: AI-Ready</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelReady'], adminID.levelReady || 'AI-Ready', 'ID')}
                      {renderInputField('EN', 'admin', ['levelReady'], adminEN.levelReady || 'AI-Ready', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 4: AI-Enabled</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelEnabled'], adminID.levelEnabled || 'AI-Enabled', 'ID')}
                      {renderInputField('EN', 'admin', ['levelEnabled'], adminEN.levelEnabled || 'AI-Enabled', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi Level 5: AI-Mature</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['levelMature'], adminID.levelMature || 'AI-Mature', 'ID')}
                      {renderInputField('EN', 'admin', ['levelMature'], adminEN.levelMature || 'AI-Mature', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Edit Opsi Filter Dropdown Pengalaman Kerja */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Opsi Dropdown Filter Pengalaman Kerja</h3>
                <p className="text-xs text-slate-500 mt-0.5">Kelola teks durasi pengalaman kerja pada dropdown filter individu.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi 1: &lt; 1 tahun</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['expUnder1'], adminID.expUnder1 || '< 1 tahun', 'ID')}
                      {renderInputField('EN', 'admin', ['expUnder1'], adminEN.expUnder1 || '< 1 year', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi 2: 1 - 3 tahun</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['exp1to3'], adminID.exp1to3 || '1 - 3 tahun', 'ID')}
                      {renderInputField('EN', 'admin', ['exp1to3'], adminEN.exp1to3 || '1 - 3 years', 'EN')}
                    </div>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi 3: 3 - 5 tahun</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['exp3to5'], adminID.exp3to5 || '3 - 5 tahun', 'ID')}
                      {renderInputField('EN', 'admin', ['exp3to5'], adminEN.exp3to5 || '3 - 5 years', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Opsi 4: &gt; 5 tahun</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['expOver5'], adminID.expOver5 || '> 5 tahun', 'ID')}
                      {renderInputField('EN', 'admin', ['expOver5'], adminEN.expOver5 || '> 5 years', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Status Data & Empty State Individu */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Status Counter & Pesan Kosong Individu</h3>
                <p className="text-xs text-slate-500 mt-0.5">Teks hitungan data dan pesan ketika belum ada pengajuan dari praktisi/individu.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teks "Menampilkan"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['showing'], adminID.showing || '', 'ID')}
                      {renderInputField('EN', 'admin', ['showing'], adminEN.showing || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Teks "dari"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['of'], adminID.of || '', 'ID')}
                      {renderInputField('EN', 'admin', ['of'], adminEN.of || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Suffix Teks Mode Individu</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['individualSubmissionsText'], adminID.individualSubmissionsText || '', 'ID')}
                      {renderInputField('EN', 'admin', ['individualSubmissionsText'], adminEN.individualSubmissionsText || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 space-y-3">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Belum Ada Data</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'admin', ['noSubmissions'], adminID.noSubmissions || '', 'ID')}
                      {renderInputField('EN', 'admin', ['noSubmissions'], adminEN.noSubmissions || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Deskripsi Belum Ada Data (Individu)</label>
                    <div className="flex flex-col md:flex-row gap-4">
                      {renderInputField('ID', 'admin', ['noSubmissionsIndDesc'], adminID.noSubmissionsIndDesc || '', 'ID')}
                      {renderInputField('EN', 'admin', ['noSubmissionsIndDesc'], adminEN.noSubmissionsIndDesc || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Header Kolom Tabel Individu */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Judul Kolom Tabel Individu</h3>
                <p className="text-xs text-slate-500 mt-0.5">Label header unik untuk kolom tabel data individu/praktisi.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Nama & Kontak</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thNameContact'], adminID.thNameContact || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thNameContact'], adminEN.thNameContact || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Jabatan & Instansi</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thRoleCompany'], adminID.thRoleCompany || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thRoleCompany'], adminEN.thRoleCompany || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pengalaman & AI Tools</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['thExpTools'], adminID.thExpTools || '', 'ID')}
                      {renderInputField('EN', 'admin', ['thExpTools'], adminEN.thExpTools || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* HEADER, NAVIGASI TAB & LOGIN ADMIN */}
        {currentMode === 'general' && (
          <div className="space-y-8 animate-fadeIn">
            {/* Header & Navigasi Dashboard */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Header & Navigasi Dashboard Admin</h3>
                <p className="text-xs text-slate-500 mt-0.5">Judul utama halaman admin, label tab switch, dan tombol logout/CMS.</p>
              </div>
              <div className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Judul Utama Dashboard</label>
                  <div className="flex flex-col md:flex-row gap-4">
                    {renderInputField('ID', 'admin', ['dashboardTitle'], adminID.dashboardTitle || '', 'ID')}
                    {renderInputField('EN', 'admin', ['dashboardTitle'], adminEN.dashboardTitle || '', 'EN')}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Tab "Dashboard Perusahaan"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['companyDashboard'], adminID.companyDashboard || '', 'ID')}
                      {renderInputField('EN', 'admin', ['companyDashboard'], adminEN.companyDashboard || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Tab "Dashboard Individu"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['individualDashboard'], adminID.individualDashboard || '', 'ID')}
                      {renderInputField('EN', 'admin', ['individualDashboard'], adminEN.individualDashboard || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Tombol "Manage Content (CMS)"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['manageContent'], adminID.manageContent || '', 'ID')}
                      {renderInputField('EN', 'admin', ['manageContent'], adminEN.manageContent || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Tombol "Logout / Keluar"</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['logout'], adminID.logout || '', 'ID')}
                      {renderInputField('EN', 'admin', ['logout'], adminEN.logout || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Halaman Login Admin */}
            <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm overflow-hidden">
              <div className="bg-slate-50/70 px-6 py-4 border-b border-slate-100">
                <h3 className="font-bold text-slate-800 text-base">Teks Formulir Login Admin</h3>
                <p className="text-xs text-slate-500 mt-0.5">Label dan pesan pada layar login administrator.</p>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Judul Login</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['loginTitle'], adminID.loginTitle || '', 'ID')}
                      {renderInputField('EN', 'admin', ['loginTitle'], adminEN.loginTitle || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Subjudul Login</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['loginSubtitle'], adminID.loginSubtitle || '', 'ID')}
                      {renderInputField('EN', 'admin', ['loginSubtitle'], adminEN.loginSubtitle || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Header Box Login</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['loginHeader'], adminID.loginHeader || '', 'ID')}
                      {renderInputField('EN', 'admin', ['loginHeader'], adminEN.loginHeader || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Label Input Password</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['password'], adminID.password || '', 'ID')}
                      {renderInputField('EN', 'admin', ['password'], adminEN.password || '', 'EN')}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Placeholder Password</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['passwordPlaceholder'], adminID.passwordPlaceholder || '', 'ID')}
                      {renderInputField('EN', 'admin', ['passwordPlaceholder'], adminEN.passwordPlaceholder || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Pesan Password Salah</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['wrongPassword'], adminID.wrongPassword || '', 'ID')}
                      {renderInputField('EN', 'admin', ['wrongPassword'], adminEN.wrongPassword || '', 'EN')}
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">Tombol Masuk</label>
                    <div className="flex flex-col gap-2">
                      {renderInputField('ID', 'admin', ['loginBtn'], adminID.loginBtn || '', 'ID')}
                      {renderInputField('EN', 'admin', ['loginBtn'], adminEN.loginBtn || '', 'EN')}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="h-screen w-full bg-[#fafafa] flex flex-col md:flex-row font-sans overflow-hidden">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/40 z-20 md:hidden backdrop-blur-sm transition-opacity" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Light Sidebar */}
      <aside className={`fixed md:static inset-y-0 left-0 w-72 bg-white border-r border-slate-200 shrink-0 h-full flex flex-col z-30 transition-transform duration-300 ease-in-out ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}>
        <div className="p-6 border-b border-slate-100 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2.5">
              <div className="bg-emerald-100 text-emerald-600 p-1.5 rounded-lg">
                <LayoutTemplate className="w-5 h-5" />
              </div>
              Manajemen Konten (CMS)
            </h2>
            <p className="text-xs text-slate-500 mt-2">Kelola teks, pertanyaan, skala, logo, dan rekomendasi website.</p>
          </div>
          <button 
            className="md:hidden p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
            onClick={() => setIsSidebarOpen(false)}
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <nav className="flex-1 p-3.5 flex flex-col gap-4 overflow-y-auto">
          {tabCategories.map((group, gIdx) => (
            <div key={gIdx} className="space-y-1">
              <div className="px-3 py-1 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                {group.category}
              </div>
              <div className="space-y-1">
                {group.tabs.map(tab => {
                  const Icon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => {
                        setActiveTab(tab.id);
                        setIsSidebarOpen(false);
                      }}
                      className={`w-full text-left px-3.5 py-2.5 rounded-xl transition-all flex items-start gap-3 ${
                        isActive 
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200/60 shadow-[0_2px_8px_-3px_rgba(16,185,129,0.15)] font-semibold' 
                          : 'text-slate-600 hover:bg-slate-50 border border-transparent'
                      }`}
                    >
                      <Icon className={`w-4 h-4 mt-0.5 shrink-0 transition-colors ${isActive ? 'text-emerald-600' : 'text-slate-400'}`} />
                      <div className="min-w-0">
                        <div className="font-semibold text-xs leading-tight truncate">{tab.label}</div>
                        <div className={`text-[10px] mt-0.5 truncate ${isActive ? 'text-emerald-600/80' : 'text-slate-400'}`}>{tab.desc}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
        <div className="p-4 border-t border-slate-100">
          <button 
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 text-slate-700 rounded-xl transition-colors text-sm font-semibold border border-slate-200 shadow-sm"
          >
            <LogOut className="w-4 h-4 text-slate-400" />
            Kembali ke Dashboard Admin
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-full overflow-hidden bg-[#fafafa] relative z-10">
        {/* Topbar */}
        <header className="bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 md:py-5 border-b border-slate-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 shrink-0 shadow-sm z-10 sticky top-0">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button 
              className="md:hidden p-2 -ml-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
              onClick={() => setIsSidebarOpen(true)}
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
              {tabs.find(t => t.id === activeTab)?.label}
            </h1>
          </div>
          <div className="flex items-center gap-3 w-full sm:w-auto ml-auto sm:ml-0">
            <button 
              onClick={handleReset}
              className="px-4 py-2 text-[13px] font-semibold text-slate-600 bg-white hover:bg-slate-50 rounded-xl transition-colors flex items-center gap-2 border border-slate-200 shadow-sm"
              title="Reset ke pengaturan awal"
            >
              <RefreshCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset ke Default</span>
            </button>
            <button 
              onClick={handleSave}
              className="flex-1 sm:flex-none px-6 py-2 text-[13px] font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              {isSaved ? <CheckCircle2 className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              <span className="hidden sm:inline">{isSaved ? 'Tersimpan!' : 'Simpan Perubahan'}</span>
              <span className="sm:hidden">{isSaved ? 'Tersimpan!' : 'Simpan'}</span>
            </button>
          </div>
        </header>

        {/* Editor Area */}
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="max-w-5xl mx-auto pb-12">
            {activeTab === 'landing_flow' && renderLandingFlow()}
            {activeTab === 'form_org' && renderFormOrgFlow()}
            {activeTab === 'questions_org' && renderQuestionsOrgFlow()}
            {activeTab === 'result_org' && renderResultFlow()}
            {activeTab === 'form_ind' && renderFormIndFlow()}
            {activeTab === 'questions_ind' && renderQuestionsIndFlow()}
            {activeTab === 'result_ind' && renderIndividualResultFlow()}
            {(activeTab === 'admin_flow' || activeTab === 'admin_org' || activeTab === 'admin_ind' || activeTab === 'admin_general') && renderAdminFlow()}
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {deleteModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-rose-600">
                <div className="p-2.5 bg-rose-50 rounded-xl">
                  <Trash2 className="w-5 h-5 text-rose-600" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{deleteModal.title}</h3>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {deleteModal.message}
              </p>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setDeleteModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    deleteModal.onConfirm();
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-rose-600 hover:bg-rose-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Hapus
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Prompt / Add Option Modal */}
        {promptModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-xs p-4 animate-in fade-in duration-150">
            <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-100 space-y-4">
              <div className="flex items-center gap-3 text-emerald-600">
                <div className="p-2.5 bg-emerald-50 rounded-xl">
                  <Plus className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-base font-bold text-slate-800">{promptModal.title}</h3>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">ID Unik / Kunci Opsi</label>
                <input
                  type="text"
                  autoFocus
                  className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 focus:bg-white transition-all shadow-xs"
                  placeholder={promptModal.placeholder}
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      promptModal.onConfirm(promptInput);
                    }
                  }}
                />
                <p className="text-[11px] text-slate-400 mt-1">Gunakan huruf kecil tanpa spasi (cth: manufacturing, tech)</p>
              </div>
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setPromptModal(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={() => {
                    promptModal.onConfirm(promptInput);
                  }}
                  className="px-5 py-2 text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl shadow-xs transition-colors cursor-pointer"
                >
                  Tambahkan
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-3 bg-slate-900 text-white text-xs font-medium rounded-xl shadow-xl animate-in slide-in-from-bottom-2 fade-in duration-200">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{toastMessage}</span>
          </div>
        )}
      </main>
    </div>
  );
}
