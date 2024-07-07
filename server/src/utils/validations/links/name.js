function nameValidation(value) {
  const nameRegex = /^[a-zA-Z0-9-_]+$/;
  if (!nameRegex.test(value.trim())) throw new Error('Link name can only contain letters, numbers, hyphens, and underscores.');

  if (value.trim().length > 20) throw new Error('Link name must be less than 20 characters.');

  return true;
}

module.exports = nameValidation;