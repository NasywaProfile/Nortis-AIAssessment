import { AssessmentSubmission } from '../types';
import { getRecommendation } from './recommendations';
import {
  getLevelSummary,
  getReadinessProfileTitle,
  getDimensionStatus,
  getStrengthInsight,
  getGrowthInsight,
  getActionPlan,
  getReadinessSummary
} from './individualInsights';

export const exportToSlideSummary = (submission: AssessmentSubmission, recTexts?: any) => {
  const isIndividual = submission.assessmentType === 'individual';
  const overallScore = submission.overallScore || 0;
  const readinessLevel = submission.readinessLevel || 'AI-Ready';
  const name = isIndividual ? (submission.fullName || 'Profesional') : (submission.companyName || 'Organisasi');
  const roleOrIndustry = isIndividual ? (submission.jobTitle || 'Praktisi') : (submission.industry || 'Umum');
  const formattedDate = new Date(submission.timestamp || Date.now()).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const { title: recTitle, desc: recDesc, slideActions, slideOutcomes } = getRecommendation(overallScore, recTexts);

  // Pillar or Dimension items
  const items = isIndividual ? [
    { name: 'AI Literacy & Mindset', score: submission.scores.aiLiteracy || 0 },
    { name: 'Task Framing & Prompting', score: submission.scores.taskFraming || 0 },
    { name: 'Workflow & Integration', score: submission.scores.workflow || 0 },
    { name: 'Evaluation & Human Judgment', score: submission.scores.evaluation || 0 },
    { name: 'Responsible AI & Risk', score: submission.scores.responsibleAi || 0 },
    { name: 'Collaboration & AI Growth', score: submission.scores.collaboration || 0 }
  ] : [
    { name: 'Strategi & Kepemimpinan', score: submission.scores.strategi || 0 },
    { name: 'Proses & Alur Kerja', score: submission.scores.proses || 0 },
    { name: 'SDM & Kapabilitas', score: submission.scores.sdm || 0 },
    { name: 'Data & Teknologi', score: submission.scores.data || 0 },
    { name: 'Tata Kelola & AI Bertanggung Jawab', score: submission.scores.tataKelola || 0 }
  ];

  const sorted = [...items].sort((a, b) => b.score - a.score);
  const strongest = sorted.slice(0, 2);
  const weakest = sorted.slice(-2).reverse();

  // Level key
  const getLevelKey = (level: string) => {
    if (level.includes('Mature')) return 'mature';
    if (level.includes('Enabled')) return 'enabled';
    if (level.includes('Ready')) return 'ready';
    if (level.includes('Aware')) return 'aware';
    return 'unready';
  };
  const levelKey = getLevelKey(readinessLevel);
  const indRec = recTexts?.[levelKey];

  const actions = isIndividual 
    ? getActionPlan(weakest.map(w => w.name), readinessLevel)
    : {
        sekarang: (slideActions && slideActions.length > 0) ? slideActions : [
          'Susun komite AI atau tunjuk champion adopsi AI di divisi kunci',
          'Audit data dan use case prioritas yang berpotensi menghasilkan quick-win 30 hari',
          'Tetapkan pedoman keamanan dan batasan kerahasiaan data dalam penggunaan AI'
        ],
        berikutnya: [
          'Jalankan program upskilling prompt engineering & otomatisasi alur kerja',
          'Integrasikan 2-3 tools AI terverifikasi ke dalam SOP operasional rutin'
        ],
        selanjutnya: [
          'Kembangkan roadmap sistematis berbasis metrik ROI dan efisiensi terukur',
          'Evaluasi skalabilitas infrastruktur data governance dan integrasi API AI'
        ]
      };

  const executiveQuote = isIndividual 
    ? getLevelSummary(readinessLevel)
    : (recDesc || 'Fokus pada pembangunan fondasi AI yang terstruktur, aman, dan berdampak nyata bagi bisnis.');

  // Generate self-contained, presentation-ready 16:9 HTML slide deck
  const htmlContent = `<!DOCTYPE html>
<html lang="id">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ringkasan Slide AI Readiness - ${name}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; font-family: 'Plus Jakarta Sans', -apple-system, sans-serif; }
    body { background: #0b1320; color: #0f172a; display: flex; flex-direction: column; align-items: center; min-height: 100vh; padding: 20px; }
    
    /* Control Toolbar */
    .toolbar {
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      background: rgba(15, 23, 42, 0.85); backdrop-filter: blur(12px);
      padding: 8px 18px; border-radius: 9999px; display: flex; align-items: center; gap: 12px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); z-index: 1000;
      color: #fff; font-size: 13px; font-weight: 600;
    }
    .toolbar button {
      background: #009E4F; color: #fff; border: none; padding: 6px 14px; border-radius: 9999px;
      font-size: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;
    }
    .toolbar button:hover { background: #00b85c; transform: translateY(-1px); }
    .toolbar button.sec { background: rgba(255,255,255,0.15); }
    .toolbar button.sec:hover { background: rgba(255,255,255,0.25); }

    /* Presentation Container (16:9 Aspect Ratio) */
    .deck-container {
      width: 100%; max-width: 1100px; aspect-ratio: 16 / 9;
      background: #ffffff; border-radius: 16px; overflow: hidden;
      box-shadow: 0 25px 60px rgba(0,0,0,0.4); margin-top: 60px;
      position: relative; display: flex; flex-direction: column;
    }

    .slide {
      display: none; width: 100%; height: 100%; padding: 48px 56px;
      flex-direction: column; justify-content: space-between;
      position: absolute; top: 0; left: 0; background: #fff;
    }
    .slide.active { display: flex; }

    /* Slide Themes */
    .slide-dark {
      background: radial-gradient(circle at 80% 20%, #0f3d26 0%, #061c12 100%);
      color: #ffffff;
    }

    /* Common Components */
    .header-tag {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 4px 12px; border-radius: 9999px; font-size: 11px; font-weight: 700;
      letter-spacing: 0.5px; text-transform: uppercase;
    }
    .tag-green { background: #ecfdf5; color: #009E4F; border: 1px solid #a7f3d0; }
    .tag-dark-green { background: rgba(0, 158, 79, 0.2); color: #34d399; border: 1px solid rgba(52, 211, 153, 0.3); }

    .title-large { font-size: 38px; font-weight: 800; line-height: 1.15; letter-spacing: -0.5px; }
    .title-medium { font-size: 26px; font-weight: 800; line-height: 1.25; color: #0f172a; }

    .slide-footer {
      display: flex; justify-content: space-between; align-items: center;
      border-top: 1px solid #e2e8f0; padding-top: 14px; font-size: 11px; color: #64748b; font-weight: 500;
    }
    .slide-dark .slide-footer { border-top-color: rgba(255,255,255,0.12); color: #94a3b8; }

    /* Slide 1 - Cover */
    .cover-content { display: flex; flex-direction: column; gap: 16px; margin-top: auto; margin-bottom: auto; }
    .cover-logo { font-size: 20px; font-weight: 900; letter-spacing: 1px; color: #34d399; }

    /* Slide 2 - Overview */
    .score-hero {
      display: grid; grid-template-columns: 240px 1fr; gap: 32px; align-items: center; margin: auto 0;
    }
    .score-card {
      background: #f8fafc; border: 2px solid #009E4F; border-radius: 16px; padding: 28px 20px;
      text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;
    }
    .score-big { font-size: 56px; font-weight: 900; color: #009E4F; line-height: 1; }
    .level-badge {
      display: inline-block; background: #009E4F; color: #fff; font-size: 13px; font-weight: 800;
      padding: 6px 16px; border-radius: 9999px; margin-top: 12px;
    }

    /* Slide 3 - Breakdown */
    .grid-pillars { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; margin: auto 0; }
    .pillar-item {
      background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 18px;
      display: flex; flex-direction: column; gap: 8px;
    }
    .pillar-header { display: flex; justify-content: space-between; align-items: center; font-weight: 700; font-size: 14px; }
    .progress-bar-bg { height: 8px; background: #e2e8f0; border-radius: 9999px; overflow: hidden; }
    .progress-bar-fill { height: 100%; background: #009E4F; border-radius: 9999px; }

    /* Slide 4 - Insights */
    .insights-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; margin: auto 0; }
    .insight-card {
      border-radius: 14px; padding: 22px; display: flex; flex-direction: column; gap: 10px;
    }
    .card-strength { background: #ecfdf5; border: 1px solid #a7f3d0; }
    .card-growth { background: #fffbeb; border: 1px solid #fde68a; }

    /* Slide 5 - Roadmap */
    .roadmap-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; margin: auto 0; }
    .phase-card {
      background: #f8fafc; border: 1px solid #e2e8f0; border-top: 4px solid #009E4F; border-radius: 12px;
      padding: 16px; display: flex; flex-direction: column; gap: 10px;
    }
    .phase-title { font-size: 13px; font-weight: 800; color: #009E4F; text-transform: uppercase; }
    .phase-items { font-size: 12px; color: #334155; line-height: 1.5; display: flex; flex-direction: column; gap: 6px; }

    /* Print styles for perfect PDF export */
    @media print {
      body { background: transparent; padding: 0; }
      .toolbar { display: none !important; }
      .deck-container { box-shadow: none; margin: 0; max-width: none; border-radius: 0; aspect-ratio: auto; }
      .slide { position: relative !important; display: flex !important; page-break-after: always; width: 100vw; height: 100vh; padding: 40px; }
    }
  </style>
</head>
<body>

  <!-- Controls -->
  <div class="toolbar">
    <button class="sec" onclick="prevSlide()">◀ Sebelumnya</button>
    <span id="slideIndicator">Slide 1 / 5</span>
    <button class="sec" onclick="nextSlide()">Berikutnya ▶</button>
    <button onclick="window.print()">🖨️ Cetak / Simpan PDF Slide</button>
  </div>

  <!-- Deck Container -->
  <div class="deck-container">
    
    <!-- SLIDE 1: COVER -->
    <div class="slide slide-dark active">
      <div class="header-tag tag-dark-green">Executive Presentation Brief</div>
      <div class="cover-content">
        <div class="cover-logo">NORTIS</div>
        <h1 class="title-large">Laporan Eksekutif<br>Kesiapan Kecerdasan Buatan (AI)</h1>
        <p style="font-size: 17px; color: #a7f3d0; max-width: 650px;">
          ${isIndividual ? 'Profil Kemahiran, Fluensi, dan Roadmap Praktik AI Mandiri' : 'Evaluasi Tingkat Kematangan dan Peta Jalan Transformasi AI Organisasi'}
        </p>
      </div>
      <div class="slide-footer">
        <span>Kandidat / Organisasi: <strong>${name}</strong> (${roleOrIndustry})</span>
        <span>Tanggal: ${formattedDate}</span>
      </div>
    </div>

    <!-- SLIDE 2: OVERALL SCORE & MATURITY -->
    <div class="slide">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 class="title-medium">1. Ringkasan Skor & Tingkat Kematangan</h2>
        <div class="header-tag tag-green">AI Readiness Index</div>
      </div>
      
      <div class="score-hero">
        <div class="score-card">
          <span style="font-size: 12px; font-weight: 700; color: #64748b; text-transform: uppercase;">Skor Indeks AI</span>
          <div class="score-big">${overallScore.toFixed(2)}</div>
          <span style="font-size: 11px; color: #94a3b8; margin-top: 2px;">skala 5.00</span>
          <div class="level-badge">${readinessLevel}</div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          <h3 style="font-size: 20px; font-weight: 800; color: #0f172a;">${recTitle || 'Kesiapan Fondasi AI Terstruktur'}</h3>
          <p style="font-size: 14px; line-height: 1.6; color: #334155; font-style: italic; background: #f8fafc; border-left: 4px solid #009E4F; padding: 14px 18px; border-radius: 8px;">
            "${executiveQuote}"
          </p>
          <div style="font-size: 12px; color: #64748b;">
            💡 <strong>Arah Strategis:</strong> Mengoptimalkan area keunggulan sambil memperkuat tata kelola dan automasi alur kerja berulang.
          </div>
        </div>
      </div>

      <div class="slide-footer">
        <span>NORTIS • AI Readiness Assessment</span>
        <span>Slide 2 dari 5</span>
      </div>
    </div>

    <!-- SLIDE 3: PILLAR / DIMENSION BREAKDOWN -->
    <div class="slide">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 class="title-medium">2. Distribusi Skor ${isIndividual ? '6 Dimensi Kompetensi' : '5 Pilar Kesiapan'}</h2>
        <div class="header-tag tag-green">Pillar Analysis</div>
      </div>

      <div class="grid-pillars">
        ${items.map((item, idx) => `
          <div class="pillar-item">
            <div class="pillar-header">
              <span style="color: #0f172a;">${idx + 1}. ${item.name}</span>
              <span style="color: #009E4F; font-weight: 800;">${item.score.toFixed(2)} / 5.0</span>
            </div>
            <div class="progress-bar-bg">
              <div class="progress-bar-fill" style="width: ${(item.score / 5) * 100}%;"></div>
            </div>
          </div>
        `).join('')}
      </div>

      <div class="slide-footer">
        <span>Evaluasi Berbasis Standar NORTIS Index</span>
        <span>Slide 3 dari 5</span>
      </div>
    </div>

    <!-- SLIDE 4: KEY INSIGHTS & OPPORTUNITIES -->
    <div class="slide">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 class="title-medium">3. Kekuatan Utama & Area Peluang</h2>
        <div class="header-tag tag-green">Strategic Insights</div>
      </div>

      <div class="insights-grid">
        <div class="insight-card card-strength">
          <div style="font-size: 13px; font-weight: 800; color: #065f46; text-transform: uppercase;">⭐ Kekuatan Menonjol</div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
            ${strongest.map(s => `
              <div style="font-size: 13px; font-weight: 700; color: #047857;">
                • ${s.name} (${s.score.toFixed(2)})
                <div style="font-size: 11.5px; font-weight: 400; color: #334155; margin-top: 2px;">
                  Pondasi yang sangat baik untuk menjadi katalis transformasi.
                </div>
              </div>
            `).join('')}
          </div>
        </div>

        <div class="insight-card card-growth">
          <div style="font-size: 13px; font-weight: 800; color: #92400e; text-transform: uppercase;">🎯 Area Prioritas Perbaikan</div>
          <div style="display: flex; flex-direction: column; gap: 8px; margin-top: 4px;">
            ${weakest.map(w => `
              <div style="font-size: 13px; font-weight: 700; color: #b45309;">
                • ${w.name} (${w.score.toFixed(2)})
                <div style="font-size: 11.5px; font-weight: 400; color: #334155; margin-top: 2px;">
                  Perlu standarisasi alur kerja dan edukasi mitigasi risiko.
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <div class="slide-footer">
        <span>Diagnostik Komparatif NORTIS</span>
        <span>Slide 4 dari 5</span>
      </div>
    </div>

    <!-- SLIDE 5: 90-DAY ACTION ROADMAP -->
    <div class="slide">
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <h2 class="title-medium">4. Roadmap Aksi 90 Hari</h2>
        <div class="header-tag tag-green">Action Roadmap</div>
      </div>

      <div class="roadmap-grid">
        <div class="phase-card">
          <div class="phase-title">Fase 1: 0 - 30 Hari</div>
          <div class="phase-items">
            ${actions.sekarang.slice(0, 3).map(a => `<div>• ${a}</div>`).join('')}
          </div>
        </div>

        <div class="phase-card" style="border-top-color: #2563eb;">
          <div class="phase-title" style="color: #2563eb;">Fase 2: 1 - 3 Bulan</div>
          <div class="phase-items">
            ${actions.berikutnya.slice(0, 3).map(a => `<div>• ${a}</div>`).join('')}
          </div>
        </div>

        <div class="phase-card" style="border-top-color: #7c3aed;">
          <div class="phase-title" style="color: #7c3aed;">Fase 3: 3 - 12 Bulan</div>
          <div class="phase-items">
            ${actions.selanjutnya.slice(0, 3).map(a => `<div>• ${a}</div>`).join('')}
          </div>
        </div>
      </div>

      <div class="slide-footer">
        <span>Konsultasi Roadmap AI Lanjutan: hai@nortis.ai • nortis.ai</span>
        <span>Slide 5 dari 5</span>
      </div>
    </div>

  </div>

  <script>
    let currentSlide = 0;
    const slides = document.querySelectorAll('.slide');
    const indicator = document.getElementById('slideIndicator');

    function updateSlides() {
      slides.forEach((s, idx) => {
        s.classList.toggle('active', idx === currentSlide);
      });
      if (indicator) {
        indicator.textContent = 'Slide ' + (currentSlide + 1) + ' / ' + slides.length;
      }
    }

    function nextSlide() {
      if (currentSlide < slides.length - 1) {
        currentSlide++;
        updateSlides();
      }
    }

    function prevSlide() {
      if (currentSlide > 0) {
        currentSlide--;
        updateSlides();
      }
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') nextSlide();
      if (e.key === 'ArrowLeft' || e.key === 'PageUp') prevSlide();
    });
  </script>
</body>
</html>`;

  // Download interactive slide presentation HTML file
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const filename = `NORTIS_AI_Executive_Slides_${(name || 'Export').replace(/\s+/g, '_')}.html`;
  
  import('file-saver').then(({ saveAs }) => {
    saveAs(blob, filename);
  }).catch(() => {
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  });
};
