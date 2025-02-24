import ClientRequestClient from '@/lib/request/clientRequest';

export default function checkSlugAvailability(slug) {
  const endpoint = '/profiles/check-slug-availability';

  return ClientRequestClient.post(endpoint, { slug }).then(data => data.available === true);
}