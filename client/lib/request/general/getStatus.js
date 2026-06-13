export default function getStatus() {
  return new Promise(async (resolve, reject) => {
    fetch('/api/status')
      .then(async response => {
        const data = await response.json();

        resolve(data);
      })
      .catch(reject);
  });
}