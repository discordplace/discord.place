const UserHashes = require('@/schemas/User/Hashes');

async function getUserHashes(userId) {
  const hashes = (await UserHashes.findOne({ id: userId })) || new UserHashes({ id: userId });
  if (typeof hashes.__v === 'undefined') await hashes.getNewHashes();

  return hashes;
}

module.exports = getUserHashes;