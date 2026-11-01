import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getTheme(id) {
  const endpoint = Endpoints.Themes(id);

  return ServerRequestClient.get(endpoint);
}