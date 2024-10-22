const EvaluateResult = require('@/schemas/EvaluateResult');
const evaluate = require('@/utils/evaluate');
const Discord = require('discord.js');
const { inspect } = require('util');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluate code.')
    .toJSON(),
  execute: async interaction => {
    if (!config.permissions.canExecuteEval.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this command.' });

    await interaction.deferReply();

    await interaction.followUp({ content: 'Please send the code you want to evaluate (reply to this message or mention me).', ephemeral: true });

    const filter = message => message.author.id === interaction.user.id;
    const collected = await interaction.channel.awaitMessages({ filter, max: 1, time: 300000 }).catch(error => {
      const errorMessage = inspect(error, { depth: Infinity });
      logger.error('Error while waiting for the code to evaluate:', error);

      interaction.followUp({ content: `An error occurred while waiting for the code to evaluate: \`\`\`js\n${errorMessage.slice(0, 1900)}\n\`\`\`` });
    });
    if (!collected?.first?.()?.content) return;

    const message = collected.first();
    // eslint-disable-next-line security/detect-non-literal-regexp
    const code = message.mentions.has(interaction.client.user.id) ? message.content.replace(new RegExp(`<@!?${interaction.client.user.id}>`), '') : message.content;
    const { hasError, id, result } = await evaluate(code);

    const embeds = [
      new Discord.EmbedBuilder()
        .setColor(hasError ? '#f04e51' : '#adadad')
        .setFields([
          { name: 'Code', value: `\`\`\`js\n${code.slice(0, 1000)}\n\`\`\`` }
        ])
        .setDescription(`### ${hasError ? 'Error' : 'Success'}\n\`\`\`js\n${String(result).slice(0, 4000)}\n\`\`\``)
    ];

    const components = [
      new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId(`deleteEvalResultMessage-${id}-${interaction.user.id}`)
            .setLabel('Delete')
            .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
            .setCustomId(`repeatEval-${id}-${interaction.user.id}`)
            .setLabel('Repeat')
            .setStyle(Discord.ButtonStyle.Secondary)
        )
    ];

    await new EvaluateResult({
      executedCode: code,
      hasError,
      id,
      result
    }).save();

    return interaction.editReply({ components, content: null, embeds });
  }
};