const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const MetadataModel = require('@/schemas/Server/Vote/Metadata');
const Discord = require('discord.js');
const createAutoVoteToken = require('@/utils/servers/createAutoVoteToken');

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

const Model = mongoose.model('ServerVoteReminder', VoteReminderSchema);

Model.watch().on('change', async data => {
  const { operationType, documentKey, fullDocument } = data;
  if (operationType === 'delete') {
    const metadata = await MetadataModel.findOne({ documentId: documentKey._id });
    if (!metadata) return;

    await metadata.deleteOne();

    const user = await client.users.fetch(metadata.userId).catch(() => null);
    if (!user) return;

    const channel = user.dmChannel || await user.createDM().catch(() => null);
    if (!channel) return;

    const guild = await client.guilds.fetch(metadata.guildId).catch(() => null);
    if (!guild) return;

    const autoVoteToken = createAutoVoteToken(guild.id, user.id, Date.now() + 3600000);

    const components = [
      new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setStyle(Discord.ButtonStyle.Link)
            .setLabel((`Quickly vote ${guild.name}`).slice(0, 80))
            .setURL(`${config.frontendUrl}/servers/${guild.id}?autoVoteToken=${encodeURIComponent(autoVoteToken)}`)
        )
    ];

    channel.send({ content: `You can vote again for the server **${guild.name}**.`, components });
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