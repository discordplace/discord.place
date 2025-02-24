import ServerRequestClient from '@/lib/request/ServerRequestClient';

export default function getThemeMetadata(themeId) {
  const endpoint = `/themes/${themeId}/metadata`;

  return ServerRequestClient.get(endpoint);
}