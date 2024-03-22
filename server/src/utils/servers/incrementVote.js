const Server = require('@/schemas/Server');
const VoteTimeout = require('@/schemas/Server/VoteTimeout');
const Premium = require('@/schemas/Premium');

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
          }
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
          }
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

  return true;
}

module.exports = incrementVote; 