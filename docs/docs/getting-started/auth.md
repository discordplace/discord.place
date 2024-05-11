# Authenticating with API Key
To get started with Discord Place API, you need to authenticate your requests using an API key. This key is used to verify your identity and access the data you need to manage your bot effectively.

API keys should be kept secure and not shared with anyone. If you suspect that your API key has been compromised, you can regenerate it at any time.

### Using API Key
To authenticate your requests with an API key, you need to include the key in the `Authorization` header of your HTTP requests.

Here's an example of how to include your API key in a certain languages:

::: code-group

```js{3,5} [JavaScript]
const axios = require('axios');

const apiKey = process.env.DISCORD_PLACE_API_KEY; // You should use environment variables to store your API key

const mockData = { // This is just a mock data to demonstrate the usage
  server_count: 0,
  command_count: 0
}

axios.post('https://api.discord.place/bots/YOUR_BOT_ID/stats', mockData, {
  headers: {
    'Authorization': apiKey
  }
})
  .then(response => {
    console.log(response.data);
  })
  .catch(error => {
    console.error(error);
  });
```

```python{3,5} [Python]
import requests

api_key = os.getenv('DISCORD_PLACE_API_KEY') # You should use environment variables to store your API key

mock_data = { # This is just a mock data to demonstrate the usage
  'server_count': 0,
  'command_count': 0
}

response = requests.post(
  'https://api.discord.place/bots/YOUR_BOT_ID/stats',
  json=mock_data, 
  headers={'Authorization': api_key}
)

print(response.json())
```

```bash [cURL]
curl -X POST https://api.discord.place/bots/YOUR_BOT_ID/stats \
  -H "Authorization: YOUR_API_KEY_HERE" \
  -H "Content-Type: application/json" \
  -d '{"server_count": 0, "command_count": 0}'
```
:::

### Congratulations! :tada:

You've successfully authenticated your requests with an API key. You can now use this key to access the data you need to manage your bot effectively. If you have any questions or need further assistance, feel free to reach out to our support team.