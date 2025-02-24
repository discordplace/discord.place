import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function deleteSocial(slug, socialId) {
  const endpoint = Endpoints.DeleteSocial(slug, socialId);

  return ClientRequestClient.post(endpoint).then(data => data.profile.socials);
}