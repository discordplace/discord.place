import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteProfile(slug) {
  const endpoint = `/profiles/${slug}/delete`;

  return ClientRequestClient.post(endpoint);
}