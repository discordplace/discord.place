import config from '@/config';
import sleep from '@/lib/sleep';
import az from '@/locales/az.json';
import en from '@/locales/en.json';
import tr from '@/locales/tr.json';
import useGeneralStore from '@/stores/general';
import i18n from 'i18next';
import intervalPlural from 'i18next-intervalplural-postprocessor';
import ReactPostprocessor from 'i18next-react-postprocessor';
import { create } from 'zustand';

i18n
  .use(new ReactPostprocessor())
  .use(intervalPlural)
  .init({
    fallbackLng: config.availableLocales.find(locale => locale.default).code,
    interpolation: {
      escapeValue: false // React already does escaping
    },
    postProcess: ['reactPostprocessor']
  });

let languageFirstlyChanged = false;

const useLanguageStore = create(set => ({
  language: 'loading',
  setLanguage: async language => {
    const availableLanguages = config.availableLocales.map(locale => locale.code);
    if (!availableLanguages.includes(language)) language = config.availableLocales.find(locale => locale.default).code;

    if ('localStorage' in window) window.localStorage.setItem('language', language);

    set({ language });

    // Show loading screen to prevent flickering when changing language
    if (!languageFirstlyChanged) languageFirstlyChanged = true;
    else {
      useGeneralStore.getState().setShowFullPageLoading(true);

      await sleep(Math.random() * 500 + 1000);

      useGeneralStore.getState().setShowFullPageLoading(false);
    }
  }
}));

export function t(key, variables = {}) {
  const language = useLanguageStore.getState().language;

  if (language === 'loading') return '';

  const localeContents = {
    az,
    en,
    tr
  };

  i18n.addResourceBundle(language, 'translation', localeContents[language], true, true);

  if (!i18n.getResource(language, 'translation', key)) {
    if (process.env.NODE_ENV === 'development') return `${key} (missing translation)`;

    return key;
  }

  return i18n.t(key, {
    ...variables,
    defaultValue: key,
    fallbackLng: config.availableLocales.find(locale => locale.default).code,
    lng: language
  });
}

export default useLanguageStore;
