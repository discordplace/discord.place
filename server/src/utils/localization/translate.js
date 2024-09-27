/**
 * Translates a given key into the specified language.
 * 
 * @param {string} key - The key to be translated.
 * @param {object} variables - The variables to be used in the translation.
 * @param {string} [language=config.availableLocales.find(locale => locale.default).code] - The language code for the translation. Defaults to the default language code.
 * @returns {string} - The translated string.
 */
function translate(key, variables, language = config.availableLocales.find(locale => locale.default).code) {
  if (!i18n.getResource(language, 'translation', key)) {
    if (process.env.NODE_ENV === 'development') return `${key} (missing translation)`;
    return key;
  }

  return i18n.t(key, {
    ...variables,
    lng: language,
    defaultValue: key
  });
}

module.exports = translate;