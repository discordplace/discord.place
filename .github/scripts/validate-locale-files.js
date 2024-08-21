if (!process.env.DEFAULT_LOCALE_CODE) throw new Error('DEFAULT_LOCALE_CODE environment variable is required');

const fs = require('node:fs');
const path = require('node:path');

const localesDir = path.join(__dirname, '..', '..', 'client', 'locales');
const locales = fs.readdirSync(localesDir);

const failedParse = [];

locales.forEach(locale => {
  const jsonPath = path.join(localesDir, `${locale}.json`);
  const content = fs.readFileSync(jsonPath, 'utf8');

  try {
    JSON.parse(content);
  } catch (e) {
    failedParse.push(locale);
  }
})

if (failedParse.length > 0) {
  console.error(`Failed to parse the following locales: ${failedParse.join(', ')}`);
  process.exit(1);
}

console.log('All locales are valid JSON');

console.log('Checking missing or extra keys in locales');

const defaultLocalePath = path.join(localesDir, `${process.env.DEFAULT_LOCALE_CODE}.json`);
const defaultLocaleContent = JSON.parse(fs.readFileSync(defaultLocalePath, 'utf8'));

const missingKeys = [];
const extraKeys = [];

locales.forEach(locale => {
  if (locale === process.env.DEFAULT_LOCALE_CODE) return;

  const localePath = path.join(localesDir, `${locale}.json`);
  const localeContent = JSON.parse(fs.readFileSync(localePath, 'utf8'));

  Object.keys(defaultLocaleContent).forEach(key => {
    if (!localeContent[key]) {
      missingKeys.push({ locale, key });
    }
  });

  Object.keys(localeContent).forEach(key => {
    if (!defaultLocaleContent[key]) {
      extraKeys.push({ locale, key });
    }
  });
});

if (missingKeys.length > 0) {
  console.error('Missing keys in locales:');

  missingKeys.forEach(({ locale, key }) => {
    console.error(`  ${locale}: ${key}`);
  });
}

if (extraKeys.length > 0) {
  console.error('Extra keys in locales:');

  extraKeys.forEach(({ locale, key }) => {
    console.error(`  ${locale}: ${key}`);
  });
}

if (missingKeys.length > 0 || extraKeys.length > 0) process.exit(1);
