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
      ephemeral: true
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

      const message = await interaction.reply({ embeds, components, fetchReply: true });
      const collected = await message.awaitMessageComponent({ time: 60000 }).catch(() => null);
      if (!collected) return message.edit({
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

        await message.edit({
          content: await interaction.translate('commands.accept_policies.success'),
          embeds: [],
          components: []
        });

        await collected.deferUpdate();
      }
    }

    try {
      await foundCommand.execute(interaction);
    } catch (error) {
      logger.error(`Error executing command ${interaction.commandName}:`, error);

      if (interaction.deferred || interaction.replied) interaction.followUp(await interaction.translate('commands.shared.errors.command_error'));
      else interaction.reply({
        content: await interaction.translate('commands.shared.errors.command_error'),
        ephemeral: true
      });
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
      await interaction.deferReply({ ephemeral: true });

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

    if (interaction.customId.startsWith('hv-')) {
      const guildId = interaction.customId.split('-')[1];

      const guild = client.guilds.cache.get(guildId);
      if (!guild) return interaction.reply(await interaction.translate('interaction.buttons.human_verification.errors.guild_not_found'));

      const member = guild.members.cache.get(interaction.user.id) || await guild.members.fetch(interaction.user.id).catch(() => null);
      if (!member) return interaction.reply(await interaction.translate('interaction.buttons.human_verification.errors.member_not_found'));

      const server = await Server.findOne({ id: guild.id });
      if (!server) return interaction.reply(await interaction.translate('interaction.buttons.human_verification.errors.server_not_listed'));

      const numbers = interaction.customId.split('-')[2].split('');
      const selectNumber = interaction.customId.split('-')[3];

      if (!client.humanVerificationData.has(interaction.user.id)) client.humanVerificationData.set(interaction.user.id, []);

      const data = client.humanVerificationData.get(interaction.user.id);
      if (data.includes(selectNumber)) return interaction.reply({
        content: await interaction.translate('interaction.buttons.human_verification.errors.number_already_selected'),
        ephemeral: true
      });

      data.push(selectNumber);
      client.humanVerificationData.set(interaction.user.id, data);

      if (data.length === 3) {
        client.humanVerificationData.delete(interaction.user.id);

        const isCorrect = data.every((number, index) => number === numbers[index]);
        if (!isCorrect) return interaction.update({
          content: await interaction.translate('interaction.buttons.human_verification.errors.failed'),
          components: [],
          files: []
        });

        await interaction.update({
          content: await interaction.translate('interaction.buttons.human_verification.success'),
          components: [],
          files: []
        });

        const continueVote = require('@/src/bot/commands/features/vote').continueVote;

        Object.defineProperty(interaction, 'user', { value: member.user });
        Object.defineProperty(interaction, 'member', { value: member });
        Object.defineProperty(interaction, 'guild', { value: guild });

        return continueVote(interaction);
      } else {
        const currentComponents = [
          Discord.ActionRowBuilder.from(interaction.message.components[0]),
          Discord.ActionRowBuilder.from(interaction.message.components[1]),
          Discord.ActionRowBuilder.from(interaction.message.components[2])
        ];

        const selectedButtonComponent = currentComponents.find(row => row.components.find(component => component.data.custom_id === interaction.customId)).components.find(component => component.data.custom_id === interaction.customId);
        selectedButtonComponent.setStyle(Discord.ButtonStyle.Primary);

        return interaction.update({
          content: await interaction.translate('interaction.buttons.human_verification.numbers_selected', { numbers: data.join('') }),
          components: currentComponents
        });
      }
    }

    if (interaction.customId.startsWith('deleteEvalResultMessage-')) {
      const [id, userId] = interaction.customId.split('-').slice(1);

      if (interaction.user.id !== userId) return;

      await EvaluateResult.deleteOne({ id });

      return interaction.message.delete();
    }

    if (interaction.customId.startsWith('repeatEval-')) {
      const [id, userId] = interaction.customId.split('-').slice(1);

      if (interaction.user.id !== userId) return;

      const data = await EvaluateResult.findOne({ id });
      if (!data || !data.executedCode) return;

      const { result, hasError } = await evaluate(data.executedCode);

      const embed = new Discord.EmbedBuilder()
        .setColor(hasError ? '#f04e51' : '#adadad')
        .setFields([
          { name: 'Code', value: `\`\`\`js\n${data.executedCode.slice(0, 1000)}\n\`\`\`` },
          { name: 'Repeated At', value: new Date().toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric', hour: 'numeric', minute: 'numeric' }) }
        ])
        .setDescription(`### ${hasError ? 'Error' : 'Success'}\n\`\`\`js\n${String(result).slice(0, 4000)}\n\`\`\``);

      return interaction.update({ embeds: [embed] });
    }
  }
};