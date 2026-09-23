const fs = require('fs');
let content = fs.readFileSync('src/contexts/LanguageContext.tsx', 'utf8');

// I will insert `individualAssessmentData` and `individualQuestions` into the translations object.
const individualAssessmentDataID = `
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
        { id: 'A2', text: 'Saya memahami bahwa AI dapat menghasilkan informasi yang terdengar meyakinkan tetapi sebenarnya tidak akurat.' },
        { id: 'A3', text: 'Saya dapat membedakan tugas yang tepat untuk dibantu AI dan tugas yang membutuhkan penilaian manusia.' },
        { id: 'A4', text: 'Saya memahami keterbatasan AI seperti hallucination, bias, keterbatasan konteks, dan ketergantungan pada kualitas input.' },
        { id: 'A5', text: 'Saya memandang AI sebagai alat untuk meningkatkan kemampuan dan kualitas kerja, bukan sekadar menggantikan pekerjaan manual.' }
      ],
      taskFraming: [
        { id: 'B1', text: 'Sebelum menggunakan AI, saya dapat menentukan dengan jelas tujuan atau hasil yang ingin saya capai.' },
        { id: 'B2', text: 'Saya dapat memberikan konteks, instruksi, batasan, dan format output yang jelas kepada AI.' },
        { id: 'B3', text: 'Saya dapat memecah pekerjaan yang kompleks menjadi beberapa tugas yang lebih kecil untuk dikerjakan bersama AI.' },
        { id: 'B4', text: 'Saya memperbaiki atau mengembangkan prompt ketika hasil pertama dari AI belum sesuai kebutuhan.' },
        { id: 'B5', text: 'Saya dapat memilih tools atau pendekatan AI yang sesuai untuk jenis tugas yang berbeda.' }
      ],
      workflow: [
        { id: 'C1', text: 'Saya menggunakan AI secara rutin dalam aktivitas pekerjaan, bukan hanya untuk mencoba atau bereksperimen.' },
        { id: 'C2', text: 'Saya dapat mengenali pekerjaan repetitif atau memakan waktu yang dapat dibantu oleh AI.' },
        { id: 'C3', text: 'Saya memiliki workflow, template, prompt, atau cara kerja AI yang dapat digunakan kembali untuk pekerjaan tertentu.' },
        { id: 'C4', text: 'Saya dapat mengintegrasikan AI ke beberapa tahap pekerjaan, mulai dari riset, ideasi, produksi, analisis hingga evaluasi.' },
        { id: 'C5', text: 'Saya dapat menunjukkan manfaat nyata dari penggunaan AI terhadap waktu, produktivitas, atau kualitas pekerjaan saya.' }
      ],
      evaluation: [
        { id: 'D1', text: 'Saya memeriksa kembali informasi penting yang dihasilkan AI sebelum menggunakannya.' },
        { id: 'D2', text: 'Saya dapat mengenali ketika jawaban AI terlihat masuk akal tetapi memiliki kemungkinan salah atau menyesatkan.' },
        { id: 'D3', text: 'Saya membandingkan informasi dari AI dengan sumber, data, atau referensi lain ketika akurasi menjadi penting.' },
        { id: 'D4', text: 'Saya mengetahui kapan output AI membutuhkan human review, expert review, atau keputusan manusia.' },
        { id: 'D5', text: 'Saya tidak menjadikan output AI sebagai dasar keputusan penting tanpa mempertimbangkan konteks dan penilaian saya sendiri.' }
      ],
      responsibleAi: [
        { id: 'E1', text: 'Saya mempertimbangkan keamanan dan kerahasiaan data sebelum memasukkan informasi ke dalam tools AI.' },
        { id: 'E2', text: 'Saya memahami bahwa informasi pribadi, rahasia perusahaan, atau data sensitif tidak boleh sembarangan dimasukkan ke AI.' },
        { id: 'E3', text: 'Saya mempertimbangkan kemungkinan bias, diskriminasi, atau konsekuensi negatif dari output AI.' },
        { id: 'E4', text: 'Saya mempertimbangkan hak cipta, kepemilikan informasi, dan penggunaan konten AI secara bertanggung jawab.' },
        { id: 'E5', text: 'Saya memahami bahwa manusia tetap bertanggung jawab terhadap keputusan atau hasil pekerjaan yang menggunakan AI.' }
      ],
      collaboration: [
        { id: 'F1', text: 'Saya secara aktif mempelajari kemampuan, tools, atau cara penggunaan AI yang relevan dengan pekerjaan saya.' },
        { id: 'F2', text: 'Saya membagikan praktik, prompt, workflow, atau pembelajaran AI yang efektif kepada orang lain ketika relevan.' },
        { id: 'F3', text: 'Saya dapat menggunakan AI sebagai partner berpikir untuk mengeksplorasi ide, alternatif, dan solusi, bukan hanya sebagai generator jawaban.' },
        { id: 'F4', text: 'Saya dapat menentukan bagian pekerjaan yang boleh dilakukan AI secara mandiri dan bagian yang tetap membutuhkan persetujuan manusia.' },
        { id: 'F5', text: 'Saya merasa siap menyesuaikan cara kerja saya ketika AI dan AI agents semakin terintegrasi dalam pekerjaan.' }
      ],
      scale: [
        { value: 0, label: '0 = Belum pernah / belum mampu melakukan ini' },
        { value: 1, label: '1 = Sangat terbatas dan masih membutuhkan banyak bantuan' },
        { value: 2, label: '2 = Sudah mulai melakukan, tetapi belum konsisten' },
        { value: 3, label: '3 = Dapat melakukan secara mandiri pada situasi yang familiar' },
        { value: 4, label: '4 = Dapat melakukan secara konsisten di berbagai situasi' },
        { value: 5, label: '5 = Sangat mahir, sistematis, dan mampu membimbing orang lain' }
      ]
    },`;

// Since I just need to add this to `ID` and `EN` respectively. I will just duplicate it for `EN` for now, 
// using ID text since it's just a placeholder and the prompt didn't specify EN translations for the individual part.
const individualAssessmentDataEN = individualAssessmentDataID;

content = content.replace("assessmentData: [", individualAssessmentDataID + "\n    assessmentData: [");
content = content.replace(/assessmentData: \[\s*\{\s*id: 'strategi',\s*title: 'Strategy & Leadership'/, individualAssessmentDataEN.replace("individualAssessmentData: [", "    individualAssessmentData: [") + "\n    assessmentData: [{ id: 'strategi', title: 'Strategy & Leadership'");

fs.writeFileSync('src/contexts/LanguageContext.tsx', content);
