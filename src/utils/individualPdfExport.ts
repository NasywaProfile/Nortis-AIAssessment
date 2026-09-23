import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { AssessmentSubmission } from '../types';
import {
  getLevelSummary,
  getReadinessProfileTitle,
  getDimensionStatus,
  getDimensionDescription,
  getStrengthInsight,
  getGrowthInsight,
  getActionPlan,
  getReflectionPrompts,
  getReadinessSummary
} from './individualInsights';

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

export const exportToIndividualPDF = async (
  submission: AssessmentSubmission, 
  recTexts?: any,
  language: string = 'ID',
  fullTranslations?: any
) => {
  const logoImg = await loadLogoImage();

  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  
  const marginLeft = 18;
  const marginRight = 18;
  const contentWidth = pageWidth - marginLeft - marginRight;
  let currentY = 26;

  // Clean, professional palette
  const colorDark = [15, 23, 42]; // #0F172A
  const colorMuted = [100, 116, 139]; // #64748B
  const colorBody = [51, 65, 85]; // #334155
  const colorBorder = [226, 232, 240]; // #E2E8F0
  const colorBgLight = [248, 250, 252]; // #F8FAFC
  const brandEmerald = [16, 185, 129]; // #10B981 Soft Emerald
  const brandDark = [6, 95, 70]; // #065F46 Soft Dark Emerald

  const overallScore = submission.overallScore || 0;
  const readinessLevel = submission.readinessLevel || 'AI-Ready';
  const badgeColors = getLevelBadgeColors(overallScore);

  const dimNames: Record<string, string> = {
    aiLiteracy: "AI Literacy & Mindset",
    taskFraming: "Task Framing & Prompting",
    workflow: "Workflow & Integration",
    evaluation: "Evaluation & Human Judgment",
    responsibleAi: "Responsible AI & Risk",
    collaboration: "Collaboration & AI Growth"
  };

  const dimensions = Object.keys(dimNames).map((key) => {
    const score = submission.scores[key as keyof typeof submission.scores] || 0;
    return {
      id: key,
      name: dimNames[key],
      score: score,
      status: getDimensionStatus(score),
      description: getDimensionDescription(key, getDimensionStatus(score))
    };
  });

  const sortedDimensions = [...dimensions].sort((a, b) => b.score - a.score);
  // Rule: Skor > 3.0 masuk ke Kekuatan Utama, Skor <= 3.0 masuk ke Area Pengembangan
  const strongest = sortedDimensions.filter(d => d.score > 3.0);
  const weakest = sortedDimensions.filter(d => d.score <= 3.0).reverse();

  const getLevelKey = (level: string) => {
    if (level.includes('Mature')) return 'mature';
    if (level.includes('Enabled')) return 'enabled';
    if (level.includes('Ready')) return 'ready';
    if (level.includes('Aware')) return 'aware';
    return 'unready';
  };
  const levelKey = getLevelKey(readinessLevel);
  const indRec = recTexts?.[levelKey] || recTexts;

  const effectiveStrongest = strongest.length > 0 ? strongest : sortedDimensions.slice(0, 3);
  const effectiveWeakest = weakest.length > 0 ? weakest : sortedDimensions.slice(-3).reverse();

  const fallbackSummary = getReadinessSummary(readinessLevel, effectiveStrongest, effectiveWeakest, overallScore);
  const fallbackActionPlan = getActionPlan(effectiveWeakest.map(w => w.id), readinessLevel);
  const fallbackReflectionPrompts = getReflectionPrompts(effectiveWeakest.map(w => w.id), effectiveStrongest.map(s => s.id));

  const profileTitle = sanitize(indRec?.title || getReadinessProfileTitle(overallScore, readinessLevel));
  const executiveSummary = sanitize(indRec?.desc || getLevelSummary(readinessLevel));

  const whatsWorkingText = sanitize(indRec?.whatsWorking || fallbackSummary.whatsWorking);
  const whatsAtRiskText = sanitize(indRec?.whatsAtRisk || fallbackSummary.whatsAtRisk);
  const focusNextText = sanitize(indRec?.focusNext || fallbackSummary.focusNext);

  const phase1ActionsList: string[] = (indRec?.phase1Actions && indRec.phase1Actions.length > 0)
    ? indRec.phase1Actions
    : fallbackActionPlan.sekarang;

  const phase2ActionsList: string[] = (indRec?.phase2Actions && indRec.phase2Actions.length > 0)
    ? indRec.phase2Actions
    : fallbackActionPlan.berikutnya;

  const phase3ActionsList: string[] = (indRec?.phase3Actions && indRec.phase3Actions.length > 0)
    ? indRec.phase3Actions
    : fallbackActionPlan.selanjutnya;

  const reflectionPromptsList: string[] = (indRec?.reflectionPrompts && indRec.reflectionPrompts.length > 0)
    ? indRec.reflectionPrompts
    : fallbackReflectionPrompts;

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
      doc.text('•  Individual AI Readiness & Competency Report', marginLeft + 19.5, 9.2);
    } else {
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(8);
      doc.setTextColor(brandEmerald[0], brandEmerald[1], brandEmerald[2]);
      doc.text('NORTIS', marginLeft, 9.2);
      
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
      doc.text('•  Individual AI Readiness & Competency Report', marginLeft + 16, 9.2);
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
    doc.text('NORTIS - AI Readiness Assessment (Individu)', marginLeft, footerY);
    doc.text(`Halaman ${pageNum} dari ${total}`, pageWidth - marginRight, footerY, { align: 'right' });
  };

  // =========================================================================
  // PAGE 1: HEADER, CANDIDATE PROFILE & 6 DIMENSIONS BREAKDOWN
  // =========================================================================

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(15);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text(language === 'EN' ? 'INDIVIDUAL AI READINESS REPORT' : 'LAPORAN KESIAPAN AI INDIVIDU', marginLeft, currentY + 4);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);
  doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
  doc.text(language === 'EN' ? 'Applied AI Fluency, Competency Evaluation & 90-Day Action Plan' : 'Evaluasi kompetensi terapan, profil kemahiran, dan peta jalan adopsi AI profesional', marginLeft, currentY + 9);

  currentY += 15;

  // 1. Candidate Info Card
  doc.setFillColor(colorBgLight[0], colorBgLight[1], colorBgLight[2]);
  doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
  doc.setLineWidth(0.3);
  doc.roundedRect(marginLeft, currentY, contentWidth, 30, 2, 2, 'FD');

  const halfWidth = contentWidth / 2;
  let infoY = currentY + 6.5;

  const renderInfoItem = (x: number, y: number, label: string, val: string, labelW: number = 24) => {
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

  renderInfoItem(marginLeft + 4, infoY, 'Nama Lengkap:', submission.fullName || '-', 24);
  renderInfoItem(marginLeft + halfWidth + 2, infoY, 'Email Kontak:', submission.email || '-', 22);

  infoY += 6.5;
  renderInfoItem(marginLeft + 4, infoY, 'Peran / Jabatan:', submission.jobTitle || '-', 24);
  renderInfoItem(marginLeft + halfWidth + 2, infoY, 'Frekuensi AI:', submission.aiUsageFrequency || 'Rutin', 22);

  infoY += 6.5;
  renderInfoItem(marginLeft + 4, infoY, 'Perusahaan:', submission.companyName || '-', 24);
  renderInfoItem(marginLeft + halfWidth + 2, infoY, 'Tanggal:', new Date(submission.timestamp || Date.now()).toLocaleDateString('id-ID', { day: 'numeric', month: 'numeric', year: 'numeric' }), 22);

  currentY += 35;

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

  // Right Side: Level Badge & Executive Quote
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

  // Profile Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  const titleLines = doc.splitTextToSize(profileTitle, descW);
  doc.text(titleLines.slice(0, 2), descX, currentY + 16);

  // Executive Quote
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(7.5);
  doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
  const splitSummary = doc.splitTextToSize(`"${executiveSummary}"`, descW);
  const quoteY = currentY + 16 + (Math.min(titleLines.length, 2) * 4.2) + 1;
  doc.text(splitSummary.slice(0, 2), descX, quoteY);

  currentY += 48;

  // 3. 6 Dimensions Breakdown Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text('EVALUASI 6 DIMENSI KESIAPAN AI INDIVIDU', marginLeft, currentY);
  currentY += 4;

  const dimTableData = dimensions.map(d => [
    d.name,
    d.score.toFixed(2),
    `${((d.score / 5) * 100).toFixed(0)}%`,
    d.status
  ]);

  autoTable(doc, {
    startY: currentY,
    margin: { left: marginLeft, right: marginRight },
    head: [['Dimensi Kompetensi', 'Skor (0-5)', 'Persentase', 'Tingkat Kemahiran']],
    body: dimTableData,
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

  // 3b. Grafik Skor Dimensi Kompetensi Individu
  const renderScoreBars = () => {
    const chartTitle = 'GRAFIK KESIAPAN DIMENSI INDIVIDU';
    const rowH = 9.5;
    const headerH = 8.5;
    const totalChartH = headerH + (dimensions.length * rowH) + 3.0;

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

    dimensions.forEach(d => {
      // Label
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(15, 23, 42);
      doc.text(d.name, marginLeft + 5, itemY + 2.8);

      // Score Text
      const scoreText = `${d.score.toFixed(1)} / 5.0 (${((d.score / 5) * 100).toFixed(0)}%)`;
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
      const fillRatio = Math.min(1, Math.max(0, d.score / 5.0));
      const fillW = Math.max(2.5, trackW * fillRatio);

      let barColor = [16, 185, 129];
      if (d.score < 1.5) barColor = [244, 63, 94];
      else if (d.score < 2.5) barColor = [245, 158, 11];
      else if (d.score < 3.5) barColor = [59, 130, 246];

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

  // 4. Analisis Kesiapan: Ringkasan Eksekutif, What's Working, What's at Risk, Focus Next
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

    currentY += cardH + 3.5;
  };

  renderPerspectiveCard("RINGKASAN EKSEKUTIF", executiveSummary, [15, 23, 42], [15, 23, 42]);
  renderPerspectiveCard("WHAT'S WORKING (PONDASI UTAMA)", whatsWorkingText, [16, 185, 129], [4, 120, 87]);
  renderPerspectiveCard("WHAT'S AT RISK (AREA RISIKO)", whatsAtRiskText, [245, 158, 11], [180, 83, 9]);
  renderPerspectiveCard("FOCUS NEXT (FOKUS 90 HARI)", focusNextText, [59, 130, 246], [29, 78, 216]);

  // =========================================================================
  // KEKUATAN UTAMA & AREA PENGEMBANGAN PRIORITAS
  // =========================================================================
  if (currentY + 25 > pageHeight - 22) {
    doc.addPage();
    currentY = 26;
  } else {
    currentY += 4.0;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text('KEKUATAN UTAMA & AREA PENGEMBANGAN PRIORITAS', marginLeft, currentY);
  currentY += 5.5;

  // Kekuatan Utama
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(4, 120, 87);
  doc.text(`${strongest.length} KEKUATAN UTAMA ANDA (SKOR > 3.0)`, marginLeft, currentY);
  currentY += 4.5;

  if (strongest.length > 0) {
    strongest.forEach(str => {
      const bulletTexts = [
        "Manfaatkan kekuatan ini untuk meningkatkan efektivitas kerja dan membantu rekan tim.",
        getStrengthInsight(str.id, indRec?.strengthInsights, undefined, levelKey)
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
      doc.text(`${str.name}  •  Skor ${str.score.toFixed(1)} / 5.0 (${str.status})  ·  Kekuatan Utama`, marginLeft + 5, currentY + 5.0);

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
    doc.setTextColor(colorBody[0], colorBody[1], colorBody[2]);
    doc.text("Belum ada dimensi dengan skor di atas 3.0. Fokus pada area prioritas pengembangan di bawah.", marginLeft + 5, currentY + 7.5);
    currentY += 16;
  }

  currentY += 4.0;

  // Area Pengembangan
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(8.8);
  doc.setTextColor(180, 83, 9);
  doc.text(`${weakest.length} AREA PENGEMBANGAN PRIORITAS (SKOR <= 3.0)`, marginLeft, currentY);
  currentY += 4.5;

  if (weakest.length > 0) {
    weakest.forEach(wk => {
      const bulletTexts = [
        "Area ini memerlukan pembelajaran terfokus dan latihan praktikal secara berkala.",
        getGrowthInsight(wk.id, indRec?.growthInsights, undefined, levelKey)
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
      doc.text(`${wk.name}  •  Skor ${wk.score.toFixed(1)} / 5.0 (${wk.status})  ·  Prioritas Peningkatan`, marginLeft + 5, currentY + 5.0);

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
    doc.text("Selamat! Seluruh dimensi kompetensi AI Anda telah mencapai tingkat optimal. Pertahankan keunggulan ini.", marginLeft + 5, currentY + 7.5);
    currentY += 16;
  }

  // Action Plan 90 Hari (Mulai di Halaman Baru)
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
  // PAGE 3: REFLECTION QUESTIONS & CONSULTATION ADVISORY
  // =========================================================================
  if (currentY + 40 > pageHeight - 22) {
    doc.addPage();
    currentY = 26;
  } else {
    currentY += 5.0;
  }

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
  doc.text('PERTANYAAN REFLEKSI PROFESIONAL', marginLeft, currentY);
  
  currentY += 4.5;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.2);
  doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
  doc.text('Bahan perenungan kritis untuk memperdalam kedewasaan berpikir dan efektivitas kerja berbasis AI:', marginLeft, currentY);
  currentY += 6;

  // Reflection cards
  reflectionPromptsList.forEach((prompt, pIdx) => {
    const pLines = doc.splitTextToSize(`"${sanitize(prompt)}"`, contentWidth - 16);
    const refH = Math.max(12, (pLines.length * 3.6) + 7);

    if (currentY + refH > pageHeight - 22) {
      doc.addPage();
      currentY = 26;
    }

    doc.setFillColor(colorBgLight[0], colorBgLight[1], colorBgLight[2]);
    doc.setDrawColor(colorBorder[0], colorBorder[1], colorBorder[2]);
    doc.setLineWidth(0.3);
    doc.roundedRect(marginLeft, currentY, contentWidth, refH, 1.2, 1.2, 'FD');

    // Quotation badge
    doc.setFillColor(59, 130, 246);
    doc.roundedRect(marginLeft + 4, currentY + 3, 4, 4, 0.8, 0.8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(6.5);
    doc.setTextColor(255, 255, 255);
    doc.text((pIdx + 1).toString(), marginLeft + 6, currentY + 5.8, { align: 'center' });

    doc.setFont('helvetica', 'italic');
    doc.setFontSize(7.8);
    doc.setTextColor(colorDark[0], colorDark[1], colorDark[2]);
    doc.text(pLines, marginLeft + 11, currentY + 5.2);

    currentY += refH + 3;
  });

  currentY += 4;

  // Reflection tip
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.5);
  doc.setTextColor(colorMuted[0], colorMuted[1], colorMuted[2]);
  doc.text('Tip: Diskusikan pertanyaan ini saat sesi 1-on-1 bersama mentor, rekan kerja, atau manajer Anda.', marginLeft, currentY);
  currentY += 8;

  if (currentY + 28 > pageHeight - 22) {
    doc.addPage();
    currentY = 26;
  }

  // Soft Contact / Advisory Next Steps Box
  doc.setFillColor(240, 253, 244); // #F0FDF4 Soft Mint
  doc.setDrawColor(187, 247, 208); // #BBF7D0
  doc.setLineWidth(0.4);
  doc.roundedRect(marginLeft, currentY, contentWidth, 26, 1.8, 1.8, 'FD');

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(6, 95, 70); // Soft Dark Emerald #065F46
  doc.text('Kembangkan Keterampilan AI Anda Bersama NORTIS', marginLeft + (contentWidth / 2), currentY + 6.5, { align: 'center' });

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7.6);
  doc.setTextColor(51, 65, 85);
  doc.text('Ikuti program upskilling intensif dan konsultasikan pengembangan AI fluency profesional Anda.', marginLeft + (contentWidth / 2), currentY + 11.5, { align: 'center' });

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

  const cleanName = (sanitize(submission.fullName) || 'User').replace(/[^a-zA-Z0-9_-]/g, '_');
  const filename = `NORTIS_AI_Individu_${cleanName}.pdf`;
  doc.save(filename);
};
