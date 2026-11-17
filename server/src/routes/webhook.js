/* eslint no-redeclare: 0 */

const crypto = require('node:crypto');
const User = require('@/schemas/User');
const Profile = require('@/schemas/Profile');
const Server = require('@/schemas/Server');
const ServerVoteTripleEnabled = require('@/schemas/Server/Vote/TripleEnabled');
const Bot = require('@/schemas/Bot');
const BotVoteTripleEnabled = require('@/schemas/Bot/Vote/TripleEnabled');
const { StandedOutBot, StandedOutServer } = require('@/schemas/StandedOut');
const WebhookEvent = require('@/schemas/WebhookEvent');
const decrypt = require('@/utils/encryption/decrypt');
const sendLog = require('@/utils/sendLog');
const sendPortalMessage = require('@/utils/sendPortalMessage');

const MAX_SKEW_SECONDS = 300;

function parseCustomFields(raw) {
  if (!raw) return {};

  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {}

  try {
    const parsed = JSON.parse(raw.replace(/=>/g, ':'));
    if (parsed && typeof parsed === 'object') return parsed;
  } catch {}

  const result = {};
  for (const match of raw.matchAll(/['"]?([^'":,=\s]+)['"]?\s*(?::|=>)\s*['"]?([^'"},]+)['"]?/g)) result[match[1]] = match[2].trim();

  return result;
}

function verifySignature(rawBody, header, secret) {
  if (!header || !secret) return false;

  const match = /^t=(\d+),v1=([a-f0-9]+)$/.exec(header);
  if (!match) return false;

  const [, timestamp, signature] = match;
  if (Math.abs(Date.now() / 1000 - Number(timestamp)) > MAX_SKEW_SECONDS) return false;

  const expected = crypto.createHmac('sha256', secret).update(`${timestamp}.${rawBody}`).digest('hex');
  const a = Buffer.from(expected, 'hex');
  const b = Buffer.from(signature, 'hex');
  if (a.length !== b.length) return false;

  return crypto.timingSafeEqual(a, b);
}

function planIdForPermalink(permalink) {
  const plans = (config.gumroad && config.gumroad.plans) || [];
  const plan = plans.find(item => item.permalink === permalink);

  return plan ? plan.id : null;
}

function expiresAtForRecurrence(recurrence) {
  const now = new Date();
  if (recurrence === 'monthly') return new Date(now.setMonth(now.getMonth() + 1));
  if (recurrence === 'yearly') return new Date(now.setFullYear(now.getFullYear() + 1));

  return null;
}

async function claimOnce(key, payload) {
  try {
    await new WebhookEvent({ key, provider: 'gumroad', payload }).save();
    return true;
  } catch (error) {
    if (error.code === 11000) return false;
    throw error;
  }
}

async function revokePremium(user, reason) {
  if (!user.subscription?.createdAt) return;

  user.oldSubscriptions.push({
    id: user.subscription.id,
    orderId: user.subscription.orderId,
    productId: user.subscription.productId,
    planId: user.subscription.planId,
    createdAt: user.subscription.createdAt,
    expiredAt: new Date()
  });
  user.subscription = null;
  await user.save();

  const profile = await Profile.findOne({ id: user.id });
  if (profile) {
    profile.preferredHost = config.defaultProfileHost || 'discord.place/p';
    await profile.save();
  }

  const guild = client.guilds.cache.get(config.guildId);
  const member = guild && (guild.members.cache.get(user.id) || await guild.members.fetch(user.id).catch(() => null));
  if (member && member.roles.cache.has(config.roles.premium)) await member.roles.remove(config.roles.premium);

  sendLog(reason, [{ type: 'user', name: 'User', value: user.id }]);
}

