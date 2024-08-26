import config from '@/config';
import { formatDistanceToNow } from 'date-fns';
import * as locales from 'date-fns/locale';

function getRelativeTime(date, language) {
  const localeObj = config.availableLocales.find(locale => locale.code === language);

  if (!localeObj) {
    console.error(`Locale for language code "${language}" not found.`);
    const defaultLocale = config.availableLocales.find(locale => locale.default);
    return formatDistanceToNow(
      new Date(date),
      {
        addSuffix: true,
        locale: locales[defaultLocale.dateFnsKey] || undefined,
      }
    );
  }

  const locale = locales[localeObj.dateFnsKey];

  if (!locale) {
    console.error(`Locale "${localeObj.dateFnsKey}" not found in date-fns locales.`);
    return formatDistanceToNow(new Date(date), { addSuffix: true });
  }

  return formatDistanceToNow(
    new Date(date),
    {
      addSuffix: true,
      locale,
    }
  );
}

export default getRelativeTime;
