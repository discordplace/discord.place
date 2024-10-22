const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluateResultSchema = new Schema({
  executedCode: {
    required: true,
    type: String
  },
  hasError: {
    required: true,
    type: Boolean
  },
  id: {
    required: true,
    type: String
  },
  result: {
    required: true,
    type: String
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EvaluateResult', EvaluateResultSchema);