import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function incrementDownloads(id) {
  const endpoint = Endpoints.IncrementSoundDownloads(id);

  return ClientRequestClient.post(endpoint);
}