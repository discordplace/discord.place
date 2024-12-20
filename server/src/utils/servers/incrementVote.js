const Server = require('@/schemas/Server');
const VoteTimeout = require('@/schemas/Server/Vote/Timeout');
const ServerVoteTripleEnabled = require('@/schemas/Server/Vote/TripleEnabled');
const User = require('@/schemas/User');
const Discord = require('discord.js');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');
const sendLog = require('@/utils/servers/sendLog');
const Reward = require('@/schemas/Server/Vote/Reward');
const axios = require('axios');
const getProxyAgent = require('@/utils/getProxyAgent');

async function incrementVote(guildId, userId) {
  const user = client.users.cache.get(userId) || await client.users.fetch(userId).catch(() => null);
  if (!user) throw new Error(`User ${userId} not found.`);

  const guild = client.guilds.cache.get(guildId);
  if (!guild) throw new Error(`Guild ${guildId} not found.`);

  const server = await Server.findOne({ id: guild.id });
  if (!server) throw new Error(`Server ${guild.id} not found.`);

  const timeout = await VoteTimeout.findOne({ 'user.id': userId, 'guild.id': guild.id });
  if (timeout) throw new Error(`User ${userId} has already voted for server ${guild.id}.`);

  const ownerHasPremium = await User.exists({ id: guild.ownerId, subscription: { $ne: null } });

  const isVoteTripleEnabled = await ServerVoteTripleEnabled.findOne({ id: guild.id }).then(data => !!data);
  const incrementCount = isVoteTripleEnabled ? 3 : (ownerHasPremium ? 2 : 1);

  if (server.voters.some(voter => voter.user.id === userId)) {
    const updateQuery = {
      $inc: {
        votes: incrementCount,
        'voters.$[element].vote': 1
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

    const arrayFilters = [
      { 'element.user.id': userId }
    ];

    await server.updateOne(updateQuery, { arrayFilters });
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

    await server.updateOne(updateQuery);
  }

  await new VoteTimeout({
    user: {
      id: userId,
      username: user.username
    },
    guild: {
      id: guild.id,
      name: guild.name
    }
  }).save();

  updatePanelMessage(guild.id);

  const embed = new Discord.EmbedBuilder()
    .setColor(Discord.Colors.Purple)
    .setAuthor({ name: `${guild.name} has received a vote!`, iconURL: guild.iconURL() })
    .setFields([
      {
        name: 'Given by',
        value: `@${user.tag} (${user.id})`
      },
      {
        name: 'Total votes',
        value: (server.votes + incrementCount).toString()
      }
    ])
    .setFooter({ text: `Voted at ${new Date().toLocaleString()}` });

  client.channels.cache.get(config.voteLogsChannelId).send({ embeds: [embed] });

  sendLog(guild.id, await guild.translate('commands.vote.logging_messages.user_voted', { username: Discord.escapeMarkdown(user.username), userId: user.id }))
    .catch(() => null);

  const rewards = await Reward.find({ 'guild.id': guild.id });
  const voterVotes = (server.voters.find(voter => voter.user.id === userId)?.vote || 0) + 1;

  for (const reward of rewards.sort((a, b) => b.required_votes - a.required_votes)) {
    if (voterVotes >= reward.required_votes) {
      const role = guild.roles.cache.get(reward.role.id);
      if (!role) {
        await Reward.deleteOne({ 'role.id': reward.role.id });

        sendLog(guild.id, await guild.translate('vote_rewards.reward_role_deleted', { roleId: reward.role.id }))
          .catch(() => null);

        logger.warn(`Role with ID ${reward.role.id} has been deleted from the database because it was not found in server ${guild.id}.`);

        continue;
      }

      const member = guild.members.cache.get(userId) || await guild.members.fetch(userId).catch(() => null);
      if (!member) continue;

      if (member.roles.cache.has(role.id)) break;

      member.roles.add(role, await guild.translate('vote_rewards.reward_role_added_audit_reason', { requiredVotes: voterVotes }))
        .then(async () => {
          await sendLog(guild.id, await guild.translate('vote_rewards.reward_role_added', { username: Discord.escapeMarkdown(user.username), userId: user.id, roleName: role.name, vote: voterVotes }))
            .catch(() => null);

          const dmChannel = user.dmChannel || await user.createDM().catch(() => null);
          if (dmChannel) dmChannel.send(await guild.translate('vote_rewards.reward_role_added_dm_message', { roleName: role.name, guildName: guild.name, vote: voterVotes }));
        })
        .catch(async error => {
          sendLog(await guild.translate('vote_rewards.reward_role_add_error', { roleName: role.name, username: Discord.escapeMarkdown(user.username), userId: user.id, errorMessage: error.message }))
            .catch(() => null);
        });

      logger.info(`User ${user.id} has been given the reward role ${role.name} for voting ${voterVotes} times in server ${guild.id}.`);

      break;
    }
  }

  if (server.webhook.url) {
    const headers = {
      'User-Agent': 'discord.place (https://discord.place)'
    };

    if (server.webhook.token) headers['Authorization'] = server.webhook.token;

    const requestConfig = {
      url: server.webhook.url,
      method: 'POST',
      headers,
      timeout: 2000,
      responseType: 'text',
      data: {
        server: guild.id,
        user: user.id
      }
    };

    if (process.env.WEBHOOKS_PROXY_SERVER_HOST) {
      try {
        requestConfig.httpsAgent = getProxyAgent();
      } catch (error) {
        logger.error('Error while creating proxy agent for webhook request:', error);
      }
    }

    const response = await axios(requestConfig)
      .catch(error => error.response);

    const data = {
      url: server.webhook.url,
      response_status_code: response?.status || 0,
      request_body: {
        server: guild.id,
        user: user.id
      },
      created_at: Date.now()
    };

    if (!server.webhook.records) server.webhook.records = [];

    server.webhook.records.push(data);

    if (server.webhook.records.length > 10) server.webhook.records.shift();

    await server.save();
  }

  return true;
}

module.exports = incrementVote;