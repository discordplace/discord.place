<p align="center">
  <a href="https://discord.place">
    <img src="https://shieldcn.dev/header/glow.svg?title=discord.place&amp;subtitle=Discover+Discord+emojis,+sounds,+themes,+servers,+bots+and+profiles.&amp;logo=https%3A%2F%2Fdiscord.place%2Fsymbol_white.png&amp;theme=violet&amp;font=geist" alt="discord.place" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/discordplace/discord.place">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/group/github/stars/discordplace/discord.place+github/forks/discordplace/discord.place+github/issues/discordplace/discord.place+github/license/discordplace/discord.place.svg?variant=outline&amp;theme=violet&amp;font=geist&amp;mode=dark" />
      <img alt="GitHub stars, forks, issues and license" src="https://shieldcn.dev/group/github/stars/discordplace/discord.place+github/forks/discordplace/discord.place+github/issues/discordplace/discord.place+github/license/discordplace/discord.place.svg?variant=outline&amp;theme=violet&amp;font=geist&amp;mode=light" />
    </picture>
  </a>
  <a href="https://discord.gg/sMkykssTtV">
    <picture>
      <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/discord/members/sMkykssTtV.svg?variant=outline&amp;theme=violet&amp;font=geist&amp;mode=dark" />
      <img alt="Discord members" src="https://shieldcn.dev/discord/members/sMkykssTtV.svg?variant=outline&amp;theme=violet&amp;font=geist&amp;mode=light" />
    </picture>
  </a>
</p>

**discord.place** is a community hub for everything related to Discord. Find emojis, sounds, themes, servers, bots, templates, and profiles. You can also list your own. This repository contains the Next.js client and the Node.js API/bot server.

## Self-Hosting

