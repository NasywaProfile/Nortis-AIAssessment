export const getLevelSummary = (level: string) => {
  switch (level) {
    case 'AI-Unready':
      return "Anda masih berada pada tahap awal. Fokus utama saat ini bukan menggunakan banyak tools, tetapi membangun pemahaman dasar dan kebiasaan penggunaan AI yang aman.";
    case 'AI-Aware':
      return "Anda sudah mengenal AI dan mulai mencoba beberapa cara penggunaan. Tantangannya adalah mengubah eksperimen yang terpisah menjadi kebiasaan yang lebih terarah dan konsisten.";
    case 'AI-Ready':
      return "Anda sudah mampu menggunakan AI secara mandiri pada pekerjaan yang familiar. Fondasi sudah cukup kuat, tetapi manfaatnya belum selalu konsisten karena workflow dan dokumentasi masih bisa diperkuat.";
    case 'AI-Enabled':
      return "AI sudah menjadi bagian nyata dari cara Anda bekerja. Anda tidak hanya bisa menggunakan tools, tetapi juga mampu memilih pendekatan, mengatur alur kerja, mengevaluasi hasil, dan menjaga batasan penggunaan.";
    case 'AI-Mature':
      return "Anda memiliki praktik AI yang matang, sistematis, dan dapat dipertanggungjawabkan. Tantangan berikutnya bukan lagi belajar menggunakan AI, tetapi meningkatkan skala, kualitas, dan kemampuan membimbing orang lain.";
    default:
      return "Terus tingkatkan pemahaman dan implementasi AI Anda dalam rutinitas kerja harian.";
  }
};

export const getReadinessProfileTitle = (score: number, level?: string) => {
  if (level) {
    if (level.includes('Mature')) return "Siap Memimpin dan Mengembangkan";
    if (level.includes('Enabled')) return "Terintegrasi dan Konsisten";
    if (level.includes('Ready') && !level.includes('Unready')) return "Siap dan Mandiri";
    if (level.includes('Aware')) return "Mulai Bereksperimen";
    if (level.includes('Unready')) return "Baru Memulai";
  }
  if (score > 4.5) return "Siap Memimpin dan Mengembangkan";
  if (score > 3.5) return "Terintegrasi dan Konsisten";
  if (score > 2.5) return "Siap dan Mandiri";
  if (score > 1.5) return "Mulai Bereksperimen";
  return "Baru Memulai";
};

export const getReadinessProfileTitleEN = (score: number, level?: string) => {
  if (level) {
    if (level.includes('Mature')) return "Ready to Lead & Scale";
    if (level.includes('Enabled')) return "Integrated & Consistent";
    if (level.includes('Ready') && !level.includes('Unready')) return "Ready & Independent";
    if (level.includes('Aware')) return "Starting to Experiment";
    if (level.includes('Unready')) return "Just Getting Started";
  }
  if (score > 4.5) return "Ready to Lead & Scale";
  if (score > 3.5) return "Integrated & Consistent";
  if (score > 2.5) return "Ready & Independent";
  if (score > 1.5) return "Starting to Experiment";
  return "Just Getting Started";
};

export const get90DayFocus = (level: string) => {
  switch (level) {
    case 'AI-Unready':
      return "Membangun dasar: memahami AI, mencoba dengan aman, dan menemukan 1-2 penggunaan yang benar-benar bermanfaat.";
    case 'AI-Aware':
      return "Mengubah eksperimen menjadi praktik: membangun prompt yang dapat dipakai ulang dan penggunaan AI yang lebih konsisten.";
    case 'AI-Ready':
      return "Membuat penggunaan AI dapat diulang: dokumentasikan workflow, ukur manfaat, dan tetapkan review yang konsisten.";
    case 'AI-Enabled':
      return "Meningkatkan leverage: sistematiskan workflow, ukur dampak, dan gunakan automasi dengan batas human review yang jelas.";
    case 'AI-Mature':
      return "Mengoptimalkan dan memimpin: skalakan praktik yang sudah matang tanpa kehilangan kualitas, keamanan, dan penilaian manusia.";
    default:
      return "Fokus pada konsistensi: dokumentasikan prompt, ukur manfaat, dan tetapkan review yang konsisten.";
  }
};

export const get90DayFocusEN = (level: string) => {
  switch (level) {
    case 'AI-Unready':
      return "Building foundations: understand AI, experiment safely, and discover 1-2 truly high-impact use cases.";
    case 'AI-Aware':
      return "Transforming experiments into practice: create reusable prompt workflows and foster consistent AI usage.";
    case 'AI-Ready':
      return "Making AI usage repeatable: document standardized workflows, measure impact, and enforce consistent human reviews.";
    case 'AI-Enabled':
      return "Maximizing leverage: systematize workflows, track business ROI, and deploy automations with defined human-in-the-loop limits.";
    case 'AI-Mature':
      return "Optimizing and leading: scale mature AI practices without compromising quality, governance, and critical human judgment.";
    default:
      return "Focus on consistency: document prompts, measure impact, and maintain continuous human reviews.";
  }
};

