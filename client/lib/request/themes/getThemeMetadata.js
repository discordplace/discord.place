import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getThemeMetadata(themeId) {
  const endpoint = Endpoints.ThemeMetadata(themeId);

  return ServerRequestClient.get(endpoint);
}