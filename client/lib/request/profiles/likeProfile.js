import ClientRequestClient from '@/lib/request/clientRequest';

export default function likeProfile(slug) {
  const endpoint = `/profiles/${slug}/like`;

  return ClientRequestClient.patch(endpoint, {}).then(data => data.isLiked);
}