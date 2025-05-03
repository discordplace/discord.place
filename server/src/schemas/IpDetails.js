const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const IpDetailsSchema = new Schema({
  ip: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: false,
    default: 'Unknown'
  },
  regionName: {
    type: String,
    required: false,
    default: 'Unknown'
  },
  city: {
    type: String,
    required: false,
    default: 'Unknown'
  },
  isp: {
    type: String,
    required: false,
    default: 'Unknown'
  },
  org: {
    type: String,
    required: false,
    default: 'Unknown'
  },
  as: {
    type: String,
    required: false,
    default: 'Unknown'
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