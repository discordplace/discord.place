module.exports = {
  /**
   * @swagger
   * /:
   *  get:
   *   summary: Responds with OK if server is up and running.
   *   description: Responds with OK if server is up and running.
   *   responses:
   *     200:
   *      description: OK
   *      content:
   *      text/plain:
   *        schema:
   *         type: string
   *         example: OK
   */
  get: (request, response) => {
    const host = request.headers.host;
    if (config.customHostnames.includes(host)) return response.redirect('https://discord.place/profiles');
    
    return response.send('OK');
  }
};