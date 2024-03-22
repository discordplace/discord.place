export default function fuc(str) {
  if (typeof str !== 'string') return null;
  return str.charAt(0).toUpperCase() + str.slice(1);
}