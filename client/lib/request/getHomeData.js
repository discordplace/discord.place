import fetchProfiles from '@/lib/request/profiles/fetchProfiles';
import fetchServers from '@/lib/request/servers/fetchServers';
import fetchBots from '@/lib/request/bots/fetchBots';
import fetchEmojis from '@/lib/request/emojis/fetchEmojis';
import fetchTemplates from '@/lib/request/templates/fetchTemplates';

export default function getHomeData(key) {
  // eslint-disable-next-line no-async-promise-executor
  if (key === 'profiles') return fetchProfiles('', 1, 6);
  if (key === 'servers') return fetchServers('', 1, 9, 'All', 'Votes');
  if (key === 'bots') return fetchBots('', 1, 9, 'All', 'Votes');
  if (key === 'emojis') return fetchEmojis('', 'All', 'Popular', 1, 9);
  if (key === 'templates') return fetchTemplates('', 1, 9, 'All', 'Popular');
}