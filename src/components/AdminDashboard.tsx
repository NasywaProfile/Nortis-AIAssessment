import React, { useState, useEffect } from 'react';
import { 
  LogOut, 
  Globe, 
  Users, 
  BarChart3, 
  Building2, 
  TrendingUp, 
  Search, 
  Filter, 
  RefreshCcw, 
  ArrowUpRight, 
  ChevronDown, 
  ChevronUp, 
  Download, 
  FileSpreadsheet, 
  Trash2, 
  Eye, 
  UserCheck, 
  Briefcase, 
  Sparkles,
  BookOpen,
  ExternalLink,
  X,
  RotateCcw,
  CheckCircle2
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';
import * as XLSX from 'xlsx';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { AssessmentSubmission } from '../types';
import { apiService } from '../services/api';
import { SubmissionDetailModal } from './SubmissionDetailModal';

interface AdminDashboardProps {
  onLogout: () => void;
  onOpenCMS?: () => void;
}

export function AdminDashboard({ onLogout, onOpenCMS }: AdminDashboardProps) {
  const [adminMode, setAdminMode] = useState<'organization' | 'individual'>('organization');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterLevel, setFilterLevel] = useState('');
  const [filterIndustry, setFilterIndustry] = useState('');
  const [filterExperience, setFilterExperience] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [submissions, setSubmissions] = useState<AssessmentSubmission[]>([]);
  const [selectedSubmission, setSelectedSubmission] = useState<AssessmentSubmission | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<{ id: string; name: string } | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const { t, language, translations } = useLanguage();

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  const loadData = async (isManual = false) => {
    setIsRefreshing(true);
    try {
      const data = await apiService.getSubmissions();
      setSubmissions(data);
      if (isManual) {
        showToast('Data asesmen berhasil diperbarui.');
      }
    } catch (e) {
      console.error('Error loading submissions:', e);
    } finally {
      setTimeout(() => setIsRefreshing(false), 300);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Split submissions
  const orgSubmissions = submissions.filter(s => s.assessmentType !== 'individual');
  const indSubmissions = submissions.filter(s => s.assessmentType === 'individual');

  const currentDataset = adminMode === 'organization' ? orgSubmissions : indSubmissions;

  // Filter dataset based on mode and inputs
  const filteredSubmissions = currentDataset.filter(sub => {
    const searchLower = searchQuery.toLowerCase().trim();

    if (adminMode === 'organization') {
      const matchesSearch = !searchLower || 
        (sub.companyName && sub.companyName.toLowerCase().includes(searchLower)) ||
        (sub.fullName && sub.fullName.toLowerCase().includes(searchLower)) ||
        (sub.email && sub.email.toLowerCase().includes(searchLower)) ||
        (sub.phone && sub.phone.toLowerCase().includes(searchLower)) ||
        (sub.location && sub.location.toLowerCase().includes(searchLower)) ||
        ((t(`form.industries.${sub.industry}`) || sub.industry || '').toLowerCase().includes(searchLower));

      const matchesLevel = !filterLevel || sub.readinessLevel === filterLevel;
      const matchesIndustry = !filterIndustry || (sub.industry && sub.industry.toLowerCase() === filterIndustry.toLowerCase());

      return matchesSearch && matchesLevel && matchesIndustry;
    } else {
      // Individual mode
      const matchesSearch = !searchLower || 
        (sub.fullName && sub.fullName.toLowerCase().includes(searchLower)) ||
        (sub.email && sub.email.toLowerCase().includes(searchLower)) ||
        (sub.phone && sub.phone.toLowerCase().includes(searchLower)) ||
        (sub.jobTitle && sub.jobTitle.toLowerCase().includes(searchLower)) ||
        (sub.companyName && sub.companyName.toLowerCase().includes(searchLower)) ||
        (sub.aiToolsUsed && sub.aiToolsUsed.toLowerCase().includes(searchLower));

      const matchesLevel = !filterLevel || sub.readinessLevel === filterLevel;
      const matchesExperience = !filterExperience || sub.experienceYears === filterExperience;

      return matchesSearch && matchesLevel && matchesExperience;
    }
  });

  const getCompanySizeLabel = (value: string) => {
    if (!value) return "-";
    const map: Record<string, string> = {
      "s50": "1-50 karyawan",
      "s200": "51-200 karyawan",
      "s500": "201-500 karyawan",
      "s1000": "501-1000 karyawan",
      "splus": "1000+ karyawan"
    };
    if (map[value]) return map[value];
    const translated = t(`form.companySizes.${value}`);
    if (translated && translated !== `form.companySizes.${value}`) {
      return translated;
    }
    return value;
  };

  const getTimelineLabel = (value: string) => {
    if (!value) return "-";
    const map: Record<string, string> = {
      "m3": "0-3 Bulan",
      "0-3m": "0-3 Bulan",
      "m6": "3-6 Bulan",
      "3-6m": "3-6 Bulan",
      "m12": "6-12 Bulan",
      "6-12m": "6-12 Bulan",
      "mplus": "12+ Bulan",
      "12m+": "12+ Bulan",
      "none": "Belum ada timeline"
    };
    if (map[value]) return map[value];
    const translated = t(`form.timelines.${value}`);
    if (translated && translated !== `form.timelines.${value}`) {
      return translated;
    }
    return value;
  };

  const getExportData = () => {
    if (adminMode === 'organization') {
      return filteredSubmissions.map((s, index) => ({
        No: index + 1,
        Timestamp: s.timestamp,
        'Company Name': s.companyName,
        Industry: (t(`form.industries.${s.industry}`) && t(`form.industries.${s.industry}`) !== `form.industries.${s.industry}`) ? t(`form.industries.${s.industry}`) : s.industry,
        'Company Size': getCompanySizeLabel(s.companySize),
        Location: s.location,
        'AI Objective': s.aiGoal,
        'AI Use Cases': s.aiUseCase,
        Timeline: getTimelineLabel(s.timeline),
        'PIC Name': s.fullName,
        'PIC Position': s.jobTitle,
        'PIC Email': s.email,
        'PIC Phone': s.phone || '-',
        'Overall Score': typeof s.overallScore === 'number' ? s.overallScore.toFixed(2) : '0.00',
        [translations[language]?.assessmentData?.[0]?.shortTitle || 'Strategy & Leadership']: s.scores?.strategi?.toFixed(2) || '0.00',
        [translations[language]?.assessmentData?.[1]?.shortTitle || 'Process & Workflow']: s.scores?.proses?.toFixed(2) || '0.00',
        'People & Capability': s.scores?.sdm?.toFixed(2) || '0.00',
        [translations[language]?.assessmentData?.[3]?.shortTitle || 'Data & Technology']: s.scores?.data?.toFixed(2) || '0.00',
        'Governance & Responsible AI': s.scores?.tataKelola?.toFixed(2) || '0.00',
        'Readiness Level': s.readinessLevel || '-',
        'Readiness Description': s.readinessDescription || '-'
      }));
    } else {
      // Individual export
      return filteredSubmissions.map((s, index) => ({
        No: index + 1,
        Timestamp: s.timestamp,
        'Nama Lengkap': s.fullName || '-',
        'Jabatan / Posisi': s.jobTitle || '-',
        'Perusahaan / Instansi': s.companyName || '-',
        Email: s.email || '-',
        'No. Telepon / WA': s.phone || '-',
        'Lama Pengalaman': s.experienceYears || '-',
        'Frekuensi Penggunaan AI': s.aiUsageFrequency || '-',
        'Tools AI Digunakan': s.aiToolsUsed || '-',
        'Tujuan AI': s.aiGoal || '-',
        'Aktivitas AI Sering': s.aiFrequentUse || '-',
        'Kebutuhan Belajar AI': s.aiLearningNeed || '-',
        'Target Penguasaan AI': s.aiMasteryTarget || '-',
        'Skor Keseluruhan': typeof s.overallScore === 'number' ? s.overallScore.toFixed(2) : '0.00',
        '1. AI Literacy & Mindset': s.scores?.aiLiteracy?.toFixed(2) || '0.00',
        '2. Task Framing & Prompting': s.scores?.taskFraming?.toFixed(2) || '0.00',
        '3. Workflow & Integration': s.scores?.workflow?.toFixed(2) || '0.00',
        '4. Evaluation & Judgment': s.scores?.evaluation?.toFixed(2) || '0.00',
        '5. Responsible AI & Risk': s.scores?.responsibleAi?.toFixed(2) || '0.00',
        '6. Collaboration & Growth': s.scores?.collaboration?.toFixed(2) || '0.00',
        'Tingkat Kesiapan': s.readinessLevel || '-'
      }));
    }
  };

  const handleExportCSV = () => {
    const data = getExportData();
    if (data.length === 0) {
      showToast('Tidak ada data yang sesuai untuk diekspor.');
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(worksheet);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    const filename = adminMode === 'organization' ? 'nortis_company_submissions.csv' : 'nortis_individual_submissions.csv';
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('File CSV berhasil diunduh.');
  };

  const handleExportExcel = async () => {
    const data = getExportData();
    if (data.length === 0) {
      showToast('Tidak ada data yang sesuai untuk diekspor.');
      return;
    }

    const workbook = new ExcelJS.Workbook();
    const sheetName = adminMode === 'organization' ? 'Company Submissions' : 'Individual Submissions';
    const worksheet = workbook.addWorksheet(sheetName);

    if (data.length > 0) {
      const headers = Object.keys(data[0]);
      worksheet.columns = headers.map(header => ({
        header: header,
        key: header,
        width: 22
      }));

      worksheet.addRows(data);

      worksheet.columns.forEach(column => {
        let maxLength = 0;
        column.eachCell({ includeEmpty: true }, cell => {
          const columnLength = cell.value ? cell.value.toString().length : 10;
          if (columnLength > maxLength) {
            maxLength = columnLength;
          }
        });
        column.width = maxLength < 10 ? 12 : maxLength + 3;
      });

      const headerRow = worksheet.getRow(1);
      headerRow.eachCell(cell => {
        cell.fill = {
          type: 'pattern',
          pattern: 'solid',
          fgColor: { argb: adminMode === 'organization' ? 'FF0e9f6e' : 'FF2563EB' }
        };
        cell.font = {
          color: { argb: 'FFFFFFFF' },
          bold: true
        };
        cell.alignment = { vertical: 'middle', horizontal: 'center' };
      });
      headerRow.height = 28;
    }

    const buffer = await workbook.xlsx.writeBuffer();
    const filename = adminMode === 'organization' ? 'nortis_company_submissions.xlsx' : 'nortis_individual_submissions.xlsx';
    saveAs(new Blob([buffer]), filename);
    showToast('File Excel (.xlsx) berhasil diunduh.');
  };

  const recentCount = currentDataset.filter(s => new Date(s.timestamp) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)).length;

  const activeFilterCount = (filterLevel ? 1 : 0) + 
    (adminMode === 'organization' ? (filterIndustry ? 1 : 0) : (filterExperience ? 1 : 0)) + 
    (searchQuery.trim() ? 1 : 0);

  const hasActiveFilters = Boolean(searchQuery.trim() || filterLevel || filterIndustry || filterExperience);

  const handleResetFilters = () => {
    setSearchQuery('');
    setFilterLevel('');
    setFilterIndustry('');
    setFilterExperience('');
    showToast('Filter telah direset.');
  };

  const handleDelete = (id: string, name: string) => {
    setDeleteTarget({ id, name: name || 'Data Asesmen ini' });
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const { id, name } = deleteTarget;
    setIsDeleting(true);

    // Optimistic UI update
    setSubmissions(prev => prev.filter(s => s.id !== id));
    if (selectedSubmission && selectedSubmission.id === id) {
      setSelectedSubmission(null);
    }

    try {
      await apiService.deleteSubmission(id);
      showToast(`Data asesmen "${name}" berhasil dihapus.`);
    } catch (e) {
      console.error('Error deleting submission:', e);
      showToast('Gagal menghapus data asesmen.');
      loadData();
    } finally {
      setIsDeleting(false);
      setDeleteTarget(null);
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] text-slate-900 font-sans p-4 md:px-8 md:pt-4 md:pb-8">
      <div className="max-w-[1400px] mx-auto">
        
        {/* Top Header Navbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-6 pb-5 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2.5">
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{t('admin.dashboardTitle') || 'Dashboard Admin'}</h1>
            </div>
          </div>

          {/* Segmented Navbar: Company vs Individual */}
          <div className="flex items-center bg-slate-200/70 p-1 rounded-xl shadow-inner border border-slate-200">
            <button
              onClick={() => {
                setAdminMode('organization');
                setSearchQuery('');
                setFilterLevel('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                adminMode === 'organization'
                  ? 'bg-white text-emerald-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Building2 className={`w-4 h-4 ${adminMode === 'organization' ? 'text-emerald-600' : 'text-slate-400'}`} />
              <span>{t('admin.companyDashboard') || 'Dashboard Perusahaan'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                adminMode === 'organization' ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-300 text-slate-700'
              }`}>
                {orgSubmissions.length}
              </span>
            </button>

            <button
              onClick={() => {
                setAdminMode('individual');
                setSearchQuery('');
                setFilterLevel('');
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                adminMode === 'individual'
                  ? 'bg-white text-blue-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className={`w-4 h-4 ${adminMode === 'individual' ? 'text-blue-600' : 'text-slate-400'}`} />
              <span>{t('admin.individualDashboard') || 'Dashboard Individu'}</span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                adminMode === 'individual' ? 'bg-blue-100 text-blue-800' : 'bg-slate-300 text-slate-700'
              }`}>
                {indSubmissions.length}
              </span>
            </button>
          </div>

          {/* Right Action buttons */}
          <div className="flex items-center gap-2.5">
            <button 
              onClick={onOpenCMS}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors font-medium text-sm shadow-sm"
              title="Kelola Konten Website & Asesmen"
            >
              <Globe className="w-4 h-4 text-emerald-600" />
              <span>{t('admin.manageContent') || 'Manage Content (CMS)'}</span>
            </button>
            <button 
              onClick={onLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 rounded-lg transition-colors font-medium text-sm shadow-sm"
            >
              <LogOut className="w-3.5 h-3.5 text-slate-400" />
              <span>{t("admin.logout") || 'Keluar'}</span>
            </button>
          </div>
        </div>

        {/* Dashboard Title & Mode Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
          <div>
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              {adminMode === 'organization' ? (
                <>
                  <Building2 className="w-5 h-5 text-emerald-600" />
                  <span>{t('admin.orgHistoryTitle') || 'Riwayat Asesmen Kesiapan AI Organisasi'}</span>
                </>
              ) : (
                <>
                  <UserCheck className="w-5 h-5 text-blue-600" />
                  <span>{t('admin.indHistoryTitle') || 'Riwayat Asesmen Kesiapan AI Individu & Profesional'}</span>
                </>
              )}
            </h2>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Total Submissions */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-start">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${adminMode === 'organization' ? 'bg-emerald-100' : 'bg-blue-100'}`}>
                {adminMode === 'organization' ? (
                  <Users className="w-6 h-6 text-emerald-600" />
                ) : (
                  <UserCheck className="w-6 h-6 text-blue-600" />
                )}
              </div>
              <span className="text-[28px] font-bold leading-none text-slate-800">{currentDataset.length}</span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-slate-600 mb-1.5">
                {adminMode === 'organization' 
                  ? (t('admin.totalOrgSubmissions') || 'Total Asesmen Organisasi')
                  : (t('admin.totalIndSubmissions') || 'Total Asesmen Individu')}
              </p>
              <div className={`flex items-center gap-1.5 text-[13px] font-semibold ${adminMode === 'organization' ? 'text-emerald-600' : 'text-blue-600'}`}>
                <ArrowUpRight className="w-4 h-4" />
                <span>{recentCount} {t('admin.last7Days') || '7 hari terakhir'}</span>
              </div>
            </div>
          </div>

          {/* Card 2: Avg Score */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-purple-100 flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-[#8b5cf6]" />
              </div>
              <span className="text-[28px] font-bold leading-none text-slate-800">
                {currentDataset.length > 0 
                  ? (currentDataset.reduce((a, b) => a + b.overallScore, 0) / currentDataset.length).toFixed(1) 
                  : "0.0"}
              </span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-slate-600 mb-1.5">{t('admin.avgScore') || 'Rata-rata Skor Kesiapan'}</p>
              <p className="text-[13px] text-slate-400">{t('admin.outOf5') || 'Skala 0.0 - 5.0'}</p>
            </div>
          </div>

          {/* Card 3: Specific metric */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-blue-100 flex items-center justify-center">
                {adminMode === 'organization' ? (
                  <Building2 className="w-6 h-6 text-[#3b82f6]" />
                ) : (
                  <Briefcase className="w-6 h-6 text-[#3b82f6]" />
                )}
              </div>
              <span className="text-[28px] font-bold leading-none text-slate-800">
                {adminMode === 'organization'
                  ? new Set(orgSubmissions.map(s => s.industry).filter(Boolean)).size
                  : new Set(indSubmissions.map(s => s.jobTitle).filter(Boolean)).size}
              </span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-slate-600 mb-1.5">
                {adminMode === 'organization' 
                  ? (t('admin.industries') || 'Sektor Industri')
                  : (t('admin.jobRoles') || 'Ragam Jabatan & Peran')}
              </p>
              <p className="text-[13px] text-slate-400">
                {adminMode === 'organization' 
                  ? (t('admin.differentSectors') || 'Kategori industri unik')
                  : (t('admin.uniqueProfessions') || 'Profesi unik terdaftar')}
              </p>
            </div>
          </div>

          {/* Card 4: AI Mature */}
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-sm flex flex-col justify-between h-[150px]">
            <div className="flex justify-between items-start">
              <div className="w-12 h-12 rounded-xl bg-orange-100 flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-[#f97316]" />
              </div>
              <span className="text-[28px] font-bold leading-none text-slate-800">
                {currentDataset.filter(s => s.overallScore >= 3.6).length}
              </span>
            </div>
            <div>
              <p className="text-[14px] font-medium text-slate-600 mb-1.5">
                {adminMode === 'organization' 
                  ? (t('admin.aiMatureOrgs') || 'Organisasi AI-Mature')
                  : (t('admin.aiMatureInds') || 'Praktisi AI-Mature')}
              </p>
              <p className="text-[13px] text-slate-400">{t('admin.topPerformers') || 'Skor tinggi (≥ 3.6)'}</p>
            </div>
          </div>
        </div>

        {/* Toolbar & Filter Bar */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col mt-4">
          <div className="p-3 flex flex-col sm:flex-row gap-3 items-center">
            <div className="relative flex-1 w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-4 h-4" />
              <input 
                type="text" 
                placeholder={
                  adminMode === 'organization'
                    ? (t('admin.searchPlaceholderOrg') || 'Cari perusahaan, nama PIC, email, phone, atau industri...')
                    : (t('admin.searchPlaceholderInd') || 'Cari nama, email, phone, jabatan, perusahaan, atau tools AI...')
                } 
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-9 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors text-sm placeholder:text-slate-400"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full hover:bg-slate-100 transition-colors"
                  title="Hapus pencarian"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
              <button 
                onClick={() => setShowFilters(!showFilters)}
                className={`flex items-center justify-between gap-2 px-3.5 py-2 border rounded-lg transition-colors font-medium text-sm flex-1 sm:flex-none min-w-[100px] ${
                  showFilters || activeFilterCount > 0 ? 'bg-slate-50 border-slate-300 text-slate-800' : 'border-slate-300 hover:bg-slate-50 text-slate-800'
                }`}
              >
                <div className="flex items-center gap-2">
                  <Filter className="w-4 h-4" />
                  <span>{t('admin.filters') || 'Filter Data'}</span>
                  {activeFilterCount > 0 && (
                    <span className="w-5 h-5 rounded-full bg-emerald-600 text-white text-[11px] font-bold flex items-center justify-center">
                      {activeFilterCount}
                    </span>
                  )}
                </div>
                {showFilters ? <ChevronUp className="w-3.5 h-3.5 text-slate-500" /> : <ChevronDown className="w-3.5 h-3.5 text-slate-500" />}
              </button>

              {hasActiveFilters && (
                <button
                  onClick={handleResetFilters}
                  className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg border border-red-200 transition-colors"
                  title="Reset semua filter dan pencarian"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Reset</span>
                </button>
              )}

              <button 
                onClick={() => loadData(true)} 
                disabled={isRefreshing}
                className="flex items-center justify-center p-2 border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors text-slate-800 flex-1 sm:flex-none disabled:opacity-50"
                title="Refresh Data Terbaru"
              >
                <RefreshCcw className={`w-4 h-4 ${isRefreshing ? 'animate-spin text-emerald-600' : ''}`} />
              </button>
            </div>
          </div>
          
          {/* Expanded Filters */}
          {showFilters && (
            <div className="p-4 border-t border-slate-100 flex flex-col sm:flex-row gap-5 bg-slate-50/50">
              <div className="flex-1 relative">
                <label className="block text-xs font-medium text-slate-700 mb-1.5">{t('admin.readinessLevel') || 'Tingkat Kesiapan AI'}</label>
                <select 
                  value={filterLevel} 
                  onChange={(e) => setFilterLevel(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors text-sm appearance-none"
                >
                  <option value="">{t('admin.allLevels') || 'Semua Tingkat Kesiapan'}</option>
                  <option value="AI-Unready">{t('admin.levelUnready') || 'AI-Unready'}</option>
                  <option value="AI-Aware">{t('admin.levelAware') || 'AI-Aware'}</option>
                  <option value="AI-Ready">{t('admin.levelReady') || 'AI-Ready'}</option>
                  <option value="AI-Enabled">{t('admin.levelEnabled') || 'AI-Enabled'}</option>
                  <option value="AI-Mature">{t('admin.levelMature') || 'AI-Mature'}</option>
                </select>
                <ChevronDown className="absolute right-3.5 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
              </div>

              {adminMode === 'organization' ? (
                <div className="flex-1 relative">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">{t('admin.industryLabel') || 'Sektor Industri'}</label>
                  <select 
                    value={filterIndustry} 
                    onChange={(e) => setFilterIndustry(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-emerald-500/50 focus:border-emerald-500 transition-colors text-sm appearance-none"
                  >
                    <option value="">{t('admin.allIndustries') || 'Semua Industri'}</option>
                    {Object.entries(translations[language].form.industries || {}).map(([key, label]) => (
                      <option key={key} value={key}>{label as string}</option>
                    ))}
                  </select>
                  <ChevronDown className="absolute right-3.5 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              ) : (
                <div className="flex-1 relative">
                  <label className="block text-xs font-medium text-slate-700 mb-1.5">{t('admin.experienceLabel') || 'Lama Pengalaman Kerja'}</label>
                  <select 
                    value={filterExperience} 
                    onChange={(e) => setFilterExperience(e.target.value)}
                    className="w-full px-3.5 py-2 bg-white border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500/50 focus:border-blue-500 transition-colors text-sm appearance-none"
                  >
                    <option value="">{t('admin.allExperience') || 'Semua Pengalaman'}</option>
                    <option value="< 1 tahun">{t('admin.expUnder1') || '< 1 tahun'}</option>
                    <option value="1-3 tahun">{t('admin.exp1to3') || '1 - 3 tahun'}</option>
                    <option value="3-5 tahun">{t('admin.exp3to5') || '3 - 5 tahun'}</option>
                    <option value="> 5 tahun">{t('admin.expOver5') || '> 5 tahun'}</option>
                  </select>
                  <ChevronDown className="absolute right-3.5 bottom-2.5 w-4 h-4 text-slate-500 pointer-events-none" />
                </div>
              )}
            </div>
          )}
        </div>

        {/* Submissions List Area */}
        <div className="space-y-4 pt-3">
          <p className="text-sm text-slate-700">
            {t('admin.showing') || 'Menampilkan'} <span className="font-medium">{filteredSubmissions.length}</span> {t('admin.of') || 'dari'} <span className="font-medium">{currentDataset.length}</span> {adminMode === 'organization' ? (t('admin.companySubmissionsText') || 'asesmen perusahaan') : (t('admin.individualSubmissionsText') || 'asesmen individu')}
          </p>
          
          {filteredSubmissions.length === 0 ? (
            <div className="border border-slate-200 rounded-xl p-12 flex flex-col items-center justify-center text-center bg-white min-h-[300px]">
              <Users className="w-10 h-10 text-slate-300 mb-4 stroke-[1.5]" />
              <h3 className="text-lg font-medium text-slate-900 mb-2">{t('admin.noSubmissions') || 'Belum ada riwayat asesmen'}</h3>
              <p className="text-sm text-slate-500">
                {adminMode === 'organization' 
                  ? (t('admin.noSubmissionsOrgDesc') || 'Belum ada perusahaan yang mengisi asesmen kesiapan AI.') 
                  : (t('admin.noSubmissionsIndDesc') || 'Belum ada individu yang mengisi asesmen kesiapan AI profesional.')}
              </p>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                {adminMode === 'organization' ? (
                  /* Organization Table */
                  <table className="w-full text-left border-collapse table-fixed min-w-[850px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="p-4 whitespace-nowrap w-[5%] text-center">{t('admin.thNo') || 'No.'}</th>
                        <th className="p-4 whitespace-nowrap w-[20%]">{t('admin.thCompanyLocation') || 'Perusahaan & Lokasi'}</th>
                        <th className="p-4 whitespace-nowrap w-[20%]">{t('admin.thPicContact') || 'PIC & Kontak'}</th>
                        <th className="p-4 whitespace-nowrap w-[15%]">{t('admin.thIndustry') || 'Industri'}</th>
                        <th className="p-4 whitespace-nowrap w-[10%] text-center">{t('admin.thScore') || 'Skor'}</th>
                        <th className="p-4 whitespace-nowrap w-[12%]">{t('admin.thLevel') || 'Level'}</th>
                        <th className="p-4 whitespace-nowrap w-[8%]">{t('admin.thDate') || 'Tanggal'}</th>
                        <th className="p-4 whitespace-nowrap w-[10%] text-center">{t('admin.thActions') || 'Aksi'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredSubmissions.map((sub, index) => (
                        <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-center text-slate-500 font-medium">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-900 truncate pr-2">{sub.companyName}</div>
                            <div className="text-slate-500 text-xs truncate pr-2">{sub.location || '-'}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-800 truncate pr-2">{sub.fullName}</div>
                            <div className="text-slate-500 text-xs truncate pr-2">{sub.email}</div>
                            <div className="text-slate-400 text-[11px] truncate pr-2 mt-0.5">{sub.phone || '-'}</div>
                          </td>
                          <td className="p-4 text-slate-600 truncate pr-2" title={t(`form.industries.${sub.industry}`) || sub.industry}>
                            {t(`form.industries.${sub.industry}`) || sub.industry || '-'}
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 font-bold border border-emerald-200">
                              {sub.overallScore.toFixed(1)}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                              {sub.readinessLevel}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 text-xs">
                            {new Date(sub.timestamp).toLocaleDateString('id-ID')}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedSubmission(sub)}
                                className="p-2 text-emerald-600 hover:text-emerald-700 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors border border-emerald-200"
                                title="Lihat Detail Asesmen"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(sub.id, sub.companyName || sub.fullName)}
                                className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                title="Hapus Data Asesmen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  /* Individual Table */
                  <table className="w-full text-left border-collapse table-fixed min-w-[850px]">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase tracking-wider">
                        <th className="p-4 whitespace-nowrap w-[5%] text-center">{t('admin.thNo') || 'No.'}</th>
                        <th className="p-4 whitespace-nowrap w-[20%]">{t('admin.thNameContact') || 'Nama & Kontak'}</th>
                        <th className="p-4 whitespace-nowrap w-[20%]">{t('admin.thRoleCompany') || 'Jabatan & Instansi'}</th>
                        <th className="p-4 whitespace-nowrap w-[17%]">{t('admin.thExpTools') || 'Pengalaman & AI Tools'}</th>
                        <th className="p-4 whitespace-nowrap w-[10%] text-center">{t('admin.thScore') || 'Skor'}</th>
                        <th className="p-4 whitespace-nowrap w-[10%]">{t('admin.thLevel') || 'Level'}</th>
                        <th className="p-4 whitespace-nowrap w-[8%]">{t('admin.thDate') || 'Tanggal'}</th>
                        <th className="p-4 whitespace-nowrap w-[10%] text-center">{t('admin.thActions') || 'Aksi'}</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredSubmissions.map((sub, index) => (
                        <tr key={sub.id} className="hover:bg-slate-50/50 transition-colors">
                          <td className="p-4 text-center text-slate-500 font-medium">
                            {index + 1}
                          </td>
                          <td className="p-4">
                            <div className="font-semibold text-slate-900 truncate pr-2">{sub.fullName}</div>
                            <div className="text-slate-500 text-xs truncate pr-2">{sub.email}</div>
                            <div className="text-slate-400 text-[11px] truncate pr-2 mt-0.5">{sub.phone || '-'}</div>
                          </td>
                          <td className="p-4">
                            <div className="font-medium text-slate-800 truncate pr-2">{sub.jobTitle || 'Profesional'}</div>
                            <div className="text-slate-500 text-xs truncate pr-2">{sub.companyName || '-'}</div>
                          </td>
                          <td className="p-4">
                            <div className="text-xs font-semibold text-slate-700 truncate pr-2">
                              {sub.experienceYears ? `Pengalaman: ${sub.experienceYears}` : '-'}
                            </div>
                            <div className="text-slate-500 text-[11px] truncate pr-2 mt-0.5" title={sub.aiToolsUsed || sub.aiUsageFrequency}>
                              {sub.aiToolsUsed || sub.aiUsageFrequency || '-'}
                            </div>
                          </td>
                          <td className="p-4 text-center">
                            <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 font-bold border border-blue-200">
                              {sub.overallScore.toFixed(1)}
                            </div>
                          </td>
                          <td className="p-4">
                            <span className="inline-block px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-800 border border-slate-200">
                              {sub.readinessLevel}
                            </span>
                          </td>
                          <td className="p-4 text-slate-500 text-xs">
                            {new Date(sub.timestamp).toLocaleDateString('id-ID')}
                          </td>
                          <td className="p-4 text-center">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                onClick={() => setSelectedSubmission(sub)}
                                className="p-2 text-blue-600 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                                title="Lihat Detail Asesmen"
                              >
                                <Eye className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDelete(sub.id, sub.fullName)}
                                className="p-2 text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
                                title="Hapus Data Asesmen"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-2xl border border-slate-200 p-6 animate-in zoom-in-95 duration-150">
            <div className="flex items-start gap-4">
              <div className="p-3 bg-red-100 text-red-600 rounded-xl shrink-0">
                <Trash2 className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-bold text-slate-900 mb-1">
                  Hapus Data Asesmen?
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed mb-5">
                  Apakah Anda yakin ingin menghapus data asesmen untuk{' '}
                  <span className="font-semibold text-slate-900">"{deleteTarget.name}"</span>? 
                  Data yang dihapus tidak dapat dipulihkan kembali.
                </p>
                <div className="flex items-center justify-end gap-2.5">
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={() => setDeleteTarget(null)}
                    className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    disabled={isDeleting}
                    onClick={handleConfirmDelete}
                    className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-lg shadow-sm transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>{isDeleting ? 'Menghapus...' : 'Ya, Hapus Data'}</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-sm animate-in fade-in slide-in-from-bottom-3 duration-200 border border-slate-700">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Submission Detail Modal */}
      {selectedSubmission && (
        <SubmissionDetailModal 
          submission={selectedSubmission} 
          onClose={() => setSelectedSubmission(null)} 
          onDelete={handleDelete}
        />
      )}
    </div>
  );
}
