import { create } from 'zustand';
import i18n from 'i18next';
import en from '@/languages/en.json';

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

const useLanguageStore = create(set => ({
  language: 'loading',
  setLanguage: async language => {
    const availableLanguages = ['en'];
    if (!availableLanguages.includes(language)) language = 'en';
    
    set({ language });
  }
}));

export function t(key, variables) {
  const language = useLanguageStore.getState().language;

  if (language === 'loading') return '';

  switch (language) {
    case 'en':
      i18n.addResourceBundle('en', 'translation', en, true, true);
  }

  return i18n.t(key, variables);
}

export default useLanguageStore;
