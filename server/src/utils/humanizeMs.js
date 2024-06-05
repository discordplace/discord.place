function humanizeMs(ms) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (days > 0) return `${days} days, ${hours % 24} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
  if (hours > 0) return `${hours} hours, ${minutes % 60} minutes, ${seconds % 60} seconds`;
  if (minutes > 0) return `${minutes} minutes, ${seconds % 60} seconds`;
  return `${seconds} seconds`;
}

module.exports = humanizeMs;