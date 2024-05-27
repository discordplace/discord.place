const Panel = require('@/schemas/Server/Panel');
const Discord = require('discord.js');
const Table = require('cli-table3');
const MonthlyVotes = require('@/schemas/Server/MonthlyVotes');
const Reward = require('@/schemas/Server/Vote/Reward');
const Server = require('@/schemas/Server');

async function updatePanelMessage(guildId) {
  logger.send(`Request to update panel message in guild ${guildId}.`);

  const guild = client.guilds.cache.get(guildId);
  if (!guild) return logger.send(`Guild ${guildId} not found.`);

  const panel = await Panel.findOne({ guildId });
  if (!panel) return logger.send(`Request to update panel message in guild ${guildId} but panel not found.`);

  const channel = guild.channels.cache.get(panel.channelId);
  if (!channel) return logger.send(`Panel channel not found in guild ${guild.name} (${guild.id}). Deleting the panel..`);

  if (!channel.permissionsFor(guild.members.me).has(Discord.PermissionFlagsBits.SendMessages)) {
    logger.send(`Panel message found in guild ${guild.name} (${guild.id}) but I don't have permission to send messages in the channel. Deleting the panel..`);
    return panel.deleteOne();
  }

  const server = await Server.findOne({ id: guild.id });
  if (!server) {
    logger.send(`Panel message found in guild ${guild.name} (${guild.id}) but server not found in database. Deleting the panel..`);
    return panel.deleteOne();
  }

  if (!panel.messageId) {
    const message = await channel.send(await createPanelMessageOptions(guild, server));
    if (!message) return panel.deleteOne();

    await panel.updateOne({ messageId: message.id });
    return logger.send(`Panel message created in guild ${guild.name} (${guild.id}).`);
  }

  const message = await channel.messages.fetch(panel.messageId).catch(() => null);
  if (!message) {
    logger.send(`Panel message not found in guild ${guild.name} (${guild.id}). Creating a new one.`);
    
    const message = await channel.send(await createPanelMessageOptions(guild, server));
    if (!message) return panel.deleteOne();

    await panel.updateOne({ messageId: message.id });
    logger.send(`Panel message created in guild ${guild.name} (${guild.id}).`);
  } else await message.edit(await createPanelMessageOptions(guild, server));
}

async function createPanelMessageOptions(guild, server) {
  const rewards = await Reward.find({ 'guild.id': guild.id });

  const tableBaseOptions = {
    style: { 
      head: ['magenta', 'bold'],
      compact: true,
      paddingLeft: 0,
      paddingRight: 0
    },
    chars: { 
      'top': '' , 
      'top-mid': '' , 
      'top-left': '' , 
      'top-right': '', 
      'bottom': '' , 
      'bottom-mid': '' , 
      'bottom-left': '' , 
      'bottom-right': '',
      'left': '' , 
      'left-mid': '', 
      'mid': '' , 
      'mid-mid': '',
      'right': '' , 
      'right-mid': ' ', 
      'middle': ' '
    }
  };

  const topVotersTable = new Table({ 
    head: ['##', 'Vote', 'User'],
    colWidths: [4, 6, 15],
    ...tableBaseOptions
  });
  const formatter = new Intl.NumberFormat('en-US');
  const topVoters = server.voters.sort((a, b) => b.vote - a.vote).slice(0, 10);
  for (const [index, voter] of topVoters.entries()) {
    const user = client.users.cache.get(voter.user.id) || await client.users.fetch(voter.user.id).catch(() => null);
    topVotersTable.push([`${index + 1}.`, formatter.format(voter.vote), user ? user.username : user]);
  }

  const monthlyVotesTable = new Table({ 
    head: ['Month', 'Votes'],
    colWidths: [10, 15],
    ...tableBaseOptions
  });

  const monthlyVotes = await MonthlyVotes.findOne({ guildId: guild.id });
  if (monthlyVotes) {
    for (const [, month] of monthlyVotes.data.sort((a, b) => b.created_at - a.created_at).slice(0, 6).entries()) {
      monthlyVotesTable.push([new Date(month.created_at).toLocaleString('en-US', { year: 'numeric', month: 'short' }), formatter.format(month.votes)]);
    }
  }

  const currentMonth = new Date().getMonth() + 1;
  if (!monthlyVotes || !monthlyVotes.data.some(month => month.month === currentMonth)) {
    const newItem = [new Date().toLocaleString('en-US', { year: 'numeric', month: 'short' }), `${formatter.format(server.votes)} (current)`];
    monthlyVotesTable.splice(0, 0, newItem);
  }

  const embeds = [
    new Discord.EmbedBuilder()
      .setAuthor({ name: guild.name, iconURL: guild.iconURL({ dynamic: true }) })
      .setColor('#2b2d31')
      .setFields([
        {
          name: 'Vote',
          value: `***${formatter.format(server.votes)}*** votes has given to this server by ***${server.voters.length}*** users.
\`\`\`ansi\n${topVotersTable.toString()}\`\`\``,
          inline: true
        },
        {
          name: 'Monthly Votes',
          value: `${!monthlyVotes ? 'Uh, there is no data for previous months.' : `The server has received ***${formatter.format(monthlyVotes.data.reduce((acc, month) => acc + month.votes, 0))}*** votes in the last ${monthlyVotes.data.length > 6 ? '6' : monthlyVotes.data.length} months.`}
\`\`\`ansi\n${monthlyVotesTable.toString()}\`\`\``,
          inline: true
        },
        {
          name: 'Rewards',
          value: `${!rewards.length ? 'No rewards found.' : rewards.map(reward => `- ***${reward.required_votes}*** votes for <@&${reward.role.id}>`).join('\n')}`
        }
      ])
  ];

  const lastVoter = server.lastVoter?.user?.id ? (client.users.cache.get(server.lastVoter.user.id) || await client.users.fetch(server.lastVoter.user.id).catch(() => null)) : false;
  if (lastVoter) embeds.push(
    new Discord.EmbedBuilder()
      .setColor('#2b2d31')
      .setFooter({ text: `@${lastVoter.username}`, iconURL: lastVoter.displayAvatarURL({ dynamic: true }) })
      .setTimestamp(server.lastVoter.date)
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