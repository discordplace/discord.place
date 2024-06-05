const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const DashboardDataSchema = new Schema({
  servers: {
    type: Number,
    default: 0
  },
  profiles: {
    type: Number,
    default: 0
  },
  bots: {
    type: Number,
    default: 0
  },
  emojis: {
    type: Number,
    default: 0
  },
  templates: {
    type: Number,
    default: 0
  },
  users: {
    type: Number,
    default: 0
  },
  guilds: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

DashboardDataSchema.index({ createdAt: 1 }, { expireAfterSeconds: 604800 });

module.exports = mongoose.model('DashboardData', DashboardDataSchema);