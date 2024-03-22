function birthdayValidation(value) {
  return /^(\d{2}\/\d{2}\/\d{4})$/.test(value);
}

module.exports = birthdayValidation;