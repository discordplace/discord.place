import ClientRequestClient from '@/lib/request/clientRequest';

export default function editServer(id, changedKeys) {
  const endpoint = `/servers/${id}`;
  const data = changedKeys.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

  return ClientRequestClient.patch(endpoint, data);
}
