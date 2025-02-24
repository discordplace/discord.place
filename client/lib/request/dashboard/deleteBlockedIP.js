import ClientRequestClient from '@/lib/request/clientRequest';

export default function deleteBlockedIP(ip) {
  const endpoint = `/blocked-ips/${ip}`;

  return ClientRequestClient.delete(endpoint);
}
