module.exports = {
  data: {
    name: 'ping',
    description: 'Replies with Pong!'
  },
  execute: async interaction => {
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

    interaction.followUp({ content: `Pong! Server latency is ${interaction.client.ws.ping}ms!` });
  }
};