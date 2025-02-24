import ClientRequestClient from '@/lib/request/clientRequest';

export default function approveTheme(id) {
  const endpoint = `/themes/${id}/approve`;

  return ClientRequestClient.post(endpoint);
}
