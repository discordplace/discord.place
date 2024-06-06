const pino = require('pino');

module.exports = class Logger {
  constructor() {
    global.logger = this;

    this.logger = pino({
      colorize: false
    });
  }

  send(message) {
    this.logger.info(message);
  }
};