**Prerequisites:** [Node.js](https://nodejs.org) 22.9 or newer, [pnpm](https://pnpm.io), [Git](https://git-scm.com), and [MongoDB](https://www.mongodb.com/try/download/community).

**1. Clone the repository**

```bash
git clone https://github.com/discordplace/discord.place.git
cd discord.place
```

**2. Install dependencies**

```bash
pnpm --dir server install
pnpm --dir client install
```

**3. Configure the apps**

Create `server/.env` and `client/.env`. Copy `server/config.local.example.yml` to `server/config.local.yml` and fill in your deployment values. The tracked `server/config.yml` and `client/config/data.js` contain defaults. Every option is documented in the collapsible sections below.

Both apps read environment variables from the process, so a secret manager can inject them instead of keeping `.env` files on disk. `.env` files are optional, and when both are present, process environment variables take precedence over `.env` values.

**4. Start both apps**

```bash
pnpm dev
```

Open [http://localhost:5000](http://localhost:5000). The client runs on `CLIENT_PORT` (default `5000`) and the server on `SERVER_PORT` (default `5001`). The server restarts when its files change.

> [!NOTE]
> `pnpm dev` runs the development servers. For a production deployment, run `pnpm --dir client build`, then `pnpm --dir server start` and `pnpm --dir client start`.

<details>
<summary><strong>Environment variables (client)</strong></summary>

Create a `.env` file in the `client` directory with the following environment variables:

```env
CLIENT_PORT=5000
NEXT_PUBLIC_SITE_URL=
NEXT_PUBLIC_API_URL=
INTERNAL_API_URL=
NEXT_PUBLIC_CF_SITE_KEY=
CLIENT_SECRET=
NEXT_PUBLIC_CDN_URL=
NEXT_PUBLIC_SUPPORT_INVITE_URL=
NEXT_PUBLIC_DOCS_URL=
NEXT_PUBLIC_STATUS_URL=
NEXT_PUBLIC_BOT_INVITE_URL=
NEXT_PUBLIC_GITHUB_ISSUES_URL=
NEXT_PUBLIC_LINK_SHORTENER_HOSTNAME=
NEXT_PUBLIC_CUSTOM_HOSTNAMES=
NEXT_PUBLIC_BOT_TEST_GUILD_ID=
SENTRY_ORG=
SENTRY_PROJECT=
NEXT_PUBLIC_SENTRY_DSN=
SENTRY_AUTH_TOKEN=
```

**Parameters**

| Name | Description |
| ---- | ----------- |
| `CLIENT_PORT` | Port the Next.js client listens on. Defaults to `5000`. |
| `NEXT_PUBLIC_SITE_URL` | Public URL of the client. Defaults to `http://localhost:5000` in development and `https://discord.place` in production. |
| `NEXT_PUBLIC_API_URL` | Public URL of the API. Defaults to `http://localhost:5001` in development and `https://api.discord.place` in production. |
| `INTERNAL_API_URL` | Internal API URL used by the client server for server-side requests. Defaults to `NEXT_PUBLIC_API_URL`. |
| `NEXT_PUBLIC_CF_SITE_KEY` | Cloudflare site key for Turnstile. |
| `CLIENT_SECRET` | Secret key for client. |
| `NEXT_PUBLIC_CDN_URL` | CDN URL for the website. Used for serving emojis and sounds files. Must be a valid URL. |
| `NEXT_PUBLIC_SUPPORT_INVITE_URL` | Support server invite URL. Defaults to `https://invite.discord.place`. |
| `NEXT_PUBLIC_DOCS_URL` | Documentation URL. Defaults to `https://docs.discord.place`. |
| `NEXT_PUBLIC_STATUS_URL` | Status page URL. Defaults to `https://status.discord.place`. |
| `NEXT_PUBLIC_BOT_INVITE_URL` | Bot invite URL. Defaults to `https://bot.discord.place`. |
| `NEXT_PUBLIC_GITHUB_ISSUES_URL` | Issue creation URL. Defaults to the repository issue form. |
| `NEXT_PUBLIC_LINK_SHORTENER_HOSTNAME` | Link shortener hostname. Defaults to `dsc.im`. |
| `NEXT_PUBLIC_CUSTOM_HOSTNAMES` | Comma-separated custom profile hostnames. Defaults to `dsc.mom`. |
| `NEXT_PUBLIC_BOT_TEST_GUILD_ID` | Guild ID used when testing newly added bots. |
| `SENTRY_ORG` | Sentry organization for error tracking. |
| `SENTRY_PROJECT` | Sentry project for error tracking. |
| `NEXT_PUBLIC_SENTRY_DSN` | Sentry DSN for error tracking. |
| `SENTRY_AUTH_TOKEN` | Sentry auth token for error tracking. |

> [!NOTE]
> - The client validates these variables with zod when Next.js loads. Missing required values or malformed URLs, ports, or hostnames stop the build or start with a list of errors.
> - Refer to the [Cloudflare Turnstile documentation](https://developers.cloudflare.com/turnstile/get-started/#get-a-sitekey-and-secret-key) to get your Turnstile site key.
> - The `CLIENT_SECRET` value is attached to the requests sent by the client's server-side rendering. You can use any random string for this value. This value is used for verifying the requests sent by the client's server-side rendering and should match the server's `CLIENT_SECRET` value.
> - The `CLIENT_PORT` value controls the Next.js listener. Set it in the environment where you build and start the client.
> - The `NEXT_PUBLIC_SITE_URL` and `NEXT_PUBLIC_API_URL` values are public and are used by both the browser and server rendering. Set them to your own domains. The defaults are for local development.
> - The `INTERNAL_API_URL` value is used by the client server to reach the API during server-side rendering. It defaults to `NEXT_PUBLIC_API_URL`. Set it to an internal address when the API is reachable directly from the client server.
> - The `NEXT_PUBLIC_SUPPORT_INVITE_URL`, `NEXT_PUBLIC_DOCS_URL`, `NEXT_PUBLIC_STATUS_URL`, `NEXT_PUBLIC_BOT_INVITE_URL`, `NEXT_PUBLIC_GITHUB_ISSUES_URL`, `NEXT_PUBLIC_LINK_SHORTENER_HOSTNAME`, `NEXT_PUBLIC_CUSTOM_HOSTNAMES`, and `NEXT_PUBLIC_BOT_TEST_GUILD_ID` values override the matching defaults in `client/config/data.js`.
> - The `NEXT_PUBLIC_CDN_URL` is used for serving emojis and sounds files. You should set this to your own CDN URL. Make sure to use valid URL format (e.g., `https://cdn.yourdomain.com`).
> - The `SENTRY_ORG`, `SENTRY_PROJECT`, `NEXT_PUBLIC_SENTRY_DSN`, and `SENTRY_AUTH_TOKEN` values are used for Sentry error tracking. We use Sentry for error tracking. Refer to the [Sentry documentation](https://docs.sentry.io/) for more information.

</details>

<details>
<summary><strong>Environment variables (server)</strong></summary>

Create a `.env` file in the `server` directory with the following environment variables:

```env
SERVER_PORT=5001
FRONTEND_URL=
BACKEND_URL=
INTERNAL_FRONTEND_URL=
COOKIE_SECRET=
GITHUB_AUTO_SYNC_TRANSLATORS_SECRET=
BOT_API_KEY_ENCRYPT_SECRET=
USER_TOKEN_ENCRYPT_SECRET=
PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY=
JWT_SECRET=
CLIENT_SECRET=
DISCORD_CLIENT_TOKEN=
DISCORD_CLIENT_SECRET=
DISCORD_CLIENT_ID=
DISCORD_PORTAL_CHANNEL_WEBHOOK_URL=
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
DAILY_DATABASE_BACKUP_HEARTBEAT_URL=
CDN_URL=
CLOUDFLARE_TURNSTILE_SECRET_KEY=
LEMON_SQUEEZY_WEBHOOK_SECRET=
LEMON_SQUEEZY_API_KEY=
DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL=
DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET=
KENERING_INSTANCE_URL=
KENERING_API_KEY=
WEBHOOKS_PROXY_SERVER_PROTOCOL=
WEBHOOKS_PROXY_SERVER_HOST=
WEBHOOKS_PROXY_SERVER_PORT=
WEBHOOKS_PROXY_SERVER_USERNAME=
WEBHOOKS_PROXY_SERVER_PASSWORD=
SENTRY_DSN=
```

**Parameters**

| Name | Description |
| ---- | ----------- |
| `SERVER_PORT` | Port the API listens on. Defaults to `5001`. |
| `FRONTEND_URL` | Public URL of the client. Overrides `frontendUrl` in `config.yml`. Defaults to `http://localhost:5000` in development. |
| `BACKEND_URL` | Public URL of the API. Overrides `backendUrl` in `config.yml`. Defaults to `http://localhost:5001` in development. |
| `INTERNAL_FRONTEND_URL` | Optional internal client URL used by the sitemap. Defaults to `FRONTEND_URL` or `config.frontendUrl`. |
| `COOKIE_SECRET` | Secret key for cookie encryption. |
| `GITHUB_AUTO_SYNC_TRANSLATORS_SECRET` | Secret key for GitHub trigger to sync translators roles. (not required) |
| `BOT_API_KEY_ENCRYPT_SECRET` | Secret key for bot API key encryption. |
| `USER_TOKEN_ENCRYPT_SECRET` | Used for encrypting user access tokens. |
| `PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY` | Secret key for encrypting custom data in the payments. |
| `JWT_SECRET` | Secret key for JWT token encryption. |
| `CLIENT_SECRET` | Secret key for client. |
| `DISCORD_CLIENT_TOKEN` | Discord bot token. |
| `DISCORD_CLIENT_SECRET` | Discord OAuth client secret. |
| `DISCORD_CLIENT_ID` | Discord OAuth client ID. |
| `DISCORD_PORTAL_CHANNEL_WEBHOOK_URL` | Webhook URL for the portal channel. (not required) |
| `MONGO_URL` | MongoDB connection URL. |
| `S3_BUCKET_NAME` | S3 bucket name. |
| `S3_ACCESS_KEY_ID` | S3 access key ID. |
| `S3_SECRET_ACCESS_KEY` | S3 secret access key. |
| `S3_REGION` | S3 region. |
| `S3_ENDPOINT` | S3 endpoint. |
| `S3_DATABASE_BACKUP_BUCKET_NAME` | S3 bucket name for database backups. (not required) |
| `S3_DATABASE_BACKUP_ACCESS_KEY_ID` | S3 access key ID for database backups. (not required) |
| `S3_DATABASE_BACKUP_SECRET_ACCESS_KEY` | S3 secret access key for database backups. (not required) |
| `S3_DATABASE_BACKUP_REGION` | S3 region for database backups. (not required) |
| `S3_DATABASE_BACKUP_ENDPOINT` | S3 endpoint for database backups. (not required) |
| `DAILY_DATABASE_BACKUP_HEARTBEAT_URL` | Heartbeat URL for daily database backup. (not required) |
| `CDN_URL` | CDN URL for the website. Used for serving emojis and sounds files. Must be a valid URL. |
| `CLOUDFLARE_TURNSTILE_SECRET_KEY` | Cloudflare Turnstile secret key. |
| `LEMON_SQUEEZY_WEBHOOK_SECRET` | Lemon Squeezy webhook secret. (not required) |
| `LEMON_SQUEEZY_API_KEY` | Lemon Squeezy API key. (not required) |
| `DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL` | Base API URL for getting approximate guild count of a bot. (not required) |
| `DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET` | Secret key for getting approximate guild count of a bot. (not required) |
| `KENERING_INSTANCE_URL` | Base URL of the Kener.ing instance used by the status page. (not required) |
| `KENERING_API_KEY` | API key for the Kener.ing instance used by the status page. (not required) |
| `WEBHOOKS_PROXY_SERVER_PROTOCOL` | Protocol for the proxy server. |
| `WEBHOOKS_PROXY_SERVER_HOST` | Host for the proxy server. |
| `WEBHOOKS_PROXY_SERVER_PORT` | Port for the proxy server. |
| `WEBHOOKS_PROXY_SERVER_USERNAME` | Username for the proxy server. (not required) |
| `WEBHOOKS_PROXY_SERVER_PASSWORD` | Password for the proxy server. (not required) |
| `SENTRY_DSN` | Sentry DSN for error tracking. (not required) |

> [!NOTE]
> - The server validates these variables with zod at startup. Missing required values or malformed URLs or ports stop the process with a list of errors.
> - The `SERVER_PORT` value controls the API listener. Set it in the environment where you start the server.
> - The `FRONTEND_URL` and `BACKEND_URL` values override the URLs in `config.yml`. Leave them empty to use the values from the configuration file.
> - The `INTERNAL_FRONTEND_URL` value is optional. It is used by the sitemap when `sitemapConfig.useInternalNetworking` is enabled, so the server can fetch blogs from the client without going through the public domain.
> - The `GITHUB_AUTO_SYNC_TRANSLATORS_SECRET` is used for syncing the translators roles when a push is made to the `main` branch. When this secret is set and you have set up the GitHub webhook, the server will automatically sync the translators roles in the base guild with the ids in the `client/locales/translators.json` file.
> - You should use 256-bit secret keys for the `BOT_API_KEY_ENCRYPT_SECRET`, `USER_TOKEN_ENCRYPT_SECRET` and `PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY` values. You can use [this tool](https://asecuritysite.com/encryption/plain) to generate a 256-bit key in hexadecimal format quickly.
> - The `PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY` value is required when `LEMON_SQUEEZY_API_KEY` is set.
> - The `CLIENT_SECRET` value is attached to the requests sent by the client's server-side rendering. You can use any random string for this value. This value is used for verifying the requests sent by the client's server-side rendering and should match the client's `CLIENT_SECRET` value.
> - The `DISCORD_PORTAL_CHANNEL_WEBHOOK_URL` is used for sending messages to the portal channel. This is not required for self-hosting. We use this webhook for sending messages to the portal channel for certain events like new bot approved, new emoji published, etc. __This webhook should be created by bot.__ Otherwise, no components (link buttons) will be sent with the messages. You can leave this value empty. Make sure to use a valid Discord webhook URL format (e.g., `https://discord.com/api/webhooks/XXX/XXX`).
> - For the `MONGO_URL` value, you can use a local MongoDB instance or a cloud-based MongoDB service like MongoDB Atlas. Refer to the [MongoDB documentation](https://docs.mongodb.com/manual/reference/connection-string) for more information on constructing the connection URL.
> - Values starting with `S3_` are required. This is used for storing emojis & sounds files in S3 (and also database backups). We personally use Cloudflare R2 Storage for this. You can use any S3-compatible storage service with the same configuration. Note: You can leave the `S3_DATABASE_BACKUP_*` values empty if you don't want to use S3 for database backups. We use S3 for storing the database backups, but this is not required for self-hosting. If you leave these values empty, the server will not take any database backups and throws warnings in the console when you start the server.
> - The `CDN_URL` is used for serving emojis and sounds files. You should set this to your own CDN URL. Make sure to use valid URL format (e.g., `https://cdn.yourdomain.com`).
> - The `CLOUDFLARE_TURNSTILE_SECRET_KEY` is used for verifying the Turnstile token. We use Cloudflare Turnstile for ensuring that the user is a human and not a bot on the website. Refer to the [Cloudflare Turnstile documentation](https://developers.cloudflare.com/turnstile/get-started/#get-a-sitekey-and-secret-key) to get your Turnstile secret key.
> - The `LEMON_SQUEEZY_WEBHOOK_SECRET` is used for verifying the Lemon Squeezy webhook. This is not required for self-hosting. We use Lemon Squeezy for our payment system. Refer to the [Lemon Squeezy documentation](https://docs.lemonsqueezy.com/help/webhooks) for more information.
> - The `LEMON_SQUEEZY_API_KEY` is used for authenticating requests to the Lemon Squeezy API. This is not required for self-hosting. We use Lemon Squeezy for our payment system. Refer to the [Lemon Squeezy Developer Guide](https://docs.lemonsqueezy.com/guides/developer-guide/getting-started#create-an-api-key) to get your API key.
> - The `DAILY_DATABASE_BACKUP_HEARTBEAT_URL` is used for the heartbeat URL for daily database backups. We use [Kener.ing](https://kener.ing) for monitoring the uptime of the website.
> - The `KENERING_INSTANCE_URL` and `KENERING_API_KEY` values are used by the status page to read monitor status from your Kener.ing instance. They are optional, but the status endpoint returns an error until they are set.
> - The `DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL` and `DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET` values are used for getting the approximate guild count of a bot. This is half required for self-hosting. If you don't want to use this feature, you can leave these values empty, but this will result in bots not being able to update server_count using the API. For now, we use private API for this because Discord doesn't provide an official API for getting the approximate guild count of a bot. We don't want to share this API source code with everyone.
> - The `WEBHOOKS_PROXY_SERVER_PROTOCOL`, `WEBHOOKS_PROXY_SERVER_HOST`, `WEBHOOKS_PROXY_SERVER_PORT`, `WEBHOOKS_PROXY_SERVER_USERNAME`, and `WEBHOOKS_PROXY_SERVER_PASSWORD` values are used for the proxy server settings. We use a proxy server for sending webhooks requests. If you don't want to use a proxy server, you can leave these values empty. Username and password are not required for the proxy server.
> - The `SENTRY_DSN` value is used for Sentry error tracking. This is not required for self-hosting. We use Sentry for error tracking. Refer to the [Sentry documentation](https://docs.sentry.io) for more information.

</details>

<details>
<summary><strong>Configuration (client)</strong></summary>

Navigate to the `client/config` directory and find the `data.js` file. This file contains the configuration for the client. You can modify the values in this file to customize the client according to your requirements.

**Parameters**

| Name | Type | Description |
| ---- | ---- | ----------- |
| `api.url` | String | Base API URL. Defaults to `http://localhost:5001` in development and `https://api.discord.place` in production. Override with `NEXT_PUBLIC_API_URL`. |
| `availableLocales` | Array<Object> | Available locales for the website, including the matching date-fns locale. |
| `baseUrl` | String | Base URL for the website. Defaults to `http://localhost:5000` in development and `https://discord.place` in production. Override with `NEXT_PUBLIC_SITE_URL`. |
| `botInviteURL` | String | URL for your bot invite. Used in many places on the website. Override with `NEXT_PUBLIC_BOT_INVITE_URL`. |
| `botTestGuildId` | String | Your test guild ID for bot testing. Override with `NEXT_PUBLIC_BOT_TEST_GUILD_ID`. |
| `customHostnames` | Array<String> | Custom hostnames for profiles. You should connect these hostnames to the same server where you host the API and connect them to the correct port, same as the API. Override with `NEXT_PUBLIC_CUSTOM_HOSTNAMES`. |
| `docsUrl` | String | Documentation URL. Override with `NEXT_PUBLIC_DOCS_URL`. |
| `githubIssuesUrl` | String | Issue creation URL. Override with `NEXT_PUBLIC_GITHUB_ISSUES_URL`. |
| `linkShortenerHostname` | String | Hostname for the link shortener. Override with `NEXT_PUBLIC_LINK_SHORTENER_HOSTNAME`. |
| `statusUrl` | String | Status page URL. Override with `NEXT_PUBLIC_STATUS_URL`. |
| `supportInviteUrl` | String | Support server invite URL. Override with `NEXT_PUBLIC_SUPPORT_INVITE_URL`. |

> [!NOTE]
> - The `api.url` value is used for making API requests from the client to the server. Set `NEXT_PUBLIC_API_URL` to your own API URL. Make sure to use domain names instead of IP addresses for the API URL. Also you should use Cloudflare for both client and server domains.
> - The `availableLocales` value is used for the available locales for the website. You can change these values to your own available locales. Locale files should be in the `client/locales` directory with the format `en.json`, `tr.json`, etc. You can add new locale files to this directory and add the locale key to the `availableLocales` value. Each entry also has a `dateFnsLocale` value, which is the [date-fns locale](https://date-fns.org/docs/I18n) object used for localized date and duration formatting. To find more details about the adding new languages to the website, check the **Adding a new language** section below.
> - The `baseUrl` value is used for the base URL for the website. Set `NEXT_PUBLIC_SITE_URL` to your own base URL. Make sure to use domain names instead of IP addresses for the base URL. Also you should use Cloudflare for the client domain.
> - The `botInviteURL` value is used for the bot invite link. You can change this value to your own bot invite link.
> - The `botTestGuildId` value is used for when you want to quickly invite newly added bots to your test guild for testing. You can change this value to your own test guild ID.
> - The `customHostnames` value is used for the custom hostnames for the profiles. You should change this value to your own custom hostnames. You should connect these hostnames to the same server where you host the API and connect them to the correct port, same as the API.
> - The `linkShortenerHostname` value is used for the hostname of the link shortener. You can change this value to your own link shortener hostname. Make sure to connect this hostname to the same server where you host the API and connect it to the correct port, same as the API.
> - The URL and hostname values in this table can be overridden with the matching `NEXT_PUBLIC_*` environment variables. The defaults are for local development.

> [!WARNING]
> - If you want to change the default locale, change the `default` value in the `client/config/data.js` file. It must be one of the entries in `availableLocales`. Locale validation reads the expected code from the `DEFAULT_LOCALE_CODE` environment variable, so set that to the same code wherever you run it.

</details>

<details>
<summary><strong>Configuration (server)</strong></summary>

We use YML files for the configuration of the server. You can find the configuration file in the `server` directory. You can modify the values in these files to customize the server according to your requirements.

The tracked `config.yml` contains defaults shared by every deployment. Copy `config.local.example.yml` to `config.local.yml` and fill in the values for your Discord instance. `config.local.yml` is ignored by Git and deep-merged over `config.yml`.

```bash
cp server/config.local.example.yml server/config.local.yml
```

Limits, categories, deny reasons, and quarantine rules are shared across the client and server in `shared/config.json`. After changing that file, run `pnpm sync:shared`; the pre-commit hook also checks that the generated copies are current.

**Parameters**

The keys below are split between `config.yml`, `config.local.yml`, and `shared/config.json`. Deployment-specific keys are marked.

| Name | Type | Description |
| ---- | ---- | ----------- |
| `discordScopes` | Array<String> | Discord OAuth scopes required for the website. |
| `botPresenceStatus` | String | Presence status for the bots. |
| `rateLimitWhitelist` | Array<String> | Whitelisted user IDs for bypassing rate limits. (config.local.yml) |
| `trustProxy` | Number | Trust proxy setting for the server. |
| `frontendUrl` | String | Client website URL. (config.local.yml; overridden by `FRONTEND_URL`.) |
| `backendUrl` | String | Server API URL. (config.local.yml; overridden by `BACKEND_URL`.) |
| `docsUrl` | String | Documentation URL used in the sitemap. (config.local.yml) |
| `statusUrl` | String | Status page URL used in the sitemap. (config.local.yml) |
| `supportInviteUrl` | String | URL for your Discord support server invite. (config.local.yml) |
| `emojis` | Object | Emojis used in the bot. (config.local.yml) |
| `sitemapConfig` | Object | Configuration for generating the website sitemap. |
| `guildId` | String | Base guild ID for the Discord bot. (config.local.yml) |
| `guildInviteUrl` | String | Invite URL for the base guild. (config.local.yml) |
| `permissions` | Object | Permissions for the server. (config.local.yml) |
| `roles` | Object | Role IDs from the base guild. (config.local.yml) |
| `excludeCollectionsInBackup` | Array<String> | Collections to exclude from database backups. |
| `customHostnames` | Array<String> | Custom hostnames for the profiles. (config.local.yml) |
| `linkShortenerHostname` | String | Hostname for the link shortener. (config.local.yml) |
| `lemonSqueezy.variantIds` | Object | Variant IDs for the Lemon Squeezy. (config.local.yml) |
| `availableLocales` | Array<Object> | Available locales for the website. |

> [!NOTE]
> - The `discordScopes` value is used for the Discord OAuth scopes required for the website. You can change these values to your own required scopes. Usually, the `identify`, `email`, and `guilds` scopes are required.
> - The `botPresenceStatus` value is used for the presence status of the bot. You can change this value to your own presence status.
> - The `rateLimitWhitelist` value is used for whitelisted user IDs for bypassing rate limits. You can change these values to your own whitelisted user IDs.
> - The `trustProxy` value is used for the trust proxy setting for the server. You can change this value to your own trust proxy setting.
> - The `frontendUrl` and `backendUrl` values are configured in `config.local.yml` and are used for the client website URL and server API URL. Override them with `FRONTEND_URL` and `BACKEND_URL` when needed. The CDN URL is configured with the `CDN_URL` environment variable.
> - The `docsUrl` and `statusUrl` values are used in the sitemap. Set them to your own documentation and status pages.
> - The `supportInviteUrl` value is used for the support server invite URL. Set it in `config.local.yml`.
> - The `emojis` value is used for the emojis used in the bot. Set these values in `config.local.yml`.
> - The `sitemapConfig` value is used to configure sitemap generation settings, such as `blogsChangeFrequency` for how often blog items are expected to change, and `useInternalNetworking` for toggling whether to fetch blogs internally. When enabled, the server uses `INTERNAL_FRONTEND_URL` if it is set, otherwise it uses `config.frontendUrl`.
> - The client and server ports are configured with the `CLIENT_PORT` and `SERVER_PORT` environment variables, not in `config.yml`.
> - The `guildId` and `guildInviteUrl` values are used for the base guild ID and invite URL for the base guild. Set them in `config.local.yml`.
> - The `permissions` value is used for the permissions for the server. If a permission name has `Roles` in the end, that means the permission is role-based. Otherwise, the permission is user ID-based. Set these values in `config.local.yml`.
> - The shared `maxServerCountDifference` limit is used for the allowed maximum server count difference for the provided server_count and the actual server count in the bot's stats API route. When new requests come to the stats API route, we check the server count of the bot. If the difference between the provided server count and the actual server count is greater than this value, we reject the request.
> - The `roles` value is used for the role IDs from the base guild. Set these values in `config.local.yml`.
> - The `excludeCollectionsInBackup` value is used for collections to exclude from database backups. We take daily backups of the database. If you don't want to take backups of some collections, you can add those collections to this value. Make sure to add the collection name exactly as it is in the database.
> - The `customHostnames` value is used for the custom hostnames for the profiles. Set it in `config.local.yml` and connect these hostnames to the same server where you host the API and connect them to the correct port, same as the API.
> - The `linkShortenerHostname` value is used for the hostname of the link shortener. Set it in `config.local.yml` and connect this hostname to the same server where you host the API and connect it to the correct port, same as the API.
> - The `lemonSqueezy.variantIds` value is used for the variant IDs for Lemon Squeezy. Set these in `config.local.yml` after creating the corresponding variants in Lemon Squeezy.
> - All fields ending with `ChannelId` are in `config.local.yml`. Fill them with the correct channel IDs from the base guild.
> - The `availableLocales` value is used for the available locales for the server. You can change these values to your own available locales. Locale files should be in the `server/src/locales` directory with the format `en.json`, `tr.json`, etc. You can add new locale files to this directory and add the locale key to the `availableLocales` value. To find more details about the adding new languages to the website, check the **Adding a new language** section below.

</details>

<details>
<summary><strong>Adding a new language</strong></summary>

**Client**

1. Create a new JSON file in the `client/locales` directory with the format `xx.json`, where `xx` is the language code. For example, `fr.json` for French. You can use the existing language files as a reference.
2. Add an entry to the `availableLocales` array in the `client/config/data.js` file. The entry needs the language `code`, `countryCode`, `flag`, `name`, and the matching `dateFnsLocale` object imported from `date-fns/locale`. Only the default locale should have `default: true`.

```js
import { fr } from 'date-fns/locale';

// ...
{ code: 'fr', countryCode: 'fr', dateFnsLocale: fr, flag: '🇫🇷', name: 'French' }
```

3. Import the new locale JSON file in the `client/lib/i18n.js` file and add it to the `resources` object in the i18n initialization.
4. Add the translations for the new language to the JSON file you created. The JSON file should have the following structure:

```json
{
  "key": "value",
  "key2": "value2"
}
```

**Server**

1. Create a new JSON file in the `server/src/locales` directory with the format `xx.json`, where `xx` is the language code. For example, `fr.json` for French. You can use the existing language files as a reference.
2. Add the language code to the `availableLocales` value in the `server/config.yml` file.
3. Add the translations for the new language to the JSON file you created. The JSON file should have the following structure:

```json
{
  "key": "value",
  "key2": "value2"
}
```

> [!NOTE]
> - Some languages may not be supported by Discord client.

</details>

<details>
<summary><strong>Project notes</strong></summary>

**react-icons**

The `@react-icons/all-files` package is used for the icons in the client. We use our version of the `@react-icons/all-files` package that hosted on our CDN (https://cdn.discord.place/react-icons-all-files-5.5.0.tgz). You can just simply replace the package with the original one (https://github.com/react-icons/react-icons/releases/download/v5.5.0/react-icons-all-files-5.5.0.tgz) if you want to use the original package. We highly recommend you to use original package.

**Tailwind CSS**

We use Tailwind CSS for styling the frontend. If you want to customize the Tailwind CSS configuration, you can modify the `tailwind.css` file in the following folders: `/` and `/client`. Both files should have the same content. Make sure to not change the first line.

</details>

## Development

Run both apps from the repository root:

```bash
pnpm dev
```

The client runs on [http://localhost:5000](http://localhost:5000) by default (`CLIENT_PORT`). The server runs on port `5001` by default (`SERVER_PORT`) and restarts when its files change. To run either side on its own, use `pnpm --dir client dev` or `pnpm --dir server dev`.

Run `pnpm lint` before committing. It checks both apps with oxlint. The pre-commit hook runs the same command together with the locale check. To apply automatic fixes, run `pnpm --dir client exec oxlint --fix` and `pnpm --dir server exec oxlint --fix`.

## Community

Thanks to everyone who has contributed to discord.place.

<p align="center">
  <a href="https://github.com/discordplace/discord.place/graphs/contributors">
    <img src="https://shieldcn.dev/contributors/discordplace/discord.place.svg?limit=30&amp;size=48&amp;theme=violet&amp;bg=transparent" alt="Contributors" />
  </a>
</p>

<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="https://shieldcn.dev/chart/github/stars/discordplace/discord.place.svg?theme=violet&amp;mode=dark" />
    <img alt="Star history" src="https://shieldcn.dev/chart/github/stars/discordplace/discord.place.svg?theme=violet&amp;mode=light" />
  </picture>
</p>

## Contributing

We welcome contributions from the community. Please read the [Contributing Guidelines](.github/CONTRIBUTING.md) and [Code of Conduct](.github/CODE_OF_CONDUCT.md) before opening a pull request.

1. Fork and clone the repository.
2. Create a branch for your change.
3. Make your changes and run `pnpm lint`.
4. Don't forget to install dependencies using `pnpm install` in `scripts/` folder before committing anything otherwise the pre-commit hook will fail.
4. Commit with a message that follows [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/).
5. Push your branch and open a pull request against `main`.

<details>
<summary><strong>Contributing translations</strong></summary>

**Website**

1. Fork the repository and clone it locally.
2. Create a new branch for your translation.
3. Find the language file you want to translate in the `client/locales` directory.
4. Add the translations for the missing keys in the language file or update the existing translations.
5. Commit your changes with descriptive commit messages that follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.
6. Push your changes to your fork and submit a pull request to the `main` branch of the original repository.

**Server**

1. Fork the repository and clone it locally.
2. Create a new branch for your translation.
3. Find the language file you want to translate in the `server/src/locales` directory.
4. Add the translations for the missing keys in the language file or update the existing translations.
5. Commit your changes with descriptive commit messages that follow the [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/) standard.
6. Push your changes to your fork and submit a pull request to the `main` branch of the original repository.

</details>

## License

Released under the [AGPL-3.0 License](LICENSE).

## Help

If you encounter any issues or have questions, [open an issue](https://github.com/discordplace/discord.place/issues) or join our [Discord server](https://discord.gg/sMkykssTtV).
