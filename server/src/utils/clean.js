module.exports = function clean(str) {
  return str.trim().replace(/\s{2,}/g, ' ');
};