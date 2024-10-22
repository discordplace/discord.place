const Discord = require('discord.js');
const fs = require('node:fs');

module.exports = class Events {
  constructor() {
    this.events = new Discord.Collection();

    return this;
  }

  fetchEvents() {
    const eventsFolders = fs.readdirSync('./src/bot/events');

    function readRecursive(folderOrFile, collection) {
      if (fs.lstatSync(`./src/bot/events/${folderOrFile}`).isDirectory()) {
        const files = fs.readdirSync(`./src/bot/events/${folderOrFile}`);
        files.forEach(file => readRecursive(`${folderOrFile}/${file}`, collection));
      } else {
        const event = require(`../events/${folderOrFile}`);
        collection.set(folderOrFile.split('.')[0], event);
      }
    }

    eventsFolders.map(folderOrFile => readRecursive(folderOrFile, this.events));
    logger.info(`Fetched ${this.events.size} events.`);
  }

  listenEvents() {
    this.events.map((event, eventName) => client.on(eventName, event));
  }
};