const webhookUrlValidation = require('@/validations/bots/webhookUrl');

function webhookValidation(data) {
  if (!data.url) throw new Error('Webhook URL is required.');

  return webhookUrlValidation(data.url);
}

module.exports = webhookValidation;