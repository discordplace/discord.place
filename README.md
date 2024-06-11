# discord.place

This repository contains the source code for the discord.place website. The project is divided into two main components: the Next.js client application located in the `/client` folder and the Express server located in the `/server` folder.

## Getting Started

To get a local copy of the project up and running, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/discordplace/discord.place.git
   ```

2. Navigate to the project directory:

   ```bash
   cd discord.place
   ```

3. Install dependencies for the client and server:

   ```bash
   cd client
   npm install
   cd ../server
   npm install
   ```

4. Configure Environment Variables:

   - **Client**:
     - Create a `.env` file in the `client` directory and populate it with the following variables:

     ```plaintext
     ANALYZE=
     NEXT_PUBLIC_CF_SITE_KEY=
     ```

   - **Server**:
     - Create a `.env` file in the `server` directory and populate it with the following variables:

     ```plaintext
     # Secrets
     COOKIE_SECRET=
     SESSION_SECRET=
     SESSION_STORE_SECRET=
     GITHUB_AUTO_DEPLOY_SECRET=
     BOT_API_KEY_ENCRYPT_SECRET=
     
     # Discord Bot
     DISCORD_CLIENT_TOKEN=
     DISCORD_CLIENT_SECRET=
     DISCORD_CLIENT_ID=
     
     # Database
     MONGO_URL=
     
     # Cloudflare R2
     S3_BUCKET_NAME=
     S3_ACCESS_KEY_ID=
     S3_SECRET_ACCESS_KEY=
     S3_REGION=
     S3_ENDPOINT=
     
     # Cloudflare Turnstile
     CLOUDFLARE_TURNSTILE_SECRET_KEY=

     # Cloudflare Secrets for global rate limiting

     CLOUDFLARE_API_KEY=
     CLOUDFLARE_EMAIL=
     CLOUDFLARE_ACCOUNT_ID=
     CLOUDFLARE_BLOCK_IP_LIST_ID=

     # Discord Place API
     DISCORD_PLACE_API_KEY=
     DISCORD_PLACE_INSTATUS_API_KEY=

     # Other

     DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL=
     DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET=
     ```
     Ensure you fill in the values for each environment variable according to your setup. Take a look to [Secrets Configuration](#secrets-configuration) for more information about .env

5. Start the development servers:

   ```bash
   # In one terminal tab
   cd client
   npm run dev

   # In another terminal tab
   cd server
   npm run dev
   ```

5. Open your browser and visit [http://localhost:3000](http://localhost:3000) to view the website.

## Contributing

We welcome contributions from the community! If you'd like to contribute to the project, please follow these guidelines:

1. Fork the repository and clone it locally.
2. Create a new branch for your feature or bug fix.
3. Make your changes and ensure the code passes any existing tests.
4. Commit your changes with descriptive commit messages.
5. Push your changes to your fork and submit a pull request to the `main` branch of the original repository.

Please make sure to follow the [Code of Conduct](.github/CODE_OF_CONDUCT.md) and [Contributing Guidelines](.github/CONTRIBUTING.md) when contributing to this project.

## Secrets Configuration

Before running the project, you need to set up the following environment variables in the `.env` files for both the client and server. Here's a breakdown of each secret:

| Secret                   | Description                                                 | Required | Example Value          |
|--------------------------|-------------------------------------------------------------|----------|------------------------|
| COOKIE_SECRET            | Secret used for cookie encryption                           | Yes      | RandomString           |
| SESSION_SECRET           | Secret used for session encryption                          | Yes      | RandomString           |
| SESSION_STORE_SECRET     | Secret used for session store encryption                    | Yes      | RandomString           |
| GITHUB_AUTO_DEPLOY_SECRET | Secret for GitHub auto-deployment webhook verification     | No      | RandomString           |
| BOT_API_KEY_ENCRYPT_SECRET       | Secret for discord.place API key encryption                   | Yes      | RandomString           |
| AUTO_VOTE_TOKEN_SECRET   | Secret for auto-vote token generation                       | Yes      | RandomString           |
| DISCORD_CLIENT_TOKEN     | Token for Discord bot integration                           | Yes      | DiscordToken           |
| DISCORD_CLIENT_SECRET    | Secret for Discord bot integration                          | Yes      | DiscordSecret          |
| DISCORD_CLIENT_ID        | Client ID for Discord bot integration                       | Yes      | DiscordClientID        |
| MONGO_URL                | URL for MongoDB database connection                         | Yes      | mongodb://localhost:27017/mydatabase |
| S3_BUCKET_NAME           | Name of the AWS S3 bucket for Cloudflare R2                 | Yes      | BucketName             |
| S3_ACCESS_KEY_ID         | AWS access key ID for Cloudflare R2                         | Yes      | AccessKeyID            |
| S3_SECRET_ACCESS_KEY     | AWS secret access key for Cloudflare R2                     | Yes      | SecretAccessKey        |
| S3_REGION                | AWS region for Cloudflare R2                                | Yes      | Region                 |
| S3_ENDPOINT              | AWS S3 endpoint for Cloudflare R2                           | Yes      | Endpoint               |
| CLOUDFLARE_TURNSTILE_SECRET_KEY | Secret key for Cloudflare Turnstile integration         | Yes      | RandomString           |
| CLOUDFLARE_API_KEY       | API key for Cloudflare integration                         | Yes      | CloudflareAPIKey       |
| CLOUDFLARE_EMAIL         | Email for Cloudflare integration                           | Yes      | CloudflareEmail        |
| CLOUDFLARE_ACCOUNT_ID    | Account ID for Cloudflare integration                      | Yes      | CloudflareAccountID    |
| CLOUDFLARE_BLOCK_IP_LIST_ID | ID for the Cloudflare IP list used for global rate limiting | Yes | CloudflareBlockIPListID |
| DISCORD_PLACE_API_KEY | API key for Discord Place API | Yes | RandomString |
| DISCORD_PLACE_INSTATUS_API_KEY | API key for Instatus integration | Yes | RandomString |
| LOGTAIL_SOURCE_TOKEN | Logtail source token | No | RandomString |
| DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL | Base API URL to get approximate guild count for bots | No | URL |
| DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET | Secret for the API to get approximate guild count for bots (used in the Authorization header) | No | RandomString |
| ANALYZE                  | Whether to enable bundle analysis during client build       | No       | true/false             |
| NEXT_PUBLIC_CF_SITE_KEY  | Public key for Cloudflare integration                      | No       | SiteKey                |

## Help

If you encounter any issues with the discord.place website or have any questions, feel free to [open an issue](https://github.com/discordplace/discord.place/issues) on this repository. We'll do our best to assist you!

## License

This project is licensed under the [ISC License](LICENSE).