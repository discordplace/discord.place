import { create } from 'zustand';
import i18n from 'i18next';
import config from '@/config';

i18n.init({
  fallbackLng: 'en',
  resources: {
    en: {
      translation: {} // Will be populated with content from JSON files
    }
  },
  interpolation: {
    escapeValue: false // React already does escaping
  }
});

const localeContents = {};

config.availableLocales
  .map(async locale => {
    const file = await import(`../../locales/${locale.code}.json`).catch(() => null);
    if (!file) throw new Error(`Failed to load locale file for ${locale.code} at /locales/${locale.code}.json`);

    localeContents[locale.code] = file.default;
  });

const useLanguageStore = create(set => ({
  language: 'loading',
  setLanguage: async language => {
    const availableLanguages = config.availableLocales.map(locale => locale.code);
    if (!availableLanguages.includes(language)) language = config.availableLocales.find(locale => locale.default).code;
    
    if ('localStorage' in window) window.localStorage.setItem('language', language);

    set({ language });
  }
}));

export function t(key, variables) {
  const language = useLanguageStore.getState().language;

  if (language === 'loading') return '';

  i18n.addResourceBundle(language, 'translation', localeContents[language], true, true);

  return i18n.t(key, variables);
}

export default useLanguageStore;
