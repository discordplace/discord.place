const Bot = require('@/schemas/Bot');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const BotVoteTripleEnabled = require('@/schemas/Bot/Vote/TripleEnabled');
const User = require('@/schemas/User');
const Discord = require('discord.js');
const axios = require('axios');

async function incrementVote(botId, userId, botWebhook) {
  const user = client.users.cache.get(userId) || await client.users.fetch(userId).catch(() => null);
  if (!user) throw new Error(`User ${userId} not found.`);

  const bot = await Bot.findOne({ id: botId });
  if (!bot) throw new Error(`Bot ${botId} not found.`);

  const timeout = await VoteTimeout.findOne({ 'user.id': userId, 'bot.id': botId });
  if (timeout) throw new Error(`User ${userId} has already voted for bot ${botId}.`);

  const ownerHasPremium = await User.exists({ id: bot.owner.id, subscription: { $ne: null } });
  const botUser = client.users.cache.get(bot.id) || await client.users.fetch(bot.id).catch(() => null);
 
  const isVoteTripleEnabled = await BotVoteTripleEnabled.findOne({ id: bot.id }).then(data => !!data);
  const incrementCount = isVoteTripleEnabled ? 3 : (ownerHasPremium ? 2 : 1);

  if (bot.voters.some(voter => voter.user.id === userId)) {
    const updateQuery = {
      $inc: {
        votes: incrementCount,
        'voters.$[element].vote': 1
      },
      $set: {
        'voters.$[element].lastVote': Date.now(),
        last_voter: {
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
            id: userId,
            username: user.username
          },
          vote: 1
        }
      },
      $set: {
        last_voter: {
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
      id: userId,
      username: user.username
    }, 
    bot: { 
      id: botId,
      username: botUser.username,
      discriminator: botUser.discriminator
    } 
  }).save();

  const embed = new Discord.EmbedBuilder()
    .setColor(Discord.Colors.Purple)
    .setAuthor({ name: botUser.tag + ' has received a vote!', iconURL: botUser.displayAvatarURL() })
    .setFields([
      {
        name: 'Given by',
        value: `@${user.tag} (${user.id})`
      },
      {
        name: 'Total votes',
        value: (bot.votes + incrementCount).toString()
      }
    ])
    .setFooter({ text: `Voted at ${new Date().toLocaleString()}` });

  client.channels.cache.get(config.voteLogsChannelId).send({ embeds: [embed] });

  if (botWebhook?.url) {
    const headers = {
      'User-Agent': 'discord.place (https://discord.place)'
    };
    
    if (botWebhook.token) headers['Authorization'] = botWebhook.token;

    const response = await axios
      .post(botWebhook.url, { bot: bot.id, user: user.id }, { headers, timeout: 2000, responseType: 'text' })
      .catch(error => error.response);
    
    const data = {
      url: botWebhook.url,
      response_status_code: response.status,
      request_body: {
        bot: bot.id,
        user: user.id
      },
      response_body: response.data,
      created_at: new Date()
    };

    if (!bot.webhook.records) bot.webhook.records = [];

    bot.webhook.records.push(data);

    if (bot.webhook.records.length > 10) bot.webhook.records.shift();

    await bot.save();
  }

  return true;
}

module.exports = incrementVote; 