export const levelBenchmarkInsights = {
  unready: {
    strengths: [
      { id: 'evaluation', name: 'Evaluation & Human Judgment', text: 'Anda mulai menunjukkan kehati-hatian saat menerima hasil dari AI. Ini menjadi dasar penting agar AI tidak digunakan secara mentah.' },
      { id: 'responsibleAi', name: 'Responsible AI & Risk', text: 'Sudah ada kesadaran awal bahwa data pribadi, rahasia pekerjaan, dan informasi sensitif perlu diperlakukan dengan hati-hati.' }
    ],
    growthAreas: [
      { id: 'workflow', name: 'Workflow & Integration', text: 'AI belum menjadi bagian dari cara kerja sehari-hari. Penggunaan masih sangat terbatas atau belum dilakukan secara konsisten.' },
      { id: 'taskFraming', name: 'Task Framing & Prompting', text: 'Tujuan, konteks, dan instruksi kepada AI masih perlu dilatih agar hasil yang diberikan lebih relevan dan dapat digunakan.' }
    ]
  },
  aware: {
    strengths: [
      { id: 'aiLiteracy', name: 'AI Literacy & Mindset', text: 'Anda sudah memahami fungsi dasar AI dan melihat AI sebagai alat bantu untuk meningkatkan kualitas atau kecepatan kerja.' },
      { id: 'evaluation', name: 'Evaluation & Human Judgment', text: 'Anda mulai menyadari bahwa output AI perlu diperiksa dan tidak selalu dapat langsung dipercaya.' }
    ],
    growthAreas: [
      { id: 'workflow', name: 'Workflow & Integration', text: 'Penggunaan AI masih bergantung pada situasi. Belum ada workflow, template, atau prompt yang dipakai kembali secara rutin.' },
      { id: 'responsibleAi', name: 'Responsible AI & Risk', text: 'Kesadaran risiko sudah ada, tetapi aturan pribadi tentang data sensitif, hak cipta, dan penggunaan output belum konsisten.' }
    ]
  },
  ready: {
    strengths: [
      { id: 'taskFraming', name: 'Task Framing & Prompting', text: 'Anda dapat memberi konteks, instruksi, dan batasan yang cukup jelas serta memperbaiki prompt ketika hasil pertama belum sesuai.' },
      { id: 'evaluation', name: 'Evaluation & Human Judgment', text: 'Anda memahami kapan hasil AI perlu diverifikasi dan kapan keputusan tetap harus bergantung pada penilaian manusia.' }
    ],
    growthAreas: [
      { id: 'workflow', name: 'Workflow & Integration', text: 'AI sudah digunakan untuk beberapa aktivitas, tetapi workflow yang dapat digunakan kembali belum sepenuhnya terbentuk.' },
      { id: 'collaboration', name: 'Collaboration & AI Growth', text: 'Pembelajaran AI masih lebih banyak bersifat pribadi. Praktik yang efektif belum banyak dibagikan atau dikembangkan bersama orang lain.' }
    ]
  },
  enabled: {
    strengths: [
      { id: 'evaluation', name: 'Evaluation & Human Judgment', text: 'Anda memiliki kebiasaan review yang kuat dan mampu membedakan pekerjaan yang dapat dibantu AI dengan keputusan yang tetap membutuhkan manusia.' },
      { id: 'collaboration', name: 'Collaboration & AI Growth', text: 'Anda aktif belajar, dapat menggunakan AI sebagai partner berpikir, dan mulai mampu membantu orang lain menggunakan AI dengan lebih efektif.' }
    ],
    growthAreas: [
      { id: 'workflow', name: 'Workflow & Integration', text: 'Workflow sudah cukup matang, tetapi beberapa proses masih dapat dibuat lebih efisien melalui automasi, template yang lebih terstruktur, atau integrasi antar-tools.' },
      { id: 'responsibleAi', name: 'Responsible AI & Risk', text: 'Pemahaman risiko sudah baik. Tahap berikutnya adalah membuat aturan dan kebiasaan tersebut lebih eksplisit agar tetap konsisten pada pekerjaan yang semakin kompleks.' }
    ]
  },
  mature: {
    strengths: [
      { id: 'taskFraming', name: 'Task Framing & Prompting', text: 'Anda mampu merancang instruksi dan alur interaksi yang kompleks, memilih pendekatan yang sesuai, dan memperbaiki sistem berdasarkan hasil penggunaan nyata.' },
      { id: 'collaboration', name: 'Collaboration & AI Growth', text: 'Anda mampu menjadikan AI sebagai partner berpikir sekaligus membimbing orang lain dalam membangun praktik AI yang efektif dan bertanggung jawab.' }
    ],
    growthAreas: [
      { id: 'responsibleAi', name: 'Responsible AI & Risk', text: 'Pada level matang, fokus bergeser ke risiko yang lebih kompleks seperti penggunaan agent, perlindungan informasi, hak cipta, dan batas keputusan yang boleh didelegasikan.' },
      { id: 'workflow', name: 'Workflow & Integration', text: 'Workflow sudah kuat. Peluang terbesar ada pada optimasi, integrasi antar-tools, penanganan kasus khusus, dan pengurangan pekerjaan manual yang tidak memberi nilai tambah.' }
    ]
  }
};

export const getDimensionStatus = (score: number) => {
  if (score >= 4.6) return "Advanced";
  if (score >= 3.6) return "Strong";
  if (score >= 2.6) return "Established";
  if (score >= 1.6) return "Developing";
  return "Needs Foundation";
};

