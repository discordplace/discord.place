import config from '@/config';

const UNITS = [
  { ms: 365 * 24 * 60 * 60 * 1000, unit: 'year' },
  { ms: 30 * 24 * 60 * 60 * 1000, unit: 'month' },
  { ms: 7 * 24 * 60 * 60 * 1000, unit: 'week' },
  { ms: 24 * 60 * 60 * 1000, unit: 'day' },
  { ms: 60 * 60 * 1000, unit: 'hour' },
  { ms: 60 * 1000, unit: 'minute' },
  { ms: 1000, unit: 'second' }
];

const formatters = new Map();

function getFormatter(language) {
  const locale = config.availableLocales.some(({ code }) => code === language) ? language : config.availableLocales[0].code;

  if (!formatters.has(locale)) {
    formatters.set(locale, new Intl.RelativeTimeFormat(locale, { numeric: 'auto', style: 'long' }));
  }

  return formatters.get(locale);
}

function getRelativeTime(date, language = config.availableLocales[0].code) {
  const rtf = getFormatter(language);
  const delta = new Date(date).getTime() - Date.now();

  if (Number.isNaN(delta)) return '';

  const absDelta = Math.abs(delta);

  for (const { unit, ms } of UNITS) {
    if (absDelta >= ms || unit === 'second') {
      return rtf.format(Math.round(delta / ms), unit);
    }
  }
}

export default getRelativeTime;