const fs = require('node:fs');
const path = require('node:path');
const core = require('@actions/core');
const lodash = require('lodash');

if (!process.env.DEFAULT_LOCALE_CODE) core.setFailed('DEFAULT_LOCALE_CODE is not set');

const localesDir = path.join(__dirname, '..', '..', 'client', 'locales');
const locales = fs.readdirSync(localesDir);
const filteredLocales = locales.filter(locale => locale !== 'translators.json');

const failedParse = [];

filteredLocales.forEach(localeFile => {
  const locale = localeFile.split('.json')[0];
  const jsonPath = path.join(localesDir, localeFile);
  const content = fs.readFileSync(jsonPath, 'utf8');

  try {
    JSON.parse(content);

    // check for missing keys
    const defaultLocalePath = path.join(localesDir, 'en.json');
    const defaultLocaleContent = fs.readFileSync(defaultLocalePath, 'utf8');
    const defaultLocale = JSON.parse(defaultLocaleContent);

    const localeContent = JSON.parse(content);
    
    // keys can be object in object so we need to flatten it
    const flattenedDefaultLocale = lodash.flattenDeep(lodash.toPairsDeep(defaultLocale));
    const flattenedLocaleContent = lodash.flattenDeep(lodash.toPairsDeep(localeContent));

    const missingKeys = flattenedDefaultLocale.filter(([key]) => !flattenedLocaleContent.some(([localeKey]) => localeKey === key));
    
    if (missingKeys.length > 0) {
      core.error(`Missing keys in ${locale}.json`, {
        title: 'Missing keys',
        file: `${locale}.json`,
        keys: missingKeys.map(([key]) => key)
      });
    }

    // check for extra keys
    const extraKeys = flattenedLocaleContent.filter(([key]) => !flattenedDefaultLocale.some(([localeKey]) => localeKey === key));

    if (extraKeys.length > 0) {
      core.error(`Extra keys in ${locale}.json`, {
        title: 'Extra keys',
        file: `${locale}.json`,
        keys: extraKeys.map(([key]) => key)
      });
    }
  } catch (e) {
    failedParse.push(locale);
  }
})

if (failedParse.length > 0) {
  failedParse.forEach(locale => {
    core.error(`Failed to parse ${locale}.json`, {
      title: 'Invalid JSON',
      file: `${locale}.json`
    });
  });

  core.setFailed('Some locale files are invalid JSON');
} else {
  console.log('All locale files are valid JSON');
}