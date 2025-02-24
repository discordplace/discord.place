import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function checkSlugAvailability(slug) {
  const endpoint = Endpoints.CheckSlugAvailability;

  return ClientRequestClient.post(endpoint, { slug }).then(data => data.available === true);
}