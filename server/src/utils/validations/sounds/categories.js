function categoriesValidation(categories) {
  if (categories.length <= 0) throw new Error('Categories must not be empty.');
  if (categories.length > config.soundCategories.length) throw new Error(`Categories must not exceed ${config.soundCategories.length}.`);
  if (!categories.some(category => config.soundCategories.find(c => c == category))) throw new Error(`${categories.join(', ')} is not a valid category.`);
  if (categories.some(category => categories.findIndex(c => c == category) != categories.lastIndexOf(category))) throw new Error('Multiple categories are not allowed.');

  return true;
}

module.exports = categoriesValidation;