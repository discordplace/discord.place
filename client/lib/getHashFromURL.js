function getHashFromURL(url, type) {
  const split = url.split(`/${type}/`);

  return split[1].split('.')[0];
}

module.exports = getHashFromURL;