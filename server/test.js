const crypto = require('node:crypto');

// Generate a random secret key of specified length (e.g., 32 bytes for AES-256)
const generateSecretKey = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Example usage:
const secretKey = generateSecretKey();
console.log('Generated Secret Key:', secretKey);