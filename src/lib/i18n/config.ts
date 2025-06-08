import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enCommon from '../../../public/locales/en/common.json';
import esCommon from '../../../public/locales/es/common.json';

export const defaultNS = 'common';

export const resources = {
  en: {
    [defaultNS]: enCommon,
  },
  es: {
    [defaultNS]: esCommon,
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'es',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false,
    },
    ns: [defaultNS],
    defaultNS,
  });

export default i18n;
