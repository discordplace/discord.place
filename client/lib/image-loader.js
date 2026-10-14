// Remote images are served directly to the browser. Local images keep using
// the built-in optimizer, except SVGs which it cannot process.
export default function imageLoader({ src, width, quality }) {
  if (typeof src !== 'string') return src;

  if (/^(https?:|data:|blob:)/.test(src)) return src;

  if (src.toLowerCase().split('?')[0].endsWith('.svg')) return src;

  const q = quality || 75;

  return `/_next/image?url=${encodeURIComponent(src)}&w=${width}&q=${q}`;
}
