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

    if (foundCommand.isGuildOnly && !interaction.guild) return interaction.reply({ content: 'This command can only be used in a server.', ephemeral: true });

    const user = await User.findOneAndUpdate({ id: interaction.user.id }, { id: interaction.user.id }, { upsert: true, new: true });

    if (!user.acceptedPolicies) {
      const embeds = [
        new Discord.EmbedBuilder()
          .setTitle('About Our Policies')
          .setDescription('Before you can use the bot, you need to accept our policies.\nAfter you accept them, you can use the bot as you wish.\n\n- [Privacy Policy](https://discord.place/legal/privacy)\n- [Terms of Service](https://discord.place/legal/terms)\n- [Cookie Policy](https://discord.place/legal/cookie)\n- [Content Policy](https://discord.place/legal/content-policy)\n- [Purchase Policy](https://discord.place/legal/purchase-policy)\n\nIf you have any questions, you can contact us at **legal@discord.place**.')
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
      logger.error(`Error executing command ${interaction.commandName}:`, error);

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

    if (interaction.customId.startsWith('create-reminder-')) {
      await interaction.deferReply({ ephemeral: true });

      const guildId = interaction.customId.split('-')[2];

      const guild = client.guilds.cache.get(guildId);
      if (!guild) return interaction.followUp({ content: 'I couldn\'t find the server.' });

      const server = await Server.findOne({ id: guild.id });
      if (!server) return interaction.followUp({ content: 'I couldn\'t find the server.' });

      const timeout = await VoteTimeout.findOne({ 'user.id': interaction.user.id, 'guild.id': guildId });
      if (!timeout) return interaction.followUp({ content: 'You can\'t set a reminder for a server you haven\'t voted for.' });

      const reminder = await VoteReminder.findOne({ 'user.id': interaction.user.id, 'guild.id': guildId });
      if (reminder) return interaction.followUp({ content: 'You already set a reminder for this server.' });

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

      return interaction.followUp({ content: 'Reminder created.' });
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