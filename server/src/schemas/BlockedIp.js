const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CLOUDFLARE_API_KEY = process.env.CLOUDFLARE_API_KEY;
const CLOUDFLARE_EMAIL = process.env.CLOUDFLARE_EMAIL;
const CLOUDFLARE_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID;
const CLOUDFLARE_BLOCK_IP_LIST_ID = process.env.CLOUDFLARE_BLOCK_IP_LIST_ID;

const CloudflareAPI = require('cloudflare');
const cloudflare = new CloudflareAPI({
  email: CLOUDFLARE_EMAIL,
  key: CLOUDFLARE_API_KEY
});

const BlockedIpSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  ip: {
    type: String,
    required: true
  }
}, {
  timestamps: true
});

BlockedIpSchema.index({ createdAt: 1 }, { expireAfterSeconds: 21600 });

const Model = mongoose.model('BlockedIps', BlockedIpSchema);

Model.watch().on('change', async data => {
  const { operationType, fullDocument, documentKey } = data;
  if (operationType === 'insert') {
    await cloudflare.rules.lists.items.create(CLOUDFLARE_BLOCK_IP_LIST_ID, {
      account_id: CLOUDFLARE_ACCOUNT_ID,
      body: [
        {
          ip: fullDocument.ip,
          comment: `Blocked by global rate limiter at ${new Date().toISOString()}.`
        }
      ]
    });
    client.blockedIps.set(fullDocument.ip, true);

    logger.send(`IP address ${fullDocument.ip} has been blocked.`);
  }

  if (operationType === 'delete') {
    const response = await cloudflare.rules.lists.items.list(CLOUDFLARE_BLOCK_IP_LIST_ID, {
      account_id: CLOUDFLARE_ACCOUNT_ID
    });

    client.blockedIps.delete(documentKey._id);

    const item = response.result.find(item => item?.ip === documentKey._id);
    if (!item) return;
    
    await cloudflare.rules.lists.items.delete(CLOUDFLARE_BLOCK_IP_LIST_ID, {
      account_id: CLOUDFLARE_ACCOUNT_ID
    }, {
      body: {
        items: [
          { id: item.id }
        ]
      }
    });

    logger.send(`IP address ${documentKey._id} has been unblocked.`);
  }
});

module.exports = Model;