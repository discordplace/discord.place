module.exports = {
  data: {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  execute: interaction => interaction.reply({ content: `Pong! Server latency is ${interaction.client.ws.ping}ms!` })
};