function githubRepositoryValidation(text) {
  if (!text) return true;

  const usernameRepositoryRegex = /^([a-zA-Z\d]{1}[-a-zA-Z\d]+)(\/){1}([-\w.]+)$/i;
  if (!usernameRepositoryRegex.test(text)) throw new Error('Invalid username/repository format.');

  return true;
}

module.exports = githubRepositoryValidation;