import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function editProfile(slug, changedKeys) {
  const endpoint = Endpoints.EditProfile(slug);

  return ClientRequestClient.patch(endpoint, changedKeys).then(data => data.profile);
}