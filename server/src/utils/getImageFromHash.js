function getImageFromHash(id, hash, options = {}) {
  const defaultOptions = {
    format: 'webp',
    size: 128
  };

  const { format, size } = { ...defaultOptions, ...options };

  const cdnUrl = 'https://cdn.discordapp.com';

  if (!hash) return `${cdnUrl}/embed/avatars/0.png?format=${format}&size=${size}`;

  return `${cdnUrl}/avatars/${id}/${hash}.${format}?size=${size}`;
}

module.exports = getImageFromHash;