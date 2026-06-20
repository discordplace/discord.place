export default function getStatus() {
  return new Promise(async (resolve, reject) => {
    fetch('/api/status')
      .then(async response => {
        if (!response.ok) {
          throw new Error(`Status check failed: ${response.status}`);
        }

        const data = await response.json();

        resolve(data);
      })
      .catch(reject);
  });
}