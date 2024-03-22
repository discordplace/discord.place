function slugValidation(value) {
  return /^(?!-)(?!.*--)(?!.*-$)[a-zA-Z0-9-]{3,32}$/.test(value);
}

module.exports = slugValidation;