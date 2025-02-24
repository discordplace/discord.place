import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteTemplate(id) {
  const endpoint = `/templates/${id}`;

  return ClientRequestClient.delete(endpoint);
}
