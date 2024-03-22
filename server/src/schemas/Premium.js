const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Profile = require('@/schemas/Profile');

const PremiumSchema = new Schema({
  used_code: {
    type: String,
    required: true
  },
  user: {
    id: {
      type: String,
      required: true
    }
  }
}, {
  timestamps: true
});

PremiumSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 * 30 });

const Model = mongoose.model('Premiums', PremiumSchema);

Model.watch().on('change', async data => {
  const { operationType, fullDocument } = data;
  if (operationType === 'delete') {
    logger.send(`Premium for user ${fullDocument.user.id} has expired.`);

    const profile = await Profile.findOne({ 'user.id': fullDocument.user.id });
    if (profile) {
      await profile.updateOne({ $set: { preferredHost: null } });
    }
  }
});

module.exports = Model;