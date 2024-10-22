const Panel = require('@/schemas/Server/Panel');
const Discord = require('discord.js');
const { ServerMonthlyVotes } = require('@/schemas/MonthlyVotes');
const Reward = require('@/schemas/Server/Vote/Reward');
const Server = require('@/schemas/Server');
const User = require('@/schemas/User');
const ansiColors = require('ansi-colors');
const { getAverageColor } = require('fast-average-color-node');

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
    const usernameText = userIsPremium ? ansiColors.reset.bold.blue(`✦ @${username}`) : `@${username}`;

    topVotersTable.push([index + 1, formatter.format(voter.vote), usernameText]);
  }

  const embedColor = await getAverageColor(guild.iconURL({ format: 'webp', size: 64, dynamic: false }));

  const embeds = [
    new Discord.EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL() })
      .setColor(embedColor.hex)
      .setDescription(`${await guild.translate('server_panel_message.embeds.0.title')}\n${await guild.translate('server_panel_message.embeds.0.description', { serverVotes: formatter.format(server.voters.reduce((acc, voter) => acc + voter.vote, 0)), totalVoters: server.voters.length })}\n\`\`\`ansi\n${(await Promise.all(topVotersTable.map(async ([index, votes, username]) => `${ansiColors.reset.bold(`${index}${index == 10 ? '' : ' '} |`)} ${ansiColors.reset.bold.blue(`${votes}${' '.repeat(Math.max(...topVotersTable.map(([, votes]) => votes)).toString().length - votes.toString().length)} ${await guild.translate('server_panel_message.embeds.0.table.vote')}`)} ${ansiColors.reset.bold(`‒ ${username}`)}`))).join('\n')}\`\`\``)
  ];

  const monthlyVotes = await ServerMonthlyVotes.findOne({ identifier: guild.id });
  if (monthlyVotes) {
    embeds.push(
      new Discord.EmbedBuilder()
        .setColor(embedColor.hex)
        .setDescription(`${await guild.translate('server_panel_message.embeds.1.title')}\n${await guild.translate('server_panel_message.embeds.1.description', { count: formatter.format(server.votes) })}\n\`\`\`ansi\n${monthlyVotes.data.map(month => [formatter.format(month.votes), new Date(month.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short' })]).map(([votes, date]) => `${ansiColors.reset.bold(`${date} ‒`)} ${ansiColors.reset.bold.blue(votes)}`).join('\n')}\`\`\``)
    );
  }

  if (rewards.length) {
    embeds.push(
      new Discord.EmbedBuilder()
        .setColor(embedColor.hex)
        .setDescription(`${await guild.translate('server_panel_message.embeds.2.title')}\n${await guild.translate('server_panel_message.embeds.2.description', { postProcess: 'interval', count: rewards.length })}\n\`\`\`ansi\n${(await Promise.all(rewards.map(async reward => `${ansiColors.reset.bold(`${reward.required_votes} ‒`)} ${ansiColors.reset.bold.blue(`@${guild.roles.cache.get(reward.role.id)?.name || await guild.translate('server_panel_message.embeds.2.table.unknown_role')}`)}`))).join('\n')}\`\`\``)
    );
  }

  const lastVoter = server.last_voter?.user?.id ? (client.users.cache.get(server.last_voter.user.id) || await client.users.fetch(server.last_voter.user.id).catch(() => null)) : false;
  if (lastVoter) embeds.push(
    new Discord.EmbedBuilder()
      .setColor(embedColor.hex)
      .setFooter({ text: `@${lastVoter.username}`, iconURL: lastVoter.displayAvatarURL() })
      .setTimestamp(server.last_voter.date)
  );

  const components = [
    new Discord.ActionRowBuilder()
      .addComponents(
        new Discord.ButtonBuilder()
          .setCustomId('vote')
          .setLabel(await guild.translate('server_panel_message.buttons.vote'))
          .setEmoji(config.emojis.pink_heart)
          .setStyle(Discord.ButtonStyle.Secondary),
        new Discord.ButtonBuilder()
          .setLabel(await guild.translate('server_panel_message.buttons.view_on_discord_place'))
          .setStyle(Discord.ButtonStyle.Link)
          .setURL(`${config.frontendUrl}/servers/${guild.id}`)
      )
  ];

  return { embeds, components };
}

module.exports = updatePanelMessage;