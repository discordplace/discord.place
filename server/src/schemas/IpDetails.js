const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IpDetailsSchema = new Schema({
  ip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  regionName: {
    type: String,
    required: true
  },
  city: {
    type: String,
    required: true
  },
  isp: {
    type: String,
    required: true
  },
  org: {
    type: String,
    required: true
  },
  as: {
    type: String,
    required: true
  },
  mobile: {
    type: Boolean,
    required: true
  },
  proxy: {
    type: Boolean,
    required: true
  },
  hosting: {
    type: Boolean,
    required: true
  }
}, {
  timestamps: true
});

IpDetailsSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('IpDetails', IpDetailsSchema);