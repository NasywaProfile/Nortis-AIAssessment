import React from 'react';
import { Globe, ArrowRight } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext';

export interface HeaderProps {
  onAdminLogin?: () => void;
  onGoHome?: () => void;
}

export function Header({ onAdminLogin, onGoHome }: HeaderProps) {
  const { language, setLanguage, t, images } = useLanguage();

  return (
    <header className="w-full bg-white sticky top-0 z-50 border-b border-slate-100">
      <div className="w-full px-4 sm:px-6 md:px-12 lg:px-20 h-20 sm:h-24 flex items-center justify-between">
        {/* Logo */}
        <button 
          onClick={onGoHome}
          className="flex items-center text-left focus:outline-none cursor-pointer group"
          title="Kembali ke Beranda"
        >
          <img src={images.logo} alt="Nortis AI Logo" className="h-10 sm:h-14 w-auto transition-transform group-hover:scale-105" />
        </button>

        {/* Actions */}
        <div className="flex items-center gap-2 sm:gap-4 md:gap-6">
          <div className="flex items-center p-1 bg-slate-100/80 rounded-full border border-slate-200/60">
            <button 
              onClick={() => setLanguage('ID')}
              className={`transition-all px-3 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                language === 'ID' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-500 hover:text-emerald-900'
              }`}
            >
              ID
            </button>
            <button 
              onClick={() => setLanguage('EN')}
              className={`transition-all px-3 sm:px-5 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-bold ${
                language === 'EN' ? 'bg-white text-emerald-900 shadow-sm' : 'text-slate-500 hover:text-emerald-900'
              }`}
            >
              EN
            </button>
          </div>
          
          <button 
            onClick={onAdminLogin}
            className="flex items-center gap-1.5 sm:gap-2 px-3 sm:px-6 py-1.5 sm:py-2.5 bg-emerald-900 text-white font-medium rounded-full hover:bg-emerald-800 shadow-sm transition-all active:scale-95"
          >
            <span className="text-xs sm:text-sm sm:inline hidden">{t('header.adminLogin')}</span>
            <span className="text-xs font-bold sm:hidden block">Admin</span>
            <ArrowRight className="w-3 h-3 sm:w-4 sm:h-4" />
          </button>
        </div>
      </div>
    </header>
  );
}
