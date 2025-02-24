import ClientRequestClient from '@/lib/request/clientRequest';

export default function patchProfileVerify(slug, verified) {
  const endpoint = `/profiles/${slug}`;

  return ClientRequestClient.patch(endpoint, { verified });
}