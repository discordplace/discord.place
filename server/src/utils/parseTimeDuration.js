const chrono = require('chrono-node/en');

function parseTimeDuration(duration) {
  return chrono.parseDate(duration);
}

module.exports = parseTimeDuration;