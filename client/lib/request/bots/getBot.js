import ServerRequestClient from '@/lib/request/serverRequest';

export default function getBot(id) {
  const endpoint = `/bots/${id}`;

  return ServerRequestClient.get(endpoint);
}