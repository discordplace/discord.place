import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getTemplate(id) {
  const endpoint = Endpoints.Templates(id);

  return ServerRequestClient.get(endpoint);
}