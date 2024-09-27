const Discord = require('discord.js');

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