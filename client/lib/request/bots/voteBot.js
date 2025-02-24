import ClientRequestClient from '@/lib/request/clientRequest';

export default function voteBot(id, captchaResponse) {
  const endpoint = `/bots/${id}/vote`;

  return ClientRequestClient.post(endpoint, { captchaResponse });
}
