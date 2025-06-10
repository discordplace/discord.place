function getEmojiURL(id, animated) {
  return `${process.env.CDN_URL}/emojis/${id}.${animated ? 'gif' : 'png'}`;
}

module.exports = getEmojiURL;