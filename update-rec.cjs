const fs = require('fs');

const path = 'src/contexts/LanguageContext.tsx';
let content = fs.readFileSync(path, 'utf8');

const idMatureStr = `      mature: {
        title: 'Komersialisasi dan Skalabilitas AI',
        desc: 'Fokus strategis utama saat ini adalah mengeksploitasi keunggulan AI untuk ekspansi bisnis, monetisasi kapabilitas internal, serta mempertahankan ketahanan operasional dan talenta kunci.',
        shortDesc: 'Fokus strategis utama saat ini adalah mengeksploitasi keunggulan AI untuk ekspansi bisnis, monetisasi kapabilitas internal, serta mempertahankan ketahanan operasional dan talenta kunci.',
        risikoUtama: [
          'Ketergantungan tinggi pada segelintir talenta kunci akibat ukuran organisasi yang ramping.',
          'Risiko komplasensi teknologis akibat merasa sudah mencapai tingkat kematangan tertinggi.',
          'Evolusi regulasi privasi data telekomunikasi global yang semakin ketat.',
          'Ancaman keamanan siber yang makin kompleks menyasar infrastruktur AI perusahaan.'
        ],
        quickWins: [
          'Meluncurkan katalog API AI internal untuk dikomersialkan ke mitra B2B sektor telekomunikasi.',
          'Menerapkan MLOps terotomatisasi penuh untuk mempercepat siklus iterasi model AI.',
          'Menerbitkan studi kasus atau whitepaper kepemimpinan AI untuk reputasi industri.',
          'Mengoptimalkan biaya infrastruktur AI melalui teknik model pruning dan pemrosesan edge.',
          'Mengintegrasikan asisten AI generatif penuh untuk mendukung efisiensi operasional tim.'
        ],
        hambatan: [
          'Kapasitas SDM yang terbatas untuk menangani skala permintaan proyek eksternal yang baru.',
          'Kenaikan biaya pemrosesan komputasi (GPU) seiring peningkatan beban kerja AI.',
          'Kompleksitas integrasi AI dengan sistem legacy milik mitra atau operator eksternal.',
          'Tantangan dalam mempertahankan standar efisiensi model AI tanpa meningkatkan latensi jaringan.'
        ],
        rekomendasiPrioritas: [
          'Membangun lini produk AI-as-a-Service (AIaaS) khusus untuk industri telekomunikasi.',
          'Memperkuat program retensi talenta AI dan melakukan suksesi pengetahuan untuk menjaga keberlanjutan.',
          'Mendapatkan sertifikasi internasional untuk Tata Kelola AI (seperti ISO/IEC 42001) guna membangun keunggulan kompetitif.',
          'Membentuk kemitraan strategis dengan penyedia infrastruktur cloud untuk mengamankan kapasitas komputasi jangka panjang'
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
      },`;

const enMatureStr = `      mature: {
        title: 'AI Commercialization and Scalability',
        desc: 'The main strategic focus right now is to exploit AI advantages for business expansion, monetize internal capabilities, and maintain operational resilience and key talent.',
        shortDesc: 'The main strategic focus is to exploit AI advantages for business expansion, monetize internal capabilities, and maintain operational resilience.',
        risikoUtama: [
          'High dependence on a few key talents due to lean organizational size.',
          'Risk of technological complacency from feeling having reached the highest maturity level.',
          'Increasingly strict global telecommunications data privacy regulations evolution.',
          'Increasingly complex cybersecurity threats targeting the company\\'s AI infrastructure.'
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
      },`;

// Read the file, replace the old mature block.
// We need to carefully replace the ID and EN mature blocks.

// Simple search and replace for ID
content = content.replace(
/      mature: \{\s+title: 'Strategic Advisory',\s+desc: 'Organisasi sudah mature dalam AI dan perlu strategic advisory untuk inovasi lanjutan, ecosystem development, dan thought leadership.',\s+shortDesc: 'Organisasi mature dan perlu strategic advisory.',\s+slideActions: \[\s+'Explore advanced AI capabilities',\s+'Develop AI innovation pipeline',\s+'Thought leadership positioning',\s+'AI ecosystem development'\s+\],\s+slideOutcomes: \[\s+'Improved organizational readiness',\s+'Clear implementation roadmap',\s+'Stakeholder alignment',\s+'Foundation for AI success'\s+\]\s+\},/,
idMatureStr);

// Simple search and replace for EN
content = content.replace(
/      mature: \{\s+title: 'Strategic Advisory',\s+desc: 'The organization is mature in AI and needs strategic advisory for advanced innovation, ecosystem development, and thought leadership.',\s+shortDesc: 'Mature organization needing strategic advisory.',\s+slideActions: \[\s+'Explore advanced AI capabilities',\s+'Develop AI innovation pipeline',\s+'Thought leadership positioning',\s+'AI ecosystem development'\s+\],\s+slideOutcomes: \[\s+'Improved organizational readiness',\s+'Clear implementation roadmap',\s+'Stakeholder alignment',\s+'Foundation for AI success'\s+\]\s+\},/,
enMatureStr);

fs.writeFileSync(path, content);
