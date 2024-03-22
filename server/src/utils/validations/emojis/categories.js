function categoriesValidation(value) {
  if (value.length > config.emojiMaxCategoriesLength) throw new Error(`Categories can't exceed ${config.emojiMaxCategoriesLength}.`);
  if (!value.every(category => config.emojiCategories.includes(category))) throw new Error('Invalid category.');

  return true;
}

module.exports = categoriesValidation;