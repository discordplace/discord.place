const Discord = require('discord.js');
const EvaluateResult = require('@/schemas/EvaluateResult');
const evaluate = require('@/utils/evaluate');
const { inspect } = require('util');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('eval')
    .setDescription('Evaluate code.')
    .toJSON(),
  execute: async interaction => {
    if (!config.permissions.canExecuteEval.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this command.' });

    await interaction.deferReply();

    await interaction.followUp({ content: 'Please send the code you want to evaluate (reply to this message).', ephemeral: true });

    const filter = message => message.author.id === interaction.user.id;
    const collected = await interaction.channel.awaitMessages({ filter, time: 60000, max: 1 }).catch(error => {
      const errorMessage = inspect(error, { depth: Infinity });
      logger.error('Error while waiting for the code to evaluate:', error);

      interaction.followUp({ content: `An error occurred while waiting for the code to evaluate: \`\`\`js\n${errorMessage.slice(0, 1900)}\n\`\`\`` });
    });
    if (!collected?.first?.()?.content) return;

    const code = collected.first().content;
    const { result, hasError, id } = await evaluate(code);

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
      id, 
      result, 
      hasError, 
      executedCode: code
    }).save();

    return interaction.editReply({ embeds, components, content: null });
  }
};