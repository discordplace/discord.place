import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getTheme(id) {
  const endpoint = Endpoints.Themes(id);

  return ServerRequestClient.get(endpoint);
}