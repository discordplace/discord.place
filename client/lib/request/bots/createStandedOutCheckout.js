import ClientRequestClient from '@/lib/request/clientRequest';

export default function createStandedOutCheckout(botId) {
  const endpoint = '/payments/checkout';

  return ClientRequestClient.post(endpoint, { id: 'standed-out', botId });
}
