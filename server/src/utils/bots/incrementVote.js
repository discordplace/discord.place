const Bot = require('@/schemas/Bot');
const VoteTimeout = require('@/schemas/Bot/Vote/Timeout');
const BotVoteTripleEnabled = require('@/schemas/Bot/Vote/TripleEnabled');
const User = require('@/schemas/User');
const sendVoteWebhook = require('@/utils/bots/sendVoteWebhook');
const sendLog = require('@/utils/sendLog');

async function incrementVote(botId, userId) {
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

  sendLog(
    'voteReceived',
    [
      { type: 'user', name: 'User', value: userId },
      { type: 'user', name: 'Target', value: botId },
      { type: 'number', name: 'Total Votes', value: bot.votes + incrementCount }
    ],
    [
      { label: 'View User', url: `${config.frontendUrl}/profile/u/${userId}` },
      { label: 'View Bot', url: `${config.frontendUrl}/bots/${botId}` }
    ]
  );

  if (bot.webhook?.url) sendVoteWebhook(bot, { id: userId, username: user.username }, { bot: bot.id, user: user.id, test: false }).catch(() => null);

  return true;
}

module.exports = incrementVote;