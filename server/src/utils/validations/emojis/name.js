function nameValidation(value) {
  return /^[a-z0-9_]{0,20}$/.test(value);
}

module.exports = nameValidation;