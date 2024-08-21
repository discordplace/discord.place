const fs = require('node:fs');
const path = require('node:path');
const core = require('@actions/core');

if (!process.env.DEFAULT_LOCALE_CODE) core.setFailed('DEFAULT_LOCALE_CODE is not set');

const localesDir = path.join(__dirname, '..', '..', 'client', 'locales');
const locales = fs.readdirSync(localesDir);

const failedParse = [];

locales.forEach(localeFile => {
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
} else {
  console.log('All locale files are valid JSON');
}

console.log('Checking missing or extra keys in locales');

const defaultLocalePath = path.join(localesDir, `${process.env.DEFAULT_LOCALE_CODE}.json`);
const defaultLocaleContent = JSON.parse(fs.readFileSync(defaultLocalePath, 'utf8'));

locales.forEach(localeFile => {
  const locale = localeFile.split('.json')[0];
  if (locale === process.env.DEFAULT_LOCALE_CODE) return;
  if (failedParse.includes(locale)) return;

  const jsonPath = path.join(localesDir, `${locale}.json`);
  const content = fs.readFileSync(jsonPath, 'utf8');

  const missingKeys = Object.keys(defaultLocaleContent).filter(key => !content[key]);
  const extraKeys = Object.keys(content).filter(key => !defaultLocaleContent[key]);

  if (missingKeys.length > 0) {
    missingKeys.forEach(key => {
      core.error(`Missing key ${key} in ${locale}.json`, {
        title: 'Missing key',
        file: `${locale}.json`,
        startLine: content.split('\n').findIndex(line => line.includes(`"${key}"`)) + 1
      });
    });
  }
  
  if (extraKeys.length > 0) {
    extraKeys.forEach(key => {
      core.error(`Extra key ${key} in ${locale}.json`, {
        title: 'Extra key',
        file: `${locale}.json`,
        startLine: content.split('\n').findIndex(line => line.includes(`"${key}"`)) + 1
      });
    });
  }
});

if (failedParse.length > 0 || missingKeys.length > 0 || extraKeys.length > 0) {
  core.setFailed('Failed to validate locale files');
} else {
  console.log('All locale files are valid');
}