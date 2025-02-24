import ClientRequestClient from '@/lib/request/clientRequest';

export default function denyTheme(id, reason) {
  const endpoint = `/themes/${id}/deny`;

  return ClientRequestClient.post(endpoint, { reason });
}
