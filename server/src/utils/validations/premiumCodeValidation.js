const PremiumCode = require('@/schemas/PremiumCode');

async function premiumCodeValidation(code) {
  const foundCode = await PremiumCode.findOne({ code });
  if (!foundCode) throw new Error('Premium code is invalid.');

  return true;
}

module.exports = premiumCodeValidation;