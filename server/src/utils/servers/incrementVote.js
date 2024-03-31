const Server = require('@/schemas/Server');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const Premium = require('@/schemas/Premium');
const Discord = require('discord.js');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');

async function incrementVote(guildId, userId) {
  const guild = client.guilds.cache.get(guildId);
  if (!guild) throw new Error(`Guild ${guildId} not found.`);

  const server = await Server.findOne({ id: guild.id });
  const timeout = await VoteTimeout.findOne({ 'user.id': userId, 'guild.id': guild.id });
  const ownerHasPremium = await Premium.findOne({ 'user.id': guild.ownerId });
  const incrementCount = ownerHasPremium ? 2 : 1;

  if (!server) throw new Error(`Server ${guild.id} not found.`);
  if (timeout) throw new Error(`User ${userId} has already voted for server ${guild.id}.`);

  if (server.voters.some(voter => voter.user.id === userId)) {
    const updateQuery = {
      $inc: {
        votes: incrementCount,
        'voters.$[element].vote': 1
      },
      $set: {
        lastVoter: {
          user: {
            id: userId
          },
          date: Date.now()
        }
      }
    };
    
    const arrayFilters = [
      { 'element.user.id': userId }
    ];

    await Server.updateOne({ id: guild.id }, updateQuery, { arrayFilters });
  } else {
    const updateQuery = {
      $inc: {
        votes: incrementCount
      },
      $push: {
        voters: {
          user: {
            id: userId
          },
          vote: 1
        }
      },
      $set: {
        lastVoter: {
          user: {
            id: userId
          },
          date: Date.now()
        }
      }
    };

    await Server.updateOne({ id: guild.id }, updateQuery);
  }

  await new VoteTimeout({ 
    user: { 
      id: userId
    }, 
    guild: { 
      id: guild.id
    } 
  }).save();

  updatePanelMessage(guild.id);

  const user = client.users.cache.get(userId) || await client.users.fetch(userId);
  const embed = new Discord.EmbedBuilder()
    .setColor(Discord.Colors.Purple)
    .setAuthor({ name: guild.name + ' has received a vote!', iconURL: guild.iconURL() })
    .setFields([
      {
        name: 'Given by',
        value: `@${user.tag} (${user.id})`,
      },
      {
        name: 'Total votes',
        value: (server.votes + incrementCount).toString()
      }
    ])
    .setFooter({ text: `Voted at ${new Date().toLocaleString()}` });

  client.channels.cache.get(config.voteLogsChannelId).send({ embeds: [embed] });

  return true;
}

module.exports = incrementVote; 