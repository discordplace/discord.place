import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createProfile(slug, preferredHost) {
  const endpoint = Endpoints.CreateProfile();

  return ClientRequestClient.post(endpoint, { slug, preferredHost });
}