const fs = require('fs');

const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const idResult = `    result: {
      title: 'Assessment Selesai',
      desc: 'Terima kasih telah menyelesaikan penilaian kesiapan AI.',
      backHome: 'Kembali ke Beranda',
      subtitle: 'AI Readiness Index & Rekomendasi Anda',
      analyzing: 'Menyiapkan Analisis Strategis AI...',
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
      focusArea: 'Area Fokus Berdasarkan Pilar',
      focusAreaDim: 'Area Fokus Berdasarkan Dimensi',
      recommendedProgram: 'Program Nortis yang Direkomendasikan untuk Perjalanan Anda',
      recommendedProgramDesc: 'Berdasarkan hasil AI readiness assessment Anda, berikut adalah program-program yang dapat membantu mempercepat transformasi AI Anda:',
      discussProgram: 'Ingin mendiskusikan program terbaik untuk organisasi Anda? Hubungi tim kami untuk konsultasi yang dipersonalisasi.',
      downloadReport: 'Download Laporan Penuh',
      downloadPdf: 'Download PDF',
      downloadExcel: 'Download Excel',
      downloadPpt: 'Download PPT',
      emailUs: 'hai@nortis.ai',
      whatsapp: 'WhatsApp'
    },`;

const enResult = `    result: {
      title: 'Assessment Completed',
      desc: 'Thank you for completing the AI readiness assessment.',
      backHome: 'Back to Home',
      subtitle: 'AI Readiness Index & Your Recommendations',
      analyzing: 'Preparing Strategic AI Analysis...',
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
      focusArea: 'Focus Areas by Pillar',
      focusAreaDim: 'Focus Areas by Dimension',
      recommendedProgram: 'Recommended Nortis Programs for Your Journey',
      recommendedProgramDesc: 'Based on your AI readiness assessment results, here are the programs that can help accelerate your AI transformation:',
      discussProgram: 'Want to discuss the best program for your organization? Contact our team for a personalized consultation.',
      downloadReport: 'Download Full Report',
      downloadPdf: 'Download PDF',
      downloadExcel: 'Download Excel',
      downloadPpt: 'Download PPT',
      emailUs: 'hi@nortis.ai',
      whatsapp: 'WhatsApp'
    },`;

content = content.replace(/    result: \{\s+title: 'Assessment Selesai',\s+desc: 'Terima kasih telah menyelesaikan penilaian kesiapan AI.',\s+backHome: 'Kembali ke Beranda'\s+\},/, idResult);
content = content.replace(/    result: \{\s+title: 'Assessment Completed',\s+desc: 'Thank you for completing the AI readiness assessment.',\s+backHome: 'Back to Home'\s+\},/, enResult);

fs.writeFileSync(path, content);
