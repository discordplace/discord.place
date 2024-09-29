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

const cooldowns = new Discord.Collection();

module.exports = {
  data: new Discord.SlashCommandBuilder()
    .setName('stats')
    .setDescription('View the stats of the bot.')
    .toJSON(),
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

    const uptimeHumanized = moment.duration(os.uptime() * 1000).humanize();
    const botUptimeHumanized = moment.duration(process.uptime() * 1000).humanize();
    const platform = os.platform() === 'win32' ? 'Windows' : os.platform() === 'darwin' ? 'macOS' : os.platform() === 'linux' ? 'Linux' : os.platform();

    return interaction.followUp({
      content: dedent`
        \`\`\`ansi
        ${ansiColors.bold.blue('System')}
        • ${ansiColors.reset.bold('Platform')} ${platform} ${os.arch()}
        • ${ansiColors.reset.bold('Operating System')} ${os.version()} ${os.release()}
        • ${ansiColors.reset.bold('Memory')} ${Math.round(os.totalmem() / 1024 / 1024 / 1024)} GB total, ${Math.round(os.freemem() / 1024 / 1024 / 1024)} GB free
        • ${ansiColors.reset.bold('CPU')} ${os.cpus()[0].model.trimEnd()} | Uptime: ${uptimeHumanized}
        • Get your own virtual private server at ${ansiColors.bold.blue('Nodesty')} https://nodesty.com 🔥

        ${ansiColors.bold.blue('Bot')}
        • ${ansiColors.reset.bold('Versions')} Node.js: ${process.version} | Discord.js: ${Discord.version}
        • ${ansiColors.reset.bold('Uptime')} ${botUptimeHumanized}
        • ${ansiColors.reset.bold('Servers')} ${interaction.client.guilds.cache.size}
        • ${ansiColors.reset.bold('Users')} ${interaction.client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0).toLocaleString('en-US')}

        ${ansiColors.bold.blue('Database Collections')}
        • ${ansiColors.reset.bold('Bots')} ${botsCount}
        • ${ansiColors.reset.bold('Emojis')} ${emojisCount}
        • ${ansiColors.reset.bold('Emoji Packs')} ${emojiPacksCount}
        • ${ansiColors.reset.bold('Profiles')} ${profilesCount}
        • ${ansiColors.reset.bold('Servers')} ${serversCount}
        • ${ansiColors.reset.bold('Templates')} ${templatesCount}
        • ${ansiColors.reset.bold('Sounds')} ${soundsCount}
        • ${ansiColors.reset.bold('Themes')} ${themesCount}
        \`\`\`
      `
    });
  }
};
