const Discord = require('discord.js');
const Premium = require('@/schemas/Premium');
const PremiumCode = require('@/schemas/Premium/Code');
const premiumCodeValidation = require('@/utils/validations/premiumCodeValidation');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('redeem')
    .setDescription('Redeem premium code.')
    .addStringOption(option => option.setName('code').setDescription('Code to redeem.').setRequired(true))
    .toJSON(),
  execute: async interaction => {
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

    if (interaction.guild) return interaction.followUp({ content: 'This command can only be used in DMs.', ephemeral: true });

    const code = interaction.options.getString('code');
    
    const validationResult = premiumCodeValidation(code).catch(error => error);
    if (validationResult instanceof Error) return interaction.followUp({ content: validationResult.message });

    const foundCode = await PremiumCode.findOne({ code });

    await new Premium({
      used_code: foundCode.code,
      user: {
        id: interaction.user.id
      },
      expire_at: foundCode.expire_at
    }).save();
    
    await foundCode.deleteOne();

    return interaction.followUp({ content: 'Premium code has been redeemed successfully.' });
  }
};
