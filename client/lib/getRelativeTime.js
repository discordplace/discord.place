import { formatDistanceToNow } from 'date-fns';

function getRelativeTime(date) {
  return formatDistanceToNow(new Date(date), { addSuffix: true });
}

export default getRelativeTime;