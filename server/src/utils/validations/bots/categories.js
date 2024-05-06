function categoriesValidation(categories) {
  if (categories.length <= 0) throw new Error('Categories must not be empty.');
  if (categories.length > config.botCategories.length) throw new Error(`Categories must not exceed ${config.botCategories.length}.`);
  if (!categories.some(category => config.botCategories.find(c => c == category))) throw new Error(`${categories.join(', ')} is not a valid category.`);
  if (categories.some(category => categories.findIndex(c => c == category) != categories.lastIndexOf(category))) throw new Error('Multiple categories are not allowed.');

  return true;
}

module.exports = categoriesValidation;