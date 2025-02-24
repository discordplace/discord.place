import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteBotDenyRecord(id) {
  const endpoint = `/bot-denies/${id}`;

  return ClientRequestClient.delete(endpoint);
}
