import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function likeSound(id) {
  const endpoint = Endpoints.LikeSound(id);

  return ClientRequestClient.patch(endpoint).then(data => data.isLiked);
}