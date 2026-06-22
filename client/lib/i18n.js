import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import config from '@/config';
import ReactPostprocessor from 'i18next-react-postprocessor';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import az from '@/locales/az.json';

i18n
  .use(new ReactPostprocessor())
  .use(intervalPlural)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false // React already does escaping
    },
    lng: config.availableLocales.find(locale => locale.default).code,
    postProcess: ['intervalPlural', 'reactPostprocessor'],
    react: {
      useSuspense: false
    },
    resources: {
      az: { translation: az },
      en: { translation: en },
      tr: { translation: tr }
    },
    supportedLngs: config.availableLocales.map(locale => locale.code)
  });

export default i18n;