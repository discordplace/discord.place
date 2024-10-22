const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const StandedOutSchema = new Schema({
  identifier: String
}, {
  timestamps: true
});

StandedOutSchema.index({ createdAt: 1 }, { expireAfterSeconds: 43200 });

const StandedOutServer = mongoose.model('StadedOutServers', StandedOutSchema);
const StandedOutBot = mongoose.model('StandedOutBots', StandedOutSchema);

module.exports = {
  StandedOutBot,
  StandedOutServer
};