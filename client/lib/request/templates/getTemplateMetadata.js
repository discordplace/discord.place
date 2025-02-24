import ServerRequestClient from '@/lib/request/serverRequest';
import Endpoints from '@/lib/request/endpoints';

export default function getTemplateMetadata(id) {
  const endpoint = Endpoints.TemplateMetadata(id);

  return ServerRequestClient.get(endpoint);
}