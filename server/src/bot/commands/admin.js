const Discord = require('discord.js');
const EvaluateResult = require('@/schemas/EvaluateResult');
const evaluate = require('@/utils/evaluate');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('admin')
    .setDescription('admin')
    .addSubcommand(subcommand => subcommand.setName('eval').setDescription('Evaluate code.'))
    .toJSON(),
  execute: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    if (subcommand === 'eval') {
      if (!config.permissions.canExecuteEval.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this command.' });

      await interaction.deferReply();

      await interaction.followUp({ content: 'Please send the code you want to evaluate (reply to this message).', ephemeral: true });

      const filter = message => message.author.id === interaction.user.id;
      const collected = await interaction.channel.awaitMessages({ filter, time: 60000, max: 1 }).catch(() => null);
      if (!collected?.first?.()?.content) return interaction.followUp({ content: 'You didn\'t send any code in time.' });

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
  }
};