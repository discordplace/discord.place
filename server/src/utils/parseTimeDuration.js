function parseTimeDuration(duration) {
  const regex = /(\d+)\s*(s|sec|second|m|min|minute|h|hour|d|day|w|week)/;
  const match = duration.match(regex);
  if (!match) return null;

  const value = parseInt(match[1]);
  const unit = match[2].toLowerCase();
  switch (unit) {
  case 's':
  case 'sec':
  case 'second':
    return value * 1000;
  case 'm':
  case 'min':
  case 'minute':
    return value * 60 * 1000;
  case 'h':
  case 'hour':
    return value * 60 * 60 * 1000;
  case 'd':
  case 'day':
    return value * 24 * 60 * 60 * 1000;
  case 'w':
  case 'week':
    return value * 7 * 24 * 60 * 60 * 1000;
  default:
    return null;
  }
}


module.exports = parseTimeDuration;