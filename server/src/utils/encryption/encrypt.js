const crypto = require('node:crypto');

function encrypt(text, secret) {
  if (!text || !secret) throw new Error('Text and secret are required');

  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), iv);
  const encrypted = Buffer.concat([cipher.update(text, 'utf-8'), cipher.final()]);
  const tag = cipher.getAuthTag();
  
  return { iv: iv.toString('hex'), encryptedText: encrypted.toString('hex'), tag: tag.toString('hex') };
}

module.exports = encrypt;