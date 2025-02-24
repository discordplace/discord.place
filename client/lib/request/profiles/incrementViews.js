import ClientRequestClient from '@/lib/request/clientRequest';

export default function incrementViews(slug) {
  const endpoint = `/profiles/${slug}/views`;

  return ClientRequestClient.post(endpoint, {});
}