const Bot = require('@/schemas/Bot');
const { BotMonthlyVotes, ServerMonthlyVotes } = require('@/schemas/MonthlyVotes');
const Server = require('@/schemas/Server');

async function updateMonthlyVotes() {
  const servers = await Server.find();
  for (const server of servers) {
    await ServerMonthlyVotes.updateMonthlyVotes(server.id, server.votes, Server);
  }

  const bots = await Bot.find();
  for (const bot of bots) {
    await BotMonthlyVotes.updateMonthlyVotes(bot.id, bot.votes, Bot);
  }
}

module.exports = updateMonthlyVotes;