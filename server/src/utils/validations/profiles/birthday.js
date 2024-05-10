function birthdayValidation(value) {
  const regexp = /^(\d{2}\/\d{2}\/\d{4})$/;
  if (!regexp.test(value)) throw new Error('Birthday must be in the format MM/DD/YYYY.');

  const date = new Date(value);
  if (date.toString() === 'Invalid Date') throw new Error('Birthday must be a valid date.');

  const now = new Date();
  if (date > now) throw new Error('Birthday must be in the past.');

  return true;
}

module.exports = birthdayValidation;