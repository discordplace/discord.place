const { z } = require('zod');

function isUrl(value) {
  try {
    new URL(value);

    return true;
  } catch {
    return false;
  }
}

function isPort(value) {
  return /^\d+$/.test(value) && Number(value) >= 1 && Number(value) <= 65_535;
}

const optionalUrl = z.string().optional().refine(value => !value || isUrl(value), 'Must be a valid URL');
const optionalPort = z.string().optional().refine(value => !value || isPort(value), 'Must be a valid port');
const requiredString = z.string().min(1);

const environmentSchema = z.object({
  BACKEND_URL: optionalUrl,
  BOT_API_KEY_ENCRYPT_SECRET: requiredString,
  CDN_URL: z.string().refine(isUrl, 'Must be a valid URL'),
  CLIENT_SECRET: requiredString,
  CLOUDFLARE_TURNSTILE_SECRET_KEY: requiredString,
  COOKIE_SECRET: requiredString,
  DAILY_DATABASE_BACKUP_HEARTBEAT_URL: optionalUrl,
  DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_SECRET: z.string().optional(),
  DISCORD_BOT_GET_APPROXIMATE_GUILD_COUNT_API_URL: optionalUrl,
  DISCORD_CLIENT_ID: z.string().regex(/^\d{17,20}$/, 'Must be a Discord snowflake'),
  DISCORD_CLIENT_SECRET: requiredString,
  DISCORD_CLIENT_TOKEN: requiredString,
  DISCORD_PORTAL_CHANNEL_WEBHOOK_URL: optionalUrl,
  FRONTEND_URL: optionalUrl,
  GITHUB_AUTO_SYNC_TRANSLATORS_SECRET: z.string().optional(),
  INTERNAL_FRONTEND_URL: optionalUrl,
  JWT_SECRET: requiredString,
  KENERING_API_KEY: z.string().optional(),
  KENERING_INSTANCE_URL: optionalUrl,
  LEMON_SQUEEZY_API_KEY: z.string().optional(),
  LEMON_SQUEEZY_WEBHOOK_SECRET: z.string().optional(),
  MONGO_URL: requiredString,
  NODE_ENV: z.enum(['development', 'production', 'test', 'staging']).optional(),
  PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY: z.string().optional(),
  PORT: optionalPort,
  S3_ACCESS_KEY_ID: requiredString,
  S3_BUCKET_NAME: requiredString,
  S3_DATABASE_BACKUP_ACCESS_KEY_ID: z.string().optional(),
  S3_DATABASE_BACKUP_BUCKET_NAME: z.string().optional(),
  S3_DATABASE_BACKUP_ENDPOINT: z.string().optional(),
  S3_DATABASE_BACKUP_REGION: z.string().optional(),
  S3_DATABASE_BACKUP_SECRET_ACCESS_KEY: z.string().optional(),
  S3_ENDPOINT: requiredString,
  S3_REGION: requiredString,
  S3_SECRET_ACCESS_KEY: requiredString,
  SENTRY_DSN: optionalUrl,
  SERVER_PORT: optionalPort,
  USER_TOKEN_ENCRYPT_SECRET: requiredString,
  WEBHOOKS_PROXY_SERVER_HOST: z.string().optional(),
  WEBHOOKS_PROXY_SERVER_PASSWORD: z.string().optional(),
  WEBHOOKS_PROXY_SERVER_PORT: optionalPort,
  WEBHOOKS_PROXY_SERVER_PROTOCOL: z.string().optional(),
  WEBHOOKS_PROXY_SERVER_USERNAME: z.string().optional()
}).passthrough().superRefine((environment, context) => {
  if (environment.LEMON_SQUEEZY_API_KEY && !environment.PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY) {
    context.addIssue({
      code: 'custom',
      message: 'Required when LEMON_SQUEEZY_API_KEY is set',
      path: ['PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY']
    });
  }
});

function validateEnvironment(environment = process.env) {
  const result = environmentSchema.safeParse(environment);

  if (!result.success) {
    const details = result.error.issues
      .map(issue => `${issue.path.join('.') || 'environment'}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid environment variables:\n${details}`);
  }

  return result.data;
}

module.exports = {
  environmentSchema,
  validateEnvironment
};
