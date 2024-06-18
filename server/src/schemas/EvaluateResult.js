const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EvaluateResult = new Schema({
  id: {
    type: String,
    required: true
  },
  result: {
    type: String,
    required: true
  },
  hasError: {
    type: Boolean,
    required: true
  },
  executedCode: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('EvaluateResult', EvaluateResult);