import ClientRequestClient from '@/lib/request/clientRequest';

export default function createProfile(slug, preferredHost) {
  const endpoint = '/profiles';

  return ClientRequestClient.post(endpoint, { slug, preferredHost });
}