const Discord = require('discord.js');
const os = require('os');
const moment = require('moment');
const Bot = require('@/schemas/Bot');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Profile = require('@/schemas/Profile');
const Server = require('@/schemas/Server');
const Template = require('@/schemas/Template');
const Sounds = require('@/schemas/Sound');

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

    const [botsCount, emojisCount, emojiPacksCount, profilesCount, serversCount, templatesCount, soundsCount] = await Promise.all([
      Bot.countDocuments({ verified: true }),
      Emoji.countDocuments({ approved: true }),
      EmojiPack.countDocuments({ approved: true }),
      Profile.countDocuments(),
      Server.countDocuments(),
      Template.countDocuments(),
      Sounds.countDocuments()
    ]);

    const uptimeHumanized = moment.duration(os.uptime() * 1000).humanize();
    const botUptimeHumanized = moment.duration(process.uptime() * 1000).humanize();

    const embed = new Discord.EmbedBuilder()
      .setAuthor({ name: client.user.username + ' | Server Stats', iconURL: client.user.displayAvatarURL() })
      .setDescription('A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.')
      .setColor(Discord.Colors.Blurple)
      .setFields([
        {
          name: 'System',
          value: `- Platform: **${os.platform()}**
- Arch: **${os.arch()}**
- Memory
 - Total: **${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB**
 - Free: **${(os.freemem() / 1024 / 1024 / 1024).toFixed(2)} GB**
- CPU
 - Model: **${os.cpus()[0].model}**
 - Uptime: **${uptimeHumanized}**
 
Get your own virtual private server at [Nodesty](https://nodesty.com/) <a:springleFire:1282966373869551667>`
        },
        {
          name: 'Bot',
          value: `- Versions
 - Node.js: **${process.version}**
 - Discord.js: **${Discord.version}**
- Uptime: **${botUptimeHumanized}**
- Servers: **${client.guilds.cache.size}**
- Users: **${client.guilds.cache.map(guild => guild.memberCount).reduce((a, b) => a + b, 0).toLocaleString('en-US')}**`
        },
        {
          name: 'Statistics',
          value: `- Bots: **${botsCount}**
- Emojis: **${emojisCount}**
- Emoji Packs: **${emojiPacksCount}**
- Profiles: **${profilesCount}**  
- Servers: **${serversCount}**
- Templates: **${templatesCount}**
- Sounds: **${soundsCount}**`
        }
      ]);
    
    return interaction.followUp({ embeds: [embed] });
  }
};
