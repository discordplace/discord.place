function getEmojiURL (id, animated) {
  return `https://cdn.discord.place/emojis/${id}.${animated ? 'gif' : 'png'}`;
}

module.exports = getEmojiURL;