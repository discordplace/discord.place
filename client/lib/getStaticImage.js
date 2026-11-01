import fs from 'node:fs';
import path from 'node:path';

const MIME_TYPES = {
  '.gif': 'image/gif',
  '.jpeg': 'image/jpeg',
  '.jpg': 'image/jpeg',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp'
};

const cache = new Map();

// Reads a file from `public/` and returns it as a data URI.
// @vercel/og refuses to fetch loopback addresses (SSRF protection), so local
// assets used in generated images have to be inlined instead of linked.
export default function getStaticImage(relativePath) {
  if (cache.has(relativePath)) return cache.get(relativePath);

  let dataUri = null;

  try {
    const filePath = path.join(process.cwd(), 'public', relativePath);
    const mime = MIME_TYPES[path.extname(relativePath).toLowerCase()] ?? 'application/octet-stream';

    dataUri = `data:${mime};base64,${fs.readFileSync(filePath).toString('base64')}`;
  } catch {
    dataUri = null;
  }

  cache.set(relativePath, dataUri);

  return dataUri;
}
