function languageDetection(request, response, next) {
  const language = request.headers['accept-language']?.split(',')[0]?.split('-')[0];
  const validCodes = config.availableLocales.map(({ code }) => code);
  
  request.language = validCodes.includes(language) ? language : 'en';

  next();
}

module.exports = languageDetection;