const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
const Discord = require('discord.js');
const EvaluateResult = require('@/schemas/EvaluateResult');
const evaluate = require('@/utils/evaluate');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const VoteReminder = require('@/schemas/Server/Vote/Reminder');

module.exports = async interaction => {
  if (interaction.isCommand()) {
    const foundCommand = client.commands.find(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON().name === interaction.commandName : command.data.name === interaction.commandName);
    if (!foundCommand) return;

    if (foundCommand.isGuildOnly && !interaction.guild) return interaction.reply({
      content: await interaction.translate('commands.shared.errors.guild_only'),
      flags: Discord.MessageFlags.Ephemeral
    });

    const user = await User.findOneAndUpdate({ id: interaction.user.id }, { id: interaction.user.id }, { upsert: true, new: true });

    if (!user.acceptedPolicies) {
      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle(await interaction.translate('commands.accept_policies.embed.title'))
          .setDescription(await interaction.translate('commands.accept_policies.embed.description'))
          .setColor(Discord.Colors.Blurple)
          .setFooter({ text: 'discord.place', iconURL: client.user.displayAvatarURL() })
      ];

      const components = [
        new Discord.ActionRowBuilder()
          .addComponents(
            new Discord.ButtonBuilder()
              .setCustomId('accept-policies')
              .setLabel(await interaction.translate('commands.accept_policies.button_label'))
              .setStyle(Discord.ButtonStyle.Secondary)
              .setEmoji(config.emojis.checkmark)
          )
      ];

      const interactionCallback = await interaction.reply({ embeds, components, withResponse: true });
      const collected = await interactionCallback.resource.message.awaitMessageComponent({ time: 60000 }).catch(() => null);

      if (!collected) return interaction.editReply({
        content: await interaction.translate('commands.accept_policies.timeout'),
        embeds: [],
        components: []
      });

      if (collected.customId === 'accept-policies') {
        user.acceptedPolicies = true;
        user.data = {
          username: interaction.user.username,
          global_name: interaction.user.globalName,
          flags: interaction.user.flags
        };

        await user.save();

        await interaction.editReply({
          content: await interaction.translate('commands.accept_policies.success'),
          embeds: [],
          components: []
        });

        await collected.deferUpdate();
      }
    } else {
      try {
        await foundCommand.execute(interaction);
      } catch (error) {
        logger.error(`Error executing command ${interaction.commandName}:`, error);

        if (interaction.deferred || interaction.replied) interaction.followUp(await interaction.translate('commands.shared.errors.command_error'));
        else interaction.reply({
          content: await interaction.translate('commands.shared.errors.command_error'),
          flags: Discord.MessageFlags.Ephemeral
        });
      }
    }
  }

  if (interaction.isAutocomplete()) {
    interaction.customRespond = data => {
      interaction.respond(
        data.filter(option => {
          if (interaction.options.getFocused() === '') return true;
          else return option.name.toLowerCase().includes(interaction.options.getFocused().toLowerCase());
        }).slice(0, 25).map(option => {
          if (option.name.length >= 100) option.name = `${option.name.slice(0, 97)}...`;

          return option;
        })
      );
    };

    const foundCommand = client.commands.find(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON().name === interaction.commandName : command.data.name === interaction.commandName);
    if (!foundCommand) return;

    if (foundCommand.isGuildOnly && !interaction.guild) return;

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
      if (!guild) return interaction.reply(await interaction.translate('interaction.buttons.quick_vote.errors.guild_not_found'));

      const member = guild.members.cache.get(interaction.user.id) || await guild.members.fetch(interaction.user.id).catch(() => null);
      if (!member) return interaction.reply(await interaction.translate('interaction.buttons.quick_vote.errors.member_not_found'));

      const server = await Server.findOne({ id: guild.id });
      if (!server) return interaction.reply(await interaction.translate('interaction.buttons.quick_vote.errors.server_not_listed'));

      Object.defineProperty(interaction, 'user', { value: member.user });
      Object.defineProperty(interaction, 'member', { value: member });
      Object.defineProperty(interaction, 'guild', { value: guild });

      const voteCommand = require('@/src/bot/commands/features/vote');

      return voteCommand.execute(interaction);
    }

    if (interaction.customId.startsWith('create-reminder-')) {
      await interaction.deferReply({ flags: Discord.MessageFlags.Ephemeral });

      const guildId = interaction.customId.split('-')[2];

      const guild = client.guilds.cache.get(guildId);
      if (!guild) return interaction.followUp(await interaction.translate('interaction.buttons.create_reminder.errors.guild_not_found'));

      const server = await Server.findOne({ id: guild.id });
      if (!server) return interaction.followUp(await interaction.translate('interaction.buttons.create_reminder.errors.server_not_listed'));

      const timeout = await VoteTimeout.findOne({ 'user.id': interaction.user.id, 'guild.id': guildId });
      if (!timeout) return interaction.followUp(await interaction.translate('interaction.buttons.create_reminder.errors.user_not_voted'));

      const reminder = await VoteReminder.findOne({ 'user.id': interaction.user.id, 'guild.id': guildId });
      if (reminder) return interaction.followUp(await interaction.translate('interaction.buttons.create_reminder.errors.reminder_already_created'));

      const newReminder = new VoteReminder({
        user: {
          id: interaction.user.id
        },
        guild: {
          id: guildId,
          name: guild.name
        }
      });

      await newReminder.save();

      const date = new Date(new Date(timeout.createdAt).getTime() + 86400000).toLocaleString(await interaction.getLanguage(), { dateStyle: 'full', timeStyle: 'short' });

      return interaction.followUp(await interaction.translate('interaction.buttons.create_reminder.success', { date }));
    }

    if (interaction.customId.startsWith('deleteEvalResultMessage-')) {
      if (!config.permissions.canExecuteEval.includes(interaction.user.id)) return;

      const [userId] = interaction.customId.split('-').slice(1);

      if (interaction.user.id !== userId) return;

      logger.info(`User @${interaction.user.username} (${interaction.user.id}) is deleting the eval command result message. (Message ID: ${interaction.message.id})`);

      await EvaluateResult.deleteOne({ messageId: interaction.message.id });

      return interaction.message.delete();
    }

    if (interaction.customId.startsWith('repeatEval-')) {
      if (!config.permissions.canExecuteEval.includes(interaction.user.id)) return;

      const [userId] = interaction.customId.split('-').slice(1);
      if (interaction.user.id !== userId) return;

      const data = await EvaluateResult.findOne({ messageId: interaction.message.id });
      if (!data) return;

      logger.info(`User @${interaction.user.username} (${interaction.user.id}) is repeating the eval command. (Message ID: ${interaction.message.id})`);

      const evaluateResult = await evaluate(data.code).catch(error => error);

      const currentComponents = Discord.ActionRowBuilder.from(interaction.message.components[0]);
      const currentDate = new Date().toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit' });

      const repeatedButton = currentComponents.components.find(component => component.data.custom_id.startsWith('evalRepeatedAt-'));
      if (!repeatedButton) {
        currentComponents.addComponents(
          new Discord.ButtonBuilder()
            .setCustomId(`evalRepeatedAt-${Date.now()}`)
            .setLabel(`Repeated at ${currentDate} by @${interaction.user.username}`)
            .setStyle(Discord.ButtonStyle.Secondary)
            .setDisabled(true)
        );
      } else {
        repeatedButton
          .setLabel(`Repeated at ${currentDate} by @${interaction.user.username}`)
          .setCustomId(`evalRepeatedAt-${Date.now()}`);
      }

      return interaction.update({
        content: evaluateResult.error ? `An error occurred while evaluating the code: \`\`\`js\n${evaluateResult.error.slice(0, 1950)}\n\`\`\`` : evaluateResult.result,
        components: [currentComponents]
      });
    }
  }
};