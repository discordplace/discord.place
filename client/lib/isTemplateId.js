export default function isTemplateId(value) {
  return typeof value === 'string' && /^[a-zA-Z0-9]{12}$/.test(value);
}