const dimDesc = {
  aiLiteracy: {
    "Advanced": "Pemahaman komprehensif Anda tentang AI memungkinkan Anda membedakan dengan presisi kapan harus menggunakan AI dan kapan mengandalkan human judgment.",
    "Strong": "Anda memiliki pemahaman yang kuat terhadap kemampuan dan keterbatasan AI serta cukup mampu menentukan penggunaannya secara tepat.",
    "Established": "Pemahaman dasar Anda sudah memadai, namun Anda perlu lebih kritis dalam menilai kemampuan dan keterbatasan AI dalam kasus yang lebih kompleks.",
    "Developing": "Anda mulai memahami AI, tetapi masih perlu membedakan lebih jelas antara kapabilitas nyata AI dan persepsi umum.",
    "Needs Foundation": "Pemahaman terhadap cara kerja dan kapabilitas AI masih sangat minim. Dibutuhkan edukasi dasar tentang apa itu AI generatif."
  },
  taskFraming: {
    "Advanced": "Anda ahli dalam merumuskan instruksi dan konteks yang sangat presisi, menghasilkan output AI yang langsung dapat digunakan.",
    "Strong": "Anda konsisten memberikan konteks dan batasan yang jelas saat melakukan prompting, sehingga output yang dihasilkan relevan.",
    "Established": "Kemampuan prompting Anda sudah cukup untuk tugas sehari-hari, namun masih bisa lebih dioptimalkan dengan instruksi yang terstruktur.",
    "Developing": "Anda mulai mencoba membuat prompt, tetapi hasilnya masih sering meleset karena kurangnya konteks dan spesifisitas instruksi.",
    "Needs Foundation": "Belum terbiasa memberikan instruksi terstruktur kepada AI. Output yang didapatkan seringkali tidak sesuai dengan kebutuhan."
  },
  workflow: {
    "Advanced": "AI telah menjadi tulang punggung efisiensi Anda, terintegrasi mulus dalam workflow dengan berbagai otomatisasi cerdas.",
    "Strong": "AI telah menjadi bagian rutin dari alur kerja Anda dan terbukti memberikan peningkatan produktivitas yang terukur.",
    "Established": "Anda sudah menggunakan AI dalam rutinitas, tetapi pendekatannya belum sepenuhnya sistematis di semua proses kerja.",
    "Developing": "Penggunaan AI masih sporadis dan belum menjadi bagian terpadu dari workflow pekerjaan sehari-hari.",
    "Needs Foundation": "Sama sekali belum ada integrasi AI ke dalam alur kerja rutin. Anda masih melakukan sebagian besar pekerjaan secara konvensional."
  },
  evaluation: {
    "Advanced": "Anda memiliki intuisi tajam dan standar evaluasi yang ketat dalam memvalidasi, menyunting, dan meningkatkan hasil dari AI.",
    "Strong": "Anda terbiasa memeriksa dan mengkritisi output AI, tidak serta merta menerima informasi mentah tanpa proses validasi.",
    "Established": "Anda melakukan evaluasi output AI, tetapi terkadang masih luput dalam mengidentifikasi bias atau kesalahan konteks.",
    "Developing": "Anda menyadari perlunya evaluasi, namun seringkali masih bergantung pada output AI karena kurang terbiasa mengkritisinya.",
    "Needs Foundation": "Kecenderungan untuk menerima mentah-mentah hasil dari AI masih tinggi. Human judgment belum secara aktif dilibatkan."
  },
  responsibleAi: {
    "Advanced": "Anda selalu mengedepankan etika, kepatuhan, dan manajemen risiko yang ketat sebelum mengimplementasikan solusi AI.",
    "Strong": "Kesadaran Anda terhadap etika dan keamanan data sangat baik, selalu mempertimbangkan risiko sebelum berinteraksi dengan AI.",
    "Established": "Anda memahami konsep etika AI, tetapi penerapannya dalam memitigasi risiko keamanan data masih belum konsisten.",
    "Developing": "Kesadaran akan risiko dan etika penggunaan AI masih parsial, membutuhkan panduan lebih jelas tentang standar keamanan.",
    "Needs Foundation": "Risiko terkait keamanan data dan privasi dalam penggunaan AI belum menjadi pertimbangan dalam keseharian Anda."
  },
  collaboration: {
    "Advanced": "Anda berperan sebagai katalis dan mentor, memimpin inisiatif AI dan aktif meningkatkan kemampuan rekan-rekan di sekitar Anda.",
    "Strong": "Anda aktif berkolaborasi dan membagikan praktik terbaik penggunaan AI, mendukung terciptanya budaya inovasi di tim.",
    "Established": "Anda terbuka untuk berkolaborasi menggunakan AI, namun belum secara proaktif membagikan insight atau inisiatif baru kepada tim.",
    "Developing": "Penggunaan AI masih terisolasi untuk kebutuhan personal dan belum ada inisiatif untuk belajar atau berkolaborasi dengan orang lain.",
    "Needs Foundation": "Belum ada interaksi, diskusi, atau kolaborasi dengan tim terkait bagaimana AI dapat membantu memecahkan masalah bersama."
  }
};

export const getDimensionDescription = (dimId: string, status: string, customDescriptions?: any) => {
  if (customDescriptions?.[dimId]?.[status]) {
    return customDescriptions[dimId][status];
  }
  return (dimDesc as any)[dimId]?.[status] || "Deskripsi tidak tersedia.";
};

const strengthInsights = {
  aiLiteracy: "Anda memiliki pondasi literasi AI yang kuat, membedakan kapabilitas nyata dari sekadar tren, dan tahu kapan intervensi manusia dibutuhkan.",
  taskFraming: "Keahlian Anda merumuskan konteks (prompting) membuat interaksi dengan AI lebih efektif dan relevan dengan kebutuhan bisnis.",
  workflow: "Anda unggul dalam menemukan peluang integrasi AI ke dalam alur kerja, sehingga meningkatkan efisiensi dan menghemat waktu.",
  evaluation: "Kemampuan human judgment Anda menonjol; Anda memvalidasi dan menyempurnakan hasil AI alih-alih menerimanya secara mentah.",
  responsibleAi: "Anda memprioritaskan keamanan data dan pertimbangan etis, menjadikan penggunaan AI Anda aman dan profesional.",
  collaboration: "Anda mampu menginspirasi rekan kerja dan berkolaborasi secara efektif dalam mengadopsi teknologi AI di lingkungan kerja."
};

