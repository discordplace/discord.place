const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ServerLanguageSchema = new Schema({
  id: {
    required: true,
    type: String
  },
  language: {
    default: config.availableLocales.find(locale => locale.default).code,
    required: false,
    type: String
  }
}, {
  timestamps: true
});

const Model = mongoose.model('ServerLanguage', ServerLanguageSchema);

Model.watch().on('change', async data => {
  if (data.operationType === 'insert') {
    const { id, language } = data.fullDocument;

    client.languageCache.set(id, language);
  }

  if (data.operationType === 'update') {
    const { language } = data.updateDescription.updatedFields;
    const foundData = await Model.findById(data.documentKey._id);

    client.languageCache.set(foundData.id, language);
  }
});

module.exports = Model;