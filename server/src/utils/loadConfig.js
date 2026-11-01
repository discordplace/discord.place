const fs = require('node:fs');
const path = require('node:path');
const yaml = require('js-yaml');

const shared = require('../../shared.generated.json');

const SERVER_ROOT = path.resolve(__dirname, '../..');

function merge(base, override) {
  if (override === null || typeof override !== 'object' || Array.isArray(override)) return override;

  const result = { ...base };

  for (const [key, value] of Object.entries(override)) result[key] = merge(base?.[key], value);

  return result;
}

function applySharedConfig(config) {
  Object.assign(config, shared.limits);

  config.templateMinDescriptionLength = shared.limits.templateDescriptionMinLength;
  config.templateMaxDescriptionLength = shared.limits.templateDescriptionMaxLength;
  config.reportReasonMinLength = shared.limits.reportReasonMinCharacters;
  config.reportReasonMaxLength = shared.limits.reportReasonMaxCharacters;

  config.emojiCategories = shared.categories.emoji;
  config.serverCategories = shared.categories.server;
  config.botCategories = shared.categories.bot;
  config.templateCategories = shared.categories.template;
  config.soundCategories = shared.categories.sound;
  config.themeCategories = shared.categories.theme;

  config.emojisDenyReasons = shared.denyReasons.emojis;
  config.botsDenyReasons = shared.denyReasons.bots;
  config.templateDenyReasons = shared.denyReasons.templates;
  config.soundDenyReasons = shared.denyReasons.sounds;
  config.themeDenyReasons = shared.denyReasons.themes;

  config.quarantineTypes = shared.quarantine.types;
  config.quarantineRestrictions = shared.quarantine.restrictions;

  return config;
}

module.exports = function loadConfig() {
  const base = yaml.load(fs.readFileSync(path.join(SERVER_ROOT, 'config.yml'), 'utf8')) || {};
  const localPath = path.join(SERVER_ROOT, 'config.local.yml');
  const config = fs.existsSync(localPath)
    ? merge(base, yaml.load(fs.readFileSync(localPath, 'utf8')) || {})
    : base;

  return applySharedConfig(config);
};
