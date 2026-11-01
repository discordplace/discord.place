export default function isHexId(value) {
  return typeof value === 'string' && /^[0-9a-f]{12}$/.test(value);
}
