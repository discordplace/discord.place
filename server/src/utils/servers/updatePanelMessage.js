const Panel = require('@/schemas/Server/Panel');
const Discord = require('discord.js');
const { ServerMonthlyVotes } = require('@/schemas/MonthlyVotes');
const Reward = require('@/schemas/Server/Vote/Reward');
const Server = require('@/schemas/Server');
const User = require('@/schemas/User');

async function updatePanelMessage(guildId) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) return;

  const panel = await Panel.findOne({ guildId });
  if (!panel) return;

  const channel = guild.channels.cache.get(panel.channelId);
  if (!channel) return;

  if (!channel.permissionsFor(guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) return panel.deleteOne();

  const server = await Server.findOne({ id: guild.id });
  if (!server) return panel.deleteOne();

  if (!panel.messageId) {
    const message = await channel.send(await createPanelMessageOptions(guild, server)).catch(() => null);
    if (!message) return panel.deleteOne();

    await panel.updateOne({ messageId: message.id });
    return logger.info(`Panel message created in guild ${guild.name} (${guild.id}).`);
  }

  const message = await channel.messages.fetch(panel.messageId).catch(() => null);
  if (!message) {
    logger.info(`Panel message not found in guild ${guild.name} (${guild.id}). Creating a new one.`);
    
    const message = await channel.send(await createPanelMessageOptions(guild, server)).catch(() => null);
    if (!message) return panel.deleteOne();

    await panel.updateOne({ messageId: message.id });
    logger.info(`Panel message created in guild ${guild.name} (${guild.id}).`);
  } else await message.edit(await createPanelMessageOptions(guild, server));
}

async function createPanelMessageOptions(guild, server) {
  const rewards = await Reward.find({ 'guild.id': guild.id });

  const formatter = new Intl.NumberFormat('en-US');
  const topVoters = server.voters.sort((a, b) => b.vote - a.vote).slice(0, 10);
  const premiumUsers = await User.find({ id: { $in: topVoters.map(voter => voter.user.id) }, subscription: { $ne: null } });
  
  const topVotersTable = [];

  for (const [index, voter] of topVoters.entries()) {
    const user = client.users.cache.get(voter.user.id) || await client.users.fetch(voter.user.id).catch(() => null);
    const userIsPremium = premiumUsers.some(premiumUser => premiumUser.id === voter.user.id);
    const username = user ? user.username : user;
    const usernameText = userIsPremium ? `[1;2m[1;34m✦ @${username}[0m[1m` : `@${username}`;

    topVotersTable.push([`${index + 1}.`, formatter.format(voter.vote), usernameText]);
  }

  const embeds = [
    new Discord.EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setColor('#2b2d31')
      .setDescription(`**Votes**\n- ***${formatter.format(server.voters.reduce((acc, voter) => acc + voter.vote, 0))}*** time this server has been voted in total by ***${server.voters.length}*** users.\n\`\`\`ansi\n${topVotersTable.map(([index, votes, username]) => `[1;2m${index}${index == 10 ? '' : ' '} |[0m [1;2m[1;34m${votes}${' '.repeat(5 - votes.toString().length)}[0m[0m [1;2m‒ ${username}[0m[0;2m[0;2m[0;2m[0;2m[0m[0m[0m[0m[1;2m[1;2m[0;2m[0m[0m[0m`).join('\n')}\`\`\``)
  ];

  const monthlyVotes = await ServerMonthlyVotes.findOne({ identifier: guild.id });
  if (monthlyVotes) {
    embeds.push(
      new Discord.EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`**Monthly Votes**\n- This server has gained ***${formatter.format(server.votes)}*** votes in this month.\n\`\`\`ansi\n${monthlyVotes.data.map(month => [formatter.format(month.votes), new Date(month.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short' })]).map(([votes, date]) => `[1;2m${date}[0m ‒ [2;34m[1;34m${votes}[0m[2;34m[0m`).join('\n')}\`\`\``)
    );
  }

  if (rewards.length) {
    embeds.push(
      new Discord.EmbedBuilder()
        .setColor('#2b2d31')
        .setDescription(`**Rewards**\n- This server has ***${rewards.length}*** reward${rewards.length > 1 ? 's' : ''}.\n\`\`\`ansi\n${rewards.map(reward => `[1;2m${reward.required_votes}[0m ‒ [1;2m@${guild.roles.cache.get(reward.role.id)?.name || 'unknown'}[0m`).join('\n')}\`\`\``)
    );
  }

  const lastVoter = server.last_voter?.user?.id ? (client.users.cache.get(server.last_voter.user.id) || await client.users.fetch(server.last_voter.user.id).catch(() => null)) : false;
  if (lastVoter) embeds.push(
    new Discord.EmbedBuilder()
      .setColor('#2b2d31')
      .setFooter({ text: `@${lastVoter.username}`, iconURL: lastVoter.displayAvatarURL() })
      .setTimestamp(server.last_voter.date)
  );

  const components = [
    new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('vote')
          .setLabel('Vote')
          .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
          .setLabel('View on discord.place')
          .setStyle(Discord.ButtonStyle.Link)
          .setURL(`${config.frontendUrl}/servers/${guild.id}`)
      )
  ];

  return { embeds, components };
}

module.exports = updatePanelMessage;