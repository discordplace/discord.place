const crypto = require('node:crypto');

function decrypt(encryptedData, secret) {
  if (!encryptedData || !encryptedData.iv || !encryptedData.encryptedText || !encryptedData.tag || !secret) throw new Error('Invalid encrypted data or secret.');

  const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(secret, 'hex'), Buffer.from(encryptedData.iv, 'hex'));
  decipher.setAuthTag(Buffer.from(encryptedData.tag, 'hex'));
  const decrypted = Buffer.concat([decipher.update(Buffer.from(encryptedData.encryptedText, 'hex')), decipher.final()]);

  return decrypted.toString('utf-8');
}

module.exports = decrypt;