const fs = require('fs');
let content = fs.readFileSync('src/components/LandingPage.tsx', 'utf8');

content = content.replace(
  "interface LandingPageProps {\n  onStart: () => void;\n}",
  "interface LandingPageProps {\n  onStart: (type: 'organization' | 'individual') => void;\n}"
);

const topCTA = `<button 
        onClick={onStart}
        className="group flex items-center justify-center gap-2 px-8 py-3 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800 shadow-md shadow-emerald-900/10 transition-all active:scale-[0.98] mb-14 text-sm"
      >
        <span>{t('landing.startAssessment')}</span>
        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
      </button>`;

const topCTAReplacement = `<div className="flex flex-col sm:flex-row gap-4 mb-14 w-full sm:w-auto px-4 justify-center">
        <button 
          onClick={() => onStart('organization')}
          className="group flex items-center justify-center gap-2 px-8 py-3 bg-emerald-700 text-white font-semibold rounded-full hover:bg-emerald-800 shadow-md shadow-emerald-900/10 transition-all active:scale-[0.98] text-sm"
        >
          <span>Asesmen Kesiapan AI Organisasi</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
        <button 
          onClick={() => onStart('individual')}
          className="group flex items-center justify-center gap-2 px-8 py-3 bg-white text-emerald-700 border border-emerald-700 font-semibold rounded-full hover:bg-emerald-50 shadow-md transition-all active:scale-[0.98] text-sm"
        >
          <span>Asesmen Kesiapan AI Individu</span>
          <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
        </button>
      </div>`;

content = content.replace(
  /<button[\s\S]*?onClick=\{onStart\}[\s\S]*?<\/button>/,
  topCTAReplacement
);

const bottomCTA = `<button 
            onClick={onStart}
            className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-400 text-amber-950 font-semibold rounded-full hover:bg-amber-500 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] text-sm"
          >
            <span>{t('landing.startAssessment')}</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>`;

const bottomCTAReplacement = `<div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto px-4 justify-center">
            <button 
              onClick={() => onStart('organization')}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-amber-400 text-amber-950 font-semibold rounded-full hover:bg-amber-500 shadow-md shadow-amber-500/20 transition-all active:scale-[0.98] text-sm"
            >
              <span>Asesmen Kesiapan AI Organisasi</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
            <button 
              onClick={() => onStart('individual')}
              className="group inline-flex items-center justify-center gap-2 px-8 py-3 bg-transparent text-white border-2 border-amber-400 font-semibold rounded-full hover:bg-amber-400/10 shadow-md transition-all active:scale-[0.98] text-sm"
            >
              <span>Asesmen Kesiapan AI Individu</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </button>
          </div>`;

content = content.replace(
  /<button[\s\S]*?onClick=\{onStart\}[\s\S]*?<\/button>/,
  bottomCTAReplacement
);

fs.writeFileSync('src/components/LandingPage.tsx', content);
