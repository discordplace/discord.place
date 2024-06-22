const { ServerMonthlyVotes, BotMonthlyVotes } = require('@/schemas/MonthlyVotes');
const Server = require('@/schemas/Server');
const Bot = require('@/schemas/Bot');
const updatePanelMessage = require('@/utils/servers/updatePanelMessage');

async function updateMonthlyVotes() {
  const servers = await Server.find();
  for (const server of servers) {
    await ServerMonthlyVotes.updateMonthlyVotes(server.id, server.votes);
    await updatePanelMessage(server.id);
  }

  const bots = await Bot.find();
  for (const bot of bots) {
    await BotMonthlyVotes.updateMonthlyVotes(bot.id, bot.votes);
  }
}

module.exports = updateMonthlyVotes;