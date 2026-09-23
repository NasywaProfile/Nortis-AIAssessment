import { AssessmentSubmission } from '../types';

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

const orgQuestionsMap: Record<string, { pillar: string; text: string }> = {
  'S1': { pillar: 'Strategi & Kepemimpinan', text: 'Apakah AI telah masuk dalam agenda strategis organisasi?' },
  'S2': { pillar: 'Strategi & Kepemimpinan', text: 'Apakah jajaran pimpinan memahami manfaat dan risiko penerapan AI?' },
  'S3': { pillar: 'Strategi & Kepemimpinan', text: 'Apakah terdapat sponsor atau penanggung jawab (owner) AI di tingkat manajemen?' },
  'S4': { pillar: 'Strategi & Kepemimpinan', text: 'Apakah tujuan penggunaan AI dalam organisasi telah jelas dan terukur?' },
  'S5': { pillar: 'Strategi & Kepemimpinan', text: 'Apakah pemanfaatan AI selaras dengan visi dan misi organisasi?' },
  
  'P1': { pillar: 'Proses & Alur Kerja', text: 'Apakah alur dan proses kerja utama organisasi telah terdokumentasi dengan baik?' },
  'P2': { pillar: 'Proses & Alur Kerja', text: 'Apakah kendala utama (bottleneck) dan titik masalah (pain points) proses kerja telah diidentifikasi?' },
  'P3': { pillar: 'Proses & Alur Kerja', text: 'Apakah alur proses kerja siap diubah atau dioptimalkan menggunakan AI?' },
  'P4': { pillar: 'Proses & Alur Kerja', text: 'Apakah Prosedur Operasional Standar (SOP) telah mendukung penggunaan teknologi digital dan AI?' },
  'P5': { pillar: 'Proses & Alur Kerja', text: 'Apakah terdapat alur kerja (workflow) yang berpotensi untuk diotomatisasi dengan AI?' },
  
  'H1': { pillar: 'SDM & Kapabilitas', text: 'Apakah Sumber Daya Manusia (SDM) telah memiliki literasi dasar mengenai AI?' },
  'H2': { pillar: 'SDM & Kapabilitas', text: 'Apakah terdapat penggerak internal (AI champion) yang mendorong adopsi AI?' },
  'H3': { pillar: 'SDM & Kapabilitas', text: 'Apakah tim dan karyawan terbuka terhadap perubahan alur kerja berbasis teknologi?' },
  'H4': { pillar: 'SDM & Kapabilitas', text: 'Apakah SDM mampu menggunakan perangkat (tools) AI secara praktis dalam pekerjaan sehari-hari?' },
  'H5': { pillar: 'SDM & Kapabilitas', text: 'Apakah telah terdapat rencana pelatihan dan pengembangan kompetensi AI untuk SDM?' },
  
  'D1': { pillar: 'Data & Teknologi', text: 'Apakah data organisasi telah tersedia secara terstruktur dan mudah diakses?' },
  'D2': { pillar: 'Data & Teknologi', text: 'Apakah kualitas dan keakuratan data sudah memadai untuk kebutuhan AI?' },
  'D3': { pillar: 'Data & Teknologi', text: 'Apakah organisasi telah secara aktif menggunakan perangkat (tools) digital atau AI?' },
  'D4': { pillar: 'Data & Teknologi', text: 'Apakah sistem teknologi yang ada telah saling terintegrasi satu sama lain?' },
  'D5': { pillar: 'Data & Teknologi', text: 'Apakah keamanan data, privasi, dan infrastruktur sistem telah terjamin dengan baik?' },
  
  'G1': { pillar: 'Tata Kelola & AI Bertanggung Jawab', text: 'Apakah telah terdapat kebijakan resmi mengenai tata kelola data dan privasi?' },
  'G2': { pillar: 'Tata Kelola & AI Bertanggung Jawab', text: 'Apakah organisasi telah memahami dan memetakan potensi risiko dari penerapan AI?' },
  'G3': { pillar: 'Tata Kelola & AI Bertanggung Jawab', text: 'Apakah prinsip etika AI telah dipertimbangkan dalam setiap pemanfaatannya?' },
  'G4': { pillar: 'Tata Kelola & AI Bertanggung Jawab', text: 'Apakah terdapat mekanisme kontrol dan pengawasan (audit) terhadap penggunaan AI?' },
  'G5': { pillar: 'Tata Kelola & AI Bertanggung Jawab', text: 'Apakah organisasi siap mematuhi regulasi dan standar kebijakan AI yang berlaku?' }
};

