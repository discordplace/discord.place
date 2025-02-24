import ClientRequestClient from '@/lib/request/clientRequest';

export default function editBot(id, changedKeys) {
  const endpoint = `/bots/${id}`;
  const data = changedKeys.reduce((acc, { key, value }) => ({ ...acc, [key]: value }), {});

  return ClientRequestClient.patch(endpoint, data);
}
