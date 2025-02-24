import ServerRequestClient from '@/lib/request/ServerRequestClient';
import Endpoints from '@/lib/request/endpoints';

export default function getThemeMetadata(themeId) {
  const endpoint = Endpoints.ThemeMetadata(themeId);

  return ServerRequestClient.get(endpoint);
}