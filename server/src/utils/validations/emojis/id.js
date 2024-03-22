function idValidation(value) {
  return /^[0-9a-f]{12}$/.test(value);
}

module.exports = idValidation;