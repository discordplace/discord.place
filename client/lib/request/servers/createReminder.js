import ClientRequestClient from '@/lib/request/clientRequest';

export default function createReminder(id) {
  const endpoint = `/servers/${id}/reminder`;

  return ClientRequestClient.post(endpoint, {});
}