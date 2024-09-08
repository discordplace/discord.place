[![discord.place](https://discord.place/og.png)](https://discord.place)

# discord.place

discord.place is your comprehensive hub for everything related to Discord. Whether you're a developer, server owner, or a regular user, discord.place offers valuable resources to enhance your Discord experience.

From finding perfect emojis for your Discord servers to discovering the latest bots and servers, discord.place caters to all your Discord needs. Enjoy easy navigation and up-to-date content designed to help you make the most out of your Discord interactions.

This repository contains the client and server files for the discord.place website. 

---

## Self-Hosting

To self-host discord.place, you will need to have the following prerequisites installed on your system:

- [Node.js](https://nodejs.org/en/download/)
- [npm](https://www.npmjs.com/get-npm) (usually comes with Node.js)
- [Git](https://git-scm.com/downloads)
- [MongoDB](https://www.mongodb.com/try/download/community)

Once you have the prerequisites installed, follow these steps to self-host discord.place:

1. Clone the repository to your local machine:

```bash
git clone https://github.com/discordplace/discord.place.git
```

2. Navigate to the cloned repository:

```bash
cd discord.place
```

3. Install the required dependencies for bot server & client:

```bash
cd server

npm install

cd ../client

npm install
```

4. Get information about how to fill in the environment values from the sections below, two for [server](#environment-variables-configuration-server) and [client](#environment-variables-configuration-client).

5. Get information about how to fill in the config file from the sections below, two for [server](#about-configuration-file-server) and [client](#about-configuration-file-client).

6. Start the server:

```bash
cd server

npm start
```

7. Start the client:

```bash
cd client

npm run dev
```

8. Open your browser and navigate to `http://localhost:3000` to view the website locally.

---

### Environment Variables Configuration (Client)

Create a `.env` file in the `client` directory with the following environment variables:

```env
ANALYZE=false
NEXT_PUBLIC_CF_SITE_KEY=0x0000000000000000000000
```

##### Parameters
| Name | Description |
| ---- | ----------- |
| `ANALYZE` | Set to `true` to enable bundle analysis. |
| `NEXT_PUBLIC_CF_SITE_KEY` | Cloudflare site key for Turnstile. |

> [!NOTE]  
> - When `ANALYZE` is set to `true`, the client will generate a bundle analysis report. This is useful for debugging and optimizing the client bundle.
> - Refer to the [Cloudflare Turnstile documentation](https://developers.cloudflare.com/turnstile/get-started/#get-a-sitekey-and-secret-key) to get your Turnstile site key.

### Environment Variables Configuration (Server)

Create a `.env` file in the `server` directory with the following environment variables:

```env
COOKIE_SECRET=
SESSION_SECRET=
SESSION_STORE_SECRET=
GITHUB_AUTO_DEPLOY_SECRET=
GITHUB_AUTO_SYNC_TRANSLATORS_SECRET=
BOT_API_KEY_ENCRYPT_SECRET=
USER_TOKEN_ENCRYPT_SECRET=
PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY=
DISCORD_CLIENT_TOKEN=
DISCORD_CLIENT_SECRET=
DISCORD_CLIENT_ID=
MONGO_URL=
S3_BUCKET_NAME=
S3_ACCESS_KEY_ID=
S3_SECRET_ACCESS_KEY=
S3_REGION=
S3_ENDPOINT=
S3_DATABASE_BACKUP_BUCKET_NAME=
S3_DATABASE_BACKUP_ACCESS_KEY_ID=
S3_DATABASE_BACKUP_SECRET_ACCESS_KEY=
S3_DATABASE_BACKUP_REGION=
S3_DATABASE_BACKUP_ENDPOINT=
CLOUDFLARE_TURNSTILE_SECRET_KEY=
CLOUDFLARE_API_KEY=
CLOUDFLARE_EMAIL=
CLOUDFLARE_ACCOUNT_ID=
CLOUDFLARE_BLOCK_IP_LIST_ID=
DISCORD_PLACE_API_KEY=
LOGTAIL_SOURCE_TOKEN=
LEMON_SQUEEZY_WEBHOOK_SECRET=
LEMON_SQUEEZY_API_KEY=
DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL=
DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET=
```

##### Parameters
| Name | Description |
| ---- | ----------- |
| `COOKIE_SECRET` | Secret key for cookie encryption. |
| `SESSION_SECRET` | Secret key for session encryption. |
| `SESSION_STORE_SECRET` | Secret key for session store encryption. |
| `GITHUB_AUTO_DEPLOY_SECRET` | Secret key for GitHub auto-deploy webhook. (not required) |
| `GITHUB_AUTO_SYNC_TRANSLATORS_SECRET` | Secret key for GitHub trigger to sync translators roles. (not required) |
| `BOT_API_KEY_ENCRYPT_SECRET` | Secret key for bot API key encryption. |
| `USER_TOKEN_ENCRYPT_SECRET` | Used for encrypting user access tokens. |
| `PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY` | Secret key for encrypting custom data in the payments. |
| `DISCORD_CLIENT_TOKEN` | Discord bot token. |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret. |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID. |
| `MONGO_URL` | MongoDB connection URL. |
| `S3_BUCKET_NAME` | S3 bucket name. |
| `S3_ACCESS_KEY_ID` | S3 access key ID. |
| `S3_SECRET_ACCESS_KEY` | S3 secret access key. |
| `S3_REGION` | S3 region. |
| `S3_ENDPOINT` | S3 endpoint. |
| `S3_DATABASE_BACKUP_BUCKET_NAME` | S3 bucket name for database backups. |
| `S3_DATABASE_BACKUP_ACCESS_KEY_ID` | S3 access key ID for database backups. |
| `S3_DATABASE_BACKUP_SECRET_ACCESS_KEY` | S3 secret access key for database backups. |
| `S3_DATABASE_BACKUP_REGION` | S3 region for database backups. |
| `S3_DATABASE_BACKUP_ENDPOINT` | S3 endpoint for database backups. |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key. |
| `CLOUDFLARE_API_KEY` | Cloudflare API key. |
| `CLOUDFLARE_EMAIL` | Cloudflare email. |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare account ID. |
| `CLOUDFLARE_BLOCK_IP_LIST_ID` | Cloudflare block IP list ID. |
| `DISCORD_PLACE_API_KEY` | discord.place API key. (not required) |
| `DISCORD_PLACE_INSTATUS_API_KEY` | discord.place Instatus API key. (not required) |
| `LOGTAIL_SOURCE_TOKEN` | Logtail source token. (not required) |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Lemon Squeezy webhook secret. (not required) |
| `LEMON_SQUEEZY_API_KEY` | Lemon Squeezy API key. (not required) |
| `DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL` | Base API URL for getting approximate guild count of a bot. (not required) |
| `DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET` | Secret key for getting approximate guild count of a bot. (not required) |

> [!NOTE]
> - The `GITHUB_AUTO_DEPLOY_SECRET` is used for auto-deploying the server when a new release created in the GitHub repository. When this secret is set and you have set up the GitHub webhook, the server will automatically deploy the new release when a new release is created in the repository.
> - The `GITHUB_AUTO_SYNC_TRANSLATORS_SECRET` is used for syncing the translators roles when a push is made to the `main` branch. When this secret is set and you have set up the GitHub webhook, the server will automatically sync the translators roles in the base guild with the ids in the `client/locales/translators.json` file.
> - You should use 256-bit secret keys for the `BOT_API_KEY_ENCRYPT_SECRET`, `USER_TOKEN_ENCRYPT_SECRET` and `PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY` values. You can use [this tool](https://asecuritysite.com/encryption/plain) to generate a 256-bit key in hexadecimal format quickly.
> - For the `MONGO_URL` value, you can use a local MongoDB instance or a cloud-based MongoDB service like MongoDB Atlas. Refer to the [MongoDB documentation](https://docs.mongodb.com/manual/reference/connection-string) for more information on constructing the connection URL.
> - Values starting with `S3_` are required. This is used for storing emojis & sounds files in S3 (and also database backups). We personally use Cloudflare R2 Storage for this. You can use any S3-compatible storage service with the same configuration.
> - The `CLOUDFLARE_TURNSTILE_SECRET_KEY` is used for verifying the Turnstile token. We use Cloudflare Turnstile for ensuring that the user is a human and not a bot on the website. Refer to the [Cloudflare Turnstile documentation](https://developers.cloudflare.com/turnstile/get-started/#get-a-sitekey-and-secret-key) to get your Turnstile secret key.
> - The `CLOUDFLARE_API_KEY`, `CLOUDFLARE_EMAIL`, and `CLOUDFLARE_ACCOUNT_ID` values are required for interacting with the Cloudflare API. You can get the API key from the Cloudflare dashboard.
> - The `CLOUDFLARE_BLOCK_IP_LIST_ID` is used for blocking IP addresses within the Cloudflare firewall. Refer to the [Cloudflare WAF documentation](https://developers.cloudflare.com/waf/tools/lists/create-dashboard/) to create a list. After creating the list, you can get the list ID from the URL. (usually should be in the end of the URL)
> - The `DISCORD_PLACE_API_KEY` is used for authenticating requests to the discord.place API endpoints. This is not required for self-hosting. We use this for update our bot's command count every day on the website.
> - The `DISCORD_PLACE_INSTATUS_API_KEY` is used for authenticating requests to the discord.place Instatus API endpoints. This is not required for self-hosting. We use this for displaying the current status of the discord.place on the homepage. You can get this from the Instatus dashboard. Refer to the [Instatus API documentation](https://instatus.com/help/api) for more information.
> - The `LOGTAIL_SOURCE_TOKEN` is used for sending logs to Logtail. This is not required for self-hosting. We actually not use this in our production environment. But we wanted to keep this in the repository for future use.
> - The `LEMON_SQUEEZY_WEBHOOK_SECRET` is used for verifying the Lemon Squeezy webhook. This is not required for self-hosting. We use Lemon Squeezy for our payment system. Refer to the [Lemon Squeezy documentation](https://docs.lemonsqueezy.com/help/webhooks) for more information.
> - The `LEMON_SQUEEZY_API_KEY` is used for authenticating requests to the Lemon Squeezy API. This is not required for self-hosting. We use Lemon Squeezy for our payment system. Refer to the [Lemon Squeezy Developer Guide](https://docs.lemonsqueezy.com/guides/developer-guide/getting-started#create-an-api-key) to get your API key.
> - The `DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL` and `DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET` values are used for getting the approximate guild count of a bot. This is half required for self-hosting. If you don't want to use this feature, you can leave these values empty, but this will result in bots not being able to update server_count using the API. For now, we use private API for this because Discord doesn't provide an official API for getting the approximate guild count of a bot. We don't want to share this API source code with everyone.

### About Configuration File (Client)

Navigate to the `client` directory and find the `config.js` file. This file contains the configuration for the client. You can modify the values in this file to customize the client according to your requirements.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `availableLocales` | Array<String> | Available locales for the website. |
| `supportInviteUrl` | String | URL for the your Discord support server invite. Used in the many places in the website. |
| `docsUrl` | String | URL for the your website documentation website. |
| `api.url` | String | Base API URL for the website. In development, it will be `http://localhost:3001`. |
| `analytics.url` | String | Your analytics website URL. |
| `analytics.script` | String | Your analytics script URL. |
| `analytics.websiteId` | String | Your analytics website ID. |
| `analytics.domains` | Array<String> | Your analytics allowed domains. |
| `instatus.summaryUrl` | String | URL for the get the summary.json file from the Instatus. |
| `instatus.baseUrl` | String | Base URL for the Instatus website. |
| `botTestGuildId` | String | Your test guild ID for the bots testing. |
| `getEmojiURL` | Function | Function for getting the emoji URL. You may need to change this to your own CDN URL. |
| `getSoundURL` | Function | Function for getting the sound URL. You may need to change this to your own CDN URL. |
| `botInviteURL` | String | URL for the your bot invite. Used in the many places in the website. |
| `customHostnames` | Array<String> | Custom hostnames for the profiles. You may need to change this to your own custom hostnames. |

> [!NOTE]
> - The `availableLocales` value is used for the available locales for the website. You can change these values to your own available locales. Locale files should be in the `client/locales` directory with the format `en.json`, `tr.json`, etc. You can add new locale files to this directory and add the locale key to the `availableLocales` value. To find more details about the adding new languages to the website, check the [New Languages](#new-languages) section.
> - The `supportInviteUrl` and `docsUrl` values are used in the website for the support server and documentation links. You can change these values to your own support server and documentation links.
> - The `api.url` value is used for making API requests from the client to the server. You should change this value to your own API URL.
> - The `analytics.url`, `analytics.script`, `analytics.websiteId`, and `analytics.domains` values are used for setting up analytics on the website. We use [Umami Analytics](https://umami.is) for analytics. Any other analytics service is not supported.
> - The `instatus.summaryUrl` and `instatus.baseUrl` values are used for getting the status of the discord.place from the Instatus. You can change these values to your own Instatus URL.
> - The `botTestGuildId` value is used for when you want to quickly invite newly added bots to your test guild for testing. You can change this value to your own test guild ID.
> - The `getEmojiURL` and `getSoundURL` functions are used for getting the emoji and sound URLs. You should change these functions to your own CDN URL.
> - The `botInviteURL` value is used for the bot invite link. You can change this value to your own bot invite link.
> - The `customHostnames` value is used for the custom hostnames for the profiles. You should change this value to your own custom hostnames. You should connect these hostnames to the same server where you host the website with different ports and use a reverse proxy to redirect the requests to the correct port.

> [!WARNING]
> - If you wanna change the default locale, you should change the `default` value in the `client/config.js` file. This value should be one of the values in the `availableLocales` array. After changing this value, you also need to change the `DEFAULT_LOCALE_CODE` environment value in the `.github/workflows/validate-locale-files.yml` file. (if you don't want to get any unnecessary errors in the GitHub Actions)

### About Configuration File (Server)

We use YML files for the configuration of the server. You can find the configuration file in the `server` directory. You can modify the values in these files to customize the server according to your requirements.

##### Parameters
| Name | Type | Description |
| ---- | ---- | ----------- |
| `discordScopes` | Array<String> | Discord OAuth scopes required for the website. |
| `botPresenceStatus` | String | Presence status for the bots. |
| `rateLimitWhitelist` | Array<String> | Whitelisted user IDs for bypassing rate limits. |
| `trustProxy` | Number | Trust proxy setting for the server. |
| `session.cookieDomain` | String | Domain for the session cookie. |
| `frontendUrl` | String | Client website URL for the website. |
| `backendUrl` | String | Server API URL for the website. |
| `cdnUrl` | String | CDN URL for the website. |
| `emojis` | Object | Emojis used in the bot. |
| `port.frontend` | Number | Port for the client. |
| `port.backend` | Number | Port for the server. |
| `guildId` | String | Base guild ID for the Discord bot. |
| `guildInviteUrl` | String | Invite URL for the base guild. |
| `permissions` | Object | Permissions for the server. |
| `maxServerCountDifference` | Number | Allowed maximum server count difference for the provided server_count and the actual server count in the bot's stats API route. |
| `roles` | Object | Role IDs from the base guild. |
| `excludeCollectionsInBackup` | Array<String> | Collections to exclude from database backups. |
| `customHostnames` | Array<String> | Custom hostnames for the profiles. |
| `globalRateLimit.maxRequests` | Number | Maximum requests allowed in the global rate limit. |
| `globalRateLimit.perMinutes` | Number | Requests allowed per minute in the global rate limit. |
| `globalRateLimit.cleanUpIntervalInMinutes` | Number | Clean-up interval for the global rate limit. |
| `instatus.page_id` | String | Page ID for the Instatus. |
| `instatus.metric_id` | String | Metric ID for the Instatus. |
| `lemonSqueezy.variantIds` | Object | Variant IDs for the Lemon Squeezy. |

> [!NOTE]
> - The `discordScopes` value is used for the Discord OAuth scopes required for the website. You can change these values to your own required scopes. Usually, the `identify`, `email`, and `guilds` scopes are required.
> - The `botPresenceStatus` value is used for the presence status of the bot. You can change this value to your own presence status.
> - The `rateLimitWhitelist` value is used for whitelisted user IDs for bypassing rate limits. You can change these values to your own whitelisted user IDs.
> - The `trustProxy` value is used for the trust proxy setting for the server. You can change this value to your own trust proxy setting.
> - The `session.cookieDomain` value is used for the domain for the session cookie. You can change this value to your own domain. Make sure to include the `.` before the domain and only use the domain name without any subdomains.
> - The `frontendUrl`, `backendUrl`, and `cdnUrl` values are used for the client website URL, server API URL, and CDN URL for the website. You can change these values to your own URLs.
> - The `emojis` value is used for the emojis used in the bot. You should change these values to your own emojis.
> - The `port.frontend` and `port.backend` values are used for the client and server ports. You can change these values to your own ports.
> - The `guildId` and `guildInviteUrl` values are used for the base guild ID and invite URL for the base guild. You can change these values to your own guild ID and invite URL.
> - The `permissions` value is used for the permissions for the server. If permission name has `Roles` in the end, that means that permission is role-based. Otherwise, that permission is user ID-based. You can change these values to your own permissions.
> - The `maxServerCountDifference` value is used for the allowed maximum server count difference for the provided server_count and the actual server count in the bot's stats API route. When new requests come to the stats API route, we check the server count of the bot. If the difference between the provided server count and the actual server count is greater than this value, we reject the request.
> - The `roles` value is used for the role IDs from the base guild. You can change these values to your own role IDs.
> - The `excludeCollectionsInBackup` value is used for collections to exclude from database backups. We take daily backups of the database. If you don't want to take backups of some collections, you can add those collections to this value. Make sure to add the collection name exactly as it is in the database.
> - The `customHostnames` value is used for the custom hostnames for the profiles. You should change this value to your own custom hostnames. You should connect these hostnames to the same server where you host the website with different ports and use a reverse proxy to redirect the requests to the correct port.
> - The `globalRateLimit.maxRequests`, `globalRateLimit.perMinutes`, and `globalRateLimit.cleanUpIntervalInMinutes` values are used for the global rate limit settings. You can change these values to your own rate limit settings.
> - The `instatus.page_id` and `instatus.metric_id` values are used for the page ID and metric ID for the Instatus. You can change these values to your own page ID and metric ID.
> - The `lemonSqueezy.variantIds` value is used for the variant IDs for the Lemon Squeezy. We sell some products on Lemon Squeezy with different variants. You should create these variants on the Lemon Squeezy and get the variant IDs from there.
> - Make sure to fill all fields that end with `ChannelId` with the correct channel IDs from the base guild.

### New Languages

To add a new language to the website, follow these steps:

1. Create a new JSON file in the `client/locales` directory with the format `xx.json`, where `xx` is the language code. For example, `fr.json` for French. You can use the existing language files as a reference.
2. Add the language code to the `availableLocales` value in the `client/config.js` file.
3. Add the translations for the new language to the JSON file you created. The JSON file should have the following structure:

```json
{
  "key": "value",
  "key2": "value2"
}
```

## Contributing

We welcome contributions from the community! If you'd like to contribute to the project, please follow these guidelines:

1. Fork the repository and clone it locally.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure the code passes any existing tests.
4. Commit your changes with descriptive commit messages.
5. Push your changes to your fork and submit a pull request to the `main` branch of the original repository.

Please make sure to follow the [Code of Conduct](.github/CODE_OF_CONDUCT.md) and [Contributing Guidelines](.github/CONTRIBUTING.md) when contributing to this project.

<details>
<summary>
  <strong>
    Contributing Translations
  </strong>
</summary>

  If you'd like to contribute translations to the discord.place website, follow these steps:

  1. Fork the repository and clone it locally.
  2. Create a new branch for your translation.
  3. Find the language file you want to translate in the `client/locales` directory.
  4. Add the translations for the missing keys in the language file or update the existing translations.
  5. Commit your changes with descriptive commit messages.
  6. Push your changes to your fork and submit a pull request to the `main` branch of the original repository.
</details>

## Help

If you encounter any issues with the discord.place or have any questions, feel free to [open an issue](https://github.com/discordplace/discordplace/issues) on this repository. We'll do our best to assist you!
