import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function addSocial(slug, href, type) {
  const endpoint = Endpoints.AddSocial(slug);

  return ClientRequestClient.patch(endpoint, {
    socials: {
      [type]: href
    }
  }).then(data => data.profile.socials);
}