import ClientRequestClient from '@/lib/request/clientRequest';

export default function approveBot(id) {
  const endpoint = `/bots/${id}/approve`;

  return ClientRequestClient.post(endpoint);
}
