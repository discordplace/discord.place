const Bot = require('@/schemas/Bot');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const Premium = require('@/schemas/Premium');
const Discord = require('discord.js');

async function incrementVote(botId, userId) {
  const user = client.users.cache.get(userId) || await client.users.fetch(userId).catch(() => null);
  if (!user) throw new Error(`User ${userId} not found.`);

  const bot = await Bot.findOne({ id: botId });
  if (!bot) throw new Error(`Bot ${botId} not found.`);

  const timeout = await VoteTimeout.findOne({ 'user.id': userId, 'bot.id': botId });
  if (timeout) throw new Error(`User ${userId} has already voted for bot ${botId}.`);

  const ownerHasPremium = await Premium.findOne({ 'user.id': bot.owner.id });
  const botUser = client.users.cache.get(bot.id) || await client.users.fetch(bot.id).catch(() => null);
  const incrementCount = ownerHasPremium ? 2 : 1;

  if (bot.voters.some(voter => voter.user.id === userId)) {
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

    await bot.updateOne(updateQuery, { arrayFilters });
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

    await bot.updateOne(updateQuery);
  }

  await new VoteTimeout({ 
    user: { 
      id: userId
    }, 
    bot: { 
      id: botId
    } 
  }).save();

  const embed = new Discord.EmbedBuilder()
    .setColor(Discord.Colors.Purple)
    .setAuthor({ name: botUser.tag + ' has received a vote!', iconURL: botUser.displayAvatarURL() })
    .setFields([
      {
        name: 'Given by',
        value: `@${user.tag} (${user.id})`,
      },
      {
        name: 'Total votes',
        value: (bot.votes + incrementCount).toString()
      }
    ])
    .setFooter({ text: `Voted at ${new Date().toLocaleString()}` });

  client.channels.cache.get(config.voteLogsChannelId).send({ embeds: [embed] });

  return true;
}

module.exports = incrementVote; 