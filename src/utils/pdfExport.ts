import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentSubmission } from '../types';
import { getRecommendation, getRecommendationKey } from './recommendations';
import { exportToIndividualPDF } from './individualPdfExport';

const companySizes: Record<string, string> = {
  s50: '1-50 karyawan',
  s200: '51-200 karyawan',
  s500: '201-500 karyawan',
  s1000: '501-1000 karyawan',
  splus: '1000+ karyawan'
};

const industries: Record<string, string> = {
  finance: 'Perbankan & Keuangan',
  it: 'Teknologi & IT',
  manufacturing: 'Manufaktur',
  retail: 'Retail & E-commerce',
  healthcare: 'Healthcare & Farmasi',
  education: 'Pendidikan & Edukasi',
  telecom: 'Telekomunikasi',
  energy: 'Energi & Sumber Daya',
  logistics: 'Transportasi & Logistik',
  other: 'Lainnya'
};

// Safe text cleaner to prevent mojibake/broken characters in jsPDF
const sanitize = (text?: string): string => {
  if (!text) return '';
  return text
    .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F1E0}-\u{1F1FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{1F900}-\u{1F9FF}\u{1F018}-\u{1F270}\u{2B50}\u{2B55}\u{FE0F}]/gu, '')
    .replace(/[^\x20-\x7E\u00A0-\u00FF\n\r\t]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

const getLevelBadgeColors = (score: number) => {
  if (score >= 4.5) return { bg: [236, 253, 245], text: [4, 120, 87], border: [16, 185, 129] }; // Mature - Emerald
  if (score >= 3.5) return { bg: [240, 253, 244], text: [22, 101, 52], border: [34, 197, 94] }; // Enabled - Green
  if (score >= 2.5) return { bg: [239, 246, 255], text: [29, 78, 216], border: [59, 130, 246] }; // Ready - Blue
  if (score >= 1.5) return { bg: [254, 243, 199], text: [180, 83, 9], border: [245, 158, 11] }; // Aware - Amber
  return { bg: [255, 241, 242], text: [190, 18, 60], border: [244, 63, 94] }; // Unready - Rose
};

const getOrgPillarStatus = (score: number) => {
  if (score >= 4.2) return 'Matang';
  if (score >= 3.4) return 'Siap';
  if (score >= 2.4) return 'Mengembangkan';
  if (score >= 1.5) return 'Terbatas';
  return 'Awal';
};

const getOrgStrengthInsight = (key: string) => {
  switch (key) {
    case 'strategi':
      return "Komitmen kepemimpinan eksekutif dan arah strategi adopsi AI sudah terarah untuk mendukung efisiensi bisnis.";
    case 'proses':
      return "Proses operasional dan alur kerja utama sudah terdokumentasi dan siap untuk otomatisasi berbasis AI.";
    case 'sdm':
      return "Tim internal memiliki antusiasme dan literasi digital dasar yang baik untuk menerima inovasi AI.";
    case 'data':
      return "Fondasi infrastruktur data dan akses sistem informasi sudah siap terhubung dengan layanan API AI modern.";
    case 'tataKelola':
      return "Organisasi sudah memiliki kepedulian terhadap keamanan data internal dan privasi informasi bisnis.";
    default:
      return "Pilar ini menunjukkan stabilitas yang baik untuk mendukung akselerasi transformasi AI.";
  }
};

const getOrgGrowthInsight = (key: string) => {
  switch (key) {
    case 'strategi':
      return "Perlu memperjelas alokasi anggaran khusus AI dan menyelaraskan KPI antar unit bisnis.";
    case 'proses':
      return "Perlu memetakan titik-titik inefisiensi manual dan menyusun alur kerja terstandar sebelum adopsi alat AI.";
    case 'sdm':
      return "Perlu menyelenggarakan pelatihan terstruktur untuk meningkatkan kemampuan prompt engineering dan keterampilan teknis AI.";
    case 'data':
      return "Perlu merapikan tata kelola katalog data terpusat, pembersihan data, dan jaminan interoperabilitas sistem.";
    case 'tataKelola':
      return "Perlu menyusun kebijakan tertulis (AI Policy), pedoman etika penggunaan AI, dan kerangka mitigasi risiko.";
    default:
      return "Pilar ini memerlukan perhatian lebih untuk meningkatkan kesiapan organisasi secara menyeluruh.";
  }
};

const loadLogoImage = (): Promise<HTMLImageElement | null> => {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') {
      resolve(null);
      return;
    }
    const img = new Image();
    img.crossOrigin = 'Anonymous';
    img.onload = () => resolve(img);
    img.onerror = () => resolve(null);
    img.src = '/LogoNortis.png';
  });
};