export const levelStrengthInsightsDefaults: Record<string, Record<string, string>> = {
  mature: {
    aiLiteracy: "Literasi AI tingkat lanjut memungkinkan Anda mengevaluasi arsitektur model mutakhir dan menerapkannya secara strategis.",
    taskFraming: "Anda menguasai perumusan prompt kompleks, chaining, dan framework instruksi yang menghasilkan output akurasi tinggi.",
    workflow: "Integrasi AI telah menjadi tulang punggung workflow harian Anda dengan otomatisasi proses yang efisien.",
    evaluation: "Human judgment tajam Anda mampu mendeteksi bias halus, logika implisit, dan memvalidasi hasil kritis secara ketat.",
    responsibleAi: "Anda menjadi teladan dalam tata kelola etika, perlindungan data rahasia, dan mitigasi risiko implementasi AI.",
    collaboration: "Anda berperan sebagai AI Champion dan mentor yang aktif menggerakkan adopsi AI di tim dan organisasi."
  },
  enabled: {
    aiLiteracy: "Pemahaman konseptual yang solid memungkinkan Anda memilih tools dan model AI yang tepat untuk kebutuhan kerja.",
    taskFraming: "Anda terbiasa menyusun prompt dengan konteks lengkap, batasan yang jelas, dan format output yang terstruktur.",
    workflow: "AI telah rutin digunakan dalam alur kerja harian Anda untuk mempercepat tugas analitis maupun administratif.",
    evaluation: "Anda secara konsisten memvalidasi output AI dan tidak menerimanya mentah-mentah sebelum digunakan.",
    responsibleAi: "Kesadaran etika dan kepatuhan privasi data Anda sangat baik, selalu menjaga kerahasiaan informasi bisnis.",
    collaboration: "Anda aktif berbagi prompt dan teknik AI yang berhasil kepada rekan kerja di unit Anda."
  },
  ready: {
    aiLiteracy: "Anda memiliki pemahaman dasar yang baik tentang cara kerja AI dan terbuka mengeksplorasi penerapannya.",
    taskFraming: "Anda mampu memberikan instruksi terarah dan menyesuaikan kembali prompt saat hasilnya belum sesuai.",
    workflow: "Anda mulai memanfaatkan AI untuk beberapa tugas rutin dan merasakan peningkatan kecepatan kerja.",
    evaluation: "Anda menyadari pentingnya verifikasi hasil AI dan mengecek poin-poin utama sebelum menggunakan laporan.",
    responsibleAi: "Anda memahami batasan keamanan data dasar dan berhati-hati saat memasukkan informasi sensitif.",
    collaboration: "Anda antusias mendiskusikan pengalaman penggunaan AI dengan rekan kerja untuk belajar bersama."
  },
  aware: {
    aiLiteracy: "Keingintahuan Anda tinggi dan Anda mulai mengenali berbagai potensi yang dapat ditawarkan oleh AI.",
    taskFraming: "Anda dapat mengajukan pertanyaan dan perintah sederhana kepada AI untuk membantu tugas awal.",
    workflow: "Anda sesekali mencoba menggunakan AI untuk tugas tertentu seperti mencari ide atau merapikan tulisan.",
    evaluation: "Anda mulai terbiasa membaca ulang jawaban AI untuk memastikan kecocokannya dengan konteks tugas.",
    responsibleAi: "Anda mengetahui bahwa keamanan data itu penting dan berusaha mematuhi petunjuk umum penggunaan tools.",
    collaboration: "Anda terbuka untuk menerima masukan dan arahan rekan kerja seputar pemanfaatan AI yang baik."
  },
  unready: {
    aiLiteracy: "Anda memiliki potensi eksplorasi yang sangat besar untuk mulai mengenal dan memanfaatkan teknologi AI modern.",
    taskFraming: "Anda telah mulai mencoba mengetikkan instruksi ke asisten AI untuk melihat bagaimana AI merespons.",
    workflow: "Peluang optimasi kerja Anda sangat terbuka lebar seiring dimulainya adopsi tools digital.",
    evaluation: "Keterbukaan untuk belajar mengecek keakuratan informasi menjadi modal awal yang sangat baik.",
    responsibleAi: "Kehati-hatian awal Anda dalam menjaga kerahasiaan informasi menjadi pondasi kepatuhan yang sehat.",
    collaboration: "Dukungan dari rekan kerja dan program pelatihan akan mempercepat kurva pembelajaran Anda secara pesat."
  }
};

export const getStrengthInsight = (
  dimId: string, 
  customLevelStrengthInsights?: any, 
  fallbackStrengthInsights?: any,
  levelKey?: string
) => {
  if (customLevelStrengthInsights?.[dimId]) {
    return customLevelStrengthInsights[dimId];
  }
  if (levelKey && levelStrengthInsightsDefaults[levelKey]?.[dimId]) {
    return levelStrengthInsightsDefaults[levelKey][dimId];
  }
  if (fallbackStrengthInsights?.[dimId]) {
    return fallbackStrengthInsights[dimId];
  }
  return (strengthInsights as any)[dimId] || "Kekuatan di area ini memberikan keunggulan kompetitif yang solid bagi Anda.";
};

const growthInsights = {
  aiLiteracy: "Kurangnya pemahaman terhadap mekanisme dasar AI dapat menghambat pemanfaatannya. Fokuslah pada membangun pondasi literasi terlebih dahulu.",
  taskFraming: "Instruksi yang kurang jelas akan menghasilkan output yang tidak relevan. Belajar menstrukturkan prompt akan sangat membantu meningkatkan efektivitas.",
  workflow: "Penggunaan AI yang belum konsisten membatasi potensi produktivitas Anda. Fokus berikutnya adalah menjadikan AI bagian permanen dari workflow Anda.",
  evaluation: "Terlalu mengandalkan AI tanpa validasi yang kuat berisiko menimbulkan kesalahan. Latih kemampuan evaluasi dan critical thinking terhadap output mesin.",
  responsibleAi: "Mengabaikan aspek privasi dan risiko bisa berdampak negatif. Anda perlu lebih peduli terhadap pedoman etika dan keamanan data saat menggunakan AI.",
  collaboration: "Penggunaan AI secara terisolasi mengurangi dampak positifnya. Mulailah berbagi knowledge dan berkolaborasi dengan rekan kerja."
};

