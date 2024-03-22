const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const VoteReminderSchema = new Schema({
  user: {
    id: {
      type: String,
      required: true
    }
  },
  guild: {
    id: {
      type: String,
      required: true
    }
  }
}, { 
  timestamps: true
});

VoteReminderSchema.index({ createdAt: 1 }, { expireAfterSeconds: 86400 });

const MetadataSchema = new Schema({
  documentId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  guildId: {
    type: String,
    required: true
  }
});

const MetadataModel = mongoose.model('VoteReminderMetadata', MetadataSchema);
const Model = mongoose.model('VoteReminder', VoteReminderSchema);

Model.watch().on('change', async data => {
  const { operationType, documentKey, fullDocument } = data;
  if (operationType === 'delete') {
    const metadata = await MetadataModel.findOne({ documentId: documentKey._id });
    if (!metadata) return;

    const user = await client.users.fetch(metadata.userId).catch(() => null);
    if (!user) return;

    const channel = user.dmChannel || await user.createDM().catch(() => null);
    if (!channel) return;

    const guild = await client.guilds.fetch(metadata.guildId).catch(() => null);
    if (!guild) return;

    channel.send(`You can vote again for the server **${guild.name}**.`);
    await metadata.deleteOne();
  }

  if (operationType === 'insert') {
    const metadata = new MetadataModel({
      documentId: documentKey._id,
      userId: fullDocument.user.id,
      guildId: fullDocument.guild.id
    });
    
    await metadata.save();
  }
});

module.exports = Model;