'use client';

import { useTranslation as useI18nTranslation } from 'react-i18next';

export const useTranslation = (ns?: string) => {
  const { t, i18n } = useI18nTranslation(ns);
  
  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    // You can also save the language preference to localStorage here
    if (typeof window !== 'undefined') {
      localStorage.setItem('i18nextLng', lng);
    }
  };

  return {
    t,
    i18n,
    changeLanguage,
    currentLanguage: i18n.language,
    isSpanish: i18n.language === 'es',
  };
};

export default useTranslation;