const indQuestionsMap: Record<string, { dimension: string; text: string }> = {
  'A1': { dimension: 'AI Literacy & Mindset', text: 'Saya memahami kemampuan utama AI generatif dan jenis pekerjaan yang cocok dibantu oleh AI.' },
  'A2': { dimension: 'AI Literacy & Mindset', text: 'Saya memahami bahwa AI dapat menghasilkan informasi yang terdengar meyakinkan tetapi sebenarnya tidak akurat (halusinasi).' },
  'A3': { dimension: 'AI Literacy & Mindset', text: 'Saya dapat membedakan dengan jelas tugas yang tepat untuk dibantu AI dan tugas yang membutuhkan penilaian manusia.' },
  'A4': { dimension: 'AI Literacy & Mindset', text: 'Saya memahami keterbatasan AI seperti halusinasi (hallucination), bias, keterbatasan konteks, dan ketergantungan pada kualitas input.' },
  'A5': { dimension: 'AI Literacy & Mindset', text: 'Saya memandang AI sebagai alat untuk meningkatkan kemampuan dan kualitas kerja, bukan sekadar menggantikan pekerjaan manual.' },

  'B1': { dimension: 'Task Framing & Prompting', text: 'Sebelum menggunakan AI, saya dapat menentukan dengan jelas tujuan atau hasil spesifik yang ingin saya capai.' },
  'B2': { dimension: 'Task Framing & Prompting', text: 'Saya dapat memberikan konteks, instruksi, batasan, dan format luaran (output) yang jelas kepada AI.' },
  'B3': { dimension: 'Task Framing & Prompting', text: 'Saya dapat memecah pekerjaan kompleks menjadi beberapa sub-tugas yang lebih terstruktur untuk dikerjakan bersama AI.' },
  'B4': { dimension: 'Task Framing & Prompting', text: 'Saya melakukan iterasi dan menyempurnakan instruksi (prompt) ketika hasil pertama dari AI belum sesuai kebutuhan.' },
  'B5': { dimension: 'Task Framing & Prompting', text: 'Saya dapat memilih perangkat (tools) atau pendekatan AI yang paling sesuai untuk berbagai jenis tugas yang berbeda.' },

  'C1': { dimension: 'Workflow & Integration', text: 'Saya menggunakan AI secara rutin dalam aktivitas pekerjaan sehari-hari, bukan hanya untuk bereksperimen.' },
  'C2': { dimension: 'Workflow & Integration', text: 'Saya dapat mengenali pekerjaan repetitif atau memakan waktu yang dapat diefisienkan menggunakan AI.' },
  'C3': { dimension: 'Workflow & Integration', text: 'Saya memiliki alur kerja (workflow), templat, atau pustaka prompt yang dapat digunakan kembali untuk pekerjaan tertentu.' },
  'C4': { dimension: 'Workflow & Integration', text: 'Saya dapat mengintegrasikan AI ke dalam berbagai tahapan kerja, mulai dari riset, ideasi, penyusunan draft, analisis, hingga evaluasi.' },
  'C5': { dimension: 'Workflow & Integration', text: 'Saya dapat menunjukkan dampak nyata penggunaan AI terhadap efisiensi waktu, produktivitas, dan kualitas hasil kerja saya.' },

  'D1': { dimension: 'Evaluation & Human Judgment', text: 'Saya selalu memeriksa dan memverifikasi kembali informasi penting yang dihasilkan AI sebelum menggunakannya.' },
  'D2': { dimension: 'Evaluation & Human Judgment', text: 'Saya dapat mengenali ketika jawaban AI terlihat masuk akal, namun mengandung kesalahan atau fakta yang menyesatkan.' },
  'D3': { dimension: 'Evaluation & Human Judgment', text: 'Saya membandingkan luaran AI dengan sumber data resmi, rujukan, atau referensi tepercaya saat akurasi menjadi hal krusial.' },
  'D4': { dimension: 'Evaluation & Human Judgment', text: 'Saya memahami kapan luaran AI membutuhkan tinjauan ahli (expert review), persetujuan hukum, atau keputusan manusia.' },
  'D5': { dimension: 'Evaluation & Human Judgment', text: 'Saya tidak membuat keputusan bisnis atau strategis yang penting hanya berdasarkan luaran AI tanpa validasi kontekstual.' },

  'E1': { dimension: 'Responsible AI & Risk', text: 'Saya mempertimbangkan faktor keamanan, hak cipta, dan kerahasiaan data sebelum memasukkan informasi ke dalam perangkat AI.' },
  'E2': { dimension: 'Responsible AI & Risk', text: 'Saya memahami bahwa data sensitif, informasi pribadi, dan rahasia perusahaan tidak boleh dimasukkan ke dalam AI publik tanpa perlindungan.' },
  'E3': { dimension: 'Responsible AI & Risk', text: 'Saya mempertimbangkan potensi bias, keadilan, dan dampak etis dari kesimpulan atau konten yang dihasilkan AI.' },
  'E4': { dimension: 'Responsible AI & Risk', text: 'Saya mematuhi pedoman hak cipta, kepemilikan intelektual, dan etika penggunaan konten berbasis AI secara bertanggung jawab.' },
  'E5': { dimension: 'Responsible AI & Risk', text: 'Saya menyadari bahwa manusia tetap bertanggung jawab penuh atas hasil akhir dan keputusan pekerjaan yang menggunakan AI.' },

  'F1': { dimension: 'Collaboration & AI Growth', text: 'Saya secara aktif mempelajari perkembangan perangkat (tools), metode, dan praktik terbaik penggunaan AI yang relevan dengan bidang saya.' },
  'F2': { dimension: 'Collaboration & AI Growth', text: 'Saya secara aktif membagikan prompt efektif, alur kerja, dan pembelajaran penggunaan AI kepada rekan kerja atau tim.' },
  'F3': { dimension: 'Collaboration & AI Growth', text: 'Saya memanfaatkan AI sebagai mitra diskusi (sparring partner) untuk mengeksplorasi ide dan solusi, bukan sekadar pembuat jawaban instan.' },
  'F4': { dimension: 'Collaboration & AI Growth', text: 'Saya dapat menentukan batasan yang jelas antara tugas yang dapat berjalan mandiri oleh AI dan keputusan yang membutuhkan persetujuan manusia.' },
  'F5': { dimension: 'Collaboration & AI Growth', text: 'Saya siap mengadaptasi cara kerja secara fleksibel seiring dengan perkembangan teknologi AI dan agen cerdas (AI agents).' }
};

