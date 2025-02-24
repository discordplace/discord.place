import ClientRequestClient from '@/lib/request/clientRequest';

export default function createApiKey(id, isNew) {
  const endpoint = `/bots/${id}/api-key`;
  const method = isNew ? 'post' : 'patch';

  return ClientRequestClient[method](endpoint).then(data => data.apiKey);
}
