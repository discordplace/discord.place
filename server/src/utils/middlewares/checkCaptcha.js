const axios = require('axios');

module.exports = async function checkCaptcha(request, response, next) {
  const { captchaResponse } = request.body;
  if (!captchaResponse) return response.sendError('Captcha is required.', 400);

  const baseURL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';
  const data = {
    response: captchaResponse,
    secret: process.env.CLOUDFLARE_TURNSTILE_SECRET_KEY,
  };

  try {
    const { data: { success } } = await axios.post(baseURL, data);
    if (!success) return response.sendError('Captcha is invalid.', 400);

    next();
  } catch (error) {
    return response.sendError('Captcha verification failed.', 500);
  }
};