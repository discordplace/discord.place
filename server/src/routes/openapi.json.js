const path = require('node:path');

module.exports = {
  get: (request, response) => {
    response.setHeader('Content-Type', 'application/json');

    return response.sendFile(path.join(__dirname, '../../openapi.json'));
  }
};