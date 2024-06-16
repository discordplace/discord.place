const Discord = require('discord.js');

module.exports = async interaction => {
  if (interaction.isCommand()) {
    if (!interaction.guild) return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });
    
    const foundCommand = client.commands.find(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON().name === interaction.commandName : command.data.name === interaction.commandName);
    if (!foundCommand) return;

    try {
      await foundCommand.execute(interaction);
    } catch (error) {
      logger.info(`Error executing command ${interaction.commandName}:`, error);
      if (interaction.deferred) interaction.followUp({ content: 'There was an error while executing this command.' });
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

    if (interaction.customId.startsWith('hv-')) {
      const guildId = interaction.customId.split('-')[1];
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

      const newComponents = interaction.message.components.map(row => {
        return new Discord.ActionRowBuilder().addComponents(
          row.components.map(button => {
            if (button.customId === interaction.customId) return new Discord.ButtonBuilder()
              .setCustomId(interaction.customId)
              .setStyle(Discord.ButtonStyle.Success)
              .setLabel(button.label);

            return button;
          })
        );
      });

      if (data.length === 3) {
        client.humanVerificationData.delete(interaction.user.id);
        client.humanVerificationTimeouts.set(interaction.user.id, { guild: guildId, expiresAt: Date.now() + 60000 });

        const isCorrect = data.every((number, index) => number === numbers[index]);
        if (!isCorrect) return interaction.update({ content: 'You failed to verify yourself. You can try again after 1 minute.', components: [], embeds: [], files: [] });

        await interaction.update({ content: 'You successfully verified yourself.', components: [], embeds: [], files: [] });

        await interaction.deferReply({ ephemeral: true });

        const continueVote = require('@/src/bot/commands/features/vote').continueVote;
        return continueVote(interaction);
      } else await interaction.update({ components: newComponents });
    }
  }
};