export default async function getStatus() {
  const response = await fetch('/api/status');

  if (!response.ok) {
    throw new Error(`Status check failed: ${response.status}`);
  }

  return response.json();
}
