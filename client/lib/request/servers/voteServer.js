import ClientRequestClient from '@/lib/request/clientRequest';

export default function voteServer(id, captchaResponse) {
  const endpoint = `/servers/${id}/vote`;

  return ClientRequestClient.post(endpoint, { captchaResponse });
}
