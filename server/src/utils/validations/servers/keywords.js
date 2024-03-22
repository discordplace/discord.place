function keywordsValidation(value) {
  if (!Array.isArray(value)) throw new Error('Keywords should be an array.');
  if (value.length < 1) throw new Error('Keywords should have at least one item.');
  if (value.length > config.serverKeywordsMaxLength) throw new Error(`Keywords can only up to ${config.serverKeywordsMaxLength} characters.`);
  if (value.some(keyword => keyword.length > config.serverKeywordsMaxCharacters)) throw new Error(`Keywords can only have up to ${config.serverKeywordsMaxCharacters} characters.`);
  if (value.some((keyword, index) => value.indexOf(keyword) !== index)) throw new Error('Keywords should be unique.');

  return true;
}

module.exports = keywordsValidation;