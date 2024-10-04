const fs = require('node:fs');
const path = require('node:path');
const core = require('@actions/core');

if (!process.env.DEFAULT_LOCALE_CODE) core.setFailed('DEFAULT_LOCALE_CODE is not set');

const localesDir = path.join(__dirname, '..', '..', '..', 'server', 'src', 'locales');
const locales = fs.readdirSync(localesDir);
const filteredLocales = locales.filter(locale => locale !== 'translators.json');

const failedParse = [];

filteredLocales.forEach(localeFile => {
  const locale = localeFile.split('.json')[0];
  const jsonPath = path.join(localesDir, localeFile);
  const content = fs.readFileSync(jsonPath, 'utf8');

  try {
    JSON.parse(content);
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