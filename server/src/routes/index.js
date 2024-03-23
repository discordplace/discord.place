module.exports = {
  get: (request, response) => {
    const host = request.headers.host;
    if (host === 'dsc.wtf') return response.redirect('https://discord.place/profiles');
    
    return response.send('OK');
  }
};