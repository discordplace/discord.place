const Discord = require('discord.js');
const Profile = require('@/schemas/Profile');
const EvaluateResult = require('@/schemas/EvaluateResult');
const evaluate = require('@/utils/evaluate');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('admin')
    .setDescription('admin')

    .addSubcommand(subcommand => subcommand.setName('eval').setDescription('Evaluate code.'))

    .addSubcommandGroup(group => group.setName('profile').setDescription('profile')
      .addSubcommand(subcommand => subcommand.setName('verify').setDescription('Verify a profile.')
        .addStringOption(option => option.setName('slug').setDescription('The slug of the profile to verify.').setRequired(true).setAutocomplete(true)))
      .addSubcommand(subcommand => subcommand.setName('unverify').setDescription('Unverify a profile.')
        .addStringOption(option => option.setName('slug').setDescription('The slug of the profile to unverify.').setRequired(true).setAutocomplete(true))))

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

    const group = interaction.options.getSubcommandGroup();
    
    if (group === 'profile') {
      if (!interaction.member.roles.cache.has(config.roles.moderator)) return;

      if (subcommand === 'verify') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();
  
        const slug = interaction.options.getString('slug');
        const profile = await Profile.findOne({ slug });
        if (!profile) return interaction.followUp({ content: 'Profile not found.' });
  
        if (profile.verified) return interaction.followUp({ content: 'Profile already verified.' });
  
        profile.verified = true;
        await profile.save();
  
        return interaction.followUp({ content: 'Profile has been verified.' });
      }
      
      if (subcommand === 'unverify') {
        if (!interaction.deferred && !interaction.replied) await interaction.deferReply();
  
        const slug = interaction.options.getString('slug');
        const profile = await Profile.findOne({ slug });
        if (!profile) return interaction.followUp({ content: 'Profile not found.' });
  
        if (!profile.verified) return interaction.followUp({ content: 'Profile already unverified.' });
  
        profile.verified = false;
        await profile.save();

        return interaction.followUp({ content: 'Profile has been unverified.' });
      }
    }
  },
  autocomplete: async interaction => {
    const subcommand = interaction.options.getSubcommand();
    const group = interaction.options.getSubcommandGroup();

    if (group === 'profile') {
      if (!interaction.member.roles.cache.has(config.roles.moderator)) return;

      if (subcommand === 'verify') {
        const unverifiedProfiles = await Profile.find({ verified: false });
        return interaction.customRespond(unverifiedProfiles.map(profile => ({ name: profile.slug, value: profile.slug })));
      }
    
      if (subcommand === 'unverify') {
        const verifiedProfiles = await Profile.find({ verified: true });
        return interaction.customRespond(verifiedProfiles.map(profile => ({ name: profile.slug, value: profile.slug })));
      }
    }
  }
};