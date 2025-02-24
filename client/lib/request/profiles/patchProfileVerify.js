import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function patchProfileVerify(slug, verified) {
  const endpoint = Endpoints.PatchProfileVerify(slug);

  return ClientRequestClient.patch(endpoint, { verified });
}