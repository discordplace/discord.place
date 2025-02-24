import ClientRequestClient from '@/lib/request/clientRequest';

export default function approveTemplate(id) {
  const endpoint = `/templates/${id}/approve`;

  return ClientRequestClient.post(endpoint);
}
