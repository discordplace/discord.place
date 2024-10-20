const Discord = require('discord.js');
const promisify = require('node:util').promisify;
const exec = promisify(require('node:child_process').exec);

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('build')
    .setDescription('Calls the build script to build the site.')

    .addStringOption(option =>
      option.setName('site')
        .setDescription('The site to build.')
        .setRequired(true)
        .addChoices([
          {
            name: 'client (discord.place)',
            value: 'client'
          },
          {
            name: 'documentation (docs.discord.place)',
            value: 'docs'
          }
        ]))

    .toJSON(),
  execute: async interaction => {
    if (!config.permissions.canExecuteBuild.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this command.' });

    const site = interaction.options.getString('site');
    if (!['client', 'docs'].includes(site)) return interaction.reply({ content: 'Invalid option provided.' });

    await interaction.deferReply();

    logger.info('Building the site...');

    try {
      const { stdout } = await exec(site === 'docs' ? process.env.DOCS_BUILD_FILE_PATH : process.env.CLIENT_BUILD_FILE_PATH, { cwd: process.env.HOME });

      logger.info('Build completed:', stdout);

      return interaction.followUp({ content: 'Build completed.' });
    } catch (error) {
      logger.error('Error building the site:', error);

      return interaction.followUp({ content: 'Error building the site. Check the logs for more information.' });
    }
  }
};