const Discord = require('discord.js');
const os = require('os');
const moment = require('moment');
const Bot = require('@/schemas/Bot');
const Emoji = require('@/schemas/Emoji');
const EmojiPack = require('@/schemas/Emoji/Pack');
const Profile = require('@/schemas/Profile');
const Server = require('@/schemas/Server');
const Reminder = require('@/schemas/Reminder');
const ServerReview = require('@/schemas/Server/Review');
const BotReview = require('@/schemas/Bot/Review');

function getCpuTimes() {
  const cpus = os.cpus();
  let user = 0, nice = 0, sys = 0, idle = 0, irq = 0;

  cpus.forEach(cpu => {
    user += cpu.times.user;
    nice += cpu.times.nice;
    sys += cpu.times.sys;
    idle += cpu.times.idle;
    irq += cpu.times.irq;
  });

  return { user, nice, sys, idle, irq };
}

function calculateCpuUsage(startTimes, endTimes) {
  const startTotal = Object.values(startTimes).reduce((acc, val) => acc + val, 0);
  const endTotal = Object.values(endTimes).reduce((acc, val) => acc + val, 0);

  const totalDiff = endTotal - startTotal;
  const idleDiff = endTimes.idle - startTimes.idle;

  const usage = (1 - idleDiff / totalDiff) * 100;

  return usage;
}

function getCpuUsage() {
  const startCpuTimes = getCpuTimes();
  
  return new Promise(resolve => {
    setTimeout(() => {
      const endCpuTimes = getCpuTimes();
      const cpuUsage = calculateCpuUsage(startCpuTimes, endCpuTimes);

      resolve(cpuUsage);
    }, 1000);
  });
}

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

    await interaction.deferReply();

    const cpuUsage = await getCpuUsage();
    const uptimeHumanized = moment.duration(os.uptime() * 1000).humanize();
    const botUptimeHumanized = moment.duration(process.uptime() * 1000).humanize();

    const embed = new Discord.EmbedBuilder()
      .setColor('Random')
      .setAuthor({ name: client.user.username + ' | Server Stats', iconURL: client.user.displayAvatarURL() })
      .setDescription('A place for all things that related to Discord. No matter if you are a developer, a server owner, or just a user, you can find something useful here.')
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
 - Load: **${cpuUsage.toFixed(2)}%**
 - Uptime: **${uptimeHumanized}**`
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
          value: `- Bots: **${await Bot.countDocuments({ verified: true })}**
- Emojis: **${await Emoji.countDocuments({ approved: true })}**
- Emoji Packs: **${await EmojiPack.countDocuments({ approved: true })}**
- Profiles: **${await Profile.countDocuments()}**
- Servers: **${await Server.countDocuments()}**`
        }
      ]);
    
    return interaction.followUp({ embeds: [embed] });
  }
};
