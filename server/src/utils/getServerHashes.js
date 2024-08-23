const ServerHashes = require('@/schemas/Server/Hashes');

async function getServerHashes(userId) {
  const hashes = (await ServerHashes.findOne({ id: userId })) || new ServerHashes({ id: userId });
  if (typeof hashes.__v === 'undefined') await hashes.getNewHashes();

  return hashes;
}

module.exports = getServerHashes;