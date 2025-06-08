'use client';

import { useTranslation } from '@/hooks/use-translation';

export function LanguageSwitcher() {
  const { changeLanguage, currentLanguage } = useTranslation();

  return (
    <div className="flex items-center space-x-2">
      <button
        onClick={() => changeLanguage('es')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLanguage === 'es' 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        ES
      </button>
      <span className="text-gray-400">|</span>
      <button
        onClick={() => changeLanguage('en')}
        className={`px-3 py-1 rounded-md text-sm font-medium ${
          currentLanguage === 'en' 
            ? 'bg-blue-500 text-white' 
            : 'text-gray-700 hover:bg-gray-100'
        }`}
      >
        EN
      </button>
    </div>
  );
}
