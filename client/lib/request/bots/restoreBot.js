import ClientRequestClient from '@/lib/request/clientRequest';

export default function restoreBot(id) {
  const endpoint = `/bot-denies/${id}/restore`;

  return ClientRequestClient.post(endpoint);
}
