const Discord = require('discord.js');
const i18next = require('i18next');
const intervalPlural = require('i18next-intervalplural-postprocessor');
const fs = require('node:fs/promises');
const path = require('node:path');
const ServerLanguage = require('@/schemas/Server/Language');
const moment = require('moment');
const translate = require('@/utils/localization/translate');

async function initialize() {
  try {
    // Get all stored server languages and add them to the cache
    const languages = await ServerLanguage.find();
    languages.forEach(language => client.languageCache.set(language.id, language.language));

    const defaultLocale = config.availableLocales.find(locale => locale.default);
    if (!defaultLocale) {
      throw new Error('Default locale is not found in the available locales. Please set the default locale in the config file.');
    }

    // Localization Setup for moment
    moment.locale(defaultLocale.code);

    // i18next Setup
    await i18next
      .use(intervalPlural)
      .init({
        fallbackLng: defaultLocale.code,
        interpolation: {
          escapeValue: false,
          prefix: '{',
          suffix: '}'
        }
      });

    global.i18n = i18next;

    await Promise.all(config.availableLocales.map(async locale => {
      const localePath = path.join(__dirname, `../../locales/${locale.code}.json`);
      const localeContent = await fs.readFile(localePath, 'utf8');

      i18next.addResourceBundle(locale.code, 'translation', JSON.parse(localeContent), true, true);

      if (!Object.values(Discord.Locale).includes(locale.code)) {
        logger.warn(`Locale ${locale.code} is not supported by Discord.`);
      }
    }));

    // Add methods to Discord.js prototypes
    extendDiscordPrototypes();

  } catch (error) {
    logger.error('Initialization failed:', error);
    process.exit(1);
  }
}

function extendDiscordPrototypes() {
  Discord.BaseInteraction.prototype.translate = async function(key, variables = {}) {
    const language = await this.getLanguage();

    return translate(key, variables, language);
  };

  Discord.BaseInteraction.prototype.getLanguage = async function() {
    if (this.guildId) {
      return getGuildLanguage(this.guildId);
    }

    return getDefaultLanguage(this.locale);
  };

  Discord.BaseGuild.prototype.translate = async function(key, variables = {}) {
    const language = await this.getLanguage();

    return translate(key, variables, language);
  };

  Discord.BaseGuild.prototype.getLanguage = async function() {
    return getGuildLanguage(this.id);
  };
}

async function getGuildLanguage(guildId) {
  let language = client.languageCache.get(guildId);
  if (!language) {
    const serverLanguageData = await ServerLanguage.findOne({ id: guildId }).select('language').lean();
    language = serverLanguageData ? serverLanguageData.language : getDefaultLanguage();
    client.languageCache.set(guildId, language);
  }

  return language;
}

function getDefaultLanguage(userLocale = '') {
  const defaultLocale = config.availableLocales.find(locale => locale.default);
  if (userLocale && Object.values(Discord.Locale).includes(userLocale.split('-')[0])) {
    return userLocale.split('-')[0];
  }

  return defaultLocale.code;
}

module.exports = initialize;