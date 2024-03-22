const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PremiumCodeSchema = new Schema({
  code: {
    type: String,
    required: true
  }
}, {
  timestamps: true,
});

module.exports = mongoose.model('PremiumCode', PremiumCodeSchema);