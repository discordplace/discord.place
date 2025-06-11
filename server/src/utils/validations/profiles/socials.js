function socialsValidation(value) {
  const socials = Object.keys(value);
  const allowedKeys = ['instagram', 'x', 'twitter', 'tiktok', 'facebook', 'steam', 'github', 'twitch', 'youtube', 'telegram', 'linkedin', 'gitlab', 'reddit', 'mastodon', 'bluesky', 'custom'];

  if (socials.some(social => !allowedKeys.includes(social))) throw new Error(`Socials contains invalid key: ${socials.find(social => !allowedKeys.includes(social))}`);
  if (socials.some(social => typeof social !== 'string')) throw new Error('Socials values must be strings.');
  if (socials.some(social => value[social].trim().length > 256)) throw new Error('Socials values cannot be longer than 256 characters.');

  return true;
}

module.exports = socialsValidation;