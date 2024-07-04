const { URL } = require('node:url');

function webhookUrlValidation(text) {
  if (!text) return true;
  
  try {
    const url = new URL(text);

    if (url.protocol !== 'https:') throw new Error('Invalid protocol. Only HTTPS URLs are allowed.');
    if (url.hostname.endsWith('discord.place')) throw new Error('Invalid hostname. Please provide a valid HTTPS URL.');
    
    return true; 
  } catch (error) {
    throw new Error('Invalid URL format. Please provide a valid HTTPS URL.');
  }
}

module.exports = webhookUrlValidation;