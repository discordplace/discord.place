const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluateResultSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  messageId: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

EvaluateResultSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

module.exports = mongoose.model('EvaluateResult', EvaluateResultSchema);