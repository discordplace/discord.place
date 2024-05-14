const webhookUrlValidation = require('@/validations/bots/webhook');

function webhookValidation(data) {
  if (!data?.url || !data?.token) throw new Error('Webhook should have url and token properties.');

  return webhookUrlValidation(data.url);
}

module.exports = webhookValidation;