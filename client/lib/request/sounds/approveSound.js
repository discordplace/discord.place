import ClientRequestClient from '@/lib/request/clientRequest';

export default function approveSound(id) {
  const endpoint = `/sounds/${id}/approve`;

  return ClientRequestClient.post(endpoint);
}