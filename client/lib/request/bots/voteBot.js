import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function voteBot(id, captchaResponse) {
  const endpoint = Endpoints.VoteBot(id);

  return ClientRequestClient.post(endpoint, { captchaResponse });
}