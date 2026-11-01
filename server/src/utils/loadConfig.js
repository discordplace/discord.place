const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const SERVER_ROOT = path.resolve(__dirname, '../..');

function merge(base, override) {
  if (override === null || typeof override !== 'object' || Array.isArray(override)) return override;

  const result = { ...base };

  for (const [key, value] of Object.entries(override)) result[key] = merge(base?.[key], value);

  return result;
}

module.exports = function loadConfig() {
  const base = yaml.load(fs.readFileSync(path.join(SERVER_ROOT, 'config.yml'), 'utf8')) || {};
  const localPath = path.join(SERVER_ROOT, 'config.local.yml');

  if (!fs.existsSync(localPath)) return base;

  const local = yaml.load(fs.readFileSync(localPath, 'utf8')) || {};

  return merge(base, local);
};
