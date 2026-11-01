module.exports = {
  get: (request, response) => {
    const host = request.headers.host;
    if (config.customHostnames.includes(host)) return response.redirect(`${config.frontendUrl}/profiles`);

    return response.send('OK');
  }
};