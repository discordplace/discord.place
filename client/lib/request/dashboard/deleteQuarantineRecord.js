import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteQuarantineRecord(id) {
  const endpoint = `/quarantines/${id}`;

  return ClientRequestClient.delete(endpoint);
}
