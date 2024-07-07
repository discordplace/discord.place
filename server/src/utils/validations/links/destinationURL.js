function destinationURL(value) {
  try {
    const parsedURL = new URL(value);
    if (parsedURL.protocol !== 'https:') throw new Error('Link destination must be a secure URL.');

    if (parsedURL.port) throw new Error('Link destination cannot have a port.');

    return true;
  } catch {
    throw new Error('Link destination must be a valid URL.');
  }
}

module.exports = destinationURL;