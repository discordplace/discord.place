const { gray } = require('colorette');

module.exports = class Logger {
  constructor() {
    global.logger = this;
  }

  send(message) {
    if (typeof message === 'object') message = JSON.stringify(message, null, 2);

    const formattedMessage = this.format(message);
    return console.log(formattedMessage);
  }
 
  format(message) {
    return `${gray(`${new Date().toLocaleDateString('en-US', {
      dateStyle: 'long'
    })} ${new Date().toLocaleTimeString('en-US', {
      timeStyle: 'medium'
    })}`)} | ${message}`;
  }
};
