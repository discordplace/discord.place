function environmentCheck() {
  const requiredEnvironmentVariables = [
    'COOKIE_SECRET',
    'SESSION_SECRET',
    'SESSION_STORE_SECRET',
    'DISCORD_CLIENT_TOKEN',
    'DISCORD_CLIENT_SECRET',
    'DISCORD_CLIENT_ID',
    'MONGO_URL',
    'S3_BUCKET_NAME',
    'S3_ACCESS_KEY_ID',
    'S3_SECRET_ACCESS_KEY',
    'S3_REGION',
    'S3_ENDPOINT',
    'CLOUDFLARE_TURNSTILE_SECRET_KEY'
  ];
  
  if (requiredEnvironmentVariables.some(key => !process.env[key])) throw new Error(`Some environment variables are missing: ${requiredEnvironmentVariables.filter(key => !process.env[key]).join(', ')}`);  

  return true;
}

module.exports = environmentCheck;