function nameValidation(value) {
  const trimmedValue = value.trim();
  if (trimmedValue.length <= 0) throw new Error('Name should not be empty.');
  if (trimmedValue.length > config.soundNameMaxLength) throw new Error(`Name should not exceed ${config.soundNameMaxLength} characters.`);

  const matches = trimmedValue.match(/[^a-zA-Z0-9_\- ]/);
  if (matches) throw new Error('Name should only contain letters, numbers, underscores, hyphens, and spaces.');

  return true;
}

module.exports = nameValidation;