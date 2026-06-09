import config from '@/config';

export default function getTopServers() {
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/top-servers`;

    fetch(url, {
      next: {
        revalidate: 60 * 60 * 24
      }
    })
      .then(async response => {
        const data = await response.json();

        resolve(data);
      })
      .catch(reject);
  });
}