export const levelGrowthInsightsDefaults: Record<string, Record<string, string>> = {
  mature: {
    aiLiteracy: "Meskipun literasi Anda tinggi, tetap ikuti perkembangan arsitektur AI terbaru (reasoning models, autonomous agents) dan pelajari implikasi regulasi global AI terkini.",
    taskFraming: "Kembangkan teknik prompting tingkat lanjut seperti structured few-shot, XML tags framing, dan meta-prompting untuk membangun sistem otomatisasi mandiri.",
    workflow: "Otomatisasikan pipeline kerja end-to-end menggunakan integrasi API atau autonomous agents lintas platform untuk mencapai efisiensi skala penuh.",
    evaluation: "Bangun kriteria evaluasi benchmark berbasis metrik objektif untuk menguji keakuratan sistem dan prompt AI sebelum dideploy ke tim.",
    responsibleAi: "Pimpin standarisasi tata kelola AI, perlindungan kekayaan intelektual (IP), dan kepatuhan privasi data di tingkat departemen atau organisasi.",
    collaboration: "Posisikan diri sebagai AI Champion dan mentor yang aktif menginspirasi serta melatih rekan kerja untuk mempercepat transformasi digital bersama."
  },
  enabled: {
    aiLiteracy: "Perdalam pemahaman tentang cara kerja model multimodal dan mekanisme reasoning AI agar dapat memilih model yang paling tepat untuk tugas kompleks.",
    taskFraming: "Sempurnakan standarisasi prompt organisasi dengan variabel dinamis dan pengujian iteratif agar output selalu konsisten memenuhi standar kerja.",
    workflow: "Bangun template alur kerja yang dapat digunakan berulang oleh tim dan hilangkan langkah copy-paste manual antar aplikasi kerja.",
    evaluation: "Pertajam intuisi dalam mendeteksi bias tersembunyi, inkonsistensi data, dan logika implisit yang keliru pada output AI analitis.",
    responsibleAi: "Pastikan pemahaman mendalam tentang lisensi model, batasan hak cipta output komersial, dan kepatuhan regulasi perlindungan data pribadi (UU PDP).",
    collaboration: "Dokumentasikan pustaka prompt dan studi kasus keberhasilan Anda, lalu bagikan secara rutin ke rekan divisi untuk mendongkrak performa tim."
  },
  ready: {
    aiLiteracy: "Tingkatkan pemahaman tentang batasan dan kapabilitas AI, serta pahami konsep halusinasi dan dependensi data konteks secara lebih mendalam.",
    taskFraming: "Terapkan framework prompt terstruktur (Role, Context, Instruction, Constraint, Output Format) agar hasil AI lebih terarah dan langsung dapat dipakai.",
    workflow: "Integrasikan AI ke dalam 2–3 tugas rutin harian secara disiplin agar menjadi kebiasaan kerja permanen yang terukur produktivitasnya.",
    evaluation: "Terapkan metode 'Verifikasi 2x' secara disiplin dengan selalu melakukan cek silang fakta dan data penting sebelum digunakan dalam keputusan kerja.",
    responsibleAi: "Terapkan batasan ketat kerahasiaan data; hindari memasukkan informasi internal perusahaan, kode rahasia, atau data klien ke public AI.",
    collaboration: "Mulailah berdiskusi dengan rekan kerja tentang use case AI yang berhasil dan bertukar trik cara prompting yang efektif."
  },
  aware: {
    aiLiteracy: "Bangun pemahaman dasar mengenai apa yang bisa dan tidak bisa dilakukan AI secara realistis, guna menghindari ekspektasi keliru terhadap teknologi.",
    taskFraming: "Hindari prompt satu kalimat yang terlalu umum. Belajarlah memberikan instruksi yang spesifik dan konteks latar belakang pekerjaan Anda kepada AI.",
    workflow: "Petakan proses kerja manual Anda yang paling memakan waktu dan pilih satu tugas sederhana untuk dibantu AI setiap hari.",
    evaluation: "Tingkatkan sikap skeptis konstruktif; jangan langsung menerima teks AI mentah-mentah tanpa membaca ulang dan mengecek kebenarannya.",
    responsibleAi: "Pahami risiko keamanan data dasar dan jangan pernah memasukkan password, data finansial, atau identitas pribadi ke tools AI pihak ketiga.",
    collaboration: "Cari rekan belajar (peer partner) di tempat kerja untuk saling berbagi pengalaman dan kendala saat mencoba tools AI."
  },
  unready: {
    aiLiteracy: "Fokus pada pengenalan dasar konsep Generative AI dan terminologi praktisnya melalui modul atau panduan pemula yang aplikatif.",
    taskFraming: "Pelajari cara menulis instruksi jelas kepada AI seperti memberikan arahan kepada asisten kerja pemula agar jawabannya relevan.",
    workflow: "Mulai biasakan membuka tools AI untuk membantu tugas sederhana seperti merangkum catatan atau menyusun draf email awal.",
    evaluation: "Kembangkan kesadaran bahwa AI dapat membuat kekeliruan (halusinasi), sehingga setiap output wajib dibaca dan diverifikasi mandiri.",
    responsibleAi: "Ketahui aturan dasar etika dan keamanan data saat menggunakan AI untuk melindungi privasi pribadi dan keamanan perusahaan.",
    collaboration: "Buka diri untuk bertanya kepada rekan kerja yang sudah terbiasa menggunakan AI tentang tools apa yang bermanfaat untuk dicoba."
  }
};

