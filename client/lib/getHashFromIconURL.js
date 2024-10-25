function getHashFromIconURL(url) {
  return url.split('/icons/')[1].split('.')[0];
}

module.exports = getHashFromIconURL;