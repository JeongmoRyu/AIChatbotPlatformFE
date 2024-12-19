import i18next from 'i18next';
import { initReactI18next } from 'react-i18next';

import translationKo from '@/shared/locale/ko';
import translationEn from '@/shared/locale/en';

const resources = {
  ko: translationKo,
  en: translationEn,
};

i18next.use(initReactI18next).init({
  resources,
  lng: 'ko',
  fallbackLng: ['ko', 'en'],
  debug: false,
  interpolation: {
    escapeValue: false,
  },
});

document.documentElement.lang = i18next.language;

export default i18next;
