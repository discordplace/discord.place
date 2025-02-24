import ClientRequestClient from '@/lib/request/clientRequest';

export default function getPlans() {
  const endpoint = '/payments/plans';

  return ClientRequestClient.get(endpoint);
}