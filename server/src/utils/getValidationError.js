function getValidationError(document) {
  const errors = document.validateSync();
  if (errors) {
    const error = Object.values(errors.errors)[0];

    return error?.message || 'An unknown error occurred.';
  }

  return null;
}

module.exports = getValidationError;