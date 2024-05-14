const { URL } = require('node:url');

function inviteUrlValidation(text) {
  try {
    const url = new URL(text);

    if (url.protocol !== 'https:') throw new Error('Invalid protocol. Only HTTPS URLs are allowed.');
    
    return true;
  } catch (error) {
    throw new Error('Invalid URL format. Please provide a valid HTTPS URL.');
  }
}

module.exports = inviteUrlValidation;
