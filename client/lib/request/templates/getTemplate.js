import ServerRequestClient from '@/lib/request/serverRequest';

export default function getTemplate(id) {
  const endpoint = `/templates/${id}`;

  return ServerRequestClient.get(endpoint);
}
