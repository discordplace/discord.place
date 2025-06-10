function getSoundURL(id) {
  return `${process.env.CDN_URL}/sounds/${id}.mp3`;
}

module.exports = getSoundURL;