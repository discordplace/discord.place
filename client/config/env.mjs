import { z } from 'zod';

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

function isHostname(value) {
  return /^(?=.{1,253}$)(?!-)[a-z0-9-]+(?:\.[a-z0-9-]+)+$/i.test(value);
}

const optionalUrl = z.string().optional().refine(value => !value || isUrl(value), 'Must be a valid URL');
const optionalPort = z.string().optional().refine(value => !value || isPort(value), 'Must be a valid port');
const optionalHostname = z.string().optional().refine(value => !value || isHostname(value), 'Must be a valid hostname');

const environmentSchema = z.object({
  CLIENT_PORT: optionalPort,
  CLIENT_SECRET: z.string().min(1),
  INTERNAL_API_URL: optionalUrl,
  NEXT_PUBLIC_API_URL: optionalUrl,
  NEXT_PUBLIC_AUTH_COOKIE_NAME: z.string().regex(/^[A-Za-z0-9_-]+$/).optional(),
  NEXT_PUBLIC_BOT_INVITE_URL: optionalUrl,
  NEXT_PUBLIC_BOT_TEST_GUILD_ID: z.string().optional().refine(
    value => !value || /^\d{17,20}$/.test(value),
    'Must be a Discord snowflake'
  ),
  NEXT_PUBLIC_CDN_URL: z.string().refine(isUrl, 'Must be a valid URL'),
  NEXT_PUBLIC_CF_SITE_KEY: z.string().optional(),
  NEXT_PUBLIC_CUSTOM_HOSTNAMES: z.string().optional().refine(
    value => !value || value.split(',').every(hostname => isHostname(hostname.trim())),
    'Must be comma-separated hostnames'
  ),
  NEXT_PUBLIC_DOCS_URL: optionalUrl,
  NEXT_PUBLIC_GITHUB_ISSUES_URL: optionalUrl,
  NEXT_PUBLIC_LINK_SHORTENER_HOSTNAME: optionalHostname,
  NEXT_PUBLIC_PORT: optionalPort,
  NEXT_PUBLIC_PROFILE_DEFAULT_HOST: z.string().optional(),
  NEXT_PUBLIC_SENTRY_DSN: optionalUrl,
  NEXT_PUBLIC_SITE_URL: optionalUrl,
  NEXT_PUBLIC_STATUS_URL: optionalUrl,
  NEXT_PUBLIC_SUPPORT_INVITE_URL: optionalUrl,
  NODE_ENV: z.enum(['development', 'production', 'test', 'staging']).optional(),
  PORT: optionalPort,
  SENTRY_AUTH_TOKEN: z.string().optional(),
  SENTRY_ORG: z.string().optional(),
  SENTRY_PROJECT: z.string().optional()
}).passthrough();

function validateClientEnv(environment = process.env) {
  const result = environmentSchema.safeParse(environment);

  if (!result.success) {
    const details = result.error.issues
      .map(issue => `${issue.path.join('.') || 'environment'}: ${issue.message}`)
      .join('\n');

    throw new Error(`Invalid client environment variables:\n${details}`);
  }

  return result.data;
}

export {
  environmentSchema,
  validateClientEnv
};
