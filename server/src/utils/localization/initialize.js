const Discord = require('discord.js');
const i18n = require('i18next');
const intervalPlural = require('i18next-intervalplural-postprocessor');
const fs = require('node:fs');
const path = require('node:path');
const ServerLanguage = require('@/schemas/Server/Language');
const moment = require('moment');
const translate = require('@/utils/localization/translate');

function initialize() {
  // Get all stored server languages and add them to the cache
  ServerLanguage.find()
    .then(languages => languages.forEach(language => this.client.languageCache.set(language.id, language.language)));

  logger.info('Client created.');

  // Localization Setup for moment
  if (!config.availableLocales.find(locale => locale.default)) {
    logger.error('Default locale is not found in the available locales. Please set the default locale in the config file.');
    process.exit(1);
  }

  moment.locale(config.availableLocales.find(locale => locale.default).code);

  // i18n Setup
  i18n
    .use(intervalPlural)
    .init({
      fallbackLng: config.availableLocales.find(locale => locale.default).code,
      postProcess: [],
      interpolation: {
        escapeValue: false,
        prefix: '{',
        suffix: '}'
      }
    });

  global.i18n = i18n;

  config.availableLocales.forEach(locale => {
    const localePath = path.join(__dirname, `../../locales/${locale.code}.json`);
    const localeContent = fs.readFileSync(localePath, 'utf8');

    i18n.addResourceBundle(locale.code, 'translation', JSON.parse(localeContent), true, true);

    if (!Object.values(Discord.Locale).some(localeCode => localeCode === locale.code)) logger.warn(`Locale ${locale.code} is not supported by Discord.`);
  });

  // Add a translate method to the Discord.js base interaction object.

  Discord.BaseInteraction.prototype.translate = async function(key, variables = {}) {
    var language = this.locale;
    
    if (this.guildId) {
      const cachedLanguage = client.languageCache.get(this.guildId);
      if (cachedLanguage) language = cachedLanguage;
      else {
        const serverLanguageData = await ServerLanguage.findOne({ id: this.guildId }).select('language').lean();
        if (serverLanguageData) language = serverLanguageData.language;
      }
    } else {
      const defaultLanguage = config.availableLocales.find(locale => locale.default).code;

      if (!Object.values(Discord.Locale).some(localeCode => localeCode === this.locale.split('-')[0])) language = defaultLanguage;

      language = this.locale.split('-')[0];
    }

    return translate(key, variables, language);
  };

  // Add a getLanguage method to the Discord.js base interaction object.

  Discord.BaseInteraction.prototype.getLanguage = async function() {
    var language = this.locale;
    
    if (this.guildId) {
      const cachedLanguage = client.languageCache.get(this.guildId);
      if (cachedLanguage) language = cachedLanguage;
      else {
        const serverLanguageData = await ServerLanguage.findOne({ id: this.guildId }).select('language').lean();
        if (serverLanguageData) language = serverLanguageData.language;
      }
    } else {
      const defaultLanguage = config.availableLocales.find(locale => locale.default).code;

      if (!Object.values(Discord.Locale).some(localeCode => localeCode === this.locale.split('-')[0])) language = defaultLanguage;

      language = this.locale.split('-')[0];
    }

    return language;
  };
}

module.exports = initialize;