export const levelStrengthInsightsDefaultsEN: Record<string, Record<string, string>> = {
  mature: {
    aiLiteracy: "Advanced AI literacy allows you to strategically evaluate cutting-edge models and apply them effectively.",
    taskFraming: "You master complex prompt engineering, chaining, and structured frameworks that yield high-precision results.",
    workflow: "AI integration serves as the reliable backbone of your daily workflow with efficient end-to-end automation.",
    evaluation: "Your sharp human judgment detects subtle biases, implicit logic flaws, and rigorously validates critical outputs.",
    responsibleAi: "You set the standard in ethical governance, sensitive data protection, and comprehensive AI risk mitigation.",
    collaboration: "You act as an inspiring AI champion and mentor, actively driving digital adoption across teams and the organization."
  },
  enabled: {
    aiLiteracy: "Solid conceptual understanding enables you to select the right AI tools and models for business tasks.",
    taskFraming: "You routinely craft prompts with complete context, explicit constraints, and structured output expectations.",
    workflow: "AI is regularly woven into your daily workflow to accelerate both analytical and administrative responsibilities.",
    evaluation: "You consistently validate AI outputs and exercise critical judgment before applying results to work.",
    responsibleAi: "Strong awareness of data ethics and privacy compliance ensures confidential company information remains secure.",
    collaboration: "You actively share successful prompt templates and AI techniques with teammates in your department."
  },
  ready: {
    aiLiteracy: "You possess a sound foundational understanding of AI capabilities and maintain an open, proactive learning attitude.",
    taskFraming: "You provide clear instructions and know how to refine prompts when initial responses miss the mark.",
    workflow: "You apply AI to routine tasks, achieving tangible productivity improvements and time savings.",
    evaluation: "You recognize the need for verification and check key figures and claims before utilizing AI outputs.",
    responsibleAi: "You respect foundational data security guidelines and remain cautious when handling sensitive company inputs.",
    collaboration: "You engage enthusiastically in peer discussions to exchange prompt tips and learn collaboratively."
  },
  aware: {
    aiLiteracy: "High curiosity and early awareness help you recognize the transformative potential AI brings to work.",
    taskFraming: "You can formulate simple questions and direct prompts to kickstart preliminary tasks and brainstorming.",
    workflow: "You occasionally utilize AI for focused needs such as drafting emails, summarizing text, or generating ideas.",
    evaluation: "You are developing the habit of reviewing AI responses to ensure relevance to your immediate assignment.",
    responsibleAi: "You understand that data privacy matters and strive to adhere to general organizational guidelines.",
    collaboration: "You are receptive to guidance and recommendations from peers experienced with AI tools."
  },
  unready: {
    aiLiteracy: "Great potential for discovery as you take your initial steps into utilizing modern generative tools.",
    taskFraming: "You have begun experimenting with prompt inputs to observe how conversational AI assistants respond.",
    workflow: "Substantial opportunities for work optimization await as digital AI tools are introduced into your routine.",
    evaluation: "Openness to learning and checking information validity provides an excellent foundation for future growth.",
    responsibleAi: "Natural caution in protecting privacy establishes a sound basis for data compliance.",
    collaboration: "With team support and structured learning, your AI adoption trajectory can accelerate rapidly."
  }
};

export const levelGrowthInsightsDefaultsEN: Record<string, Record<string, string>> = {
  mature: {
    aiLiteracy: "Stay ahead by tracking autonomous reasoning agents and understanding emerging global AI regulatory frameworks.",
    taskFraming: "Advance into meta-prompting, structured XML tag framing, and few-shot calibration for autonomous multi-agent systems.",
    workflow: "Automate end-to-end business pipelines using cross-platform API integrations or autonomous agents for full scale efficiency.",
    evaluation: "Establish benchmark evaluation criteria based on objective metrics to test prompt accuracy before team-wide deployment.",
    responsibleAi: "Lead standardized AI governance, intellectual property safeguards, and compliance with data privacy regulations across divisions.",
    collaboration: "Mentor colleagues, share reusable prompt libraries, and lead workshops to elevate overall organizational digital literacy."
  },
  enabled: {
    aiLiteracy: "Deepen your understanding of multimodal reasoning and model parameters to choose optimal solutions for complex tasks.",
    taskFraming: "Standardize prompt templates with dynamic variables and iterative testing to ensure consistent business deliverables.",
    workflow: "Build repeatable workflow templates for your team and eliminate repetitive manual data transfers between apps.",
    evaluation: "Sharpen intuition for spotting subtle hallucinations, data inconsistencies, and skewed logic in complex analytical outputs.",
    responsibleAi: "Ensure full alignment with model licenses, commercial output guidelines, and data protection privacy standards.",
    collaboration: "Document your prompt repository and case studies to inspire and upskill your immediate working group."
  },
  ready: {
    aiLiteracy: "Expand your knowledge of AI limitations, hallucinations, and context window dependencies to avoid over-reliance.",
    taskFraming: "Adopt structured prompt frameworks (Role, Context, Instruction, Constraint, Format) for faster, reliable results.",
    workflow: "Consistently integrate AI into 2–3 daily routine tasks to turn productivity gains into permanent working habits.",
    evaluation: "Practice a disciplined 'Double Verification' rule by cross-checking critical facts and figures before decision-making.",
    responsibleAi: "Enforce strict confidentiality boundaries; never paste proprietary data, internal code, or client records into public AI tools.",
    collaboration: "Engage with colleagues about high-impact AI use cases and exchange practical techniques that elevate team output."
  },
  aware: {
    aiLiteracy: "Build a realistic understanding of what AI can and cannot accomplish to avoid misconceptions about its capabilities.",
    taskFraming: "Avoid vague, single-sentence prompts. Provide specific context and background details to receive actionable answers.",
    workflow: "Identify your most repetitive manual task each day and commit to utilizing an AI assistant to accelerate it.",
    evaluation: "Cultivate constructive skepticism; always review, fact-check, and edit AI drafts rather than accepting them raw.",
    responsibleAi: "Understand foundational privacy risks; never input passwords, proprietary financials, or personal identifiable data.",
    collaboration: "Find a learning buddy in your workplace to share experiences, overcome bottlenecks, and discover useful tools."
  },
  unready: {
    aiLiteracy: "Focus on fundamental Generative AI concepts and practical terminology through hands-on beginner guides.",
    taskFraming: "Learn to write clear, step-by-step instructions as if guiding a newly hired assistant to achieve relevant answers.",
    workflow: "Start by opening an AI assistant for simple tasks like summarizing meeting notes or drafting initial outlines.",
    evaluation: "Recognize that AI can make factual errors (hallucinations); always read and independently confirm outputs.",
    responsibleAi: "Familiarize yourself with corporate security policies and ethical guidelines for safe digital tool usage.",
    collaboration: "Reach out to tech-savvy colleagues to ask which AI tools they find most useful in day-to-day operations."
  }
};

