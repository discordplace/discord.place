import ClientRequestClient from '@/lib/request/clientRequest';

export default function addSocial(slug, socialId) {
  const endpoint = `/profiles/${slug}/socials/delete/${socialId}`;

  return ClientRequestClient.post(endpoint).then(data => data.profile.socials);
}