module.exports = async interaction => {
  if (interaction.isCommand()) {
    const foundCommand = client.commands.find(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON().name === interaction.commandName : command.data.name === interaction.commandName);
    if (!foundCommand) return;

    try {
      await foundCommand.execute(interaction);
    } catch (error) {
      logger.send(`Error executing command ${interaction.commandName}`);
      logger.send(error.stack);
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
        }).slice(0, 25)
      );
    };

    const foundCommand = client.commands.find(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON().name === interaction.commandName : command.data.name === interaction.commandName);
    if (!foundCommand) return;

    try {
      await foundCommand.autocomplete(interaction);
    } catch (error) {
      logger.send(`Error executing autocomplete for command ${interaction.commandName}`);
      logger.send(error.stack);
    }
  }

  if (interaction.isMessageComponent()) {
    if (interaction.customId === 'vote') require('@/src/bot/commands/vote').execute(interaction);
    if (interaction.customId.startsWith('vote:')) {
      const guildId = interaction.customId.split(':')[1];

      const guild = await client.guilds.fetch(guildId).catch(() => null);
      if (!guild) return interaction.reply({ content: 'This server no longer exists.' });

      const member = await guild.members.fetch(interaction.user.id).catch(() => null);
      if (!member) return interaction.reply({ content: 'You are no longer in this server.' });

      Object.defineProperty(interaction, 'guild', { value: guild });
      Object.defineProperty(interaction, 'member', { value: member });

      require('@/src/bot/commands/vote').execute(interaction);
    }
  }
};