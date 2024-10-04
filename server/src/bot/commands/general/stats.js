const Discord = require('discord.js');
const os = require('os');
const moment = require('moment');
const Bot = require('@/schemas/Bot');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Profile = require('@/schemas/Profile');
const Server = require('@/schemas/Server');
const Template = require('@/schemas/Template');
const Sound = require('@/schemas/Sound');
const Theme = require('@/schemas/Theme');
const dedent = require('dedent');
const ansiColors = require('ansi-colors');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');

const cooldowns = new Discord.Collection();

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('stats')
    .setDescription('View the stats of the bot.')
    .setNameLocalizations(getLocalizedCommand('stats').names)
    .setDescriptionLocalizations(getLocalizedCommand('stats').descriptions),
  execute: async interaction => {
    if (cooldowns.has(interaction.user.id)) {
      const expirationTime = cooldowns.get(interaction.user.id) + 60000;

      if (Date.now() < expirationTime) return interaction.reply({ content: 'You are on cooldown! Please wait 1 minute before using this command again.' });
    }

    cooldowns.set(interaction.user.id, Date.now());

    if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

    const [botsCount, emojisCount, emojiPacksCount, profilesCount, serversCount, templatesCount, soundsCount, themesCount] = await Promise.all([
      Bot.countDocuments({ verified: true }),
      Emoji.countDocuments({ approved: true }),
      EmojiPack.countDocuments({ approved: true }),
      Profile.countDocuments(),
      Server.countDocuments(),
      Template.countDocuments(),
      Sound.countDocuments(),
      Theme.countDocuments()
    ]);

    moment.locale(await interaction.getLanguage());

    const uptimeHumanized = moment.duration(os.uptime() * 1000).humanize();
    const botUptimeHumanized = moment.duration(process.uptime() * 1000).humanize();
    const platform = os.platform() === 'win32' ? 'Windows' : os.platform() === 'darwin' ? 'macOS' : os.platform() === 'linux' ? 'Linux' : os.platform();

    moment.locale(config.availableLocales.find(locale => locale.default).code);

    return interaction.followUp({
      content: dedent`
        \`\`\`ansi
        ${ansiColors.bold.blue(await interaction.translate('commands.stats.blocks.0.title'))}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.0.fields.0.name'))} ${await interaction.translate('commands.stats.blocks.0.fields.0.value', { platform, arch: os.arch() })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.0.fields.1.name'))} ${await interaction.translate('commands.stats.blocks.0.fields.1.value', { version: os.version(), release: os.release() })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.0.fields.2.name'))} ${await interaction.translate('commands.stats.blocks.0.fields.2.value', { totalMemory: Math.round(os.totalmem() / 1024 / 1024 / 1024), freeMemory: Math.round(os.freemem() / 1024 / 1024 / 1024) })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.0.fields.3.name'))} ${await interaction.translate('commands.stats.blocks.0.fields.3.value', { cpuModel: os.cpus()[0].model.trimEnd(), uptime: uptimeHumanized })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.0.fields.4.name'))} ${await interaction.translate('commands.stats.blocks.0.fields.4.value', { nodestyText: `${ansiColors.bold.blue('Nodesty')} https://nodesty.com` })}

        ${ansiColors.bold.blue(await interaction.translate('commands.stats.blocks.1.title'))}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.1.fields.0.name'))} ${await interaction.translate('commands.stats.blocks.1.fields.0.value', { nodeVersion: process.version, discordVersion: Discord.version })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.1.fields.1.name'))} ${await interaction.translate('commands.stats.blocks.1.fields.1.value', { uptime: botUptimeHumanized })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.1.fields.2.name'))} ${await interaction.translate('commands.stats.blocks.1.fields.2.value', { guildsCount: interaction.client.guilds.cache.size })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.1.fields.3.name'))} ${await interaction.translate('commands.stats.blocks.1.fields.3.value', { usersCount: interaction.client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0).toLocaleString('en-US') })}

        ${ansiColors.bold.blue(await interaction.translate('commands.stats.blocks.2.title'))}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.2.fields.0.name'))} ${await interaction.translate('commands.stats.blocks.2.fields.0.value', { botsCount })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.2.fields.1.name'))} ${await interaction.translate('commands.stats.blocks.2.fields.1.value', { emojisCount })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.2.fields.2.name'))} ${await interaction.translate('commands.stats.blocks.2.fields.2.value', { emojiPacksCount })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.2.fields.3.name'))} ${await interaction.translate('commands.stats.blocks.2.fields.3.value', { profilesCount })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.2.fields.4.name'))} ${await interaction.translate('commands.stats.blocks.2.fields.4.value', { serversCount })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.2.fields.5.name'))} ${await interaction.translate('commands.stats.blocks.2.fields.5.value', { templatesCount })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.2.fields.6.name'))} ${await interaction.translate('commands.stats.blocks.2.fields.6.value', { soundsCount })}
        • ${ansiColors.reset.bold(await interaction.translate('commands.stats.blocks.2.fields.7.name'))} ${await interaction.translate('commands.stats.blocks.2.fields.7.value', { themesCount })}
        \`\`\`
      `
    });
  }
};