export const getGrowthInsight = (
  dimId: string, 
  customLevelGrowthInsights?: any, 
  fallbackGrowthInsights?: any,
  levelKey?: string
) => {
  if (customLevelGrowthInsights?.[dimId]) {
    return customLevelGrowthInsights[dimId];
  }
  if (levelKey && levelGrowthInsightsDefaults[levelKey]?.[dimId]) {
    return levelGrowthInsightsDefaults[levelKey][dimId];
  }
  if (fallbackGrowthInsights?.[dimId]) {
    return fallbackGrowthInsights[dimId];
  }
  return (growthInsights as any)[dimId] || "Area ini memerlukan fokus lebih agar Anda dapat memaksimalkan potensi AI.";
};

export const getActionPlan = (weakestDimensions: string[], level: string) => {
  const actions = {
    sekarang: [] as string[],
    berikutnya: [] as string[],
    selanjutnya: [] as string[]
  };

  const primaryWeakness = weakestDimensions[0] || 'workflow';

  // SEKARANG (0-30 Hari) - Sangat bergantung pada kelemahan utama
  if (primaryWeakness === 'aiLiteracy') {
    actions.sekarang.push("Ikuti kursus singkat atau baca materi dasar mengenai cara kerja Generative AI.");
    actions.sekarang.push("Identifikasi 3 jenis tugas yang BISA dan TIDAK BISA dilakukan oleh AI di posisi Anda.");
  } else if (primaryWeakness === 'taskFraming') {
    actions.sekarang.push("Gunakan framework prompt (Konteks, Instruksi, Format) setiap kali menggunakan AI.");
    actions.sekarang.push("Simpan 2 template prompt yang terbukti memberikan hasil baik untuk tugas rutin.");
  } else if (primaryWeakness === 'evaluation') {
    actions.sekarang.push("Terapkan aturan 'Validasi 2x' untuk setiap output AI sebelum digunakan dalam pekerjaan.");
    actions.sekarang.push("Posisikan diri sebagai 'Editor Utama', bukan hanya konsumen dari hasil AI.");
  } else if (primaryWeakness === 'responsibleAi') {
    actions.sekarang.push("Hapus kebiasaan memasukkan data sensitif perusahaan atau klien ke public AI tools.");
    actions.sekarang.push("Pelajari kebijakan perusahaan Anda (jika ada) mengenai penggunaan AI.");
  } else if (primaryWeakness === 'collaboration') {
    actions.sekarang.push("Diskusikan satu pengalaman Anda menggunakan AI dengan rekan kerja minggu ini.");
    actions.sekarang.push("Tanyakan kepada rekan tim tools AI apa yang sering mereka gunakan.");
  } else { // workflow
    actions.sekarang.push("Identifikasi tiga aktivitas kerja rutin yang dapat dibantu AI.");
    actions.sekarang.push("Gunakan satu tools AI secara konsisten selama dua minggu untuk satu tugas spesifik.");
  }
  
  if (actions.sekarang.length < 3) {
    actions.sekarang.push("Dedikasikan 15 menit setiap hari untuk mengeksplorasi penggunaan tools AI baru yang relevan.");
  }

  // BERIKUTNYA (1-3 Bulan)
  if (level === 'AI-Unready' || level === 'AI-Aware') {
    actions.berikutnya.push("Bangun personal AI toolkit yang terdiri dari 2–3 tools utama.");
    actions.berikutnya.push("Dokumentasikan prompt dan alur kerja AI yang terbukti efektif untuk tugas Anda.");
    actions.berikutnya.push("Pilih satu workflow pekerjaan sederhana untuk dioptimalkan secara penuh menggunakan AI.");
  } else {
    actions.berikutnya.push("Integrasikan AI ke dalam alur kerja harian secara mulus tanpa mengganggu kualitas.");
    actions.berikutnya.push("Temukan rekan diskusi (peer learning partner) untuk bereksperimen dengan AI bersama-sama.");
    actions.berikutnya.push("Evaluasi ulang tools yang Anda gunakan; hentikan yang tidak efisien dan fokus pada yang berdampak tinggi.");
  }

  // SELANJUTNYA (3-12 Bulan)
  if (level === 'AI-Mature' || level === 'AI-Enabled') {
    actions.selanjutnya.push("Bangun workflow AI yang lebih otomatis (contoh: Zapier/Make) untuk pekerjaan repetitif.");
    actions.selanjutnya.push("Bagikan best practice penggunaan AI kepada tim dan dorong standarisasi di tingkat departemen.");
  } else {
    actions.selanjutnya.push("Perluas cakupan penggunaan AI dari tugas klerikal ke tugas analitis atau kreatif tingkat menengah.");
    actions.selanjutnya.push("Lakukan assessment ulang ini untuk melihat perkembangan AI Readiness Anda.");
  }
  
  if (actions.selanjutnya.length < 3) {
      actions.selanjutnya.push("Posisikan diri Anda sebagai konsultan internal AI di lingkaran rekan kerja Anda.");
  }

  return actions;
};

