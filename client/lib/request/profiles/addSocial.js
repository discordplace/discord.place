import ClientRequestClient from '@/lib/request/clientRequest';

export default function addSocial(slug, href, type) {
  const endpoint = `/profiles/${slug}`;

  return ClientRequestClient.patch(endpoint, {
    socials: {
      [type]: href
    }
  }).then(data => data.profile.socials);
}