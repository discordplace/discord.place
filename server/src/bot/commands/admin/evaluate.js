const Discord = require('discord.js');
const EvaluateResult = require('@/schemas/EvaluateResult');
const evalute = require('@/utils/evaluate');

module.exports = {
  data: new Discord.ContextMenuCommandBuilder()
    .setName('internal__command_evaluate')
    .setType(Discord.ApplicationCommandType.Message)
    .setContexts([
      Discord.InteractionContextType.BotDM,
      Discord.InteractionContextType.Guild,
      Discord.InteractionContextType.PrivateChannel
    ])
    .setIntegrationTypes([Discord.ApplicationIntegrationType.GuildInstall]),
  execute: async interaction => {
    if (!config.permissions.canExecuteEval.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this command.' });

    await interaction.deferReply();

    const evaluateResult = await evalute(interaction.targetMessage.content).catch(error => error);

    const components = [
      new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonBuilder()
            .setCustomId(`deleteEvalResultMessage-${interaction.user.id}`)
            .setLabel('Delete')
            .setStyle(Discord.ButtonStyle.Secondary),
          new Discord.ButtonBuilder()
            .setCustomId(`repeatEval-${interaction.user.id}`)
            .setLabel('Repeat')
            .setStyle(Discord.ButtonStyle.Secondary)
        )
    ];

    const followUpMessage = await interaction.followUp({
      content: evaluateResult.error ? `An error occurred while evaluating the code: \`\`\`js\n${evaluateResult.error.slice(0, 1950)}\n\`\`\`` : evaluateResult.result,
      components
    });

    if (followUpMessage) {
      const resultDocument = new EvaluateResult({
        code: interaction.targetMessage.content,
        messageId: followUpMessage.id
      });

      await resultDocument.save();
    }
  }
};