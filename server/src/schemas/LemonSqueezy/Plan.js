const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PlanSchema = new Schema({
  id: {
    required: true,
    type: Number
  },
  name: {
    required: true,
    type: String
  },
  price: {
    required: true,
    type: Number
  },
  price_formatted: {
    required: true,
    type: String
  },
  slug: {
    required: true,
    type: String
  },
  status: {
    required: true,
    type: String
  },
  storeId: {
    required: true,
    type: Number
  },
  variantId: {
    required: true,
    type: Number
  }
});

module.exports = mongoose.model('Plan', PlanSchema);