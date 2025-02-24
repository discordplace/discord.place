import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function voteServer(id, captchaResponse) {
  const endpoint = Endpoints.VoteServer(id);

  return ClientRequestClient.post(endpoint, { captchaResponse });
}