import ClientRequestClient from '@/lib/request/clientRequest';

export default function editProfile(slug, changedKeys) {
  const endpoint = `/profiles/${slug}`;

  return ClientRequestClient.patch(endpoint, changedKeys).then(data => data.profile);
}