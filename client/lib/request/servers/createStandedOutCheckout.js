import ClientRequestClient from '@/lib/request/clientRequest';

export default function createStandedOutCheckout(serverId) {
  const endpoint = '/payments/checkout';

  return ClientRequestClient.post(endpoint, { id: 'standed-out', serverId });
}