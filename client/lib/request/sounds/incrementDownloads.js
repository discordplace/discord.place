import ClientRequestClient from '@/lib/request/clientRequest';

export default function incrementDownloads(id) {
  const endpoint = `/sounds/${id}/downloads`;

  return ClientRequestClient.post(endpoint);
}
