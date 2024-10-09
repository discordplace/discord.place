function environmentCheck() {
  const requiredEnvironmentVariables = [
    'COOKIE_SECRET',
    'DISCORD_CLIENT_TOKEN',
    'DISCORD_CLIENT_SECRET',
    'DISCORD_CLIENT_ID',
    'MONGO_URL',
    'S3_BUCKET_NAME',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'S3_REGION',
    'S3_ENDPOINT',
    'CLOUDFLARE_TURNSTILE_SECRET_KEY',
    'CLOUDFLARE_API_KEY',
    'CLOUDFLARE_EMAIL',
    'CLOUDFLARE_ACCOUNT_ID',
    'CLOUDFLARE_BLOCK_IP_LIST_ID',
    'BOT_API_KEY_ENCRYPT_SECRET',
    'USER_TOKEN_ENCRYPT_SECRET',
    'JWT_SECRET'
  ];
  
  if (requiredEnvironmentVariables.some(key => !process.env[key])) throw new Error(`Some environment variables are missing: ${requiredEnvironmentVariables.filter(key => !process.env[key]).join(', ')}`);  

  return true;
}

module.exports = environmentCheck;