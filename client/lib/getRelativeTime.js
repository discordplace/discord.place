import config from '@/config';
import { formatDistanceToNow } from 'date-fns';
import * as locales from 'date-fns/locale';

function getRelativeTime(date, language) {
  return formatDistanceToNow(
    new Date(date),
    {
      addSuffix: true,
      locale: locales[config.availableLocales.find(locale => locale.code === language).dateFnsKey]
    }
  );
}

export default getRelativeTime;
