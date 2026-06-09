import config from '@/config';

export default function getStatus() {
  return new Promise(async (resolve, reject) => {
    const url = `${config.api.url}/status`;

    fetch(url, {
      next: {
        revalidate: 60
      }
    })
      .then(async response => {
        const data = await response.json();

        resolve(data);
      })
      .catch(reject);
  });
}