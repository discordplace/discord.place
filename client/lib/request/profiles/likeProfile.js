import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function likeProfile(slug) {
  const endpoint = Endpoints.LikeProfile(slug);

  return ClientRequestClient.patch(endpoint, {}).then(data => data.isLiked);
}