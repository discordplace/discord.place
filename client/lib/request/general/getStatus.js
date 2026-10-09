export default async function getStatus() {
  const response = await fetch('/api/status');

  const data = await response.json().catch(() => null);

  if (!data?.status) {
    throw new Error(`Status check failed: ${response.status}`);
  }

  return data;
}
