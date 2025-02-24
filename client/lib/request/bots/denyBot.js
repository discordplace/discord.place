import ClientRequestClient from '@/lib/request/clientRequest';

export default function denyBot(id, reason) {
  const endpoint = `/bots/${id}/deny`;

  return ClientRequestClient.post(endpoint, { reason });
}
