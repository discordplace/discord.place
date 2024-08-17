import { create } from 'zustand';
import i18n from 'i18next';
import config from '@/config';
import useGeneralStore from '@/stores/general';
import sleep from '@/lib/sleep';
import ReactPostprocessor from 'i18next-react-postprocessor';

i18n
  .use(new ReactPostprocessor())
  .init({
    fallbackLng: config.availableLocales.find(locale => locale.default).code,
    interpolation: {
      escapeValue: false // React already does escaping
    },
    postProcess: ['reactPostprocessor']
  });

const localeContents = {};
let languageFirstlyChanged = false;

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

    // Show loading screen to prevent flickering when changing language in production
    if (process.env.NODE_ENV === 'production') {
      if (!languageFirstlyChanged) languageFirstlyChanged = true;
      else {
        useGeneralStore.getState().setShowFullPageLoading(true);

        await sleep(Math.random() * 500 + 1000);

        useGeneralStore.getState().setShowFullPageLoading(false);
      }
    }
  }
}));

export function t(key, variables = {}) {
  const language = useLanguageStore.getState().language;

  if (language === 'loading') return '';

  i18n.addResourceBundle(language, 'translation', localeContents[language], true, true);

  return i18n.t(key, {
    ...variables,
    lng: language,
    fallbackLng: config.availableLocales.find(locale => locale.default).code
  });
}

export default useLanguageStore;
