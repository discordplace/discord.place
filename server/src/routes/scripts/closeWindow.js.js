module.exports = {
  get: (request, response) => {
    response.setHeader('Content-Type', 'text/javascript');

    return response.send('window.close()');
  }
};