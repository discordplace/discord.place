import config from '@/config';
import ClientRequestClient from '@/lib/request/clientRequest';
import Endpoints from '@/lib/request/endpoints';

export default function setWebhookSettings(id, webhookURL, webhookToken, webhookLanguage) {
  const endpoint = Endpoints.SetServerWebhookSettings(id);

  const data = {
    url: webhookURL
  };

  const isDiscordWebhook = config.discordWebhookRegex.test(webhookURL);

  if (!isDiscordWebhook) data.token = webhookToken;
  else data.language = webhookLanguage;

  return ClientRequestClient.patch(endpoint, data);
}