import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getTemplate(id) {
  const endpoint = Endpoints.Templates(id);

  return ServerRequestClient.get(endpoint);
}