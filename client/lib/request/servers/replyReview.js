import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function replyReview(serverId, reviewId, content) {
  const endpoint = Endpoints.ReplyServerReview(serverId, reviewId);

  return ClientRequestClient.post(endpoint, { content });
}
