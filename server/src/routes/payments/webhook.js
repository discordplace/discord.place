/* eslint no-redeclare: 0 */

const bodyParser = require('body-parser');
const crypto = require('crypto');
const Plan = require('@/schemas/LemonSqueezy/Plan');
const User = require('@/schemas/User');
const Profile = require('@/schemas/Profile');

module.exports = {
  post: [
    bodyParser.raw({ type: 'application/json' }),
    async (request, response) => {
      const hmac = crypto.createHmac('sha256', process.env.LEMON_SQUEEZY_WEBHOOK_SECRET);
      const digest = Buffer.from(hmac.update(request.body).digest('hex'), 'utf-8');
      const signature = Buffer.from(request.headers['x-signature'], 'utf-8');
    
      try {
        if (digest.length !== signature.length || !crypto.timingSafeEqual(digest, signature)) {
          return response.sendError('Invalid signature', 403);
        }
      } catch (error) {
        return response.sendError('Invalid signature', 403);
      }

      await response.send('OK');

      const body = JSON.parse(request.body.toString());

      switch (body.meta.event_name) {
      case 'order_created':
        var user_id = body.meta.custom_data?.user_id;
        if (!user_id) return logger.warn('[Lemon Squeezy] User ID not found in custom data:', `\n${JSON.stringify(body, null, 2)}`);

        var user = await User.findOne({ id: user_id });
        if (!user) return logger.warn('[Lemon Squeezy] User not found:', `\n${JSON.stringify(body, null, 2)}`);

        if (user.subscription) return logger.warn('[Lemon Squeezy] User already has a subscription:', `\n${JSON.stringify(body, null, 2)}`);

        var plan = await Plan.findOne({ id: body.data.attributes.first_order_item.product_id });
        if (!plan) return logger.warn('[Lemon Squeezy] Plan not found:', `\n${JSON.stringify(body, null, 2)}`);

        user.subscription = {
          id: body.data.id,
          orderId: body.data.attributes.order_number,
          productId: body.data.attributes.first_order_item.product_id,
          planId: plan.id,
          createdAt: new Date(body.data.attributes.created_at)
        };

        await user.save();

        var guild = client.guilds.cache.get(config.guildId);
        var member = await guild.members.fetch(user.id).catch(() => null);

        if (member) await member.roles.add(config.roles.premium);

        break;
      case 'order_refunded':
        var user = await User.findOne({ 'subscription.orderId': body.data.attributes.order_number });
        if (!user) return logger.warn('[Lemon Squeezy] User not found:', `\n${JSON.stringify(body, null, 2)}`);

        user.subscription = null;

        await user.save();

        var profile = await Profile.findOne({ id: user.id });
        if (profile) {
          profile.preferredHost = 'discord.place/p',

          await profile.save();
        }

        var guild = client.guilds.cache.get(config.guildId);
        var member = await guild.members.cache.get(user.id);

        if (member && member.roles.cache.has(config.roles.premium)) await member.roles.remove(config.roles.premium);

        break;
      case 'subscription_expired':
        var user = await User.findOne({ 'subscription.id': body.data.id });
        if (!user) return logger.warn('[Lemon Squeezy] User not found:', `\n${JSON.stringify(body, null, 2)}`);

        user.subscription = null;

        await user.save();
        var profile = await Profile.findOne({ id: user.id });
        if (profile) {
          profile.preferredHost = 'discord.place/p',

          await profile.save();
        }

        var guild = client.guilds.cache.get(config.guildId);
        var member = await guild.members.cache.get(user.id);

        if (member && member.roles.cache.has(config.roles.premium)) await member.roles.remove(config.roles.premium);

        break;
      }
    }
  ]
};
