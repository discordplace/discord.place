export default function isSnowflake(value) {
  return typeof value === 'string' && /^\d{17,20}$/.test(value);
}