async function processPing(fields) {
  const resourceName = fields.get('resource_name');
  const saleId = fields.get('sale_id');
  const permalinkRaw = fields.get('permalink') || fields.get('product_permalink') || '';
  const permalink = permalinkRaw.replace(/^https?:\/\/[^/]+\/l\//, '').split(/[?#]/)[0];
  const customFields = parseCustomFields(fields.get('custom_fields'));
  const token = fields.get('custom_fields[Reference]') ||
    fields.get('Reference') ||
    customFields.Reference ||
    fields.get('url_params[Reference]') ||
    (fields.get('url_params') && parseCustomFields(fields.get('url_params')).Reference);

  if (!token) {
    logger.warn('[Gumroad] No Reference token in ping:', saleId, 'fields:', JSON.stringify(Object.fromEntries(fields)));
    return;
  }

  let decryptedData;
  try {
    const [iv, encryptedText, tag] = Buffer.from(token, 'base64').toString('utf-8').split(':');
    decryptedData = decrypt({ iv, encryptedText, tag }, process.env.PAYMENTS_CUSTOM_DATA_ENCRYPT_SECRET_KEY);
  } catch (error) {
    logger.warn('[Gumroad] Could not decrypt token:', error.message);
    return;
  }

  const separator = decryptedData.indexOf(':');
  if (separator < 0) {
    logger.warn('[Gumroad] Invalid token payload.');
    return;
  }

  const type = decryptedData.slice(0, separator);
  const targetId = decryptedData.slice(separator + 1);

  if (resourceName === 'refund') {
    const user = await User.findOne({ 'subscription.id': saleId });
    if (user) await revokePremium(user, 'orderRefunded');

    if (permalink === config.gumroad.tripledVotesPermalink) {
      if (type === 'server') await ServerVoteTripleEnabled.deleteOne({ id: targetId });
      if (type === 'bot') await BotVoteTripleEnabled.deleteOne({ id: targetId });
    }
    if (permalink === config.gumroad.standedOutPermalink) {
      if (type === 'server') await StandedOutServer.deleteOne({ identifier: targetId });
      if (type === 'bot') await StandedOutBot.deleteOne({ identifier: targetId });
    }

    return;
  }

  if (resourceName === 'subscription_ended' || resourceName === 'cancellation') {
    const user = await User.findOne({ 'subscription.subscriptionId': fields.get('subscription_id') });
    if (user) await revokePremium(user, 'subscriptionExpired');
    return;
  }

  if (resourceName !== 'sale') return;

  if (type === 'user') {
    const planId = planIdForPermalink(permalink);
    if (!planId) {
      logger.warn('[Gumroad] Unknown premium permalink:', permalink);
      return;
    }

    const user = await User.findOne({ id: targetId });
    if (!user) {
      logger.warn('[Gumroad] User not found:', targetId);
      return;
    }
    if (user.subscription?.createdAt) return;

    user.subscription = {
      id: saleId,
      subscriptionId: fields.get('subscription_id') || undefined,
      orderId: fields.get('order_number'),
      productId: fields.get('product_id'),
      planId,
      createdAt: new Date(Number(fields.get('sale_timestamp')) * 1000),
      expiresAt: expiresAtForRecurrence(fields.get('recurrence')) || undefined
    };
    await user.save();

    const guild = client.guilds.cache.get(config.guildId);
    const member = guild && (guild.members.cache.get(user.id) || await guild.members.fetch(user.id).catch(() => null));
    if (member && !member.roles.cache.has(config.roles.premium)) await member.roles.add(config.roles.premium);

    sendPortalMessage({ embeds: [{ color: '#a855f7', footer: { text: 'Purchased premium via Gumroad.' } }] });
    return;
  }

  if (permalink === config.gumroad.tripledVotesPermalink) {
    if (type === 'server') {
      if (!await Server.exists({ id: targetId })) return;
      if (await ServerVoteTripleEnabled.exists({ id: targetId })) return;
      await new ServerVoteTripleEnabled({ id: targetId }).save();
    } else if (type === 'bot') {
      if (!await Bot.exists({ id: targetId })) return;
      if (await BotVoteTripleEnabled.exists({ id: targetId })) return;
      await new BotVoteTripleEnabled({ id: targetId }).save();
    }

    sendPortalMessage({ embeds: [{ color: '#f97316', footer: { text: 'Purchased tripled votes via Gumroad.' } }] });
    return;
  }

  if (permalink === config.gumroad.standedOutPermalink) {
    if (type === 'server') {
      if (!await Server.exists({ id: targetId })) return;
      if (await StandedOutServer.exists({ identifier: targetId })) return;
      await new StandedOutServer({ identifier: targetId }).save();
    } else if (type === 'bot') {
      if (!await Bot.exists({ id: targetId })) return;
      if (await StandedOutBot.exists({ identifier: targetId })) return;
      await new StandedOutBot({ identifier: targetId }).save();
    }

    sendPortalMessage({ embeds: [{ color: '#166534', footer: { text: 'Purchased standed out via Gumroad.' } }] });
  }
}

module.exports = {
  post: async (request, response) => {
    const rawBody = request.body.toString('utf-8');
    const signature = request.headers['x-gumroad-signature'];

    if (!verifySignature(Buffer.isBuffer(request.body) ? request.body : Buffer.from(rawBody), signature, process.env.GUMROAD_WEBHOOK_SECRET)) {
      return response.sendStatus(400);
    }

    response.sendStatus(200);

    const fields = new URLSearchParams(rawBody);
    const key = `${fields.get('resource_name')}:${fields.get('sale_id')}`;

    claimOnce(key, Object.fromEntries(fields))
      .then(claimed => claimed ? processPing(fields) : null)
      .catch(error => logger.error('[Gumroad] Failed to process ping:', error));
  }
};