const getScoreInterpretation = (score: number) => {
  if (score === 5) return 'Sangat Mahir / Mature & Scalable';
  if (score === 4) return 'Siap & Terstruktur / Konsisten';
  if (score === 3) return 'Cukup Siap / Mandiri (Terbatas)';
  if (score === 2) return 'Mulai / Belum Konsisten';
  if (score === 1) return 'Ad-hoc / Terbatas';
  return 'Belum Pernah / Tidak Ada';
};

export const exportToExcel = async (submission: AssessmentSubmission, recTexts?: any) => {
  const isIndividual = submission.assessmentType === 'individual';
  const ExcelJS = (await import('exceljs')).default;
  const { saveAs } = (await import('file-saver')).default;
  
  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'NORTIS';
  workbook.created = new Date();

  // Colors
  const darkGreen = 'FF0B2F1E';
  const nortisGreen = 'FF009E4F';
  const headerBg = 'FF009E4F';
  const lightGreenBg = 'FFE8F5E9';
  const lightGrayBg = 'FFF8FAFC';
  const borderGray = 'FFE2E8F0';

  const thinBorder = {
    top: { style: 'thin' as const, color: { argb: borderGray } },
    left: { style: 'thin' as const, color: { argb: borderGray } },
    bottom: { style: 'thin' as const, color: { argb: borderGray } },
    right: { style: 'thin' as const, color: { argb: borderGray } }
  };

  // =========================================================
  // SHEET 1: RINGKASAN EKSEKUTIF (EXECUTIVE SUMMARY)
  // =========================================================
  const sheetSummary = workbook.addWorksheet('1. Ringkasan Eksekutif', {
    views: [{ showGridLines: true }]
  });

  sheetSummary.columns = [
    { width: 4 },  // Margin
    { width: 28 }, // Key / Dimension
    { width: 32 }, // Value / Detail
    { width: 16 }, // Score
    { width: 16 }, // Percentage
    { width: 28 }  // Status
  ];

  // Title Banner
  sheetSummary.mergeCells('B2:F2');
  const bannerCell = sheetSummary.getCell('B2');
  bannerCell.value = isIndividual 
    ? 'LAPORAN HASIL PENILAIAN KESIAPAN AI INDIVIDU — NORTIS' 
    : 'LAPORAN RESMI PENILAIAN KESIAPAN AI ORGANISASI — NORTIS';
  bannerCell.font = { name: 'Segoe UI', size: 13, bold: true, color: { argb: 'FFFFFFFF' } };
  bannerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkGreen } };
  bannerCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheetSummary.getRow(2).height = 36;

  sheetSummary.mergeCells('B3:F3');
  const subBannerCell = sheetSummary.getCell('B3');
  subBannerCell.value = 'Laporan diagnostik komprehensif kesiapan transformasi kecerdasan buatan (AI Readiness Index)';
  subBannerCell.font = { name: 'Segoe UI', size: 9, italic: true, color: { argb: 'FFFFFFFF' } };
  subBannerCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: nortisGreen } };
  subBannerCell.alignment = { vertical: 'middle', horizontal: 'center' };
  sheetSummary.getRow(3).height = 20;

  // Section 1: Profil
  sheetSummary.getCell('B5').value = isIndividual ? 'A. DATA PROFIL PROFESIONAL' : 'A. INFORMASI ORGANISASI & PIC';
  sheetSummary.getCell('B5').font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: darkGreen } };

  const metaRows = isIndividual ? [
    ['Nama Lengkap', submission.fullName || '-', 'Posisi / Role', submission.jobTitle || '-'],
    ['Perusahaan / Asal', submission.companyName || '-', 'Industri', industries[submission.industry] || submission.industry || '-'],
    ['Pengalaman Kerja', submission.experienceYears || '-', 'Frekuensi Penggunaan AI', submission.aiUsageFrequency || '-'],
    ['Email Kontak', submission.email || '-', 'No. WhatsApp', submission.phone || '-'],
    ['Tools AI Digunakan', submission.aiToolsUsed || '-', 'Tanggal Asesmen', new Date(submission.timestamp || Date.now()).toLocaleDateString('id-ID')]
  ] : [
    ['Nama Perusahaan', submission.companyName || '-', 'Nama PIC', submission.fullName || '-'],
    ['Industri', industries[submission.industry] || submission.industry || '-', 'Posisi / Jabatan', submission.jobTitle || '-'],
    ['Ukuran Perusahaan', companySizes[submission.companySize] || submission.companySize || '-', 'Email PIC', submission.email || '-'],
    ['Lokasi Operasional', submission.location || '-', 'No. Telepon / WA', submission.phone || '-'],
    ['ID Asesmen', submission.id || 'NORTIS-AI', 'Tanggal Asesmen', new Date(submission.timestamp || Date.now()).toLocaleDateString('id-ID')]
  ];

  let currRow = 6;
  metaRows.forEach(([k1, v1, k2, v2]) => {
    const row = sheetSummary.getRow(currRow);
    row.getCell(2).value = k1;
    row.getCell(2).font = { bold: true, size: 9, color: { argb: 'FF475569' } };
    row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGrayBg } };
    row.getCell(2).border = thinBorder;

    row.getCell(3).value = v1;
    row.getCell(3).font = { size: 9, color: { argb: 'FF0F172A' } };
    row.getCell(3).border = thinBorder;

    row.getCell(4).value = k2;
    row.getCell(4).font = { bold: true, size: 9, color: { argb: 'FF475569' } };
    row.getCell(4).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGrayBg } };
    row.getCell(4).border = thinBorder;

    sheetSummary.mergeCells(`E${currRow}:F${currRow}`);
    const v2Cell = sheetSummary.getCell(`E${currRow}`);
    v2Cell.value = v2;
    v2Cell.font = { size: 9, color: { argb: 'FF0F172A' } };
    v2Cell.border = thinBorder;
    sheetSummary.getCell(`F${currRow}`).border = thinBorder;

    row.height = 20;
    currRow++;
  });

  // Section 2: Overall Score KPI
  currRow += 2;
  sheetSummary.getCell(`B${currRow}`).value = 'B. HASIL SKOR KESIAPAN AI KESELURUHAN';
  sheetSummary.getCell(`B${currRow}`).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: darkGreen } };
  currRow++;

  sheetSummary.mergeCells(`B${currRow}:C${currRow}`);
  const kpiLabel = sheetSummary.getCell(`B${currRow}`);
  kpiLabel.value = 'AI Readiness Index (NORTIS Score)';
  kpiLabel.font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  kpiLabel.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkGreen } };
  kpiLabel.alignment = { vertical: 'middle', horizontal: 'center' };

  sheetSummary.getCell(`D${currRow}`).value = 'Skor (0-5)';
  sheetSummary.getCell(`D${currRow}`).font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  sheetSummary.getCell(`D${currRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkGreen } };
  sheetSummary.getCell(`D${currRow}`).alignment = { vertical: 'middle', horizontal: 'center' };

  sheetSummary.getCell(`E${currRow}`).value = 'Persentase';
  sheetSummary.getCell(`E${currRow}`).font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  sheetSummary.getCell(`E${currRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkGreen } };
  sheetSummary.getCell(`E${currRow}`).alignment = { vertical: 'middle', horizontal: 'center' };

  sheetSummary.getCell(`F${currRow}`).value = 'Level Kesiapan';
  sheetSummary.getCell(`F${currRow}`).font = { bold: true, size: 10, color: { argb: 'FFFFFFFF' } };
  sheetSummary.getCell(`F${currRow}`).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkGreen } };
  sheetSummary.getCell(`F${currRow}`).alignment = { vertical: 'middle', horizontal: 'center' };
  sheetSummary.getRow(currRow).height = 24;
  currRow++;

  // Score Data Row
  sheetSummary.mergeCells(`B${currRow}:C${currRow}`);
  const kpiVal = sheetSummary.getCell(`B${currRow}`);
  kpiVal.value = `Tingkat Kematangan: ${submission.readinessLevel}`;
  kpiVal.font = { bold: true, size: 10, color: { argb: darkGreen } };
  kpiVal.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGreenBg } };
  kpiVal.alignment = { vertical: 'middle', horizontal: 'center' };
  kpiVal.border = thinBorder;
  sheetSummary.getCell(`C${currRow}`).border = thinBorder;

  const scoreCell = sheetSummary.getCell(`D${currRow}`);
  scoreCell.value = submission.overallScore;
  scoreCell.numFmt = '0.00';
  scoreCell.font = { bold: true, size: 13, color: { argb: nortisGreen } };
  scoreCell.alignment = { vertical: 'middle', horizontal: 'center' };
  scoreCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGreenBg } };
  scoreCell.border = thinBorder;

  const pctCell = sheetSummary.getCell(`E${currRow}`);
  pctCell.value = (submission.overallScore / 5);
  pctCell.numFmt = '0.0%';
  pctCell.font = { bold: true, size: 11, color: { argb: darkGreen } };
  pctCell.alignment = { vertical: 'middle', horizontal: 'center' };
  pctCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGreenBg } };
  pctCell.border = thinBorder;

  const lvlCell = sheetSummary.getCell(`F${currRow}`);
  lvlCell.value = submission.readinessLevel;
  lvlCell.font = { bold: true, size: 10, color: { argb: darkGreen } };
  lvlCell.alignment = { vertical: 'middle', horizontal: 'center' };
  lvlCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGreenBg } };
  lvlCell.border = thinBorder;
  sheetSummary.getRow(currRow).height = 28;

  // Section 3: Pillar / Dimension Table
  currRow += 2;
  sheetSummary.getCell(`B${currRow}`).value = isIndividual ? 'C. SKOR 6 DIMENSI KESIAPAN AI' : 'C. SKOR 5 PILAR STRATEGIS KESIAPAN AI';
  sheetSummary.getCell(`B${currRow}`).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: darkGreen } };
  currRow++;

  const tableHeader = sheetSummary.getRow(currRow);
  tableHeader.getCell(2).value = 'No';
  tableHeader.getCell(3).value = isIndividual ? 'Dimensi Kompetensi' : 'Pilar Strategis';
  tableHeader.getCell(4).value = 'Skor (0-5)';
  tableHeader.getCell(5).value = 'Persentase';
  tableHeader.getCell(6).value = 'Status Evaluasi';
  
  for (let c = 2; c <= 6; c++) {
    const cell = tableHeader.getCell(c);
    cell.font = { bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
    cell.alignment = { vertical: 'middle', horizontal: c === 3 ? 'left' : 'center' };
  }
  tableHeader.height = 22;
  currRow++;

  const pillarData = isIndividual ? [
    ['1', 'AI Literacy & Mindset', submission.scores.aiLiteracy || 0],
    ['2', 'Task Framing & Prompting', submission.scores.taskFraming || 0],
    ['3', 'Workflow & Integration', submission.scores.workflow || 0],
    ['4', 'Evaluation & Human Judgment', submission.scores.evaluation || 0],
    ['5', 'Responsible AI & Risk', submission.scores.responsibleAi || 0],
    ['6', 'Collaboration & AI Growth', submission.scores.collaboration || 0]
  ] : [
    ['1', 'Strategi & Kepemimpinan', submission.scores.strategi || 0],
    ['2', 'Proses & Alur Kerja', submission.scores.proses || 0],
    ['3', 'SDM & Kapabilitas', submission.scores.sdm || 0],
    ['4', 'Data & Teknologi', submission.scores.data || 0],
    ['5', 'Tata Kelola & AI Bertanggung Jawab', submission.scores.tataKelola || 0]
  ];

  pillarData.forEach(([no, name, scoreVal]) => {
    const row = sheetSummary.getRow(currRow);
    const scoreNum = Number(scoreVal);

    row.getCell(2).value = no;
    row.getCell(2).alignment = { horizontal: 'center' };

    row.getCell(3).value = name;
    row.getCell(3).font = { bold: true, size: 9 };

    row.getCell(4).value = scoreNum;
    row.getCell(4).numFmt = '0.00';
    row.getCell(4).font = { bold: true, color: { argb: nortisGreen } };
    row.getCell(4).alignment = { horizontal: 'center' };

    row.getCell(5).value = (scoreNum / 5);
    row.getCell(5).numFmt = '0.0%';
    row.getCell(5).alignment = { horizontal: 'center' };

    row.getCell(6).value = getScoreInterpretation(Math.round(scoreNum));
    row.getCell(6).font = { size: 9 };

    for (let c = 2; c <= 6; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      if (currRow % 2 === 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGrayBg } };
      }
    }
    row.height = 20;
    currRow++;
  });

  // Section 4: Qualitative Goals / Action Plan
  if (!isIndividual && (submission.aiGoal || submission.aiUseCase || submission.aiTools)) {
    currRow += 2;
    sheetSummary.getCell(`B${currRow}`).value = 'D. OBJEKTIF & RENCANA ADOPSI AI';
    sheetSummary.getCell(`B${currRow}`).font = { name: 'Segoe UI', size: 10, bold: true, color: { argb: darkGreen } };
    currRow++;

    const qualData = [
      ['Objektif AI Organisasi', submission.aiGoal || '-'],
      ['Use Case AI Direncanakan', submission.aiUseCase || '-'],
      ['Tools AI yang Diperlukan', submission.aiTools || '-'],
      ['Penggunaan AI Saat Ini', submission.aiCurrentUse || '-']
    ];

    qualData.forEach(([qTitle, qVal]) => {
      const row = sheetSummary.getRow(currRow);
      row.getCell(2).value = qTitle;
      row.getCell(2).font = { bold: true, size: 9, color: { argb: 'FF475569' } };
      row.getCell(2).fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGrayBg } };
      row.getCell(2).border = thinBorder;

      sheetSummary.mergeCells(`C${currRow}:F${currRow}`);
      const valC = sheetSummary.getCell(`C${currRow}`);
      valC.value = qVal;
      valC.font = { size: 9 };
      valC.alignment = { wrapText: true };
      valC.border = thinBorder;
      for (let c = 3; c <= 6; c++) sheetSummary.getCell(currRow, c).border = thinBorder;

      row.height = 24;
      currRow++;
    });
  }

  // =========================================================
  // SHEET 2: DETAIL JAWABAN ASESMEN (DETAILED RESPONSES)
  // =========================================================
  const sheetDetail = workbook.addWorksheet('2. Detail Jawaban Asesmen', {
    views: [{ showGridLines: true }]
  });

  sheetDetail.columns = [
    { width: 4 },  // Margin
    { width: 6 },  // No
    { width: 30 }, // Pilar / Dimensi
    { width: 14 }, // Kode Soal
    { width: 65 }, // Teks Pertanyaan
    { width: 14 }, // Skor Jawaban (0-5)
    { width: 32 }  // Interpretasi
  ];

  // Header banner
  sheetDetail.mergeCells('B2:G2');
  const dTitle = sheetDetail.getCell('B2');
  dTitle.value = 'RINCIAN BUTIR PERTANYAAN & SKOR EVALUASI ASESMEN';
  dTitle.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  dTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkGreen } };
  dTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  sheetDetail.getRow(2).height = 30;

  let dRow = 4;
  const detailHeader = sheetDetail.getRow(dRow);
  detailHeader.getCell(2).value = 'No';
  detailHeader.getCell(3).value = isIndividual ? 'Dimensi' : 'Pilar';
  detailHeader.getCell(4).value = 'Kode';
  detailHeader.getCell(5).value = 'Pertanyaan Evaluasi';
  detailHeader.getCell(6).value = 'Skor (0-5)';
  detailHeader.getCell(7).value = 'Tingkat Kemahiran / Status';

  for (let c = 2; c <= 7; c++) {
    const cell = detailHeader.getCell(c);
    cell.font = { bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
    cell.alignment = { vertical: 'middle', horizontal: c === 5 ? 'left' : 'center' };
  }
  detailHeader.height = 24;
  dRow++;

  const questionEntries = isIndividual
    ? Object.entries(indQuestionsMap)
    : Object.entries(orgQuestionsMap);

  let qIndex = 1;
  questionEntries.forEach(([code, qInfo]: any) => {
    const ansScore = submission.answers?.[code] !== undefined ? Number(submission.answers[code]) : '-';
    const row = sheetDetail.getRow(dRow);

    row.getCell(2).value = qIndex++;
    row.getCell(2).alignment = { horizontal: 'center' };

    row.getCell(3).value = qInfo.dimension || qInfo.pillar;
    row.getCell(3).font = { bold: true, size: 9 };

    row.getCell(4).value = code;
    row.getCell(4).alignment = { horizontal: 'center' };
    row.getCell(4).font = { bold: true };

    row.getCell(5).value = qInfo.text;
    row.getCell(5).font = { size: 9 };
    row.getCell(5).alignment = { wrapText: true };

    row.getCell(6).value = ansScore;
    row.getCell(6).alignment = { horizontal: 'center' };
    row.getCell(6).font = { bold: true, color: { argb: typeof ansScore === 'number' ? nortisGreen : 'FF000000' } };

    row.getCell(7).value = typeof ansScore === 'number' ? getScoreInterpretation(ansScore) : '-';
    row.getCell(7).font = { size: 8.5 };

    for (let c = 2; c <= 7; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      if (dRow % 2 === 0) {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGrayBg } };
      }
    }
    row.height = 28;
    dRow++;
  });

  // =========================================================
  // SHEET 3: PANDUAN SKALA & LEVEL KESIAPAN
  // =========================================================
  const sheetRef = workbook.addWorksheet('3. Panduan Skala & Level', {
    views: [{ showGridLines: true }]
  });

  sheetRef.columns = [
    { width: 4 },  // Margin
    { width: 10 }, // Nilai / Level
    { width: 18 }, // Rentang
    { width: 40 }, // Deskripsi ID
    { width: 40 }  // Deskripsi EN
  ];

  // Title
  sheetRef.mergeCells('B2:E2');
  const rTitle = sheetRef.getCell('B2');
  rTitle.value = 'STANDAR MATRIKS KESIAPAN AI & SKALA PENILAIAN';
  rTitle.font = { name: 'Segoe UI', size: 12, bold: true, color: { argb: 'FFFFFFFF' } };
  rTitle.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: darkGreen } };
  rTitle.alignment = { vertical: 'middle', horizontal: 'center' };
  sheetRef.getRow(2).height = 30;

  // Table 1: Skala 0-5
  sheetRef.getCell('B4').value = '1. PANDUAN SKALA PENILAIAN BUTIR (0 — 5)';
  sheetRef.getCell('B4').font = { bold: true, size: 10, color: { argb: darkGreen } };

  const sHead = sheetRef.getRow(5);
  sHead.getCell(2).value = 'Skor';
  sHead.getCell(3).value = 'Tingkat';
  sHead.getCell(4).value = 'Interpretasi Skala (Bahasa Indonesia)';
  sHead.getCell(5).value = 'Scale Interpretation (English)';
  for (let c = 2; c <= 5; c++) {
    const cell = sHead.getCell(c);
    cell.font = { bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
    cell.alignment = { vertical: 'middle', horizontal: c <= 3 ? 'center' : 'left' };
  }
  sHead.height = 22;

  const scales = [
    ['0', 'Nol', 'Tidak ada sama sekali / Belum pernah diterapkan', 'Not at all / Not applicable'],
    ['1', 'Awal', 'Ada secara ad-hoc / sporadis / sangat terbatas', 'Ad-hoc / Sporadic / Very limited'],
    ['2', 'Berkembang', 'Sudah mulai dilakukan, namun belum konsisten', 'Started but not yet consistent'],
    ['3', 'Cukup Siap', 'Cukup siap dan mandiri pada situasi terbatas / familiar', 'Fairly ready / Independent on familiar tasks'],
    ['4', 'Siap & Terstruktur', 'Siap, terstruktur, dan konsisten di berbagai proses', 'Ready, structured, and consistent across workflows'],
    ['5', 'Mature', 'Mature, sistematis, scalable, dan mampu membimbing', 'Mature, scalable, and capable of guiding others']
  ];

  let sRow = 6;
  scales.forEach(([sk, tk, idD, enD]) => {
    const row = sheetRef.getRow(sRow);
    row.getCell(2).value = sk;
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(2).font = { bold: true };

    row.getCell(3).value = tk;
    row.getCell(3).alignment = { horizontal: 'center' };

    row.getCell(4).value = idD;
    row.getCell(5).value = enD;

    for (let c = 2; c <= 5; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      if (sRow % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGrayBg } };
    }
    row.height = 20;
    sRow++;
  });

  // Table 2: 5 Level Kesiapan AI
  sRow += 2;
  sheetRef.getCell(`B${sRow}`).value = '2. TINGKATAN KEMATANGAN KESIAPAN AI (AI READINESS LEVELS)';
  sheetRef.getCell(`B${sRow}`).font = { bold: true, size: 10, color: { argb: darkGreen } };
  sRow++;

  const lHead = sheetRef.getRow(sRow);
  lHead.getCell(2).value = 'Level';
  lHead.getCell(3).value = 'Rentang Skor';
  lHead.getCell(4).value = 'Karakteristik & Penjelasan';
  lHead.getCell(5).value = 'Arah Strategis & Rekomendasi';
  for (let c = 2; c <= 5; c++) {
    const cell = lHead.getCell(c);
    cell.font = { bold: true, size: 9, color: { argb: 'FFFFFFFF' } };
    cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: headerBg } };
    cell.alignment = { vertical: 'middle', horizontal: c <= 3 ? 'center' : 'left' };
  }
  lHead.height = 22;
  sRow++;

  const levels = [
    ['AI-Unready', '0.00 — 1.50', 'Organisasi / individu baru memulai. Belum ada fondasi strategi, data, atau tata kelola.', 'Membangun literasi dasar dan identifikasi 1-2 use-case sederhana.'],
    ['AI-Aware', '1.60 — 2.50', 'Mulai menyadari potensi AI dan mencoba secara sporadis tanpa SOP formal.', 'Membangun standarisasi prompt, pemahaman risiko, dan alur kerja berulang.'],
    ['AI-Ready', '2.60 — 3.50', 'Fondasi siap dan mampu menggunakan AI secara mandiri di beberapa divisi/tugas.', 'Memperluas adopsi ke lintas fungsi dan menyusun roadmap terukur.'],
    ['AI-Enabled', '3.60 — 4.50', 'AI telah terintegrasi dalam alur kerja rutin dan menghasilkan efisiensi terukur.', 'Otomatisasi lanjutan, integrasi API sistem, dan penguatan governance.'],
    ['AI-Mature', '4.60 — 5.00', 'Transformasi AI matang, inovasi berkelanjutan, dan menjadi standar industri.', 'Skalabilitas ekosistem, autonomous agents, dan memimpin ekosistem AI.']
  ];

  levels.forEach(([lvl, rng, char, strat]) => {
    const row = sheetRef.getRow(sRow);
    row.getCell(2).value = lvl;
    row.getCell(2).alignment = { horizontal: 'center' };
    row.getCell(2).font = { bold: true, color: { argb: darkGreen } };

    row.getCell(3).value = rng;
    row.getCell(3).alignment = { horizontal: 'center' };

    row.getCell(4).value = char;
    row.getCell(4).alignment = { wrapText: true };

    row.getCell(5).value = strat;
    row.getCell(5).alignment = { wrapText: true };

    for (let c = 2; c <= 5; c++) {
      const cell = row.getCell(c);
      cell.border = thinBorder;
      if (sRow % 2 === 0) cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: lightGrayBg } };
    }
    row.height = 32;
    sRow++;
  });

  // Save Workbook
  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  const filename = `NORTIS_AI_Readiness_${(submission.companyName || submission.fullName || 'Export').replace(/\s+/g, '_')}.xlsx`;
  saveAs(blob, filename);
};
