import ClientRequestClient from '@/lib/request/clientRequest';

export default function incrementDownloads(id, isPack) {
  const endpoint = `/emojis/${isPack ? 'packages/' : ''}${id}/downloads`;

  return ClientRequestClient.post(endpoint);
}