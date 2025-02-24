import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function incrementViews(slug) {
  const endpoint = Endpoints.IncrementViews(slug);

  return ClientRequestClient.post(endpoint, {});
}