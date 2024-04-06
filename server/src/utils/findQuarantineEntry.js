const Quarantine = require('@/schemas/Quarantine');

function findQuarantineEntry(type, value, restriction) {
  if (!type) throw new Error('Type is required');
  if (!value) throw new Error('Value is required');
  if (!restriction) throw new Error('Restriction is required');

  if (!config.quarantineTypes.includes(type)) throw new Error('Invalid quarantine type');
  if (!config.quarantineRestrictions[restriction]) throw new Error('Invalid quarantine restriction');

  // eslint-disable-next-line no-async-promise-executor
  return new Promise(async (resolve, reject) => {
    const entry = await Quarantine.findOne({ type, [type === 'USER_ID' ? 'user.id' : 'guild.id']: value, restriction });
    if (!entry) return reject('Quarantine entry not found');

    resolve(entry);
  });
}

module.exports = findQuarantineEntry;