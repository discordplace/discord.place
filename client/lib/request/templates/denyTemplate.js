import ClientRequestClient from '@/lib/request/clientRequest';

export default function denyTemplate(id, reason) {
  const endpoint = `/templates/${id}/deny`;

  return ClientRequestClient.post(endpoint, { reason });
}
