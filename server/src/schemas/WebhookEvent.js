const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WebhookEventSchema = new Schema({
  key: {
    type: String,
    required: true,
    unique: true
  },
  provider: {
    type: String,
    required: true
  },
  payload: {
    type: Schema.Types.Mixed,
    required: false
  }
}, { timestamps: true });

module.exports = mongoose.model('WebhookEvent', WebhookEventSchema);
