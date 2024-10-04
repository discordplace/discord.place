const Discord = require('discord.js');

/**
 * Get localized command name and description.
 * @param {string} key - Command key.
 * @returns {Object.<string, string>} - Localized command name and description.
 */
function getLocalizedCommand(key) {
  const availableLocales = config.availableLocales.filter(({ code }) => Object.values(Discord.Locale).some(locale => locale === code));

  const descriptions = availableLocales.reduce((descriptions, locale) => {
    if (!i18n.getResource(locale.code, 'translation', `commands.${key}.description`)) return descriptions;

    descriptions[locale.code] = i18n.getResource(locale.code, 'translation', `commands.${key}.description`);
    
    return descriptions;
  }, {});

  const names = availableLocales.reduce((names, locale) => {
    if (!i18n.getResource(locale.code, 'translation', `commands.${key}.name`)) return names;

    names[locale.code] = i18n.getResource(locale.code, 'translation', `commands.${key}.name`);
    
    return names;
  }, {});

  return { descriptions, names };
}

module.exports = getLocalizedCommand;