import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteProfile(slug) {
  const endpoint = Endpoints.DeleteProfile(slug);

  return ClientRequestClient.post(endpoint);
}