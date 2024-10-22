const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetadataModel = require('@/schemas/Reminder/Metadata');
const Discord = require('discord.js');

const ReminderSchema = new Schema({
  about: {
    required: true,
    type: String
  },
  expire_at: {
    default: null,
    type: Date
  },
  user: {
    id: {
      required: true,
      type: String
    }
  }
}, {
  timestamps: true
});

ReminderSchema.index({ expire_at: 1 }, { expireAfterSeconds: 0 });

const Model = mongoose.model('Reminder', ReminderSchema);

Model.watch().on('change', async data => {
  const { documentKey, fullDocument, operationType } = data;
  if (operationType === 'delete') {
    const metadata = await MetadataModel.findOne({ documentId: documentKey._id });
    if (!metadata) return;

    await metadata.deleteOne();

    const user = await client.users.fetch(metadata.userId).catch(() => null);
    if (!user) return;

    const channel = user.dmChannel || await user.createDM().catch(() => null);
    if (!channel) return;

    const embeds = [
      new Discord.EmbedBuilder()
        .setTitle(`Reminder #${metadata.documentId}`)
        .setColor('Random')
        .setDescription(`You created this reminder on **${new Date(metadata.createdAt).toLocaleDateString('en-US', { dateStyle: 'medium' })}**.`)
        .setFields([
          {
            name: 'About',
            value: metadata.about
          }
        ])
    ];

    channel.send({ embeds });
  }

  if (operationType === 'insert') {
    const metadata = new MetadataModel({
      about: fullDocument.about,
      createdAt: fullDocument.createdAt,
      documentId: documentKey._id,
      userId: fullDocument.user.id
    });

    await metadata.save();
  }
});

module.exports = Model;