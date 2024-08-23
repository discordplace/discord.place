const ServerHashes = require('@/schemas/Server/Hashes');

async function getServerHashes(serverId) {
  const hashes = (await ServerHashes.findOne({ id: serverId })) || new ServerHashes({ id: serverId });
  if (typeof hashes.__v === 'undefined') await hashes.getNewHashes();

  return hashes;
}

module.exports = getServerHashes;