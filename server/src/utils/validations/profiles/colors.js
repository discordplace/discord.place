const { colord } = require('colord');

function colorsValidation(value) {
  const colors = Object.keys(value);
  if (colors.length !== 2) throw new Error('Colors must have exactly 2 keys.');

  if (value.primary === null && value.secondary === null) throw new Error('At least one color must be provided.');

  if (value.primary !== null) {
    const primary = colord(value.primary);
    if (!primary.isValid()) throw new Error('Primary color must be a valid hex code.');
  } 

  if (value.secondary !== null) {
    const secondary = colord(value.secondary);
    if (!secondary.isValid()) throw new Error('Secondary color must be a valid hex code.');
  }

  return true;
}

module.exports = colorsValidation;