const { ServerMonthlyVotes, BotMonthlyVotes } = require('@/schemas/MonthlyVotes');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');

async function updateMonthlyVotes() {
  const servers = await Server.find().sort({ votes: -1 });
  const mostVotedServer = servers[0];

  for (const server of servers) {
    await ServerMonthlyVotes.updateMonthlyVotes(
      server.id,
      {
        votes: server.votes,
        voters: server.voters,
        isMostVoted: mostVotedServer && mostVotedServer.id === server.id
      },
      Server
    );
  }

  const bots = await Bot.find().sort({ votes: -1 });
  const mostVotedBot = bots[0];

  for (const bot of bots) {
    await BotMonthlyVotes.updateMonthlyVotes(
      bot.id,
      {
        votes: bot.votes,
        voters: bot.voters,
        isMostVoted: mostVotedBot && mostVotedBot.id === bot.id
      },
      Bot
    );
  }
}

module.exports = updateMonthlyVotes;