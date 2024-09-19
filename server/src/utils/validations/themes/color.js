const { colord } = require('colord');

function colorValidation(color) {
  const regex = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
  if (!regex.test(color)) throw new Error(`${color} is not a valid color.`);

  if (!colord(color).isValid()) throw new Error(`${color} is not a valid color.`);

  return true;
}

module.exports = colorValidation;