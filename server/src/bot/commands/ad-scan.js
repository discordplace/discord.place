const Discord = require('discord.js');

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('ad')
    .setDescription('ad')
    .addSubcommand(subcommand => subcommand.setName('scan').setDescription('Scans user presences for if they are advertising.')
      .addStringOption(option => option.setName('text').setDescription('The text to scan for advertising. (Default: discord.gg)').setRequired(false)))
    .toJSON(),
  execute: async interaction => {
    if (!interaction.member.permissions.has(Discord.PermissionFlagsBits.ManageGuild)) return interaction.reply({ content: 'You do not have the required permissions to use this command.' });
  
    const text = interaction.options.getString('text') || 'discord.gg';
    const members = interaction.guild.members.cache.filter(member => member.presence?.activities?.some(activity => activity.type === Discord.ActivityType.Custom && activity.state.toLowerCase().includes(text.toLowerCase())));

    if (!members.size) return interaction.reply({ content: `No members found advertising with the text \`${Discord.escapeMarkdown(text)}\`.` });

    const pages = [];
    let currentPage = 0;
    const perPage = 5;
    const totalPages = Math.ceil(members.size / perPage);
    
    for (let i = 0; i < members.size; i += perPage) {
      const data = members.map(member => member).slice(i, i + perPage);

      const embed = new Discord.EmbedBuilder()
        .setAuthor({ name: `Advertising scan results for ${interaction.guild.name}`, iconURL: interaction.guild.iconURL() })
        .setColor('Random')
        .setTitle(`Page ${pages.length + 1} of ${totalPages}`)
        .setDescription(data.map(member => `- **@${Discord.escapeMarkdown(member.user.username)}** (${member.user.id})`).join('\n'))
        .setFooter({ text: `Scanned for text: ${text}` });

      pages.push(embed);
    }

    if (pages.length === 1) return interaction.reply({ embeds: [pages[0]] });

    const components = [
      new Discord.ActionRowBuilder()
        .addComponents(
          new Discord.ButtonComponentBuilder()
            .setCustomId('previous')
            .setLabel('Previous')
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(true),
          new Discord.ButtonComponentBuilder()
            .setCustomId('next')
            .setLabel('Next')
            .setStyle(Discord.ButtonStyle.Primary)
            .setDisabled(pages.length === 1)
        )
    ];

    const message = interaction.reply({ embeds: [pages[currentPage]], components, fetchReply: true });

    const filter = i => i.user.id === interaction.user.id;
    const collector = message.createMessageComponentCollector({ filter, time: 300000 });

    collector.on('collect', i => {
      if (i.customId === 'previous' && currentPage > 0) {
        currentPage--;
        message.edit({ embeds: [pages[currentPage]] });
      } else if (i.customId === 'next' && currentPage < pages.length - 1) {
        currentPage++;
        message.edit({ embeds: [pages[currentPage]] });
      }
    });

    collector.on('end', () => message.edit({ content: 'This message is now inactive.', components: [] }));
  }
};