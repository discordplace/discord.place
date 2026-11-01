function environmentCheck() {
  const requiredEnvironmentVariables = [
    'COOKIE_SECRET',
    'CLIENT_SECRET',
    'DISCORD_CLIENT_TOKEN',
    'DISCORD_CLIENT_SECRET',
    'DISCORD_CLIENT_ID',
    'MONGO_URL',
    'CDN_URL',
    'S3_BUCKET_NAME',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'S3_REGION',
    'S3_ENDPOINT',
    'CLOUDFLARE_TURNSTILE_SECRET_KEY',
    'BOT_API_KEY_ENCRYPT_SECRET',
    'USER_TOKEN_ENCRYPT_SECRET',
    'JWT_SECRET'
  ];

  if (requiredEnvironmentVariables.some(key => !process.env[key])) throw new Error(`Some environment variables are missing: ${requiredEnvironmentVariables.filter(key => !process.env[key]).join(', ')}`);

  if (process.env.LEMON_SQUEEZY_API_KEY && !process.env.PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY) throw new Error('PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY is required when LEMON_SQUEEZY_API_KEY is set.');

  return true;
}

module.exports = environmentCheck;