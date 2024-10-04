function humanizeMs(ms, strings) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} ${strings.days}, ${hours % 24} ${strings.hours}, ${minutes % 60} ${strings.minutes}, ${seconds % 60} ${strings.seconds}`;
  if (hours > 0) return `${hours} ${strings.hours}, ${minutes % 60} ${strings.minutes}, ${seconds % 60} ${strings.seconds}`;
  if (minutes > 0) return `${minutes} ${strings.minutes}, ${seconds % 60} ${strings.seconds}`;
  return `${seconds} ${strings.seconds}`;
}

module.exports = humanizeMs;