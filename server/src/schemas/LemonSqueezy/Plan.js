const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  storeId: {
    type: Number,
    required: true
  },
  variantId: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  slug: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  price_formatted: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Plan', PlanSchema);