export const getReflectionPrompts = (weakestDimensions: string[], strongestDimensions: string[]) => {
  const prompts = [
    "Aktivitas apa dalam pekerjaan Anda yang paling berpotensi ditingkatkan efisiensinya dengan bantuan AI?"
  ];

  if (weakestDimensions.includes('evaluation')) {
    prompts.push("Di bagian mana Anda merasa masih terlalu bergantung pada output AI tanpa melakukan evaluasi kritis secara mendalam?");
  }
  if (weakestDimensions.includes('responsibleAi')) {
    prompts.push("Bagaimana Anda dapat memastikan penggunaan AI Anda tetap aman dan tidak membocorkan data sensitif?");
  }
  if (weakestDimensions.includes('workflow')) {
    prompts.push("Hambatan terbesar apa yang mencegah Anda menjadikan AI sebagai kebiasaan kerja sehari-hari?");
  }
  if (strongestDimensions.includes('collaboration')) {
    prompts.push("Bagaimana cara terbaik Anda dapat membagikan keahlian AI Anda saat ini untuk membantu meningkatkan produktivitas tim?");
  }
  
  if (prompts.length < 3) {
      prompts.push("Skill spesifik terkait AI apa yang paling krusial untuk Anda kuasai dalam 90 hari ke depan?");
  }
  
  if (prompts.length < 4) {
      prompts.push("Jika Anda memiliki satu asisten AI pribadi super cerdas hari ini, apa tugas pertama yang akan Anda delegasikan?");
  }

  return prompts.slice(0, 4);
};

export const getReadinessSummary = (level: string, strongestScores: any[], weakestScores: any[], overallScore: number) => {
  let whatsWorking = "";
  if (strongestScores.length > 0) {
    if (overallScore >= 3.6) {
      whatsWorking = `Anda menunjukkan pondasi yang solid terutama di area ${strongestScores[0].name}. Anda berani bereksperimen, merefleksikan hasil, dan beradaptasi. Anda tidak hanya menggunakan AI — Anda berpikir kritis tentang cara dan waktu penggunaannya.`;
    } else if (overallScore >= 2.6) {
      whatsWorking = `Anda sudah menemukan ritme penggunaan AI di beberapa area, khususnya ${strongestScores[0].name}. Keterampilan Anda mulai terbentuk dan siap untuk diintegrasikan lebih dalam.`;
    } else {
      whatsWorking = `Keinginan Anda untuk mengeksplorasi sudah terlihat di dimensi ${strongestScores[0].name}. Langkah awal yang baik untuk membangun kebiasaan teknologi di masa depan.`;
    }
  } else {
      whatsWorking = "Anda sedang membangun pemahaman awal yang baik terhadap adopsi AI.";
  }

  let whatsAtRisk = "";
  if (weakestScores.length > 0) {
    if (level === 'AI-Mature' || level === 'AI-Enabled') {
      whatsAtRisk = `Di level ini, risikonya adalah rasa cepat puas atau terisolasi. Jika Anda melesat jauh di depan rekan-rekan, Anda mungkin berjalan sendiri tanpa mengangkat kompetensi tim secara keseluruhan. Selain itu, dimensi ${weakestScores[0].name} masih memerlukan sedikit perhatian.`;
    } else if (level === 'AI-Ready') {
      whatsAtRisk = `Kemajuan Anda bisa terhenti menjadi sekadar teori jika tidak diiringi dengan praktik yang konsisten, terutama di area ${weakestScores[0].name}. Kegagalan mengintegrasikan AI ke alur kerja nyata adalah risiko terbesar.`;
    } else {
      whatsAtRisk = `Kurangnya pemahaman komprehensif, terutama pada aspek ${weakestScores[0].name}, berpotensi menyebabkan misinformasi, penurunan kualitas kerja, atau paparan terhadap risiko keamanan data.`;
    }
  }

  let focusNext = "";
  if (level === 'AI-Mature') {
    focusNext = "Beralih dari kesiapan personal menuju mode multiplier: jadilah mentor, role model, dan penggerak inisiatif penggunaan AI yang cerdas di tim atau organisasi Anda.";
  } else if (level === 'AI-Enabled') {
    focusNext = "Sistematiskan penggunaan AI Anda. Dokumentasikan prompt yang paling berhasil, bangun personal toolkit yang solid, dan mulailah berbagi knowledge tersebut ke lingkungan terdekat.";
  } else if (level === 'AI-Ready') {
    focusNext = "Fokus pada konsistensi. Paksakan diri untuk mempraktikkan penggunaan AI pada tugas-tugas rutin harian hingga hal tersebut menjadi kebiasaan tak terpisahkan dari workflow Anda.";
  } else {
    focusNext = "Tingkatkan rasa ingin tahu (curiosity). Lakukan eksperimen sederhana dengan tools AI yang aman selama 10-15 menit setiap hari untuk melihat kemampuannya secara langsung.";
  }

  return { whatsWorking, whatsAtRisk, focusNext };
};
