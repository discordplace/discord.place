const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
const Discord = require('discord.js');

module.exports = async interaction => {
  if (interaction.isCommand()) {
    if (!interaction.guild) return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    
    const foundCommand = client.commands.find(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON().name === interaction.commandName : command.data.name === interaction.commandName);
    if (!foundCommand) return;

    const user = await User.findOneAndUpdate({ id: interaction.user.id }, { id: interaction.user.id }, { upsert: true, new: true });

    if (!user.acceptedPolicies) {
      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle('About Our Policies')
          .setDescription('Before you can use the bot, you need to accept our policies.\nAfter you accept them, you can use the bot as you wish.\n\n- [Privacy Policy](https://discord.place/legal/privacy)\n- [Terms of Service](https://discord.place/legal/terms)\n- [Cookie Policy](https://discord.place/legal/cookie)\n- [Content Policy](https://discord.place/legal/content-policy)\n\nIf you have any questions, you can contact us at **legal@discord.place**.')
          .setColor(Discord.Colors.Blurple)
          .setFooter({ text: 'discord.place', iconURL: client.user.displayAvatarURL() })
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId('accept-policies')
              .setLabel('Accept Policies')
              .setStyle(Discord.ButtonStyle.Secondary)
              .setEmoji(config.emojis.checkmark)
          )
      ];

      const message = await interaction.reply({ embeds, components, fetchReply: true });
      const collected = await message.awaitMessageComponent({ time: 60000 }).catch(() => null);
      if (!collected) return message.edit({ content: 'You didn\'t accept the policies in time.', embeds: [], components: [] });

      if (collected.customId === 'accept-policies') {
        user.acceptedPolicies = true;
        await user.save();

        await message.edit({ content: 'You accepted the policies.', embeds: [], components: [] });

        await collected.deferUpdate();
      }
    }

    try {
      await foundCommand.execute(interaction);
    } catch (error) {
      logger.info(`Error executing command ${interaction.commandName}:`, error);

      if (interaction.deferred || interaction.replied) interaction.followUp({ content: 'There was an error while executing this command.' });
      else interaction.reply({ content: 'There was an error while executing this command.', ephemeral: true });
    }
  }

  if (interaction.isAutocomplete()) {
    interaction.customRespond = data => {
      interaction.respond(
        data.filter(option => {
          if (interaction.options.getFocused() === '') return true;
          else return option.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase());
        }).slice(0, 25).map(option => {
          if (option.name.length >= 100) option.name = option.name.slice(0, 97) + '...';
          return option;
        })
      );
    };

    if (!interaction.guild) return;

    const foundCommand = client.commands.find(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON().name === interaction.commandName : command.data.name === interaction.commandName);
    if (!foundCommand) return;

    try {
      await foundCommand.autocomplete(interaction);
    } catch (error) {
      logger.error(`Error executing autocomplete for command ${interaction.commandName}:`, error);
    }
  }

  if (interaction.isMessageComponent()) {
    if (interaction.customId === 'vote') require('@/src/bot/commands/features/vote').execute(interaction);
    if (interaction.customId.startsWith('quick-vote-')) {
      const guildId = interaction.customId.split('-')[2];
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return interaction.reply({ content: 'I couldn\'t find the server.' });
      
      const member = await guild.members.fetch(interaction.user.id).catch(() => null);
      if (!member) return interaction.reply({ content: 'You are not in the server.' });

      const server = await Server.findOne({ id: guild.id });
      if (!server) return interaction.reply({ content: 'I couldn\'t find the server.' });
      Object.defineProperty(interaction, 'member', { value: member });
      Object.defineProperty(interaction, 'guild', { value: guild });
      
      const voteCommand = require('@/src/bot/commands/features/vote');
      return voteCommand.execute(interaction);
    }

    if (interaction.customId.startsWith('hv-')) {
      const guildId = interaction.customId.split('-')[1];
      const guild = client.guilds.cache.get(guildId);
      if (!guild) return interaction.reply({ content: 'I couldn\'t find the server.' });

      const member = await guild.members.fetch(interaction.user.id).catch(() => null);
      if (!member) return interaction.reply({ content: 'You are not in the server.' });

      const server = await Server.findOne({ id: guild.id });
      if (!server) return interaction.reply({ content: 'I couldn\'t find the server.' });

      const numbers = interaction.customId.split('-')[2].split('');
      const selectNumber = interaction.customId.split('-')[3];

      if (client.humanVerificationTimeouts.has(interaction.user.id)) {
        const timeout = client.humanVerificationTimeouts.get(interaction.user.id);
        if (timeout.guild === guildId && timeout.expiresAt > Date.now()) return interaction.reply({ content: `You can try again after ${Math.floor((timeout.expiresAt - Date.now()) / 1000)} seconds.`, ephemeral: true });
      }
    
      if (!client.humanVerificationData.has(interaction.user.id)) client.humanVerificationData.set(interaction.user.id, []);

      const data = client.humanVerificationData.get(interaction.user.id);
      if (data.includes(selectNumber)) return interaction.reply({ content: 'You already selected this number.', ephemeral: true });

      data.push(selectNumber);
      client.humanVerificationData.set(interaction.user.id, data);

      if (data.length === 3) {
        client.humanVerificationData.delete(interaction.user.id);
        client.humanVerificationTimeouts.set(interaction.user.id, { guild: guildId, expiresAt: Date.now() + 60000 });

        const isCorrect = data.every((number, index) => number === numbers[index]);
        if (!isCorrect) return interaction.update({ content: 'You failed to verify yourself. You can try again after 1 minute.', components: [], embeds: [], files: [] });

        await interaction.update({ content: 'You successfully verified yourself.', components: [], embeds: [], files: [] });

        const continueVote = require('@/src/bot/commands/features/vote').continueVote;

        Object.defineProperty(interaction, 'member', { value: member });
        Object.defineProperty(interaction, 'guild', { value: guild });

        return continueVote(interaction);
      } else {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply({ ephemeral: true });

        return interaction.followUp({ content: `You selected: **${data.join('')}** (${data.length}/3)` });
      }
    }
  }
};