export const exportToPDF = async (
  submission: AssessmentSubmission, 
  recTexts?: any,
  language: string = 'ID',
  fullTranslations?: any
) => {
  const isIndividual = submission.assessmentType === 'individual';
  if (isIndividual) {
    await exportToIndividualPDF(submission, recTexts, language, fullTranslations);
    return;
  }

  const logoImg = await loadLogoImage();

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  const marginLeft = 18;
  const marginRight = 18;
  const contentWidth = pageWidth - marginLeft - marginRight;
  let currentY = 26;

  // Clean, professional soft palette
  const colorDark = [15, 23, 42];      // #0F172A
  const colorMuted = [100, 116, 139];  // #64748B
  const colorBody = [51, 65, 85];      // #334155
  const colorBorder = [226, 232, 240]; // #E2E8F0
  const colorBgLight = [248, 250, 252];// #F8FAFC
  const brandEmerald = [16, 185, 129]; // #10B981 Soft Emerald
  const brandDark = [6, 95, 70];       // #065F46 Soft Dark Emerald

  const overallScore = submission.overallScore || 0;
  const readinessLevel = submission.readinessLevel || 'AI-Ready';
  const badgeColors = getLevelBadgeColors(overallScore);
  const levelKey = getRecommendationKey(overallScore);

  // Exact recommendation object matching the web result
  const defaultRec = recTexts?.[levelKey] || getRecommendation(overallScore, recTexts);
  const recTitle = sanitize(defaultRec.title || 'Implementation Pilot');
  const recExecutiveSummary = sanitize(defaultRec.executiveSummary || defaultRec.desc || '');
  const recDesc = sanitize(defaultRec.desc || defaultRec.executiveSummary || '');

  // Exact dynamic programs configured in CMS for that level
  let nortisPrograms: any[] = [];
  try {
    const levelPrograms = fullTranslations?.result?.nortisProgramsByLevel?.[levelKey];
    if (Array.isArray(levelPrograms)) {
      nortisPrograms = levelPrograms;
    } else if (Array.isArray(fullTranslations?.result?.nortisPrograms)) {
      nortisPrograms = fullTranslations.result.nortisPrograms;
    } else {
      const saved = localStorage.getItem('nortis_translations');
      if (saved) {
        const parsed = JSON.parse(saved);
        const transObj = parsed?.[language] || parsed?.ID;
        const storedLevelProgs = transObj?.result?.nortisProgramsByLevel?.[levelKey];
        if (Array.isArray(storedLevelProgs)) {
          nortisPrograms = storedLevelProgs;
        } else if (Array.isArray(transObj?.result?.nortisPrograms)) {
          nortisPrograms = transObj.result.nortisPrograms;
        }
      }
    }
  } catch {
    nortisPrograms = [];
  }

  // 5 Strategic Pillars
  const pillarNames: Record<string, string> = {
    strategi: "Strategi & Kepemimpinan",
    proses: "Proses & Alur Kerja",
    sdm: "SDM & Kapabilitas",
    data: "Data & Arsitektur Teknologi",
    tataKelola: "Tata Kelola & AI Bertanggung Jawab"
  };

  const scores = submission.scores || { strategi: 0, proses: 0, sdm: 0, data: 0, tataKelola: 0 };
  const pillars = Object.keys(pillarNames).map((key) => {
    const score = scores[key as keyof typeof scores] || 0;
    return {
      id: key,
      name: pillarNames[key],
      score: score,
      status: getOrgPillarStatus(score)
    };
  });

  const sortedPillars = [...pillars].sort((a, b) => b.score - a.score);
  const strongest = sortedPillars.filter(p => p.score >= 3.0);
  const weakest = sortedPillars.filter(p => p.score < 3.0).sort((a, b) => a.score - b.score);

  // Perspective Texts
  const whatsWorkingText = sanitize(
    defaultRec?.quickWins?.join(' ') || 
    defaultRec?.executiveSummary || 
    'Pondasi strategi dan komitmen pimpinan organisasi sudah terbentuk baik.'
  );

  const whatsAtRiskText = sanitize(
    defaultRec?.risikoUtama?.join(' ') || 
    'Risiko utama meliputi keterbatasan tata kelola data, keamanan informasi, dan akselerasi kapabilitas tim.'
  );

  const focusNextText = sanitize(
    defaultRec?.rekomendasiPrioritas?.join(' ') || 
    defaultRec?.desc || 
    'Fokus pada eksekusi pilot project pada use case prioritas terukur.'
  );

  // Action Plan Phases (Plan Kedepannya)
  const phase1ActionsList: string[] = (defaultRec?.actionPlanPhase1 && defaultRec.actionPlanPhase1.length > 0)
    ? defaultRec.actionPlanPhase1
    : (defaultRec?.quickWins && defaultRec.quickWins.length > 0 ? defaultRec.quickWins.slice(0, 3) : [
        'Menyelenggarakan workshop literasi AI & penyusunan panduan penggunaan aman bagi tim.',
        'Memilih 1-2 pilot use case berdampak tinggi dengan siklus eksekusi cepat 4-6 minggu.',
        'Membentuk AI Task Force gabungan antara unit bisnis dan tim teknis IT.'
      ]);

  const phase2ActionsList: string[] = (defaultRec?.actionPlanPhase2 && defaultRec.actionPlanPhase2.length > 0)
    ? defaultRec.actionPlanPhase2
    : (defaultRec?.rekomendasiPrioritas && defaultRec.rekomendasiPrioritas.length > 0 ? defaultRec.rekomendasiPrioritas.slice(0, 3) : [
        'Mengeksekusi pilot project pada use case prioritas serta mengukur metrik ROI.',
        'Membangun fondasi data terpusat dan menetapkan tata kelola privasi data organisasi.',
        'Mengadakan pelatihan hands-on implementasi AI bagi tim pengembang dan analis.'
      ]);

  const phase3ActionsList: string[] = (defaultRec?.actionPlanPhase3 && defaultRec.actionPlanPhase3.length > 0)
    ? defaultRec.actionPlanPhase3
    : [
        'Mereplikasi solusi AI yang sukses ke divisi/unit bisnis pendukung lainnya.',
        'Menerapkan otomasi pipeline MLOps untuk pemantauan performa model secara kontinu.',
        'Membentuk AI Center of Excellence (CoE) dan merancang roadmap inovasi jangka panjang.'
      ];

  // Header & Footer helper
  const addHeaderAndFooter = (doc: jsPDF, pageNum: number, total: number) => {
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.setLineWidth(0.3);
    doc.line(marginLeft, 13, pageWidth - marginRight, 13);
    
    if (logoImg) {
      doc.addImage(logoImg, 'PNG', marginLeft, 4.8, 17.5, 6);
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
      doc.text('•  Organization AI Readiness & Strategic Report', marginLeft + 19.5, 9.2);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(brandEmerald[0], brandEmerald[1], brandEmerald[2]);
      doc.text('NORTIS', marginLeft, 9.2);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
      doc.text('•  Organization AI Readiness & Strategic Report', marginLeft + 16, 9.2);
    }

    const dateStr = new Date(submission.timestamp || Date.now()).toLocaleDateString(language === 'EN' ? 'en-US' : 'id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
    doc.text(dateStr, pageWidth - marginRight, 9.2, { align: 'right' });

    const footerY = pageHeight - 10.5;
    doc.line(marginLeft, footerY - 3.5, pageWidth - marginRight, footerY - 3.5);
    doc.setFontSize(7.5);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text('NORTIS - AI Readiness Assessment (Organisasi)', marginLeft, footerY);
    doc.text(`Halaman ${pageNum} dari ${total}`, pageWidth - marginRight, footerY, { align: 'right' });
  };

  // =========================================================================
  // PAGE 1: DOCUMENT TITLE, COMPANY INFO, SCORE HERO & 5 PILLARS BREAKDOWN
  // =========================================================================

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text(language === 'EN' ? 'ORGANIZATION AI READINESS REPORT' : 'LAPORAN KESIAPAN AI ORGANISASI', marginLeft, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
  doc.text(language === 'EN' ? 'Organizational AI Maturity Evaluation, 5 Pillar Benchmark & 90-Day Roadmap' : 'Evaluasi Kematangan AI Organisasi, Benchmark 5 Pilar, dan Peta Jalan Adopsi 90 Hari', marginLeft, currentY + 9);

  currentY += 15;

  // 1. Company & PIC Info Card
  doc.setFillColor(colorBgLight[0], colorBgLight[1], colorBgLight[2]);
  doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, currentY, contentWidth, 32, 2, 2, 'FD');

  const halfWidth = contentWidth / 2;
  let infoY = currentY + 6.5;

  const renderInfoItem = (x: number, y: number, label: string, val: string, labelW: number = 22) => {
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text(label, x, y);

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8);
    doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
    const maxValW = halfWidth - labelW - 4;
    const truncated = doc.splitTextToSize(sanitize(val) || '-', maxValW)[0] || '-';
    doc.text(truncated, x + labelW, y);
  };

  const industryName = industries[submission.industry] || submission.industry;
  const companySizeName = companySizes[submission.companySize] || submission.companySize;

  renderInfoItem(marginLeft + 4, infoY, 'Perusahaan:', submission.companyName || '-', 20);
  renderInfoItem(marginLeft + halfWidth + 2, infoY, 'Industri:', industryName || '-', 18);

  infoY += 6.5;
  renderInfoItem(marginLeft + 4, infoY, 'Ukuran:', companySizeName || '-', 20);
  renderInfoItem(marginLeft + halfWidth + 2, infoY, 'Lokasi:', submission.location || 'Malang', 18);

  infoY += 6.5;
  renderInfoItem(marginLeft + 4, infoY, 'PIC & Posisi:', `${submission.fullName || '-'} (${submission.jobTitle || '-'})`, 22);
  renderInfoItem(marginLeft + halfWidth + 2, infoY, 'Email & Tgl:', `${submission.email || '-'} | ${new Date(submission.timestamp || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' })}`, 22);

  currentY += 37;

  // 2. Score Hero Card
  doc.setFillColor(255, 255, 255);
  doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
  doc.setLineWidth(0.4);
  doc.roundedRect(marginLeft, currentY, contentWidth, 42, 2, 2, 'FD');

  // Left accent line
  doc.setFillColor(brandEmerald[0], brandEmerald[1], brandEmerald[2]);
  doc.roundedRect(marginLeft, currentY, 3, 42, 1, 1, 'F');

  const scoreBoxW = 42;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
  doc.text('SKOR KESIAPAN', marginLeft + 6 + (scoreBoxW / 2), currentY + 10, { align: 'center' });

  doc.setFontSize(26);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text(overallScore.toFixed(2), marginLeft + 6 + (scoreBoxW / 2), currentY + 23, { align: 'center' });

  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
  doc.text('dari skala 5.00', marginLeft + 6 + (scoreBoxW / 2), currentY + 32, { align: 'center' });

  // Divider line
  doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
  doc.setLineWidth(0.3);
  doc.line(marginLeft + scoreBoxW + 8, currentY + 6, marginLeft + scoreBoxW + 8, currentY + 36);

  // Right Side: Level Badge & Executive Summary
  const descX = marginLeft + scoreBoxW + 14;
  const descW = contentWidth - scoreBoxW - 18;

  // Level Badge
  doc.setFillColor(badgeColors.bg[0], badgeColors.bg[1], badgeColors.bg[2]);
  doc.setDrawColor(badgeColors.border[0], badgeColors.border[1], badgeColors.border[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(descX, currentY + 5, 34, 6, 1.2, 1.2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(badgeColors.text[0], badgeColors.text[1], badgeColors.text[2]);
  doc.text(readinessLevel, descX + 17, currentY + 9.2, { align: 'center' });

  // Recommendation Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  const titleLines = doc.splitTextToSize(recTitle, descW);
  doc.text(titleLines.slice(0, 2), descX, currentY + 16);

  // Executive Summary Quote
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
  const splitSummary = doc.splitTextToSize(`"${recDesc}"`, descW);
  const quoteY = currentY + 16 + (Math.min(titleLines.length, 2) * 4.2) + 1;
  doc.text(splitSummary.slice(0, 2), descX, quoteY);

  currentY += 48;

  // 3. 5 Strategic Pillars Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text('EVALUASI 5 PILAR KESIAPAN AI ORGANISASI', marginLeft, currentY);
  currentY += 4;

  const pillarTableData = pillars.map(p => [
    p.name,
    p.score.toFixed(2),
    `${((p.score / 5) * 100).toFixed(0)}%`,
    p.status
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginLeft, right: marginRight },
    head: [['Pilar Strategis Organisasi', 'Skor (0-5)', 'Persentase', 'Tingkat Kematangan']],
    body: pillarTableData,
    theme: 'grid',
    headStyles: {
      fillColor: [240, 253, 244],
      textColor: [6, 95, 70],
      fontStyle: 'bold',
      fontSize: 8.5,
      cellPadding: 2.2
    },
    styles: {
      font: 'helvetica',
      fontSize: 8,
      textColor: [51, 65, 85],
      cellPadding: 2.0,
      lineColor: [226, 232, 240],
      lineWidth: 0.2
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    columnStyles: {
      0: { cellWidth: 72, fontStyle: 'bold', textColor: [15, 23, 42] },
      1: { cellWidth: 24, halign: 'center', fontStyle: 'bold', textColor: [16, 185, 129] },
      2: { cellWidth: 24, halign: 'center' },
      3: { cellWidth: 'auto', fontStyle: 'normal' }
    }
  });

  currentY = (doc as any).lastAutoTable.finalY + 6;

  // 3b. Grafik Skor Pilar Strategis Organisasi
  const renderScoreBars = () => {
    const chartTitle = 'GRAFIK KESIAPAN PILAR STRATEGIS ORGANISASI';
    const rowH = 9.5;
    const headerH = 8.5;
    const totalChartH = headerH + (pillars.length * rowH) + 3.0;

    if (currentY + totalChartH > pageHeight - 22) {
      doc.addPage();
      currentY = 26;
    }

    // Container Card
    doc.setFillColor(250, 252, 253);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, currentY, contentWidth, totalChartH, 1.2, 1.2, 'FD');

    // Header Inside Card
    doc.setFillColor(241, 245, 249);
    doc.roundedRect(marginLeft, currentY, contentWidth, headerH, 1.2, 1.2, 'F');
    doc.rect(marginLeft, currentY + headerH - 1.5, contentWidth, 1.5, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(15, 23, 42);
    doc.text(chartTitle, marginLeft + 5, currentY + 5.5);

    let itemY = currentY + headerH + 2.5;

    pillars.forEach(p => {
      // Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(p.name, marginLeft + 5, itemY + 2.8);

      // Score Text
      const scoreText = `${p.score.toFixed(1)} / 5.0 (${((p.score / 5) * 100).toFixed(0)}%)`;
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(51, 65, 85);
      doc.text(scoreText, marginLeft + contentWidth - 5, itemY + 2.8, { align: 'right' });

      // Bar Track
      const barY = itemY + 4.5;
      const barH = 2.8;
      const trackW = contentWidth - 10;
      const trackX = marginLeft + 5;

      doc.setFillColor(226, 232, 240);
      doc.roundedRect(trackX, barY, trackW, barH, 0.8, 0.8, 'F');

      // Bar Fill
      const fillRatio = Math.min(1, Math.max(0, p.score / 5.0));
      const fillW = Math.max(2.5, trackW * fillRatio);

      let barColor = [16, 185, 129];
      if (p.score < 1.5) barColor = [244, 63, 94];
      else if (p.score < 2.5) barColor = [245, 158, 11];
      else if (p.score < 3.5) barColor = [59, 130, 246];

      doc.setFillColor(barColor[0], barColor[1], barColor[2]);
      doc.roundedRect(trackX, barY, fillW, barH, 0.8, 0.8, 'F');

      itemY += rowH;
    });

    currentY += totalChartH + 3.5;
  };

  renderScoreBars();

  // Force Ringkasan Eksekutif to start on a fresh new page
  doc.addPage();
  currentY = 26;

  // 4. Analisis Kesiapan: Ringkasan Eksekutif, What's Working, What's at Risk, Hambatan Organisasi
  const renderPerspectiveCard = (title: string, textOrItems: string | string[], accentColor: number[], textHeadColor: number[]) => {
    const isArray = Array.isArray(textOrItems);
    let totalLines = 0;
    let preparedLines: string[][] = [];

    if (isArray) {
      preparedLines = (textOrItems as string[]).map(item => doc.splitTextToSize(sanitize(item), contentWidth - 16));
      totalLines = preparedLines.reduce((acc, l) => acc + l.length, 0);
    } else {
      const lines = doc.splitTextToSize(sanitize(textOrItems as string) || '-', contentWidth - 12);
      preparedLines = [lines];
      totalLines = lines.length;
    }

    const cardH = Math.max(13, isArray ? (totalLines * 3.4) + (preparedLines.length * 1.8) + 5.5 : (totalLines * 3.4) + 7);

    if (currentY + cardH > pageHeight - 22) {
      doc.addPage();
      currentY = 26;
    }

    doc.setFillColor(colorBgLight[0], colorBgLight[1], colorBgLight[2]);
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.setLineWidth(0.3);

    doc.roundedRect(marginLeft, currentY, contentWidth, cardH, 1.2, 1.2, 'FD');
    doc.setFillColor(accentColor[0], accentColor[1], accentColor[2]);
    doc.roundedRect(marginLeft, currentY, 2.5, cardH, 0.8, 0.8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(textHeadColor[0], textHeadColor[1], textHeadColor[2]);
    doc.text(title, marginLeft + 5, currentY + 4.5);

    if (isArray) {
      let itemY = currentY + 8.2;
      preparedLines.forEach(lines => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(textHeadColor[0], textHeadColor[1], textHeadColor[2]);
        doc.text("•", marginLeft + 5, itemY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
        doc.text(lines, marginLeft + 8.5, itemY);

        itemY += (lines.length * 3.4) + 1.2;
      });
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
      doc.text(preparedLines[0], marginLeft + 5, currentY + 8.2);
    }

    currentY += cardH + 2.8;
  };

  renderPerspectiveCard("RINGKASAN EKSEKUTIF", recExecutiveSummary, [15, 23, 42], [15, 23, 42]);
  renderPerspectiveCard("WHAT'S WORKING (PONDASI UTAMA ORGANISASI)", whatsWorkingText, [16, 185, 129], [4, 120, 87]);
  renderPerspectiveCard("WHAT'S AT RISK (AREA RISIKO POTENSIAL)", whatsAtRiskText, [245, 158, 11], [180, 83, 9]);

  const hambatanList: string[] = (defaultRec?.hambatan && defaultRec.hambatan.length > 0)
    ? defaultRec.hambatan
    : [
        'Hubungan antar sistem dan sumber data belum sepenuhnya konsisten.',
        'Standar untuk prompt, alur kerja, evaluasi, dan alat AI belum sama di seluruh organisasi.',
        'Pemantauan hasil dan risiko masih banyak dilakukan per proyek, belum secara menyeluruh.'
      ];

  renderPerspectiveCard("HAMBATAN ORGANISASI", hambatanList, [225, 29, 72], [190, 18, 60]);

  // =========================================================================
  // KEKUATAN UTAMA, AREA RISIKO & PETA JALAN AKSI 90 HARI
  // =========================================================================
  if (currentY + 25 > pageHeight - 22) {
    doc.addPage();
    currentY = 26;
  } else {
    currentY += 4.0;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text('AREA FOKUS BERDASARKAN PILAR & REKOMENDASI', marginLeft, currentY);
  currentY += 5.5;

  // Kekuatan Utama Organisasi (Fondasi Kuat >= 3.0)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(4, 120, 87);
  doc.text(`${strongest.length} KEKUATAN UTAMA ORGANISASI (FONDASI KUAT)`, marginLeft, currentY);
  currentY += 4.5;

  if (strongest.length > 0) {
    strongest.forEach(str => {
      const bulletTexts = [
        "Manfaatkan kekuatan ini untuk mendorong inisiatif AI dan mendukung area lainnya.",
        getOrgStrengthInsight(str.id)
      ];

      let totalLines = 0;
      const processedBullets = bulletTexts.map(bt => {
        const clean = sanitize(bt);
        const lines = doc.splitTextToSize(clean, contentWidth - 16);
        totalLines += lines.length;
        return lines;
      });

      const boxH = Math.max(16, 7 + (processedBullets.length * 2) + (totalLines * 3.6));

      if (currentY + boxH > pageHeight - 22) {
        doc.addPage();
        currentY = 26;
      }

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginLeft, currentY, contentWidth, boxH, 1.2, 1.2, 'FD');
      doc.setFillColor(16, 185, 129);
      doc.roundedRect(marginLeft, currentY, 2.5, boxH, 0.8, 0.8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(4, 120, 87);
      doc.text(`${str.name}  •  Skor ${str.score.toFixed(1)} / 5.0 (${str.status})  ·  Fondasi Kuat`, marginLeft + 5, currentY + 5.0);

      let bulletY = currentY + 9.2;
      processedBullets.forEach(lines => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(16, 185, 129);
        doc.text("•", marginLeft + 5, bulletY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
        doc.text(lines, marginLeft + 8.5, bulletY);

        bulletY += (lines.length * 3.6) + 1.5;
      });

      currentY += boxH + 4.0;
    });
  } else {
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, currentY, contentWidth, 12, 1.2, 1.2, 'FD');
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7.8);
    doc.setTextColor(100, 116, 139);
    doc.text("Belum ada pilar dengan skor >= 3.0. Fokus pada area perbaikan prioritas di bawah.", marginLeft + 5, currentY + 7.5);
    currentY += 16;
  }

  currentY += 4.0;

  // Area Pengembangan (Perlu Perhatian Segera < 3.0)
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(180, 83, 9);
  doc.text(`${weakest.length} AREA PENGEMBANGAN PRIORITAS (PERLU PERHATIAN SEGERA)`, marginLeft, currentY);
  currentY += 4.5;

  if (weakest.length > 0) {
    weakest.forEach(wk => {
      const bulletTexts = [
        "Area ini memerlukan investasi prioritas dan inisiatif perbaikan yang terfokus.",
        getOrgGrowthInsight(wk.id)
      ];

      let totalLines = 0;
      const processedBullets = bulletTexts.map(bt => {
        const clean = sanitize(bt);
        const lines = doc.splitTextToSize(clean, contentWidth - 16);
        totalLines += lines.length;
        return lines;
      });

      const boxH = Math.max(16, 7 + (processedBullets.length * 2) + (totalLines * 3.6));

      if (currentY + boxH > pageHeight - 22) {
        doc.addPage();
        currentY = 26;
      }

      doc.setFillColor(248, 250, 252);
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginLeft, currentY, contentWidth, boxH, 1.2, 1.2, 'FD');
      doc.setFillColor(245, 158, 11);
      doc.roundedRect(marginLeft, currentY, 2.5, boxH, 0.8, 0.8, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8.2);
      doc.setTextColor(180, 83, 9);
      doc.text(`${wk.name}  •  Skor ${wk.score.toFixed(1)} / 5.0 (${wk.status})  ·  Perlu Perhatian Segera`, marginLeft + 5, currentY + 5.0);

      let bulletY = currentY + 9.2;
      processedBullets.forEach(lines => {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(245, 158, 11);
        doc.text("•", marginLeft + 5, bulletY);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(7.5);
        doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
        doc.text(lines, marginLeft + 8.5, bulletY);

        bulletY += (lines.length * 3.6) + 1.5;
      });

      currentY += boxH + 4.0;
    });
  } else {
    doc.setFillColor(240, 253, 244);
    doc.setDrawColor(187, 247, 208);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, currentY, contentWidth, 12, 1.2, 1.2, 'FD');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(7.8);
    doc.setTextColor(4, 120, 87);
    doc.text("Selamat! Seluruh pilar kesiapan AI organisasi telah mencapai tingkat optimal (Fondasi Kuat).", marginLeft + 5, currentY + 7.5);
    currentY += 16;
  }

  // Plan Kedepannya: Peta Jalan Aksi 90 Hari (Mulai di Halaman Baru)
  doc.addPage();
  currentY = 26;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text('PETA JALAN AKSI 90 HARI (REKOMENDASI PRIORITAS)', marginLeft, currentY);
  currentY += 5.5;

  const planPhases = [
    { title: "FASE 1: SEKARANG (0 - 30 HARI)", items: phase1ActionsList, color: [16, 185, 129], textCol: [4, 120, 87] },
    { title: "FASE 2: BERIKUTNYA (1 - 3 BULAN)", items: phase2ActionsList, color: [59, 130, 246], textCol: [29, 78, 216] },
    { title: "FASE 3: SELANJUTNYA (3 - 12 BULAN)", items: phase3ActionsList, color: [139, 92, 246], textCol: [109, 40, 217] }
  ];

  planPhases.forEach(phase => {
    const validItems = phase.items && phase.items.length > 0 ? phase.items : ['Belum ada tindakan tercatat.'];
    const processedItems = validItems.map(item => {
      const clean = sanitize(item);
      const lines = doc.splitTextToSize(clean, contentWidth - 16);
      return lines;
    });
    const totalLines = processedItems.reduce((acc, l) => acc + l.length, 0);
    const boxH = Math.max(16, 7 + (processedItems.length * 2) + (totalLines * 3.6));

    if (currentY + boxH > pageHeight - 22) {
      doc.addPage();
      currentY = 26;
    }

    doc.setFillColor(255, 255, 255);
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, currentY, contentWidth, boxH, 1.2, 1.2, 'FD');
    doc.setFillColor(phase.color[0], phase.color[1], phase.color[2]);
    doc.roundedRect(marginLeft, currentY, 2.5, boxH, 0.8, 0.8, 'F');

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8.2);
    doc.setTextColor(phase.textCol[0], phase.textCol[1], phase.textCol[2]);
    doc.text(phase.title, marginLeft + 5, currentY + 5.0);

    let itemY = currentY + 9.2;
    processedItems.forEach(lines => {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(phase.textCol[0], phase.textCol[1], phase.textCol[2]);
      doc.text("•", marginLeft + 5, itemY);

      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.5);
      doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
      doc.text(lines, marginLeft + 8.5, itemY);

      itemY += (lines.length * 3.6) + 1.5;
    });

    currentY += boxH + 4.0;
  });

  // =========================================================================
  // PAGE 3: RECOMMENDED NORTIS PROGRAMS (IF ANY) & CONSULTATION ADVISORY
  // =========================================================================
  if (nortisPrograms && nortisPrograms.length > 0) {
    if (currentY + 45 > pageHeight - 22) {
      doc.addPage();
      currentY = 26;
    } else {
      currentY += 5.0;
    }

    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
    doc.text('PROGRAM NORTIS YANG DIREKOMENDASIKAN', marginLeft, currentY);
    currentY += 5;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(8.5);
    doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
    doc.text('Program pendampingan yang disesuaikan dengan tingkat kesiapan AI organisasi Anda:', marginLeft, currentY);
    currentY += 6;

    nortisPrograms.forEach((prog: any, idx: number) => {
      const pTitle = sanitize(prog.title || `Program ${idx + 1}`);
      const pSubtitle = sanitize(prog.subtitle || '');
      const pDesc = sanitize(prog.desc || '');

      const descLines = doc.splitTextToSize(pDesc, contentWidth - 18);
      const neededHeight = (descLines.length * 3.8) + (pSubtitle ? 14 : 10);

      if (currentY + neededHeight > pageHeight - 45) {
        doc.addPage();
        currentY = 26;
      }

      doc.setFillColor(colorBgLight[0], colorBgLight[1], colorBgLight[2]);
      doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
      doc.setLineWidth(0.3);
      doc.roundedRect(marginLeft, currentY, contentWidth, neededHeight, 1.2, 1.2, 'FD');

      // Left Green Accent Circle
      doc.setFillColor(16, 185, 129);
      doc.circle(marginLeft + 6, currentY + 5.5, 3, 'F');

      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(255, 255, 255);
      doc.text((idx + 1).toString(), marginLeft + 6, currentY + 6.5, { align: 'center' });

      // Title
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(9);
      doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
      doc.text(pTitle, marginLeft + 12, currentY + 6.5);

      let itemY = currentY + 11;
      if (pSubtitle) {
        doc.setFont('helvetica', 'italic');
        doc.setFontSize(7.8);
        doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
        doc.text(pSubtitle, marginLeft + 12, itemY);
        itemY += 4.5;
      }

      // Description
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(7.8);
      doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
      doc.text(descLines, marginLeft + 12, itemY);

      currentY += neededHeight + 3.5;
    });

    currentY += 4;
  }

  // Check height for Contact / Advisory Box
  if (currentY + 28 > pageHeight - 22) {
    doc.addPage();
    currentY = 26;
  } else {
    currentY += 4;
  }

  // Soft Contact / Advisory Next Steps Box
  doc.setFillColor(240, 253, 244); // #F0FDF4 Soft Mint
  doc.setDrawColor(187, 247, 208); // #BBF7D0
  doc.setLineWidth(0.4);
  doc.roundedRect(marginLeft, currentY, contentWidth, 26, 1.8, 1.8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70); // Soft Dark Emerald #065F46
  doc.text('Konsultasikan Transformasi AI Organisasi Anda Bersama NORTIS', marginLeft + (contentWidth / 2), currentY + 6.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(51, 65, 85);
  doc.text('Dapatkan pendampingan strategi intensif, audit MLOps, dan workshop kapabilitas tim.', marginLeft + (contentWidth / 2), currentY + 11.5, { align: 'center' });

  // Soft Contact Bar Pill
  doc.setFillColor(209, 250, 229); // #D1FAE5 Soft Pill
  doc.setDrawColor(167, 243, 208);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft + 12, currentY + 15.5, contentWidth - 24, 6.5, 1.2, 1.2, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(7.5);
  doc.setTextColor(4, 120, 87);
  doc.text('Email: hai@nortis.ai   |   WhatsApp: +62 823-3757-6338   |   Website: nortis.ai', marginLeft + (contentWidth / 2), currentY + 19.8, { align: 'center' });

  // Add headers & footers across all pages
  const totalPages = doc.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    addHeaderAndFooter(doc, i, totalPages);
  }

  const cleanCompanyName = (sanitize(submission.companyName) || 'Organisasi').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `NORTIS_AI_Readiness_${cleanCompanyName}.pdf`;
  doc.save(filename);
};
