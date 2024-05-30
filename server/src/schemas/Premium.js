const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Profile = require('@/schemas/Profile');
const createActivity = require('@/utils/createActivity');

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
  },
  expire_at: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

PremiumSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

const Model = mongoose.model('Premiums', PremiumSchema);

Model.watch().on('change', async data => {
  const { operationType, fullDocument } = data;
  if (operationType === 'delete') {
    logger.send(`Premium for user ${fullDocument.user.id} has expired.`);

    createActivity({
      type: 'USER_ACTIVITY',
      user_id: fullDocument.user.id,
      target_type: 'USER',
      target: { 
        id: fullDocument.user.id
      },
      message: 'Premium has expired.'
    });

    const profile = await Profile.findOne({ 'user.id': fullDocument.user.id });
    if (profile) {
      await profile.updateOne({ $set: { preferredHost: null } });
    }
  }
});

module.exports = Model;