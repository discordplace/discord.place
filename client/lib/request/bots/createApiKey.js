import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function createApiKey(id, isNew) {
  const endpoint = Endpoints.CreateApiKey(id);
  const method = isNew ? 'post' : 'patch';

  return ClientRequestClient[method](endpoint).then(data => data.apiKey);
}