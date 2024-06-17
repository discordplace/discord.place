const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PremiumCodeSchema = new Schema({
  code: {
    type: String,
    required: true
  },
  expire_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('PremiumCode', PremiumCodeSchema);