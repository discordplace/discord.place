const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerLanguageSchema = new Schema({
  id: {
    type: String,
    required: true
  },
  language: {
    type: String,
    required: false,
    default: config.availableLocales.find(locale => locale.default).code
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ServerLanguage', ServerLanguageSchema);