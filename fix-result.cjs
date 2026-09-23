const fs = require('fs');
const path = 'src/components/AssessmentResult.tsx';
let content = fs.readFileSync(path, 'utf8');

// replace risikoUtama block
content = content.replace(
/              <ul className="space-y-3\.5">\s*\{aiAnalysis\?\.risikoUtama \? aiAnalysis\.risikoUtama\.map\(\(item: string, idx: number\) => \(\s*<li key=\{idx\} className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-rose-500 mt-0\.5 shrink-0 text-lg leading-none">•<\/span> \{item\}<\/li>\s*\)\) : \(\s*<>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-rose-500 mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Kurangnya strategi AI yang jelas dapat menyebabkan inisiatif terfragmentasi dan berdampak rendah<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-rose-500 mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Dukungan leadership yang tidak memadai dapat mengakibatkan alokasi sumber daya yang kurang<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-rose-500 mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Proses yang tidak terdokumentasi atau manual akan menghambat integrasi AI dan ROI<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-rose-500 mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Resistensi terhadap perubahan proses dapat menunda atau menggagalkan implementasi AI<\/li>\s*<\/>\s*\)\}\s*<\/ul>/,
`              <ul className="space-y-3.5">
                 {(aiAnalysis?.risikoUtama || defaultRec.risikoUtama || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2.5 text-[13px] text-[#475569] leading-relaxed"><span className="text-rose-500 mt-0.5 shrink-0 text-lg leading-none">•</span> {item}</li>
                 ))}
              </ul>`);

// replace quickWins block
content = content.replace(
/              <ul className="space-y-3\.5">\s*\{aiAnalysis\?\.quickWins \? aiAnalysis\.quickWins\.map\(\(item: string, idx: number\) => \(\s*<li key=\{idx\} className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> \{item\}<\/li>\s*\)\) : \(\s*<>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Deploy AI champions internal untuk mendorong program awareness dan adopsi<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Manfaatkan talenta teknis yang ada untuk membuat prototype use case AI sederhana<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Governance yang kuat memberikan kepercayaan bagi leadership untuk menyetujui investasi AI<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Framework yang mapan memungkinkan eksperimen AI yang bertanggung jawab dan compliant<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Kesiapan keseluruhan memungkinkan fast-tracking proyek pilot di area prioritas<\/li>\s*<\/>\s*\)\}\s*<\/ul>/,
`              <ul className="space-y-3.5">
                 {(aiAnalysis?.quickWins || defaultRec.quickWins || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2.5 text-[13px] text-[#475569] leading-relaxed"><span className="text-[#10B981] mt-0.5 shrink-0 text-lg leading-none">•</span> {item}</li>
                 ))}
              </ul>`);

// replace hambatan block
content = content.replace(
/              <ul className="space-y-3\.5">\s*\{aiAnalysis\?\.hambatan \? aiAnalysis\.hambatan\.map\(\(item: string, idx: number\) => \(\s*<li key=\{idx\} className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#F97316\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> \{item\}<\/li>\s*\)\) : \(\s*<>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#F97316\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Kurangnya sponsorship eksekutif dan arahan strategis<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#F97316\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Prioritas yang bersaing dan business case AI yang tidak jelas<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#F97316\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Operasi yang tersilo dan resistensi terhadap kolaborasi lintas fungsi<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#F97316\] mt-0\.5 shrink-0 text-lg leading-none">•<\/span> Workflow manual dan legacy yang sulit didigitalisasi<\/li>\s*<\/>\s*\)\}\s*<\/ul>/,
`              <ul className="space-y-3.5">
                 {(aiAnalysis?.hambatan || defaultRec.hambatan || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2.5 text-[13px] text-[#475569] leading-relaxed"><span className="text-[#F97316] mt-0.5 shrink-0 text-lg leading-none">•</span> {item}</li>
                 ))}
              </ul>`);

// replace rekomendasiPrioritas block
content = content.replace(
/              <ul className="space-y-3\.5">\s*\{aiAnalysis\?\.rekomendasiPrioritas \? aiAnalysis\.rekomendasiPrioritas\.map\(\(item: string, idx: number\) => \(\s*<li key=\{idx\} className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] font-bold shrink-0">\{idx \+ 1\}\.<\/span> \{item\}<\/li>\s*\)\) : \(\s*<>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] font-bold shrink-0">1\.<\/span> Skalakan pilot yang berhasil ke unit bisnis atau geografi tambahan<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] font-bold shrink-0">2\.<\/span> Optimalkan implementasi AI yang ada untuk performa dan efisiensi<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] font-bold shrink-0">3\.<\/span> Bangun kompetensi AI internal melalui training dan knowledge sharing<\/li>\s*<li className="flex gap-2\.5 text-\[13px\] text-\[\#475569\] leading-relaxed"><span className="text-\[\#10B981\] font-bold shrink-0">4\.<\/span> Kembangkan kapabilitas AI operations \(MLOps\) untuk deployment berkelanjutan<\/li>\s*<\/>\s*\)\}\s*<\/ul>/,
`              <ul className="space-y-3.5">
                 {(aiAnalysis?.rekomendasiPrioritas || defaultRec.rekomendasiPrioritas || []).map((item: string, idx: number) => (
                    <li key={idx} className="flex gap-2.5 text-[13px] text-[#475569] leading-relaxed"><span className="text-[#10B981] font-bold shrink-0">{idx + 1}.</span> {item}</li>
                 ))}
              </ul>`);


fs.writeFileSync(path, content);
