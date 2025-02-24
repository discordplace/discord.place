import ClientRequestClient from '@/lib/request/clientRequest';

export default function likeSound(id) {
  const endpoint = `/sounds/${id}/like`;

  return ClientRequestClient.patch(endpoint).then(data => data.isLiked);
}
