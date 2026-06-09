function getProfileURL(slug, preferredHost) {
  return `https://${preferredHost}/${slug}`;
}

function getEmojiURL(id, animated) {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/emojis/${id}.${animated ? 'gif' : 'png'}`;
}

function getSoundURL(id) {
  return `${process.env.NEXT_PUBLIC_CDN_URL}/sounds/${id}.mp3`;
}

function getEmojiIdFromURL(url) {
  const match = url.match(/emojis\/(?:packages\/(?<packageId>[a-zA-Z0-9-]+)\/)?(?<emojiId>[a-zA-Z0-9-]+)\.(?<type>gif|png)/);
  if (!match) return null;

  return match.groups.packageId;
}

function validateSlug(value) {
  return /^(?!-)(?!.*--)(?!.*-$)[a-zA-Z0-9-]{3,32}$/.test(value);
}

const utils = {
  getEmojiIdFromURL,
  getEmojiURL,
  getProfileURL,
  getSoundURL,
  validateSlug
};

export default utils;