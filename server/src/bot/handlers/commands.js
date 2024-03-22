const Discord = require('discord.js');
const fs = require('node:fs');

module.exports = class Commands {
  constructor() {
    this.commands = new Discord.Collection();
    return this;
  }

  fetchCommands() {
    const commandsFolders = fs.readdirSync('./src/bot/commands');

    function readRecursive(folderOrFile, collection) {
      if (fs.lstatSync(`./src/bot/commands/${folderOrFile}`).isDirectory()) {
        const files = fs.readdirSync(`./src/bot/commands/${folderOrFile}`);
        files.forEach(file => readRecursive(`${folderOrFile}/${file}`, collection));
      } else {
        const command = require(`../commands/${folderOrFile}`);
        collection.set(command.data.name, command);
      }
    }

    commandsFolders.map(folderOrFile => readRecursive(folderOrFile, this.commands));
    logger.send(`Fetched ${this.commands.size} commands.`);
  }

  registerCommands() {
    logger.send('Started refreshing application (/) commands.');

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        // Global commands
        await this.pushToDiscord(this.commands.filter(command => !config.commandsExcludeToGlobal.includes(command.data.name)).map(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON() : command.data), Discord.Routes.applicationCommands(client.user.id));

        // Admin commands
        await this.pushToDiscord(this.commands.filter(command => config.commandsExcludeToGlobal.includes(command.data.name)).map(command => typeof command.data?.toJSON === 'function' ? command.data.toJSON() : command.data), Discord.Routes.applicationGuildCommands(client.user.id, config.guildId));

        logger.send('Successfully reloaded application (/) commands.');
        resolve();
      } catch (error) {
        logger.send(`Failed to register commands:\n${error.stack}`);
        reject(error);
      }
    });
  }

  unregisterCommands() {
    logger.send('Started unregister application (/) commands.');

    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        // Global commands
        await this.pushToDiscord([], Discord.Routes.applicationCommands(client.user.id));

        // Admin commands
        await this.pushToDiscord([], Discord.Routes.applicationGuildCommands(client.user.id, config.guildId));

        logger.send('Successfully unregistered application (/) commands.');
        resolve();
      } catch (error) {
        logger.send(`Failed to unregister commands:\n${error.stack}`);
        reject(error);
      }
    });
  }

  pushToDiscord(body, route) {
    return client.rest.put(route, { body: body });
  }
};