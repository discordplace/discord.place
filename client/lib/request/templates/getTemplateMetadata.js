import ServerRequestClient from '@/lib/request/serverRequest';

export default function getTemplateMetadata(id) {
  const endpoint = `/templates/${id}/metadata`;

  return ServerRequestClient.get(endpoint);
}
