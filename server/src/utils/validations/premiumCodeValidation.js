const PremiumCode = require('@/schemas/Premium/Code');

async function premiumCodeValidation(code) {
  const foundCode = await PremiumCode.findOne({ code });
  if (!foundCode) throw new Error('Premium code is invalid.');

  if (foundCode.expire_at && new Date() > foundCode.expire_at) {
    await foundCode.deleteOne();

    throw new Error('Premium code has expired.');
  }

  return true;
}

module.exports = premiumCodeValidation;