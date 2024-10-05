const Discord = require('discord.js');
const promisify = require('node:util').promisify;
const exec = promisify(require('node:child_process').exec);

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('build')
    .setDescription('Calls build.sh file to build & restart the site.')
    .toJSON(),
  execute: async interaction => {
    if (!config.permissions.canExecuteBuild.includes(interaction.user.id)) return interaction.reply({ content: 'You are not allowed to use this command.' });

    await interaction.deferReply();

    logger.info('Building the site...');

    try {
      const stdout = await exec(process.env.CLIENT_BUILD_FILE_PATH, { cwd: process.env.HOME });

      logger.info('Build completed:', stdout);

      return interaction.followUp({ content: 'Build completed.' });
    } catch (error) {
      logger.error('Error building the site:', error);

      return interaction.followUp({ content: 'Error building the site. Check the logs for more information.' });
    }
  }
};