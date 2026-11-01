import Endpoints from '@/lib/request/endpoints';
import ServerRequestClient from '@/lib/request/serverRequest';

export default function getTemplateMetadata(id) {
  const endpoint = Endpoints.TemplateMetadata(id);

  return ServerRequestClient.get(endpoint);
}