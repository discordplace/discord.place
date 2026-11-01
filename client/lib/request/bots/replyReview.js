import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function replyReview(botId, reviewId, content) {
  const endpoint = Endpoints.ReplyBotReview(botId, reviewId);

  return ClientRequestClient.post(endpoint, { content });
}
