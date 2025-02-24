import ClientRequestClient from '@/lib/request/clientRequest';

export default function denySound(id, reason) {
  const endpoint = `/sounds/${id}/deny`;

  return ClientRequestClient.post(endpoint, { reason });
}
