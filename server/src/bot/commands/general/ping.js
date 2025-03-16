const mongoose = require('mongoose');
const ansiColors = require('ansi-colors');
const getLocalizedCommand = require('@/utils/localization/getLocalizedCommand');
const getServerResponseTime = require('@/utils/getServerResponseTime');

module.exports = {
  data: {
    name: 'ping',
    description: 'Shows latency values.',
    name_localizations: getLocalizedCommand('ping').names,
    description_localizations: getLocalizedCommand('ping').descriptions
  },
  execute: async interaction => {
    if (!interaction.deferred && !interaction.replied) await interaction.deferReply();

    const websocketHeartbeat = interaction.client.ws.ping;
    const serverResponseTime = await getServerResponseTime();

    let mongoosePing = 'N/A';

    if (mongoose.connection.readyState === mongoose.STATES.connected) {
      const start = Date.now();
      await mongoose.connection.db.admin().ping();

      mongoosePing = `${Date.now() - start}ms`;
    }

    return interaction.followUp({
      content: `\`\`\`ansi
${ansiColors.bold(`${ansiColors.blue(await interaction.translate('commands.ping.fields.0.name'))} ${websocketHeartbeat}ms
${ansiColors.reset(await interaction.translate('commands.ping.fields.0.value'))}

${ansiColors.blue(await interaction.translate('commands.ping.fields.1.name'))} ${serverResponseTime}
${ansiColors.reset(await interaction.translate('commands.ping.fields.1.value'))}

${ansiColors.blue(await interaction.translate('commands.ping.fields.2.name'))} ${mongoosePing}
${ansiColors.reset(await interaction.translate('commands.ping.fields.2.value'))}
`)}\`\`\``
    });
  }
};